import { createClient } from '@supabase/supabase-js'
export const getStaticClient = () => 
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );