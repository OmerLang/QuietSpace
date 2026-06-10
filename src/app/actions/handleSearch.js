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
  const supabase = await createClient();
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const responseIDs = await fetch(
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
        "X-Goog-FieldMask": "places.id",
      },
    },
  );
  const dataG = await responseIDs.json();

  const placesIDs = dataG?.places ?? [];

  console.log("placesByGoogle:", placesIDs);

  if (placesIDs.length < 1) {
    return [];
  }
  const placesIDsArr = placesIDs.map((placeID) => placeID.id) || [];

  const { data, error } = await supabase
    .from("search_places_view")
    .select("*")
    .in("google_place_id", placesIDsArr)
    .limit(5);
  if (error) {
    console.error("supabase error:", error);
    return [];
  }
  console.log("my supabase data with 5 limit:", data);
  if (data.length === 5) {
    return data;
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
  const { places: places2 } = await response.json();
  console.log("Places2:", places2);

  const fullPlaces = places2 || [];
  const fullPlacesAfterTypeFiltered = fullPlaces.filter((place) =>
    place.types?.some((type) => allowedTypes.includes(type)),
  );
  const gPlacesTotallyFiltered = filterGoogleArray(
    data,
    fullPlacesAfterTypeFiltered,
  );
  console.log("google places post all filtering:", gPlacesTotallyFiltered);

  const dbRowsToInsert = gPlacesTotallyFiltered.map((place) => {
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

  after(async () => {
    if (gPlacesTotallyFiltered.length === 0) return;
    console.log(
      `[After Context] Executing image pipeline for ${gPlacesTotallyFiltered.length} nodes.`,
    );

    await Promise.all(
      gPlacesTotallyFiltered.map(async (place) => {
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

  const normalizedGooglePlace = gPlacesTotallyFiltered.map((place) => {
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

    const primaryType =
      place.types?.find((type) => allowedTypes.includes(type)) ||
      place.types?.[0];

    return {
      ...place,
      google_place_id: place.id,
      is_quiet_space: false,
      display_name: place?.displayName?.text ?? null,
      address: address ?? null,
      place_type: primaryType,
      is_suitable: true,
      outdoor_seating: place?.outdoorSeating ?? null,
      photo_url: null,
      photo_attribution: null,
      total_rating: null,
      wifi_rating: null,
      noise_level_rating: null,
      seating_comfort_rating: null,
      charging_accessibility_rating: null,
      location: {
        lat: place.location?.latitude,
        lng: place.location?.longitude,
      },
    };
  });

  const combinedResults = [...(data || []), ...normalizedGooglePlace];
  console.log("COMBINED RESULTS:", combinedResults);
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
