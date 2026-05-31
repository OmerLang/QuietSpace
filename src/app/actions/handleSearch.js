"use server";
import { createClient } from "@/utils/supabase/server";

const allowedTypes = [
  "restaurant",
  "cafe",
  "park",
  "library",
  "bar",
  "botanical_garden",
  "food",
];

export const handleSearch = async (searchTerm, lat, lng) => {
  console.log("Search is:", searchTerm);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("search_places_view")
    .select("*")
    .like("display_name", `%${searchTerm}%`)
    .limit(5);
  if (error) {
    console.error("supabase error:", error);
    return [];
  }

  return data;
};

// if (data.length === 5) {
//   return data;
// }
//   if (searchTerm.trim().length < 3) {
//     return data;
//   }
//   const remainingSlots = 5 - data.length;
//   const apiKey = process.env.GOOGLE_PLACES_API_KEY;
//   const response = await fetch(
//     "https://places.googleapis.com/v1/places:searchText",
//     {
//       method: "POST",
//       body: JSON.stringify({
//         textQuery: searchTerm,
//         containedInPlace: ["ChIJi7wclYVGAhURu69gCkw_7sc"],
//         locationBias: {
//           circle: {
//             center: {
//               latitude: lat,
//               longitude: lng,
//             },
//             radius: 10000.0,
//           },
//         },
//       }),
//       headers: {
//         "Content-Type": "application/json",
//         "X-Goog-Api-Key": `${apiKey}`,
//         "X-Goog-FieldMask":
//           "places.id,places.types,places.location,places.addressComponents,places.displayName,places.outdoorSeating,places.photos",
//       },
//     },
//   );
//   const { places } = await response.json();
//   const placesArray = places || [];
//   const normalizedGooglePlaces = placesArray.map(async (place) => {
//     const suitable = place.types?.find((type) => allowedTypes.includes(type));
//     const pointWKT = `POINT(${place.location.longitude} ${place.location.latitude})`;
//     if (suitable) {
//       let address = null;
//       if (place.addressComponents) {
//         const components = place.addressComponents;
//         const getPart = (type) => {
//           const match = components.find((c) => c?.types?.includes(type));
//           return match ? match.longText : "";
//         };
//         const route = getPart("route");
//         const fallback = components[0]?.longText;
//         const streetNumber = getPart("street_number");
//         const city = getPart("locality");
//         const streetFull =
//           [route, streetNumber].filter(Boolean).join(" ") || fallback;
//         address = [streetFull, city].filter(Boolean).join(", ");
//       }
//       const firstImage = place.photos ? googlePlace.photos[0] : null;
//       let finalPhotoUrl = null;
//       let finalAttribution = null;
//       if (firstImage) {
//         try {
//           const imageResponse = await fetch(
//             `https://places.googleapis.com/v1/${firstImage.name}/media?key=${apiKey}&maxWidthPx=400`,
//           );
//           const arrayBuffer = await imageResponse.arrayBuffer();
//           const buffer = Buffer.from(arrayBuffer);
//           const fileName = `${place.id}.jpg`;
//           const { error: uploadError } = await supabase.storage
//             .from("poi_photos")
//             .upload(fileName, buffer, {
//               contentType: "image/jpeg",
//               upsert: true,
//             });
//           if (uploadError) throw uploadError;
//           const { data: publicUrlData } = supabase.storage
//             .from("poi_photos")
//             .getPublicUrl(fileName);
//           finalPhotoUrl = publicUrlData.publicUrl;
//           finalAttribution =
//             firstImage?.authorAttributions?.[0]?.displayName || null;
//         } catch (error) {
//           console.error("Photo Fetch/Upload Error:", error);
//         }
//       }
//     }
//     return {
//       google_place_id: place.id,
//       place_type: place.types[0],
//       location: pointWKT,
//       is_suitable: suitable,
//       display_name: place?.displayName?.text ?? null,
//       address: address ?? null,
//       outdoor_seating: place.outdoorSeating,
//       photo_url: finalPhotoUrl,
//       photo_attribution: finalAttribution,
//       total_rating: null,
//       wifi_rating: null,
//       noise_level_rating: null,
//       seating_comfort_rating: null,
//       charging_accessibility_rating: null,
//     };
//   });
// };
