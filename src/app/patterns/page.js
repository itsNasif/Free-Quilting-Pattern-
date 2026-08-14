import Link from "next/link";
import SearchFilters from "@/components/SearchFilters";
import PatternCard from "@/components/PatternCard";
import AdSlot from "@/components/AdSlot";
import { CATEGORIES, DIFFICULTIES, getPatterns } from "@/lib/patterns";

export const metadata = {
  title: "Browse Patterns",
  description:
    "Browse the free QuiltHaven pattern library — filter by size, skill, or search by name and idea.",
};

const PAGE_SIZE = 12;

export default async function PatternsPage({ searchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";
  const difficulty = typeof params.difficulty === "string" ? params.difficulty : "";

  const { items, total } = await getPatterns({
    search: q,
    category,
    difficulty,
    limit: PAGE_SIZE,
    offset: 0,
  });

  return (
    <>
      <section className="border-b border-ink/10 bg-linen-light">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <nav aria-label="Breadcrumb" className="measure-label text-ink-soft">
            <Link href="/" className="transition-colors hover:text-thread-deep">
              Home
            </Link>
            <span className="mx-1 text-ink-soft/60">/</span>
            <span aria-current="page">Patterns</span>
          </nav>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            The pattern wall
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">
            Every quilt here is free to download. Filter by size and skill, or
            search for a name or idea.
          </p>

          <div className="mt-8">
            <SearchFilters
              categories={CATEGORIES}
              difficulties={DIFFICULTIES}
              initial={{ q, category, difficulty }}
            />
          </div>
        </div>
      </section>

      <section className="bg-linen">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
          <p className="measure-label text-ink-soft" role="status">
            {total} pattern{total === 1 ? "" : "s"}
            {q ? ` for “${q}”` : ""}
            {category ? ` · ${category}` : ""}
            {difficulty ? ` · ${difficulty}` : ""}
          </p>

          {items.length === 0 ? (
            <div className="mt-10 rounded-sm border border-dashed border-ink/20 bg-linen-light p-10 text-center">
              <p className="font-display text-xl font-semibold text-ink">
                Nothing on the wall for that search
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-soft">
                Try a different word or clear the filters — the fabric room
                always has something.
              </p>
              <Link href="/patterns" className="btn btn-seam btn-sm mt-6">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <PatternCard key={p.slug} pattern={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* A single, quiet in-feed slot after the grid */}
      <div className="border-t-2 border-dashed border-ink/15 bg-linen">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-5 py-8 sm:px-8">
          <AdSlot variant="infeed" />
        </div>
      </div>
    </>
  );
}
