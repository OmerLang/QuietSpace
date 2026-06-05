"use server";
import { after } from "next/server";
import { createClient } from "@/utils/supabase/service_role";

const allowedTypes = [
  "restaurant",
  "cafe",
  "park",
  "library",
  "bar",
  "botanical_garden",
  "food",
];

const filterGoogleArray = (dbArr, gArr) => {
  const existingIds = new Set(dbArr.map((dbPlace) => dbPlace.google_place_id));

  return gArr.filter((gPlace) => {
    if (existingIds.has(gPlace.id)) {
      return false;
    }

    existingIds.add(gPlace.id);
    return true;
  });
};

export const handleSearch = async (searchTerm, lat, lng) => {
  console.log("Search is:", searchTerm);
  const supabase = await createClient();
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const { data, error } = await supabase
    .from("search_places_view")
    .select("*")
    .like("display_name", `%${searchTerm}%`)
    .limit(5);
  if (error) {
    console.error("supabase error:", error);
    return [];
  }
  if (data.length >= 5) {
    return data.slice(0, 5);
  }
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      body: JSON.stringify({
        textQuery: searchTerm,
        locationBias: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng,
            },
            radius: 10000.0,
          },
        },
      }),
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": `${apiKey}`,
        "X-Goog-FieldMask":
          "places.id,places.types,places.location,places.addressComponents,places.displayName,places.outdoorSeating,places.photos",
      },
    },
  );
  const { places } = await response.json();
  const placesArray = places || [];
  console.log("google places BEFORE filtering:", placesArray);
  const filteredPlacesType = placesArray.filter((place) =>
    place.types?.some((type) => allowedTypes.includes(type)),
  );
  const filteredPlaces = filterGoogleArray(data, filteredPlacesType);
  console.log("google places AFTER filtering:", placesArray);

  const dbRowsToInsert = filteredPlaces.map((place) => {
    let address = null;
    if (place?.addressComponents) {
      const components = place.addressComponents;
      const getPart = (type) => {
        const match = components.find((c) => c?.types?.includes(type));
        return match ? match.longText : "";
      };
      const route = getPart("route");
      const fallback = components[0]?.longText;
      const streetNumber = getPart("street_number");
      const city = getPart("locality");
      const streetFull =
        [route, streetNumber].filter(Boolean).join(" ") || fallback;
      address = [streetFull, city].filter(Boolean).join(", ");
    }
    const pointWKT = `POINT(${place.location.longitude} ${place.location.latitude})`;
    const primaryType =
      place.types?.find((type) => allowedTypes.includes(type)) ||
      place.types?.[0];
    return {
      google_place_id: place.id,
      place_type: primaryType,
      location: pointWKT,
      is_suitable: true,
      display_name: place?.displayName?.text ?? null,
      address: address ?? null,
      outdoor_seating: place.outdoorSeating,
      photo_url: null,
      photo_attribution: null,
    };
  });
  if (dbRowsToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("poi_cache")
      .upsert(dbRowsToInsert, { onConflict: "google_place_id" });
    if (insertError) {
      console.error("Error background caching places:", insertError.message);
    }
  }
  const dbRowLookup = new Map(
    dbRowsToInsert.map((row) => [row.google_place_id, row]),
  );

  const fullyNormalizedPlaces = filteredPlaces
    .map((originalPlace) => {
      if (!originalPlace || !originalPlace.location) return null;

      const dbRow = dbRowLookup.get(originalPlace.id);
      if (!dbRow) return null;

      return {
        google_place_id: dbRow.google_place_id,
        display_name: dbRow.display_name,
        is_suitable: true,
        address: dbRow.address,
        outdoor_seating: dbRow.outdoor_seating,
        photo_url: null,
        photo_attribution: null,
        is_quiet_space: false,
        total_rating: null,
        wifi_rating: null,
        noise_level_rating: null,
        seating_comfort_rating: null,
        charging_accessibility_rating: null,
        location: {
          lat: originalPlace.location.latitude,
          lng: originalPlace.location.longitude,
        },
      };
    })
    .filter(Boolean);
  console.log("filteredPlaces", filteredPlaces);

  after(async () => {
    if (filteredPlaces.length === 0) return;
    console.log(
      `[After Context] Executing image pipeline for ${filteredPlaces.length} nodes.`,
    );

    await Promise.all(
      filteredPlaces.map(async (place) => {
        // 1. Check if the place even has a photo from Google
        const firstImage = place.photos ? place.photos[0] : null;
        if (!firstImage) return;

        const fileName = `${place.id}.jpg`;

        try {
          // 2. OPTIMIZATION: Check if the file already exists in your Supabase bucket
          // We use list() with a prefix filter matching our exact fileName
          const { data: existingFiles, error: listError } =
            await supabase.storage.from("poi_photos").list("", {
              search: fileName,
            });

          if (listError) throw listError;

          // If the file exists in our bucket array, grab its public URL and patch the DB (just in case)
          if (existingFiles && existingFiles.length > 0) {
            console.log(
              `[After Context] Image for ${place.id} already exists in bucket. Skipping fetch/upload.`,
            );

            const { data: publicUrlData } = supabase.storage
              .from("poi_photos")
              .getPublicUrl(fileName);

            const finalPhotoUrl = publicUrlData.publicUrl;
            const finalAttribution =
              firstImage?.authorAttributions?.[0]?.displayName || null;

            // Ensure our table cache is up-to-date with the image reference links
            await supabase
              .from("poi_cache")
              .update({
                photo_url: finalPhotoUrl,
                photo_attribution: finalAttribution,
              })
              .eq("google_place_id", place.id);

            return; // EXIT EARLY! Stop the execution loop for this specific place.
          }

          // 3. Fallback: File doesn't exist, proceed with the original download/upload flow
          const imageResponse = await fetch(
            `https://places.googleapis.com/v1/${firstImage.name}/media?key=${apiKey}&maxWidthPx=400`,
          );
          const arrayBuffer = await imageResponse.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const { error: uploadError } = await supabase.storage
            .from("poi_photos")
            .upload(fileName, buffer, {
              contentType: "image/jpeg",
              upsert: true,
            });

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from("poi_photos")
            .getPublicUrl(fileName);

          const finalPhotoUrl = publicUrlData.publicUrl;
          const finalAttribution =
            firstImage?.authorAttributions?.[0]?.displayName || null;

          await supabase
            .from("poi_cache")
            .update({
              photo_url: finalPhotoUrl,
              photo_attribution: finalAttribution,
            })
            .eq("google_place_id", place.id);
        } catch (photoError) {
          console.error(
            `Background processing failed for ${place.id}:`,
            photoError,
          );
        }
      }),
    );
    console.log("[After Context] Image sync completed successfully.");
  });

  const combinedResults = [...(data || []), ...fullyNormalizedPlaces];
  // 3. Run the final unique filter pass over the combined array pool
  // const finalSanitizedSet = new Set();
  // const uniqueCombinedResults = combinedResults.filter((place) => {
  //   if (!place || !place.google_place_id) return false;

  //   if (finalSanitizedSet.has(place.google_place_id)) {
  //     return false;
  //   }

  //   finalSanitizedSet.add(place.google_place_id);
  //   return true;
  // });

  // 4. SLICE LAST: Cut down the perfectly clean, duplicate-free array to exactly 5 elements
  return combinedResults.slice(0, 5);
};
export const fetchImageToPoi = async (poi) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poi_cache")
    .select("photo_url, photo_attribution")
    .eq("google_place_id", poi.google_place_id)
    .maybeSingle();
  if (error) {
    console.error("image fetching error from poi_cache table:", error);
    return poi;
  }
  if (!data) {
    console.log("No cached image record found for this place ID.");
    return poi;
  }
  const { photo_url, photo_attribution } = data;
  const poiWithImage = {
    ...poi,
    photo_url: photo_url,
    photo_attribution: photo_attribution,
  };
  return poiWithImage;
};
