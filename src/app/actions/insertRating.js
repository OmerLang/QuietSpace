'use server'
import { createClient } from "@/utils/supabase/server"


const inputCheck = (name, value) => {
  const num = Number(value);
  if (!value || value === "")
    return { passed: false, error: `${name} must be rated` }
  if (Number.isNaN(num) || num < 1 || Number(value) > 5)
    return { passed: false, error: `Only numbers between 1-5 are allowed for ${name} field` }
  return { passed: true }
}

const characterLimitCheck = (comment) => {
  if (comment && comment.length>200)
    return { passed: false, error: "Up to 200 characters allowed" }
  return { passed: true }
}

export default async function insertRating(activePoi, formData){

  const supabase = await createClient();
  const { data: { user }, error} = await supabase.auth.getUser();
  if (error || !user)
    return { passed: false, error: error?.message };
  const google_place_id = activePoi.google_place_id;
  const { wifi_rating, noise_level_rating, seating_comfort_rating, charging_accessibility_rating, comment } = formData;
  const wifiCheck = inputCheck("wifi", wifi_rating);
  const noise_levelCheck = inputCheck("noise_level", noise_level_rating);
  const seating_comfortCheck = inputCheck("seating_comfort", seating_comfort_rating);
  const charging_accessibilityCheck = inputCheck("charging_accessibility", charging_accessibility_rating);
  const commentCheck = characterLimitCheck(comment);
  if (!wifiCheck.passed)
    return wifiCheck
  if (!noise_levelCheck.passed )
    return noise_levelCheck
  if (!seating_comfortCheck.passed)
    return seating_comfortCheck
  if (!charging_accessibilityCheck.passed)
    return charging_accessibilityCheck
  if (!commentCheck.passed)  
    return commentCheck;

  if (!activePoi.is_quiet_space){
    const { error : spaceError } = await supabase
    .from('quiet_spaces')
    .upsert({ google_place_id: google_place_id }, { onConflict: 'google_place_id' });
    if (spaceError) return { passed: false, error: "Space init failed" };
  }
  const { error : ratingInsertError } = await supabase
    .from('ratings')
    .upsert({
      google_place_id: google_place_id,
      user_id: user.id,
      wifi_rating: Number(wifi_rating),
      noise_level_rating: Number(noise_level_rating),
      seating_comfort_rating: Number(seating_comfort_rating), 
      charging_accessibility_rating: Number(charging_accessibility_rating),
      comment: comment 
      },
      {
      onConflict: 'user_id, google_place_id'
      }
    ); 
    if (ratingInsertError)
      return { passed: false, error: `Failed inserting to ratings table, - ${ratingInsertError.message}`} 
    const { data: updatedPoi, error: fetchError } = await supabase.rpc('get_poi_by_placeid', { placeid: google_place_id })
      if (fetchError){
        return console.error("fetch error:", fetchError)
      }
    return { passed: true, updatedPoi: updatedPoi[0] };
  }







 