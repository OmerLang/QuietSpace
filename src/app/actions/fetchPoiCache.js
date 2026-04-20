'use server'
import { getStaticClient } from "@/utils/supabase/static"

export async function fetchPoiCache(searchArea) {
  const staticSupabase = getStaticClient();
  const { data, error } = await staticSupabase.rpc('get_pois_in_view', searchArea);
  if (error) {
    console.error("Supabase RPC Error:", error.message);
    console.error("Details:", error.details);
    return [];
  }
  return data;
}

export async function getQuietSpacesByZoom(area) {
  const staticSupabase = getStaticClient();
  const { data, error } = await staticSupabase.rpc('get_pois_by_density', area)
  if (error) {
    console.error("Supabase RPC Error:", error.message);
    console.error("Details:", error.details);
    return [];
  }
  return data;
}