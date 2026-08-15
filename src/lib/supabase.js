// ─────────────────────────────────────────────────────────────────────
// QuiltHaven · Supabase base clients & configuration
// ─────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseAdminConfigured() {
  return isSupabaseConfigured();
}

export function supabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

/** Public read-only client (anon key). */
export function getSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  );
}

/** Server-only client with the service-role key (or anon key fallback if service key not set). */
export function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );
  }
  return getSupabase();
}

/** Storage buckets */
export const PATTERN_FILES_BUCKET = "pattern-files";
export const PATTERN_IMAGES_BUCKET = "pattern-images";
export const AVATARS_BUCKET = "avatars";
