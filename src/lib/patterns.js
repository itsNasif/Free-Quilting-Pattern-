// ─────────────────────────────────────────────────────────────────────
// QuiltHaven · pattern data access
//
// One access layer for both worlds. With Supabase keys present every
// function queries the `patterns` table; without them the site serves
// the bundled demo library so the design is fully visible before real
// content is added. Demo rows are synthetic and labeled.
// ─────────────────────────────────────────────────────────────────────

import { getDemoPattern, getDemoPatterns } from "./demo-patterns";
import {
  getSupabase,
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
  PATTERN_FILES_BUCKET,
} from "./supabase";

const TABLE = "patterns";

/** snake_case DB row → camelCase pattern object */
function rowToPattern(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    difficulty: row.difficulty,
    finished_size: row.finished_size,
    pieces: row.pieces,
    fabric: row.fabric,
    file_url: row.file_url,
    image_url: row.image_url,
    download_count: row.download_count ?? 0,
    featured: Boolean(row.featured),
    created_at: row.created_at,
  };
}

function demoFilter({ search = "", category = "", difficulty = "" }) {
  const q = search.trim().toLowerCase();
  return getDemoPatterns().filter((p) => {
    if (category && p.category !== category) return false;
    if (difficulty && p.difficulty !== difficulty) return false;
    if (q) {
      const hay = `${p.title} ${p.description} ${p.category}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export const CATEGORIES = [
  "Lap Quilt",
  "Baby Quilt",
  "Bed Quilt",
  "Wall Hanging",
  "Table Topper",
];

export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

/**
 * List patterns with optional filters.
 * Returns { items, total }.
 */
export async function getPatterns({
  search = "",
  category = "",
  difficulty = "",
  limit = 12,
  offset = 0,
} = {}) {
  if (!isSupabaseConfigured()) {
    const items = demoFilter({ search, category, difficulty });
    return { items, total: items.length };
  }

  const client = getSupabase();
  let query = client.from(TABLE).select("*", { count: "exact" });

  if (category) query = query.eq("category", category);
  if (difficulty) query = query.eq("difficulty", difficulty);
  if (search.trim()) {
    query = query.or(
      `title.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`
    );
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("getPatterns error:", error.message);
    return { items: [], total: 0 };
  }
  return { items: (data || []).map(rowToPattern), total: count ?? 0 };
}

export async function getPatternBySlug(slug) {
  if (!isSupabaseConfigured()) {
    return getDemoPattern(slug);
  }
  const client = getSupabase();
  const { data, error } = await client
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("getPatternBySlug error:", error.message);
    return null;
  }
  return rowToPattern(data);
}

export async function getFeaturedPatterns(limit = 4) {
  if (!isSupabaseConfigured()) {
    return getDemoPatterns().filter((p) => p.featured).slice(0, limit);
  }
  const client = getSupabase();
  const { data, error } = await client
    .from(TABLE)
    .select("*")
    .eq("featured", true)
    .order("download_count", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getFeaturedPatterns error:", error.message);
    return [];
  }
  return (data || []).map(rowToPattern);
}

/** Patterns that share a category, excluding the current one. */
export async function getRelatedPatterns(pattern, limit = 3) {
  if (!isSupabaseConfigured()) {
    return getDemoPatterns()
      .filter((p) => p.slug !== pattern.slug && p.category === pattern.category)
      .slice(0, limit);
  }
  const client = getSupabase();
  const { data, error } = await client
    .from(TABLE)
    .select("*")
    .eq("category", pattern.category)
    .neq("slug", pattern.slug)
    .order("download_count", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getRelatedPatterns error:", error.message);
    return [];
  }
  return (data || []).map(rowToPattern);
}

/** Most-downloaded patterns for the homepage rail. */
export async function getPopularPatterns(limit = 4) {
  if (!isSupabaseConfigured()) {
    return [...getDemoPatterns()]
      .sort((a, b) => b.download_count - a.download_count)
      .slice(0, limit);
  }
  const client = getSupabase();
  const { data, error } = await client
    .from(TABLE)
    .select("*")
    .order("download_count", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getPopularPatterns error:", error.message);
    return [];
  }
  return (data || []).map(rowToPattern);
}

/**
 * The URL the download button ultimately points at.
 * Demo mode: the bundled public PDF. Supabase mode: a short-lived signed
 * URL from the pattern-files bucket so the file is never exposed.
 */
export async function getDownloadUrl(pattern) {
  if (!isSupabaseConfigured()) {
    return pattern.file_url;
  }
  if (!pattern.file_url) return null;
  try {
    const client = getSupabaseAdmin();
    const { data, error } = await client.storage
      .from(PATTERN_FILES_BUCKET)
      .createSignedUrl(pattern.file_url, 60 * 60);
    if (error || !data?.signedUrl) return pattern.file_url;
    return data.signedUrl;
  } catch {
    return pattern.file_url;
  }
}

/**
 * Record a completed download. Returns the new count.
 * In demo mode the count is not persisted, so it returns the demo number.
 */
export async function incrementDownloadCount(id) {
  if (!isSupabaseAdminConfigured()) {
    const demo = getDemoPatterns().find((p) => p.id === id);
    return demo ? demo.download_count : 0;
  }
  const client = getSupabaseAdmin();
  const { data, error } = await client.rpc("increment_download", {
    pattern_id: id,
  });
  if (error) {
    console.error("increment_download error:", error.message);
    return 0;
  }
  return typeof data === "number" ? data : 0;
}

/* ── admin (server-only) ───────────────────────────────────────────── */

export async function listAllPatterns() {
  if (!isSupabaseConfigured()) {
    return getDemoPatterns();
  }
  const client = getSupabase();
  const { data, error } = await client
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("listAllPatterns error:", error.message);
    return [];
  }
  return (data || []).map(rowToPattern);
}

/** Insert a pattern row. Returns { ok, pattern?, error? }. */
export async function createPatternRow(input) {
  if (!isSupabaseAdminConfigured()) {
    return { ok: false, error: "Demo mode — configure Supabase to publish patterns." };
  }
  const client = getSupabaseAdmin();
  const { data, error } = await client
    .from(TABLE)
    .insert({
      slug: input.slug,
      title: input.title,
      description: input.description,
      category: input.category,
      difficulty: input.difficulty,
      finished_size: input.finished_size,
      pieces: input.pieces,
      fabric: input.fabric,
      file_url: input.file_url || null,
      image_url: input.image_url || null,
      featured: Boolean(input.featured),
    })
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, pattern: rowToPattern(data) };
}

export async function updatePatternRow(id, input) {
  if (!isSupabaseAdminConfigured()) {
    return { ok: false, error: "Demo mode — configure Supabase to manage patterns." };
  }
  const client = getSupabaseAdmin();
  const { data, error } = await client
    .from(TABLE)
    .update({
      slug: input.slug,
      title: input.title,
      description: input.description,
      category: input.category,
      difficulty: input.difficulty,
      finished_size: input.finished_size,
      pieces: input.pieces,
      fabric: input.fabric,
      ...(input.file_url !== undefined ? { file_url: input.file_url } : {}),
      ...(input.image_url !== undefined ? { image_url: input.image_url } : {}),
      featured: Boolean(input.featured),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, pattern: rowToPattern(data) };
}

export async function deletePatternRow(id) {
  if (!isSupabaseAdminConfigured()) {
    return { ok: false, error: "Demo mode — configure Supabase to manage patterns." };
  }
  const client = getSupabaseAdmin();
  const { error } = await client.from(TABLE).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Upload a PDF to the pattern-files bucket. Returns the stored path. */
export async function uploadPatternFile(file, slug) {
  if (!isSupabaseAdminConfigured()) return null;
  const client = getSupabaseAdmin();
  const path = `patterns/${slug}.pdf`;
  const { error } = await client.storage
    .from(PATTERN_FILES_BUCKET)
    .upload(path, file, { upsert: true, contentType: "application/pdf" });
  if (error) {
    console.error("uploadPatternFile error:", error.message);
    return null;
  }
  return path;
}
