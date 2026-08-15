import Link from "next/link";
import PatternImage from "@/components/PatternImage";
import PatternCard from "@/components/PatternCard";
import AdSlot from "@/components/AdSlot";
import { getFeaturedPatterns, getPopularPatterns } from "@/lib/patterns";
import { formatCount } from "@/lib/format";

export const metadata = {
  title: "Free Quilting Patterns to Download",
  description:
    "QuiltHaven offers free, printable quilting patterns for all skill levels. Browse lap quilts, baby quilts, bed quilts, wall hangings and more — download your PDF pattern with no sign-up required.",
  alternates: { canonical: "https://quilthaven.vercel.app/" },
  keywords: [
    "free quilting patterns",
    "free quilt patterns PDF",
    "printable quilting patterns download",
    "beginner quilt patterns",
    "lap quilt patterns free",
    "baby quilt patterns free",
    "wall hanging quilt patterns",
    "QuiltHaven",
  ],
  openGraph: {
    title: "QuiltHaven — Free Quilting Patterns to Download",
    description:
      "Free, printable quilting patterns for all skill levels. Download your PDF — no sign-up, no paywall.",
    url: "https://quilthaven.vercel.app/",
    images: [{ url: "https://quilthaven.vercel.app/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuiltHaven — Free Quilting Patterns",
    description: "Free printable quilting patterns — download with no sign-up.",
    images: ["https://quilthaven.vercel.app/og-image.png"],
  },
};

export default async function HomePage() {
  const [featured, popular] = await Promise.all([
    getFeaturedPatterns(1),
    getPopularPatterns(8),
  ]);

  // Build the 3×3 medallion: featured hero in the center, popular blocks around.
  const center = featured[0] || popular[0];
  const ring = popular.filter((p) => p.slug !== center?.slug);
  const medallion = [null, null, null, null, center, null, null, null, null];
  let ringIdx = 0;
  for (let i = 0; i < 9; i++) {
    if (medallion[i] === null && ring[ringIdx]) {
      medallion[i] = ring[ringIdx];
      ringIdx++;
    }
  }

  return (
    <>
      {/* ── Hero: dark medallion on linen ─────────────────────────────── */}
      <section className="bg-linen-light">
        <div className="mx-auto w-full max-w-6xl px-5 pb-4 pt-14 text-center sm:px-8 sm:pt-20">
          <p className="measure-label text-thread-deep">
            Free quilting patterns · seams hand-checked
          </p>
          <h1 className="mt-4 font-display text-[3.4rem] font-semibold leading-[0.95] tracking-tight text-ink sm:text-[6rem] lg:text-[7.5rem]">
            Quilt
            <span className="text-indigo">Haven</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-ink-soft">
            A library of free, printable quilting patterns. See the finished
            quilt, read the numbers, and take the file home — without the
            popups and clutter.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="#featured" className="btn btn-midnight">
              Browse the library
            </Link>
            <Link href="#how" className="btn btn-seam">
              How downloading works
            </Link>
          </div>
        </div>

        {/* The medallion */}
        <div className="mx-auto w-full max-w-4xl px-4 pb-2 pt-12 sm:px-8">
          <div className="bg-stitch p-1.5 sm:p-2" aria-hidden="true">
            <div className="grid grid-cols-3 gap-1.5 bg-char p-1.5 shadow-[var(--shadow-lift)] sm:gap-2 sm:p-2">
              {medallion.map((p, i) =>
                p ? (
                  <Link
                    key={p.slug}
                    href={`/patterns/${p.slug}`}
                    className={`group relative aspect-square overflow-hidden ${
                      i === 4 ? "ring-2 ring-thread ring-offset-2 ring-offset-char" : ""
                    }`}
                    aria-label={`${p.title} — view pattern`}
                  >
                    <PatternImage
                      src={p.image_url}
                      alt={p.title}
                      sizes="(max-width: 768px) 30vw, 20vw"
                    />
                    <span className="absolute inset-0 bg-midnight/0 transition-colors duration-200 group-hover:bg-midnight/25" />
                    {i === 4 && (
                      <span className="measure-label absolute bottom-2 left-2 rounded-sm bg-char/80 px-2 py-1 text-thread-light">
                        Featured
                      </span>
                    )}
                  </Link>
                ) : (
                  <div key={`empty-${i}`} className="aspect-square bg-linen-deep/30" aria-hidden="true" />
                )
              )}
            </div>
          </div>
        </div>

        {/* Gold-thread download path */}
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-5 pb-16 pt-10 text-center sm:px-8">
          <p className="max-w-md text-base leading-7 text-ink-soft">
            Pick any block above — every pattern downloads free after one
            short, labeled ad moment.
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <Link href="/patterns" className="btn btn-gold">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M4 19h16" />
              </svg>
              Download a pattern
            </Link>
            <span className="measure-label text-ink-soft">
              {formatCount(popular[0]?.download_count || 0)}+ patterns taken home
            </span>
          </div>
        </div>
      </section>

      {/* ── Ad: Leaderboard banner at the fold seam ───────────────────── */}
      <div className="border-t-2 border-dashed border-ink/15 bg-linen-light">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-5 py-8 sm:px-8">
          <p className="measure-label text-ink-soft/80">
            Kept free by the folks below
          </p>
          <AdSlot variant="leaderboard" />
        </div>
      </div>

      {/* ── The library ──────────────────────────────────────────────── */}
      <section id="featured" className="scroll-mt-24 bg-linen">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="measure-label text-thread-deep">The library</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Patterns worth the presser foot
              </h2>
            </div>
            <Link href="/patterns" className="btn btn-seam btn-sm">
              See all patterns
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((p) => (
              <PatternCard key={p.slug} pattern={p} />
            ))}
          </div>

          {/* ── Ad: Native in-feed inside the pattern library section ── */}
          <div className="mt-12 border-t border-dashed border-ink/15 pt-8">
            <AdSlot variant="infeed" />
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section id="how" className="scroll-mt-24 border-t border-ink/10 bg-linen-light">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <p className="measure-label text-thread-deep">How it works</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              From block to your machine in three seams
            </h2>
          </div>

          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                n: "01",
                title: "Pick a pattern",
                body: "Browse by size, skill, or idea. Every card shows the finished quilt so you know what you're taking home.",
              },
              {
                n: "02",
                title: "Preview the quilt",
                body: "Open a pattern and read the numbers — finished size, pieces, and the fabric it calls for — before you download.",
              },
              {
                n: "03",
                title: "Take the file home",
                body: "One short, clearly-labeled ad view unlocks the PDF. No popups, no sign-up, no email wall.",
              },
            ].map((step) => (
              <li key={step.n} className="relative rounded-sm border border-ink/12 bg-linen-light p-6 raised">
                <span className="font-display text-4xl font-semibold text-linen-deep">
                  {step.n}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>

          {/* ── Ad: Leaderboard banner under How It Works steps ──────── */}
          <div className="mt-12 flex justify-center border-t border-dashed border-ink/15 pt-8">
            <AdSlot variant="leaderboard" />
          </div>
        </div>
      </section>

      {/* ── Closing note ─────────────────────────────────────────────── */}
      <section className="bg-char text-cream">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-5 py-16 text-center sm:px-8">
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            The best quilt is the one you finally start.
          </h2>
          <Link href="/patterns" className="btn btn-gold">
            Start a pattern tonight
          </Link>
        </div>
      </section>
    </>
  );
}
