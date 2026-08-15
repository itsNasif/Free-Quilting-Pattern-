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
  uploadPatternImage,
} from "@/lib/patterns";
import { isSupabaseAdminConfigured } from "@/lib/supabase";
import { ADMIN_COOKIE, isAdmin, issueToken } from "@/lib/auth";
import { slugify } from "@/lib/format";

const DEMO_ERROR = "Demo mode — configure Supabase to publish patterns.";

/** Safely extracts FormData whether action is invoked from useActionState(prev, formData) or direct form action */
function extractFormData(arg1, arg2) {
  if (arg2 && typeof arg2.get === "function") return arg2;
  if (arg1 && typeof arg1.get === "function") return arg1;
  return null;
}

export async function login(prevStateOrFormData, maybeFormData) {
  const formData = extractFormData(prevStateOrFormData, maybeFormData);
  if (!formData) {
    return { error: "Please enter your workshop passcode." };
  }

  const password = String(formData.get("password") || "").trim();
  const expected = (process.env.ADMIN_PASSWORD || "quilthaven-change-me").trim();

  if (!password || password !== expected) {
    return { error: "That passcode didn't open the door. Check ADMIN_PASSWORD." };
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
  const rawSlug = String(formData.get("slug") || "").trim();
  const rawTitle = String(formData.get("title") || "").trim();
  const computedSlug = rawSlug ? slugify(rawSlug) : slugify(rawTitle);

  return {
    slug: computedSlug,
    title: rawTitle,
    description: String(formData.get("description") || "").trim(),
    category: String(formData.get("category") || "Lap Quilt").trim(),
    difficulty: String(formData.get("difficulty") || "Beginner").trim(),
    finished_size: String(formData.get("finished_size") || "").trim(),
    pieces: String(formData.get("pieces") || "").trim(),
    fabric: String(formData.get("fabric") || "").trim(),
    image_url: String(formData.get("image_url") || "").trim(),
    file_url: String(formData.get("file_url") || "").trim(),
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
  };
}

function pickFile(formData, key) {
  const file = formData.get(key);
  if (file && typeof file !== "string" && file.size > 0) return file;
  return null;
}

export async function createPattern(prevStateOrFormData, maybeFormData) {
  if (!(await isAdmin())) return { error: "Not authorized. Please sign in." };
  if (!isSupabaseAdminConfigured()) return { error: DEMO_ERROR };

  const formData = extractFormData(prevStateOrFormData, maybeFormData);
  if (!formData) return { error: "Invalid form submission." };

  const input = readPatternInput(formData);
  if (!input.title) {
    return { error: "Pattern title is required." };
  }
  if (!input.slug) {
    return { error: "Pattern slug could not be generated. Please enter a title or slug." };
  }

  // Handle PDF file upload
  const pdfFile = pickFile(formData, "file") || pickFile(formData, "pdf_file");
  let fileUrl = input.file_url || null;
  if (pdfFile) {
    const uploadedPath = await uploadPatternFile(pdfFile, input.slug);
    if (uploadedPath) {
      fileUrl = uploadedPath;
    }
  }

  // Handle Thumbnail Image upload
  const imageFile = pickFile(formData, "image_file") || pickFile(formData, "thumbnail_file");
  let imageUrl = input.image_url || null;
  if (imageFile) {
    const uploadedImageUrl = await uploadPatternImage(imageFile, input.slug);
    if (uploadedImageUrl) {
      imageUrl = uploadedImageUrl;
    }
  }

  const result = await createPatternRow({
    ...input,
    file_url: fileUrl,
    image_url: imageUrl,
  });

  if (!result.ok) {
    if (result.error?.includes("duplicate") || result.error?.includes("slug")) {
      return { error: `The slug “${input.slug}” is already in use. Please modify the slug.` };
    }
    return { error: result.error || "Failed to create pattern." };
  }

  revalidatePath("/");
  revalidatePath("/patterns");
  revalidatePath(`/patterns/${input.slug}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updatePattern(prevStateOrFormData, maybeFormData) {
  if (!(await isAdmin())) return { error: "Not authorized. Please sign in." };
  if (!isSupabaseAdminConfigured()) return { error: DEMO_ERROR };

  const formData = extractFormData(prevStateOrFormData, maybeFormData);
  if (!formData) return { error: "Invalid form submission." };

  const id = String(formData.get("id") || "").trim();
  const input = readPatternInput(formData);

  if (!id || !input.title || !input.slug) {
    return { error: "Missing pattern details (id, title, or slug)." };
  }

  // Handle PDF file upload
  const pdfFile = pickFile(formData, "file") || pickFile(formData, "pdf_file");
  let fileUrl = input.file_url || undefined;
  if (pdfFile) {
    const uploadedPath = await uploadPatternFile(pdfFile, input.slug);
    if (uploadedPath) {
      fileUrl = uploadedPath;
    }
  }

  // Handle Thumbnail Image upload
  const imageFile = pickFile(formData, "image_file") || pickFile(formData, "thumbnail_file");
  let imageUrl = input.image_url || undefined;
  if (imageFile) {
    const uploadedImageUrl = await uploadPatternImage(imageFile, input.slug);
    if (uploadedImageUrl) {
      imageUrl = uploadedImageUrl;
    }
  }

  const result = await updatePatternRow(id, {
    ...input,
    ...(fileUrl !== undefined ? { file_url: fileUrl } : {}),
    ...(imageUrl !== undefined ? { image_url: imageUrl } : {}),
  });

  if (!result.ok) {
    if (result.error?.includes("duplicate") || result.error?.includes("slug")) {
      return { error: `The slug “${input.slug}” is already in use by another pattern.` };
    }
    return { error: result.error || "Failed to update pattern." };
  }

  revalidatePath("/");
  revalidatePath("/patterns");
  revalidatePath(`/patterns/${input.slug}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function removePattern(prevStateOrFormData, maybeFormData) {
  if (!(await isAdmin())) return { error: "Not authorized. Please sign in." };
  if (!isSupabaseAdminConfigured()) return { error: DEMO_ERROR };

  const formData = extractFormData(prevStateOrFormData, maybeFormData);
  if (!formData) return { error: "Invalid form submission." };

  const id = String(formData.get("id") || "").trim();
  if (!id) return { error: "Missing pattern id." };

  const result = await deletePatternRow(id);
  if (!result.ok) return { error: result.error || "Failed to delete pattern." };

  revalidatePath("/");
  revalidatePath("/patterns");
  revalidatePath("/admin");
  redirect("/admin");
}
