import { createClient as createRawClient } from "@supabase/supabase-js";

export async function createClient() {
  // Directly connect using the Service Role Admin Token—no browser cookies attached!
  return createRawClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false, // Prevents serverless instances from caching state tokens across distinct users
        autoRefreshToken: false,
      },
    },
  );
}

// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";

// export async function createClient() {
//   const cookieStore = await cookies();
//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.SUPABASE_SERVICE_ROLE_KEY,
//     {
//       cookies: {
//         getAll() {
//           return cookieStore.getAll();
//         },
//         setAll(cookiesToSet) {
//           try {
//             cookiesToSet.forEach(({ name, value, options }) =>
//               cookieStore.set(name, value, options),
//             );
//           } catch {}
//         },
//       },
//     },
//   );
// }
