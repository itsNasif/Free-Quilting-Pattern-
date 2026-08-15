"use client";

import { useState, useRef, useEffect, useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { updateProfile, signOutUser } from "@/actions/auth";

const CRAFT_OPTIONS = [
  "Traditional Patchwork",
  "Modern Quilting",
  "Appliqué & Hand Stitching",
  "Foundation Paper Piecing (FPP)",
  "English Paper Piecing (EPP)",
  "Free-Motion Quilting",
  "Baby & Lap Quilts",
  "Art Quilts & Wall Hangings",
  "Scrap Quilting",
];

export default function ProfileEditor({ profile, user, isCloudinaryReady = false }) {
  const [state, formAction, pending] = useActionState(updateProfile, {});
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarPreview(profile.avatar_url);
    }
  }, [profile?.avatar_url]);

  useEffect(() => {
    if (state?.success && fileInputRef.current) {
      fileInputRef.current.value = "";
      setSelectedFileName("");
    }
  }, [state?.success]);

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const roleLabel = profile?.role === "admin" ? "Administrator" : "Quilter (User)";
  const isAdmin = profile?.role === "admin";

  return (
    <div className="space-y-8">
      {/* Profile Overview Card */}
      <div className="overflow-hidden rounded-md border border-ink/15 bg-linen-light shadow-[var(--shadow-lift)]">
        {/* Banner */}
        <div className="relative h-28 bg-gradient-to-r from-midnight via-indigo-deep to-forest sm:h-36">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 right-4 flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide ${
                isAdmin
                  ? "bg-gold text-char border border-gold-light"
                  : "bg-midnight/80 text-thread-light border border-thread/40"
              }`}
            >
              {isAdmin ? "👑 Admin Role" : "🧵 Normal User"}
            </span>
          </div>
        </div>

        {/* User Identity Header */}
        <div className="relative px-6 pb-6 pt-0 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex items-end gap-4">
              {/* Avatar Frame */}
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-full border-4 border-linen-light bg-linen-deep shadow-md flex items-center justify-center">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview}
                    alt={profile?.display_name || "Profile avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-midnight text-cream text-2xl font-serif font-bold">
                    {(profile?.display_name || user?.email || "Q")[0].toUpperCase()}
                  </div>
                )}
              </div>

              <div className="pb-1">
                <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                  {profile?.display_name || "Quilter"}
                </h1>
                <p className="font-mono text-xs text-ink-soft">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link href="/admin" className="btn btn-gold btn-sm">
                  Go to Admin Workshop →
                </Link>
              )}
              <form action={signOutUser}>
                <button type="submit" className="btn btn-seam btn-sm">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form
        action={formAction}
        className="overflow-hidden rounded-md border border-ink/15 bg-linen-light shadow-sm"
      >
        <div className="border-b border-ink/10 bg-linen/50 px-6 py-4">
          <span className="measure-label text-thread-deep">Quilter Profile Details</span>
          <h2 className="mt-0.5 font-display text-xl font-semibold text-ink">
            Edit Your Quilter Profile & Avatar
          </h2>
          <p className="text-xs text-ink-soft mt-0.5">
            Profile images are uploaded directly to Cloudinary.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Notifications */}
          {state?.error && (
            <div
              className="rounded border border-burgundy/40 bg-burgundy/10 p-3.5 text-xs font-medium text-burgundy"
              role="alert"
            >
              ⚠️ {state.error}
            </div>
          )}

          {state?.success && (
            <div
              className="rounded border border-forest/40 bg-forest/10 p-3.5 text-xs font-medium text-forest"
              role="alert"
            >
              ✨ {state.message}
            </div>
          )}

          {/* Section 1: Avatar Upload */}
          <div className="rounded border border-ink/10 bg-linen/30 p-4">
            <label className="field-label block mb-1">
              Profile Avatar (Cloudinary Upload)
            </label>
            <p className="text-xs text-ink-soft mb-3">
              Upload a profile picture from your computer or phone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-ink/20 bg-linen flex items-center justify-center">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-mono text-xs text-ink-soft">No Pic</span>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <input
                  ref={fileInputRef}
                  id="f-avatar-file"
                  name="avatar_file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleAvatarFileChange}
                  className="field file:mr-3 file:rounded-sm file:border-0 file:bg-midnight file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cream cursor-pointer text-xs"
                />

                {selectedFileName && (
                  <p className="font-mono text-[0.72rem] text-forest font-medium">
                    ✓ Selected: {selectedFileName}
                  </p>
                )}

                <div className="pt-1">
                  <span className="measure-label text-[0.65rem] text-ink-soft">
                    Or Direct Avatar Image URL
                  </span>
                  <input
                    id="f-avatar-url"
                    name="avatar_url"
                    type="url"
                    defaultValue={profile?.avatar_url || ""}
                    placeholder="https://res.cloudinary.com/... or https://..."
                    className="field text-xs mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Details */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="f-display-name">
                Display Name <span className="text-burgundy">*</span>
              </label>
              <input
                id="f-display-name"
                name="display_name"
                defaultValue={profile?.display_name || ""}
                required
                placeholder="e.g. Eleanor Burns, Jane Quilt"
                className="field"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="f-email-readonly">
                Email Address (Account ID)
              </label>
              <input
                id="f-email-readonly"
                type="email"
                readOnly
                value={user?.email || ""}
                className="field bg-ink/[.03] text-ink-soft cursor-not-allowed font-mono text-xs"
              />
            </div>
          </div>

          {/* Section 3: Favorite Craft & Bio */}
          <div>
            <label className="field-label" htmlFor="f-favorite-craft">
              Favorite Quilting Technique / Style
            </label>
            <div className="space-y-2">
              <input
                id="f-favorite-craft"
                name="favorite_craft"
                defaultValue={profile?.favorite_craft || ""}
                placeholder="e.g. Traditional Patchwork, Star Blocks, Foundation Paper Piecing"
                className="field"
              />
              <div className="flex flex-wrap gap-1.5">
                {CRAFT_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      const input = document.getElementById("f-favorite-craft");
                      if (input) input.value = c;
                    }}
                    className="rounded bg-linen px-2 py-0.5 font-mono text-[0.68rem] text-ink-soft hover:bg-linen-deep border border-ink/10 transition-colors"
                  >
                    + {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="f-bio">
              Quilter Bio & Craft Journey
            </label>
            <textarea
              id="f-bio"
              name="bio"
              defaultValue={profile?.bio || ""}
              rows={3}
              placeholder="Tell other quilters about your sewing machine, favourite color palettes, or how many years you have been making quilts..."
              className="field"
            />
          </div>

          {/* Role & Account Information Box */}
          <div className="rounded border border-ink/15 bg-linen/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="measure-label text-ink-soft">System Role</span>
                <p className="font-medium text-ink text-sm">
                  {roleLabel}
                </p>
              </div>
              <div className="text-right">
                <span className="measure-label text-ink-soft">Member Since</span>
                <p className="font-mono text-xs text-ink-soft">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recently"}
                </p>
              </div>
            </div>
            <p className="mt-2 text-[0.72rem] text-ink-soft leading-relaxed">
              {isAdmin
                ? "As an Administrator, you have full access to publish new patterns, edit existing catalog items, and view download analytics in the Pattern Workshop."
                : "As a Quilter (Normal User), you have free access to download all pattern PDFs, manage your profile, and save favourite quilt studies."}
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between border-t border-ink/10 pt-4">
            <button
              type="submit"
              disabled={pending}
              className="btn btn-gold"
            >
              {pending ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-char border-t-transparent" />
                  Saving Profile…
                </span>
              ) : (
                "Save Profile Changes"
              )}
            </button>

            <Link href="/patterns" className="btn btn-seam text-xs">
              Explore Pattern Catalog →
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
