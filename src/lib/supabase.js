// ─────────────────────────────────────────────────────────────────────
// QuiltHaven · Supabase clients
//
// The public site reads with the anon key; server-only actions write with
// the service-role key. These throw if the keys are missing — callers
// guard with `isSupabaseConfigured()` so the site still runs on the
// bundled demo library until real keys are added.
// ─────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseAdminConfigured() {
  return isSupabaseConfigured() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function supabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

/** Public read-only client (anon key). Use in Server Components / route handlers. */
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

/** Server-only client with the service-role key. Never import from a client component. */
export function getSupabaseAdmin() {
  if (!isSupabaseAdminConfigured()) {
    throw new Error(
      "Supabase admin is not configured. Set SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

/** The storage bucket that holds pattern PDF files. */
export const PATTERN_FILES_BUCKET = "pattern-files";
