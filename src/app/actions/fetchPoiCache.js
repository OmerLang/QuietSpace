'use server'
import { getStaticClient } from "@/utils/supabase/static"

export async function fetchPoiCache(searchArea) {
  
  const staticSupabase = getStaticClient();
  const { data } = await staticSupabase.rpc('get_pois_in_view', searchArea);
  return data;
}