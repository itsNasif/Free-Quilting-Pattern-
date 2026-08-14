"use server";

// Server-only mutations for the /admin area. Every function re-checks the
// signed admin cookie — never trust the client.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  createPatternRow,
  deletePatternRow,
  updatePatternRow,
  uploadPatternFile,
} from "@/lib/patterns";
import { isSupabaseAdminConfigured } from "@/lib/supabase";
import { ADMIN_COOKIE, isAdmin, issueToken } from "@/lib/auth";
import { slugify } from "@/lib/format";

const DEMO_ERROR = "Demo mode — configure Supabase to publish patterns.";

export async function login(formData) {
  const password = String(formData.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD || "quilthaven-change-me";
  if (password !== expected) {
    return { error: "That passcode didn't open the door." };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, issueToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin");
}

function readPatternInput(formData) {
  return {
    slug: slugify(String(formData.get("slug") || "")),
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    category: String(formData.get("category") || "Lap Quilt"),
    difficulty: String(formData.get("difficulty") || "Beginner"),
    finished_size: String(formData.get("finished_size") || "").trim(),
    pieces: String(formData.get("pieces") || "").trim(),
    fabric: String(formData.get("fabric") || "").trim(),
    image_url: String(formData.get("image_url") || "").trim(),
    featured: formData.get("featured") === "on",
  };
}

function pickFile(formData) {
  const file = formData.get("file");
  if (file && typeof file !== "string" && file.size > 0) return file;
  return null;
}

export async function createPattern(formData) {
  if (!(await isAdmin())) return { error: "Not authorized." };
  if (!isSupabaseAdminConfigured()) return { error: DEMO_ERROR };

  const input = readPatternInput(formData);
  if (!input.title || !input.slug) {
    return { error: "A title and slug are required." };
  }

  const file = pickFile(formData);
  let fileUrl = input.image_url ? String(formData.get("file_url") || "") : "";
  if (file) {
    const path = await uploadPatternFile(file, input.slug);
    if (path) fileUrl = path;
  }

  const result = await createPatternRow({ ...input, file_url: fileUrl || null });
  if (!result.ok) return { error: result.error };
  revalidatePath("/");
  revalidatePath("/patterns");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updatePattern(formData) {
  if (!(await isAdmin())) return { error: "Not authorized." };
  if (!isSupabaseAdminConfigured()) return { error: DEMO_ERROR };

  const id = String(formData.get("id") || "");
  const input = readPatternInput(formData);
  if (!id || !input.title || !input.slug) {
    return { error: "Missing pattern details." };
  }

  const file = pickFile(formData);
  let fileUrl = String(formData.get("file_url") || "");
  if (file) {
    const path = await uploadPatternFile(file, input.slug);
    if (path) fileUrl = path;
  }

  const result = await updatePatternRow(id, {
    ...input,
    file_url: fileUrl || null,
    image_url: input.image_url || null,
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/");
  revalidatePath("/patterns");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function removePattern(formData) {
  if (!(await isAdmin())) return { error: "Not authorized." };
  if (!isSupabaseAdminConfigured()) return { error: DEMO_ERROR };

  const id = String(formData.get("id") || "");
  if (!id) return { error: "Missing pattern id." };
  const result = await deletePatternRow(id);
  if (!result.ok) return { error: result.error };
  revalidatePath("/");
  revalidatePath("/patterns");
  revalidatePath("/admin");
  redirect("/admin");
}
