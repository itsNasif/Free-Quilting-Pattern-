"use client";

import { useActionState } from "react";
import { CATEGORIES, DIFFICULTIES } from "@/lib/patterns";

// Shared create/edit form. `action` is the server action (createPattern or
// updatePattern); `initial` is the pattern being edited, or null for a new one.

export default function PatternForm({ action, initial = null, demoMode = false }) {
  const [state, formAction, pending] = useActionState(action, {});
  const isEdit = Boolean(initial);

  return (
    <form
      action={formAction}
      className="rounded-md border border-ink/15 bg-linen-light p-6 raised-lift"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold text-ink">
          {isEdit ? `Edit — ${initial.title}` : "New pattern"}
        </h2>
        {isEdit && <input type="hidden" name="id" value={initial.id} />}
        {isEdit && (
          <input type="hidden" name="file_url" value={initial.file_url || ""} />
        )}
      </div>

      {demoMode && (
        <p className="mt-3 rounded-sm border border-dashed border-thread-deep/50 bg-linen px-3 py-2 text-sm text-ink-soft">
          Demo mode is on — add your Supabase keys to publish changes.
        </p>
      )}

      {state?.error && (
        <p className="mt-3 rounded-sm border border-burgundy/40 bg-burgundy/5 px-3 py-2 text-sm font-medium text-burgundy" role="alert">
          {state.error}
        </p>
      )}

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label className="field-label" htmlFor="f-title">Title</label>
          <input id="f-title" name="title" required defaultValue={initial?.title || ""} className="field" />
        </div>
        <div className="sm:col-span-1">
          <label className="field-label" htmlFor="f-slug">Slug</label>
          <input id="f-slug" name="slug" required defaultValue={initial?.slug || ""} className="field" placeholder="cabin-in-the-pines" />
        </div>

        <div>
          <label className="field-label" htmlFor="f-category">Category</label>
          <select id="f-category" name="category" defaultValue={initial?.category || CATEGORIES[0]} className="field">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="f-difficulty">Difficulty</label>
          <select id="f-difficulty" name="difficulty" defaultValue={initial?.difficulty || DIFFICULTIES[0]} className="field">
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="f-size">Finished size</label>
          <input id="f-size" name="finished_size" defaultValue={initial?.finished_size || ""} className="field" placeholder="54 × 54 in" />
        </div>
        <div>
          <label className="field-label" htmlFor="f-pieces">Pieces</label>
          <input id="f-pieces" name="pieces" defaultValue={initial?.pieces || ""} className="field" placeholder="9 blocks · 81 strips" />
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="f-fabric">Fabric notes</label>
          <input id="f-fabric" name="fabric" defaultValue={initial?.fabric || ""} className="field" />
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="f-description">Description</label>
          <textarea id="f-description" name="description" defaultValue={initial?.description || ""} className="field" />
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="f-image">Preview image URL (Cloudinary)</label>
          <input id="f-image" name="image_url" type="url" defaultValue={initial?.image_url || ""} className="field" placeholder="https://res.cloudinary.com/…/pattern.jpg" />
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="f-file">Pattern PDF {isEdit ? "(leave empty to keep current)" : ""}</label>
          <input id="f-file" name="file" type="file" accept="application/pdf" className="field file:mr-3 file:rounded-sm file:border-0 file:bg-midnight file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-cream" />
        </div>

        <div className="flex items-center gap-3 sm:col-span-2">
          <input
            id="f-featured"
            name="featured"
            type="checkbox"
            defaultChecked={Boolean(initial?.featured)}
            className="h-5 w-5 accent-thread"
          />
          <label htmlFor="f-featured" className="text-sm font-medium text-ink">
            Feature on the homepage medallion
          </label>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-gold">
          {pending ? "Saving…" : isEdit ? "Save changes" : "Publish pattern"}
        </button>
      </div>
    </form>
  );
}
