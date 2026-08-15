"use client";

import { useState, useMemo } from "react";
import PatternForm from "./PatternForm";
import { createPattern, logout, removePattern, updatePattern } from "@/actions/admin";
import { formatCount, formatDate } from "@/lib/format";
import Link from "next/link";

export default function AdminDashboard({ patterns = [], demoMode = false }) {
  const [activeTab, setActiveTab] = useState("list"); // 'list' | 'upload'
  const [editingPattern, setEditingPattern] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const totalDownloads = patterns.reduce((n, p) => n + (p.download_count || 0), 0);
  const featuredCount = patterns.filter((p) => p.featured).length;

  // Filtered patterns for list view
  const filteredPatterns = useMemo(() => {
    return patterns.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (difficultyFilter !== "all" && p.difficulty !== difficultyFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const haystack = `${p.title} ${p.slug} ${p.category} ${p.difficulty} ${p.finished_size} ${p.fabric}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [patterns, searchQuery, categoryFilter, difficultyFilter]);

  // Unique categories in existing patterns for filtering
  const availableCategories = useMemo(() => {
    const set = new Set(patterns.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [patterns]);

  // If in edit mode, show the editor directly
  if (editingPattern) {
    return (
      <section className="bg-linen-light min-h-[85vh] py-8 sm:py-12">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
          <button
            type="button"
            onClick={() => setEditingPattern(null)}
            className="btn btn-seam btn-sm mb-6 flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Pattern Workshop</span>
          </button>
          <PatternForm
            action={updatePattern}
            initial={editingPattern}
            demoMode={demoMode}
            onCancel={() => setEditingPattern(null)}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-linen-light min-h-[85vh] py-8 sm:py-12">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/15 pb-6">
          <div>
            <span className="measure-label text-thread-deep">Admin Workshop</span>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Pattern Management
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Manage your free quilting pattern catalog, uploads, and download analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "upload" ? "list" : "upload")}
              className={`btn btn-sm ${activeTab === "upload" ? "btn-seam" : "btn-gold"}`}
            >
              {activeTab === "upload" ? "View Library" : "+ Upload New Pattern"}
            </button>
            <form action={logout}>
              <button type="submit" className="btn btn-seam btn-sm">
                Sign out
              </button>
            </form>
          </div>
        </div>

        {/* Demo Mode Alert if applicable */}
        {demoMode && (
          <div className="rounded border border-dashed border-thread-deep/50 bg-linen p-4 text-sm text-ink-soft">
            <span className="font-semibold text-thread-deep">Demo Mode Active:</span>{" "}
            Supabase keys are not set in your environment. Add <code className="font-mono text-xs bg-ink/10 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="font-mono text-xs bg-ink/10 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable full persistence.
          </div>
        )}

        {/* Workshop Metric Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded border border-ink/12 bg-linen-light p-5 raised">
            <span className="measure-label text-ink-soft">Catalog Patterns</span>
            <div className="mt-2 font-display text-3xl font-semibold text-ink">
              {patterns.length}
            </div>
            <p className="mt-1 text-xs text-ink-soft">Active downloadable quilting designs</p>
          </div>

          <div className="rounded border border-ink/12 bg-linen-light p-5 raised">
            <span className="measure-label text-ink-soft">Total Downloads</span>
            <div className="mt-2 font-display text-3xl font-semibold text-ink">
              {formatCount(totalDownloads)}
            </div>
            <p className="mt-1 text-xs text-ink-soft">Unlocked by visitors through ads</p>
          </div>

          <div className="rounded border border-ink/12 bg-linen-light p-5 raised">
            <span className="measure-label text-ink-soft">Featured Quilt Designs</span>
            <div className="mt-2 font-display text-3xl font-semibold text-ink">
              {featuredCount}
            </div>
            <p className="mt-1 text-xs text-ink-soft">Prominently highlighted on homepage</p>
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div className="flex border-b border-ink/15 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === "list"
                ? "border-thread-deep text-ink font-semibold bg-linen/40"
                : "border-transparent text-ink-soft hover:text-ink hover:border-ink/20"
            }`}
          >
            📚 Pattern Library ({patterns.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === "upload"
                ? "border-thread-deep text-ink font-semibold bg-linen/40"
                : "border-transparent text-ink-soft hover:text-ink hover:border-ink/20"
            }`}
          >
            ➕ Upload New Pattern
          </button>
        </div>

        {/* TAB 1: Upload New Pattern Form */}
        {activeTab === "upload" && (
          <div className="max-w-4xl">
            <PatternForm
              action={createPattern}
              demoMode={demoMode}
              onCancel={() => setActiveTab("list")}
            />
          </div>
        )}

        {/* TAB 2: Pattern Library Table & Filters */}
        {activeTab === "list" && (
          <div className="space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded border border-ink/12 bg-linen/40 p-4">
              <div className="flex-1 min-w-[220px]">
                <label htmlFor="admin-search" className="sr-only">
                  Search patterns
                </label>
                <input
                  id="admin-search"
                  type="search"
                  placeholder="Search by title, slug, fabric, size..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="field text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Category Filter */}
                <select
                  aria-label="Filter by category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="field text-xs py-2"
                >
                  <option value="all">All Categories ({patterns.length})</option>
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {/* Difficulty Filter */}
                <select
                  aria-label="Filter by difficulty"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="field text-xs py-2"
                >
                  <option value="all">All Skill Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Easy">Easy</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                {(searchQuery || categoryFilter !== "all" || difficultyFilter !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setCategoryFilter("all");
                      setDifficultyFilter("all");
                    }}
                    className="btn btn-seam btn-sm text-xs"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Pattern Table */}
            {filteredPatterns.length === 0 ? (
              <div className="rounded border border-dashed border-ink/20 bg-linen/30 p-12 text-center">
                <p className="font-display text-xl font-semibold text-ink">No patterns found</p>
                <p className="mt-1 text-sm text-ink-soft">
                  {patterns.length === 0
                    ? "Your library is empty. Click “Upload New Pattern” to publish your first design."
                    : "No patterns matched your search and filter criteria."}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className="btn btn-gold btn-sm mt-4"
                >
                  + Upload New Pattern
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded border border-ink/15 bg-linen-light shadow-sm">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink/15 bg-linen/50 measure-label text-ink-soft">
                      <th className="py-3.5 px-4 font-medium">Thumbnail & Pattern</th>
                      <th className="py-3.5 px-3 font-medium">Category</th>
                      <th className="py-3.5 px-3 font-medium">Skill</th>
                      <th className="py-3.5 px-3 font-medium">Specs (Size / Pieces)</th>
                      <th className="py-3.5 px-3 font-medium">Downloads</th>
                      <th className="py-3.5 px-3 font-medium">Featured</th>
                      <th className="py-3.5 px-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {filteredPatterns.map((p) => (
                      <tr
                        key={p.id || p.slug}
                        className="transition-colors hover:bg-linen/30 align-middle"
                      >
                        {/* Thumbnail & Title */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-ink/15 bg-linen-deep quilt-frame">
                              {p.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={p.image_url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center font-mono text-[0.65rem] text-ink-soft">
                                  PDF
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-ink block truncate max-w-[200px]">
                                {p.title}
                              </span>
                              <span className="font-mono text-xs text-thread-deep block truncate max-w-[200px]">
                                /patterns/{p.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3">
                          <span className="rounded bg-linen border border-ink/10 px-2 py-0.5 text-xs font-medium text-ink">
                            {p.category}
                          </span>
                        </td>

                        {/* Difficulty */}
                        <td className="py-3 px-3">
                          <span className="text-xs text-ink-soft">
                            {p.difficulty === "Beginner"
                              ? "🌱 Beginner"
                              : p.difficulty === "Easy"
                              ? "✨ Easy"
                              : p.difficulty === "Intermediate"
                              ? "🧵 Intermediate"
                              : "👑 Advanced"}
                          </span>
                        </td>

                        {/* Specs */}
                        <td className="py-3 px-3 text-xs text-ink-soft">
                          <div>{p.finished_size || "—"}</div>
                          <div className="text-[0.7rem] text-ink-soft/70 truncate max-w-[140px]">
                            {p.pieces || p.fabric || "—"}
                          </div>
                        </td>

                        {/* Downloads */}
                        <td className="py-3 px-3 text-xs font-medium text-ink">
                          {formatCount(p.download_count)}
                        </td>

                        {/* Featured */}
                        <td className="py-3 px-3">
                          {p.featured ? (
                            <span className="rounded bg-thread/20 border border-thread/40 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-thread-deep">
                              ★ Featured
                            </span>
                          ) : (
                            <span className="text-ink-soft/40 text-xs">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/patterns/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-seam btn-sm text-xs py-1 px-2"
                              title="Preview pattern live on site"
                            >
                              Live ↗
                            </Link>

                            <button
                              type="button"
                              onClick={() => setEditingPattern(p)}
                              className="btn btn-seam btn-sm text-xs py-1 px-2.5"
                            >
                              Edit
                            </button>

                            <form
                              action={removePattern}
                              onSubmit={(e) => {
                                if (
                                  !window.confirm(
                                    `Are you sure you want to delete “${p.title}”? This action cannot be undone.`
                                  )
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              <input type="hidden" name="id" value={p.id} />
                              <button
                                type="submit"
                                className="btn btn-seam btn-sm text-xs py-1 px-2 text-burgundy hover:bg-burgundy/10"
                                title="Delete pattern"
                              >
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
            )}
          </div>
        )}
      </div>
    </section>
  );
}
