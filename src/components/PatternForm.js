"use client";

import { useState, useRef, useEffect, useActionState } from "react";
import { CATEGORIES, DIFFICULTIES } from "@/lib/patterns";
import { slugify } from "@/lib/format";

const SIZE_PRESETS = [
  "Baby (40″ × 40″)",
  "Lap (54″ × 54″)",
  "Twin (70″ × 90″)",
  "Queen (90″ × 108″)",
  "Wall Hanging (36″ × 36″)",
  "Table Runner (16″ × 48″)",
];

export default function PatternForm({
  action,
  initial = null,
  demoMode = false,
  onCancel = null,
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const isEdit = Boolean(initial);

  // Form state
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [isSlugCustomized, setIsSlugCustomized] = useState(Boolean(initial?.slug));
  const [category, setCategory] = useState(initial?.category || CATEGORIES[0]);
  const [isCustomCategory, setIsCustomCategory] = useState(
    Boolean(initial?.category && !CATEGORIES.includes(initial.category))
  );
  const [customCategoryText, setCustomCategoryText] = useState(
    initial?.category && !CATEGORIES.includes(initial.category) ? initial.category : ""
  );
  const [difficulty, setDifficulty] = useState(initial?.difficulty || DIFFICULTIES[0]);
  const [finishedSize, setFinishedSize] = useState(initial?.finished_size || "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url || "");
  const [imagePreview, setImagePreview] = useState(initial?.image_url || "");
  const [pdfFileName, setPdfFileName] = useState("");
  const [imageFileName, setImageFileName] = useState("");

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Auto-generate slug when title changes unless user manually customized slug
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugCustomized) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (e) => {
    setIsSlugCustomized(true);
    setSlug(slugify(e.target.value));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeKb = Math.round(file.size / 1024);
      setPdfFileName(`${file.name} (${sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`})`);
    }
  };

  const handleImageUrlChange = (e) => {
    const val = e.target.value;
    setImageUrl(val);
    if (!imageFileName) {
      setImagePreview(val);
    }
  };

  const finalCategory = isCustomCategory ? customCategoryText.trim() || "Lap Quilt" : category;

  return (
    <form
      action={formAction}
      className="overflow-hidden rounded-md border border-ink/15 bg-linen-light shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-ink/10 bg-linen/50 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="measure-label text-thread-deep">
              {isEdit ? "Workshop Editor" : "New Pattern Creation"}
            </span>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
              {isEdit ? `Edit “${initial.title}”` : "Upload Quilting Pattern"}
            </h2>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-seam btn-sm"
            >
              Cancel
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Complete the details below. Patterns are immediately formatted into the public library and downloadable PDF flow.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Hidden inputs for edit mode */}
        {isEdit && <input type="hidden" name="id" value={initial.id} />}
        {isEdit && (
          <input type="hidden" name="file_url" value={initial.file_url || ""} />
        )}

        {/* Demo Mode Notice */}
        {demoMode && (
          <div className="rounded border border-dashed border-thread-deep/40 bg-linen p-4 text-sm text-ink">
            <span className="font-semibold text-thread-deep">Demo Mode:</span> Supabase database keys are not configured yet. Changes are preview-only.
          </div>
        )}

        {/* Error Alert */}
        {state?.error && (
          <div
            className="rounded border border-burgundy/40 bg-burgundy/10 p-4 text-sm font-medium text-burgundy"
            role="alert"
          >
            <div className="flex items-start gap-2">
              <span className="text-base leading-none">⚠️</span>
              <div>
                <p className="font-semibold">Unable to save pattern</p>
                <p className="mt-0.5 text-xs opacity-90">{state.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Section 1: Identity & URL ────────────────────────────── */}
        <div>
          <h3 className="font-display text-lg font-semibold text-ink border-b border-ink/10 pb-2">
            1. Title & URL Slug
          </h3>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className="field-label" htmlFor="f-title">
                Pattern Title <span className="text-burgundy">*</span>
              </label>
              <input
                id="f-title"
                name="title"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Star of Bethlehem, Cabin in the Pines"
                className="field font-medium text-ink"
              />
            </div>

            <div className="sm:col-span-1">
              <div className="flex items-center justify-between">
                <label className="field-label" htmlFor="f-slug">
                  URL Slug <span className="text-burgundy">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsSlugCustomized(false);
                    setSlug(slugify(title));
                  }}
                  className="measure-label text-[0.65rem] text-thread-deep hover:underline"
                  title="Reset slug to auto-sync with title"
                >
                  Auto-sync
                </button>
              </div>
              <div className="relative">
                <input
                  id="f-slug"
                  name="slug"
                  required
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="star-of-bethlehem"
                  className="field font-mono text-sm"
                />
              </div>
              <p className="mt-1.5 font-mono text-[0.72rem] text-ink-soft">
                Live URL: <span className="text-thread-deep">/patterns/{slug || "pattern-slug"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Section 2: Pattern Files & Thumbnail ─────────────────── */}
        <div>
          <h3 className="font-display text-lg font-semibold text-ink border-b border-ink/10 pb-2">
            2. Media & Files (PDF & Thumbnail)
          </h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {/* Thumbnail Image */}
            <div className="rounded border border-ink/12 bg-linen/30 p-4">
              <label className="field-label" htmlFor="f-image-file">
                Thumbnail / Preview Image
              </label>
              <p className="mb-3 text-xs text-ink-soft">
                Upload a finished quilt photo or SVG artwork (stored in Supabase).
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* Image Preview Box */}
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded border border-ink/20 bg-linen-deep flex items-center justify-center quilt-frame">
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt="Thumbnail preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-center font-mono text-[0.68rem] text-ink-soft/70 px-2">
                      No Image
                    </span>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 w-full space-y-3">
                  <div>
                    <input
                      ref={imageInputRef}
                      id="f-image-file"
                      name="image_file"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleImageFileChange}
                      className="field file:mr-3 file:rounded-sm file:border-0 file:bg-midnight file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cream cursor-pointer text-xs"
                    />
                    {imageFileName && (
                      <p className="mt-1 font-mono text-[0.7rem] text-forest font-medium">
                        ✓ Selected: {imageFileName}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="measure-label text-[0.65rem] text-ink-soft">
                      Or Direct Image URL (Cloudinary / External)
                    </span>
                    <input
                      id="f-image-url"
                      name="image_url"
                      type="url"
                      value={imageUrl}
                      onChange={handleImageUrlChange}
                      placeholder="https://res.cloudinary.com/... or /patterns/..."
                      className="field text-xs mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PDF Pattern File */}
            <div className="rounded border border-ink/12 bg-linen/30 p-4">
              <label className="field-label" htmlFor="f-pdf-file">
                Pattern PDF File {isEdit ? "(optional to replace)" : ""}
              </label>
              <p className="mb-3 text-xs text-ink-soft">
                Upload the printable pattern PDF. Visitors unlock this via the ad view modal.
              </p>

              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  id="f-pdf-file"
                  name="file"
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfFileChange}
                  className="field file:mr-3 file:rounded-sm file:border-0 file:bg-midnight file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-cream cursor-pointer text-xs"
                />

                {pdfFileName ? (
                  <div className="flex items-center gap-2 rounded bg-forest/10 border border-forest/30 px-3 py-1.5 text-xs text-forest font-medium">
                    <span>📄</span>
                    <span>{pdfFileName}</span>
                  </div>
                ) : isEdit && initial?.file_url ? (
                  <div className="flex items-center justify-between rounded bg-linen border border-ink/15 px-3 py-1.5 text-xs text-ink-soft">
                    <span className="font-mono truncate max-w-[240px]">
                      Current: {initial.file_url}
                    </span>
                    <span className="measure-label text-[0.65rem] text-thread-deep">
                      Attached
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-ink-soft/80 italic">
                    Choose a .pdf file from your computer to attach to this pattern.
                  </p>
                )}

                <div>
                  <span className="measure-label text-[0.65rem] text-ink-soft">
                    Or Direct PDF URL / Static Path
                  </span>
                  <input
                    id="f-file-url"
                    name="file_url"
                    type="text"
                    defaultValue={initial?.file_url || ""}
                    placeholder="/patterns/demo/sample.pdf or https://..."
                    className="field text-xs mt-1 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 3: Classification & Specs ───────────────────── */}
        <div>
          <h3 className="font-display text-lg font-semibold text-ink border-b border-ink/10 pb-2">
            3. Pattern Specifications & Category
          </h3>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Category */}
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="f-category">
                Pattern Category
              </label>
              <div className="space-y-2">
                <select
                  id="f-category"
                  value={isCustomCategory ? "custom" : category}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setIsCustomCategory(true);
                    } else {
                      setIsCustomCategory(false);
                      setCategory(e.target.value);
                    }
                  }}
                  className="field"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="custom">+ Custom Category…</option>
                </select>

                {isCustomCategory && (
                  <div className="flex items-center gap-2">
                    <input
                      name="category"
                      value={customCategoryText}
                      onChange={(e) => setCustomCategoryText(e.target.value)}
                      placeholder="e.g. Modern Quilt, Holiday, Throw"
                      className="field text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(false)}
                      className="btn btn-seam btn-sm"
                    >
                      Presets
                    </button>
                  </div>
                )}
                {!isCustomCategory && (
                  <input type="hidden" name="category" value={category} />
                )}
              </div>
            </div>

            {/* Skill / Difficulty */}
            <div className="sm:col-span-2">
              <label className="field-label">Skill Level (Difficulty)</label>
              <input type="hidden" name="difficulty" value={difficulty} />
              <div className="flex flex-wrap gap-2 mt-1">
                {DIFFICULTIES.map((d) => {
                  const isActive = difficulty === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`chip ${isActive ? "is-active" : ""}`}
                    >
                      <span>
                        {d === "Beginner"
                          ? "🌱"
                          : d === "Easy"
                          ? "✨"
                          : d === "Intermediate"
                          ? "🧵"
                          : "👑"}
                      </span>
                      <span>{d}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Finished Size */}
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="f-size">
                Finished Size
              </label>
              <input
                id="f-size"
                name="finished_size"
                value={finishedSize}
                onChange={(e) => setFinishedSize(e.target.value)}
                placeholder="e.g. 54″ × 54″, 60″ × 72″"
                className="field"
              />
              <div className="mt-2 flex flex-wrap gap-1">
                {SIZE_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFinishedSize(p)}
                    className="rounded bg-linen px-2 py-0.5 font-mono text-[0.65rem] text-ink-soft hover:bg-linen-deep border border-ink/10 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Pieces */}
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="f-pieces">
                Pieces / Block Breakdown
              </label>
              <input
                id="f-pieces"
                name="pieces"
                defaultValue={initial?.pieces || ""}
                placeholder="e.g. 9 blocks · 81 strips, 12 Star Blocks"
                className="field"
              />
            </div>

            {/* Fabric Notes */}
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="field-label" htmlFor="f-fabric">
                Fabric Requirements & Notes
              </label>
              <input
                id="f-fabric"
                name="fabric"
                defaultValue={initial?.fabric || ""}
                placeholder="e.g. 2.5 yds Linen White, 1.5 yds Indigo Chambray, 0.75 yds Gold Accent"
                className="field"
              />
            </div>
          </div>
        </div>

        {/* ── Section 4: Description ──────────────────────────────── */}
        <div>
          <h3 className="font-display text-lg font-semibold text-ink border-b border-ink/10 pb-2">
            4. Description & Notes
          </h3>
          <div className="mt-4">
            <label className="field-label" htmlFor="f-description">
              Pattern Description & Story
            </label>
            <textarea
              id="f-description"
              name="description"
              defaultValue={initial?.description || ""}
              rows={4}
              placeholder="Describe the quilt design, inspiration, cutting tips, or assembly advice for quilters..."
              className="field"
            />
          </div>
        </div>

        {/* ── Section 5: Homepage Feature Toggle ──────────────────── */}
        <div className="rounded border border-ink/15 bg-linen/40 p-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              id="f-featured"
              name="featured"
              type="checkbox"
              defaultChecked={Boolean(initial?.featured)}
              className="h-5 w-5 rounded border-ink/30 text-thread-deep accent-thread cursor-pointer"
            />
            <div>
              <span className="font-medium text-ink text-sm block">
                Feature on Homepage Medallion
              </span>
              <span className="text-xs text-ink-soft">
                Highlights this pattern in the top showcase on the home page.
              </span>
            </div>
          </label>
        </div>

        {/* ── Submit / Actions ────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="btn btn-gold"
            >
              {pending ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-char border-t-transparent" />
                  {isEdit ? "Saving Changes…" : "Publishing Pattern…"}
                </span>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "+ Publish Pattern to Library"
              )}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={pending}
                className="btn btn-seam"
              >
                Cancel
              </button>
            )}
          </div>

          <p className="measure-label text-[0.7rem] text-ink-soft">
            {isEdit ? "Edits apply live immediately" : "Published patterns appear instantly in search"}
          </p>
        </div>
      </div>
    </form>
  );
}
