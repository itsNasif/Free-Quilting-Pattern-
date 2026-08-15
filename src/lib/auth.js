// ─────────────────────────────────────────────────────────────────────
// QuiltHaven · Authentication & Role-Based Access Control (RBAC)
//
// Supports both:
// 1. Supabase User Authentication (profiles table with role: 'user' | 'admin')
// 2. Admin workshop passcode HMAC cookie (quilthaven_admin)
// ─────────────────────────────────────────────────────────────────────

import { createHmac, timingSafeEqual } from "node:crypto";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";
import { createClientSSR } from "./supabase-server";

export const ADMIN_COOKIE = "quilthaven_admin";

const CLAIM = "quilthaven-admin";

function secret() {
  return process.env.ADMIN_PASSWORD || "quilthaven-change-me";
}

export function issueToken() {
  const sig = createHmac("sha256", secret()).update(CLAIM).digest("base64url");
  return `${CLAIM}.${sig}`;
}

export function verifyToken(token) {
  if (!token) return false;
  const [value, sig] = token.split(".");
  if (value !== CLAIM || !sig) return false;
  const expected = createHmac("sha256", secret())
    .update(CLAIM)
    .digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Get the currently authenticated Supabase Auth user (or null) */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClientSSR();
    if (!supabase) return null;
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (err) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") {
      throw err;
    }
    console.error("getCurrentUser error:", err);
    return null;
  }
}

/** Get current user's profile row from public.profiles */
export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("getCurrentProfile error:", error.message);
    }

    if (data) {
      return {
        ...data,
        email: data.email || user.email || "",
      };
    }

    // Fallback if profile row is not yet generated
    return {
      id: user.id,
      email: user.email || "",
      display_name:
        user.user_metadata?.display_name ||
        user.email?.split("@")[0] ||
        "Quilter",
      avatar_url: user.user_metadata?.avatar_url || null,
      role: "user",
      bio: "",
      favorite_craft: "",
      created_at: user.created_at,
    };
  } catch (err) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.error("getCurrentProfile caught error:", err);
    return null;
  }
}

/**
 * Returns true if the current session has admin privileges:
 * 1. Has a valid ADMIN_COOKIE passcode session, OR
 * 2. Is a logged-in Supabase user whose role in public.profiles is 'admin'.
 */
export async function isAdmin() {
  // Check admin passcode cookie first
  try {
    const store = await cookies();
    const token = store.get(ADMIN_COOKIE)?.value;
    if (verifyToken(token)) {
      return true;
    }
  } catch (err) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    // Ignore other cookie read issues
  }

  // Check Supabase user profile role
  try {
    const profile = await getCurrentProfile();
    if (profile && profile.role === "admin") {
      return true;
    }
  } catch (err) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.error("isAdmin profile check error:", err);
  }

  return false;
}

/**
 * Returns the current authenticated state:
 * { user, profile, isAdmin, isUser, isLoggedIn }
 */
export async function getAuthSession() {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;
  const adminAllowed = await isAdmin();

  return {
    isLoggedIn: Boolean(user),
    user,
    profile,
    isAdmin: adminAllowed,
    isUser: Boolean(user && (!profile || profile.role === "user")),
    role: adminAllowed ? "admin" : user ? (profile?.role || "user") : "guest",
  };
}
