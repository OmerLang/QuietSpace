'use server'
import { getStaticClient } from "@/utils/supabase/static";
import { createClient } from "@/utils/supabase/service_role";
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
  if (placeId === 'warmup-ping') return true;
  const staticSupabase = getStaticClient();
  const { data } = await staticSupabase
    .from('poi_cache')
    .select('google_place_id, is_suitable, location')
    .eq('google_place_id', placeId)
    .maybeSingle();
  
  if (data) {
    return {
      google_place_id: placeId,
      is_suitable: data.is_suitable,
      location: {
        lat: data.location?.coordinates?.[1],
        lng: data.location?.coordinates?.[0]
      }
    }
  }
  if (data === null) {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'id,types,location'
        }
      }
    )
    const googlePlace = await response.json();
    if (!googlePlace?.location?.latitude) return;
    const type = googlePlace.types?.find((type) => allowedTypes.includes(type))
    const is_suitable = Boolean(type);
    after(async () => {
      const supabase = await createClient();
      const pointWKT = `POINT(${googlePlace.location.longitude} ${googlePlace.location.latitude})`;
      const { error } = await supabase
        .from('poi_cache')
        .insert({ google_place_id: googlePlace.id, place_type: type || googlePlace.types[0],location: pointWKT, is_suitable: is_suitable })
      if (error) console.log(error)
    });
    return {
      google_place_id: googlePlace.id,
      is_suitable: is_suitable,
      location: {
        lat: googlePlace.location?.latitude,
        lng: googlePlace.location?.longitude
      }
    }
  }
}