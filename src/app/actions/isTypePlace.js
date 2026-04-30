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
  const { data, error } = await staticSupabase.rpc('get_poi_by_placeid', { placeid: placeId });
  if (error) {
    console.error("Supabase error:", error.message);
    console.error("Details:", error.details);
  }

  if (data && data.length > 0) {
    return {
      google_place_id: data[0].google_place_id,
      is_quiet_space: data[0].is_quiet_space,
      is_suitable: data[0].is_suitable,
      location: {
        lat: data[0].lat,
        lng: data[0].lng
      },
      display_name: data[0].display_name,
      address: data[0].address,
      outdoor_seating: data[0].outdoor_seating,
      photo_url: data[0].photo_url,
      photo_attribution: data[0].photo_attribution,
      total_rating: data[0].total_rating,
      wifi_rating: data[0].wifi_rating,
      noise_level_rating: data[0].noise_level_rating,
      seating_comfort_rating: data[0].seating_comfort_rating,
      charging_accessibility_rating: data[0].charging_accessibility_rating
    } 
  }

  if (data === null || data.length ===0) {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=he&regionCode=IL`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'id,types,location,addressComponents,displayName,outdoorSeating,photos',
        }
      }
    )
    const googlePlace = await response.json();
    if (!googlePlace?.location?.latitude) return;
    const type = googlePlace.types?.find((type) => allowedTypes.includes(type))
    const is_suitable = Boolean(type);
    let address = null;
    if (googlePlace.addressComponents) {
      const components = googlePlace.addressComponents;
      const getPart = (type) => {
        const match = components.find(c => c?.types?.includes(type));
        return match ? match.longText : "";
      };
      const route = getPart('route');
      const fallback = components[0]?.longText;
      const streetNumber = getPart('street_number'); 
      const city = getPart('locality');             
      const streetFull = [route, streetNumber].filter(Boolean).join(' ') || fallback;
      address = [streetFull, city].filter(Boolean).join(', ');
    }
    const firstImage = googlePlace.photos ? googlePlace.photos[0] : null;
    let finalPhotoUrl = null;
    let finalAttribution = null;
    const supabase = await createClient();
    if (is_suitable && firstImage){
      try {
        const imageResponse = await fetch (`https://places.googleapis.com/v1/${firstImage.name}/media?key=${apiKey}&maxWidthPx=400`)
        const arrayBuffer = await imageResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileName = `${googlePlace.id}.jpg`;
        const { error: uploadError } = await supabase
          .storage
          .from('poi_photos')
          .upload(fileName,buffer, {
            contentType: 'image/jpeg',
            upsert: true        
          });
          if (uploadError) throw uploadError;
          const { data: publicUrlData } = supabase
          .storage
          .from('poi_photos')
          .getPublicUrl(fileName);
          finalPhotoUrl = publicUrlData.publicUrl
          finalAttribution = firstImage?.authorAttributions?.[0]?.displayName || null;             
      } catch (error) {
        console.error("Photo Fetch/Upload Error:", error);
      }
    } 
    after(async () => {
      const pointWKT = `POINT(${googlePlace.location.longitude} ${googlePlace.location.latitude})`;
      const insertData = {
        google_place_id: googlePlace.id,
        place_type: type || googlePlace.types[0],
        location: pointWKT,
        is_suitable: is_suitable
      };
      if (is_suitable) {
        insertData.display_name = googlePlace.displayName?.text;
        insertData.address = address;
        insertData.outdoor_seating = googlePlace.outdoorSeating;     
        insertData.photo_url = finalPhotoUrl,
        insertData.photo_attribution = finalAttribution
      }
      const  { error } = await supabase
        .from('poi_cache')
        .insert([insertData], { upsert: true, ignoreDuplicates: true });
        if (error) console.log("Supabase Insert Error:", error);
    });
    return {
      google_place_id: googlePlace.id,
      is_quiet_space: false,
      is_suitable: is_suitable,
      location: {
        lat: googlePlace.location?.latitude,
        lng: googlePlace.location?.longitude
      },
      display_name: googlePlace.displayName?.text,
      address: address || null,
      outdoor_seating: googlePlace.outdoorSeating,
      photo_url: finalPhotoUrl,
      photo_attribution: finalAttribution,
      total_rating: null,
      wifi_rating: null,
      noise_level_rating: null,
      seating_comfort_rating: null,
      charging_accessibility_rating: null
    }
  }
}