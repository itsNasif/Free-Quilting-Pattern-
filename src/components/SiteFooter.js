import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function SiteFooter() {
  const demoMode = !isSupabaseConfigured();

  return (
    <footer className="border-t-2 border-dashed border-thread-deep/40 bg-midnight text-cream">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold tracking-tight">
            <span className="text-cream">Quilt</span>
            <span className="text-thread-light">Haven</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-cream-dim">
            Free, printable quilting patterns. Preview the finished quilt, read
            the numbers, and take the pattern home.
          </p>
          {demoMode && (
            <p className="measure-label mt-4 inline-block rounded-sm border border-thread-deep/50 px-2 py-1 text-thread-light">
              Demo library · add Supabase keys to publish
            </p>
          )}
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          <p className="measure-label mb-1 text-thread-light">Browse</p>
          <Link href="/patterns" className="text-cream-dim transition-colors hover:text-thread-light">
            All patterns
          </Link>
          <Link href="/#how" className="text-cream-dim transition-colors hover:text-thread-light">
            How downloading works
          </Link>
          <Link href="/admin" className="text-cream-dim transition-colors hover:text-thread-light">
            Pattern workshop
          </Link>
        </nav>

        <div className="text-sm text-cream-dim">
          <p className="measure-label mb-1 text-thread-light">A note on ads</p>
          <p className="max-w-xs leading-6">
            Every pattern here is free because of the ads. They stay in their
            frames — a labeled slot, one honest moment before your download,
            never a popup over your sewing.
          </p>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4">
        <p className="mx-auto max-w-6xl px-5 text-xs text-cream-dim/70 sm:px-8">
          © {new Date().getFullYear()} QuiltHaven · made with thread and
          straight seams.
        </p>
      </div>
    </footer>
  );
}
