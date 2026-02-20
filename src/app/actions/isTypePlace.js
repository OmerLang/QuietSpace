'use server'
import { createClient } from "@/utils/supabase/service_role"
import { after } from "next/server";

const allowedTypes = [
  "restaurant",
  "cafe",
  "zoo",
  "beach",
  "park",
  "library",
  "bar",
  "botanical_garden",
  "food"
];

export async function isTypePlace(placeId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('poi_cache')
    .select('place_type, is_suitable')
    .eq('google_place_id', placeId)
    .maybeSingle();
  
  if (error) {
    console.log(error);
    return false;
  }
  if (data === null) {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'id,types'
        }
      }
    )
    const googlePlace = await response.json();
    if (googlePlace)
      console.log("Google response types1:", googlePlace);


    const type = googlePlace.types?.find((type) => allowedTypes.includes(type))
    const is_suitable = Boolean(type);
    after(async () => {
      const { error } = await supabase
        .from('poi_cache')
        .insert({ google_place_id: googlePlace.id, place_type: type || googlePlace.types[0], is_suitable: is_suitable })
      if (error) console.log(error)
    });
    return is_suitable;
  }
  return data.is_suitable;
}