"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSupabaseAdmin, isSupabaseConfigured, AVATARS_BUCKET } from "@/lib/supabase";
import { createClientSSR } from "@/lib/supabase-server";
import { ADMIN_COOKIE, getCurrentUser, getCurrentProfile } from "@/lib/auth";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

function extractFormData(arg1, arg2) {
  if (arg2 && typeof arg2.get === "function") return arg2;
  if (arg1 && typeof arg1.get === "function") return arg1;
  return null;
}

function pickFile(formData, key) {
  const file = formData.get(key);
  if (file && typeof file !== "string" && file.size > 0) return file;
  return null;
}

/**
 * Register / Sign up a new user account.
 * Automatically assigns role 'user' in public.profiles.
 */
export async function signUpUser(prevStateOrFormData, maybeFormData) {
  if (!isSupabaseConfigured()) {
    return { error: "Database is in demo mode. Configure Supabase to register users." };
  }

  const formData = extractFormData(prevStateOrFormData, maybeFormData);
  if (!formData) return { error: "Invalid form submission." };

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "").trim();
  const displayName = String(formData.get("display_name") || "").trim() || email.split("@")[0];

  if (!email || !email.includes("@")) {
    return { error: "Please provide a valid email address." };
  }
  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const supabase = await createClientSSR();
  if (!supabase) return { error: "Authentication client unavailable." };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    return { error: error.message || "Failed to create account." };
  }

  // If user is immediately signed in
  if (data.session) {
    revalidatePath("/");
    revalidatePath("/profile");
    redirect("/profile");
  }

  return {
    success: true,
    message: "Welcome to QuiltHaven! Please check your email to confirm your account, then sign in.",
  };
}

/**
 * Sign in an existing user with email and password.
 */
export async function signInUser(prevStateOrFormData, maybeFormData) {
  if (!isSupabaseConfigured()) {
    return { error: "Database is in demo mode. Configure Supabase to sign in." };
  }

  const formData = extractFormData(prevStateOrFormData, maybeFormData);
  if (!formData) return { error: "Invalid form submission." };

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "").trim();
  const returnTo = String(formData.get("return_to") || "/profile").trim();

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const supabase = await createClientSSR();
  if (!supabase) return { error: "Authentication client unavailable." };

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Invalid email or password. Please try again." };
    }
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/admin");

  const safePath = returnTo.startsWith("/") ? returnTo : "/profile";
  redirect(safePath);
}

/**
 * Sign out the currently authenticated user.
 */
export async function signOutUser() {
  const supabase = await createClientSSR();
  if (supabase) {
    await supabase.auth.signOut();
  }

  try {
    const store = await cookies();
    store.delete(ADMIN_COOKIE);
  } catch {}

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/admin");
  redirect("/");
}

/**
 * Upload an avatar to Cloudinary (or Supabase Storage fallback)
 * and update the user's profile.
 */
export async function updateProfile(prevStateOrFormData, maybeFormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be signed in to update your profile." };
  }

  const formData = extractFormData(prevStateOrFormData, maybeFormData);
  if (!formData) return { error: "Invalid form submission." };

  const displayName = String(formData.get("display_name") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const favoriteCraft = String(formData.get("favorite_craft") || "").trim();
  const directAvatarUrl = String(formData.get("avatar_url") || "").trim();

  let avatarUrl = directAvatarUrl || undefined;

  // Check for uploaded avatar image file
  const avatarFile = pickFile(formData, "avatar_file");
  if (avatarFile) {
    let uploadSuccess = false;

    // 1. Try Cloudinary first
    if (isCloudinaryConfigured()) {
      const uploadRes = await uploadImageToCloudinary(avatarFile, {
        folder: "quilthaven/avatars",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
      });

      if (uploadRes.ok && uploadRes.url) {
        avatarUrl = uploadRes.url;
        uploadSuccess = true;
      } else {
        console.warn("Cloudinary upload issue:", uploadRes.error);
      }
    }

    // 2. Fallback to Supabase Storage if Cloudinary was not used or failed
    if (!uploadSuccess) {
      try {
        const admin = getSupabaseAdmin();
        const ext = avatarFile.name?.split(".").pop()?.toLowerCase() || "jpg";
        const path = `avatars/${user.id}-${Date.now()}.${ext}`;
        const { error: uploadErr } = await admin.storage
          .from(AVATARS_BUCKET)
          .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type || "image/jpeg" });

        if (uploadErr) {
          console.error("Supabase Storage upload error:", uploadErr.message);
          return { error: `Failed to upload avatar image: ${uploadErr.message}` };
        }

        const { data } = admin.storage.from(AVATARS_BUCKET).getPublicUrl(path);
        if (data?.publicUrl) {
          avatarUrl = data.publicUrl;
          uploadSuccess = true;
        }
      } catch (e) {
        console.error("Avatar storage upload caught error:", e);
        return { error: `Image upload failed: ${e.message}` };
      }
    }
  }

  // Update profile row in database via authenticated SSR client (or admin fallback)
  const supabase = (await createClientSSR()) || getSupabaseAdmin();
  const updatePayload = {
    id: user.id,
    email: user.email || "",
    updated_at: new Date().toISOString(),
    display_name: displayName || user.email?.split("@")[0] || "Quilter",
    bio: bio,
    favorite_craft: favoriteCraft,
    ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
  };

  const { error: updateError } = await supabase
    .from("profiles")
    .upsert(updatePayload, { onConflict: "id" });

  if (updateError) {
    console.error("Profile upsert error:", updateError);
    return { error: updateError.message || "Failed to update profile in database." };
  }

  revalidatePath("/profile");
  revalidatePath("/");
  return { success: true, message: "Profile updated successfully! Your picture is saved." };
}
