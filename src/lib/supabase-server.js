// ─────────────────────────────────────────────────────────────────────
// QuiltHaven · Supabase SSR Server Client (Server Components & Server Actions)
// ─────────────────────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "./supabase";

export async function createClientSSR() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can be safely ignored when called from Server Component render contexts
          }
        },
      },
    }
  );
}
