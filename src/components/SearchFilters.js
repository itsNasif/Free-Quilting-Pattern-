"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SearchFilters({ categories, difficulties, initial = {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(initial.q || "");
  const [category, setCategory] = useState(initial.category || "");
  const [difficulty, setDifficulty] = useState(initial.difficulty || "");
  const debounceRef = useRef(null);

  const push = (next) => {
    const params = new URLSearchParams();
    if (next.q?.trim()) params.set("q", next.q.trim());
    if (next.category) params.set("category", next.category);
    if (next.difficulty) params.set("difficulty", next.difficulty);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Debounce the free-text search; chips apply immediately.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => push({ q, category, difficulty }), 350);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const applyCategory = (c) => {
    setCategory(c === category ? "" : c);
    push({ q, category: c === category ? "" : c, difficulty });
  };
  const applyDifficulty = (d) => {
    setDifficulty(d);
    push({ q, category, difficulty: d });
  };
  const clearAll = () => {
    setQ("");
    setCategory("");
    setDifficulty("");
    router.push(pathname, { scroll: false });
  };

  const hasFilters = Boolean(q.trim() || category || difficulty);

  return (
    <div className="flex flex-col gap-4">
      <label className="sr-only" htmlFor="pattern-search">
        Search patterns
      </label>
      <div className="flex items-center gap-2 rounded-sm border border-ink/20 bg-linen-light px-3 py-2 focus-within:border-thread">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-ink-soft">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="pattern-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or idea…"
          className="w-full bg-transparent text-ink outline-none placeholder:text-ink-soft/70"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => applyCategory(c)}
            aria-pressed={category === c}
            className={category === c ? "chip is-active" : "chip"}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="measure-label text-ink-soft">Skill</span>
        {difficulties.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => applyDifficulty(d)}
            aria-pressed={difficulty === d}
            className={difficulty === d ? "chip is-active" : "chip"}
          >
            {d}
          </button>
        ))}
        {hasFilters && (
          <button type="button" onClick={clearAll} className="chip text-thread-deep">
            Clear all ✕
          </button>
        )}
      </div>
    </div>
  );
}
