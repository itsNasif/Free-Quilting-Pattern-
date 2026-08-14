"use client";

import { useState } from "react";
import PatternForm from "./PatternForm";
import { createPattern, logout, removePattern, updatePattern } from "@/actions/admin";
import { formatCount, formatDate } from "@/lib/format";

export default function AdminDashboard({ patterns, demoMode }) {
  const [view, setView] = useState({ mode: "list" });

  const totalDownloads = patterns.reduce((n, p) => n + (p.download_count || 0), 0);
  const featuredCount = patterns.filter((p) => p.featured).length;

  if (view.mode !== "list") {
    const action = view.mode === "edit" ? updatePattern : createPattern;
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
        <button
          type="button"
          onClick={() => setView({ mode: "list" })}
          className="btn btn-seam btn-sm mb-6"
        >
          ← Back to the wall
        </button>
        <PatternForm
          action={action}
          initial={view.mode === "edit" ? view.pattern : null}
          demoMode={demoMode}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="measure-label text-thread-deep">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Pattern workshop
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView({ mode: "new" })}
            className="btn btn-gold btn-sm"
          >
            + New pattern
          </button>
          <form action={logout}>
            <button type="submit" className="btn btn-seam btn-sm">
              Sign out
            </button>
          </form>
        </div>
      </div>

      {demoMode && (
        <p className="mt-4 max-w-2xl rounded-sm border border-dashed border-thread-deep/50 bg-linen px-4 py-3 text-sm text-ink-soft">
          <span className="font-semibold text-thread-deep">Demo mode.</span>{" "}
          Add your Supabase URL, anon key, and service-role key to publish
          changes for real. Until then the library below is the bundled demo.
        </p>
      )}

      <dl className="mt-8 grid grid-cols-3 gap-4 sm:max-w-md">
        {[
          { label: "Patterns", value: patterns.length },
          { label: "Downloads", value: formatCount(totalDownloads) },
          { label: "Featured", value: featuredCount },
        ].map((s) => (
          <div key={s.label} className="rounded-sm border border-ink/12 bg-linen-light p-4 text-center raised">
            <dd className="font-display text-3xl font-semibold text-ink">{s.value}</dd>
            <dt className="measure-label mt-1 text-ink-soft">{s.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="measure-label border-b border-ink/15 text-ink-soft">
              <th className="pb-3 pr-4 font-medium">Pattern</th>
              <th className="pb-3 pr-4 font-medium">Category</th>
              <th className="pb-3 pr-4 font-medium">Skill</th>
              <th className="pb-3 pr-4 font-medium">Downloads</th>
              <th className="pb-3 pr-4 font-medium">Featured</th>
              <th className="pb-3 pr-4 font-medium">Added</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {patterns.map((p) => (
              <tr key={p.id} className="align-middle">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="block h-10 w-10 shrink-0 overflow-hidden rounded-sm border border-ink/10 bg-linen-deep">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </span>
                    <span className="font-medium text-ink">{p.title}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-ink-soft">{p.category}</td>
                <td className="py-3 pr-4 text-ink-soft">{p.difficulty}</td>
                <td className="py-3 pr-4 text-ink-soft">{formatCount(p.download_count)}</td>
                <td className="py-3 pr-4">
                  {p.featured ? (
                    <span className="measure-label rounded-sm bg-thread px-2 py-0.5 text-char">Featured</span>
                  ) : (
                    <span className="measure-label text-ink-soft/60">—</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-ink-soft">{formatDate(p.created_at)}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setView({ mode: "edit", pattern: p })}
                      className="btn btn-seam btn-sm"
                    >
                      Edit
                    </button>
                    <form
                      action={removePattern}
                      onSubmit={(e) => {
                        if (!window.confirm(`Delete “${p.title}”? This can't be undone.`)) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="btn btn-seam btn-sm text-burgundy">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
