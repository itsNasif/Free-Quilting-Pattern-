import Link from "next/link";
import { notFound } from "next/navigation";
import PatternImage from "@/components/PatternImage";
import PatternCard from "@/components/PatternCard";
import DownloadModal from "@/components/DownloadModal";
import AdSlot from "@/components/AdSlot";
import { getDownloadUrl, getPatternBySlug, getRelatedPatterns } from "@/lib/patterns";
import { formatCount } from "@/lib/format";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pattern = await getPatternBySlug(slug);
  if (!pattern) return { title: "Pattern not found" };

  const canonicalUrl = `https://quilthaven.vercel.app/patterns/${slug}`;
  const title = `${pattern.title} — Free Quilt Pattern PDF`;
  const description = pattern.description
    ? `${pattern.description} Download this free quilting pattern PDF from QuiltHaven — no sign-up required.`
    : `Download the free ${pattern.title} quilting pattern PDF. ${pattern.difficulty ?? ""} ${pattern.category ?? ""} quilt pattern from QuiltHaven.`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    keywords: [
      pattern.title,
      `${pattern.title} free PDF`,
      `${pattern.title} quilt pattern`,
      pattern.category ? `${pattern.category.toLowerCase()} quilt pattern` : null,
      pattern.difficulty ? `${pattern.difficulty.toLowerCase()} quilt pattern` : null,
      "free quilting pattern download",
      "free quilt PDF",
      "QuiltHaven",
    ].filter(Boolean),
    openGraph: {
      title: `${pattern.title} — QuiltHaven`,
      description,
      url: canonicalUrl,
      type: "article",
      images: pattern.image_url
        ? [{ url: pattern.image_url, width: 800, height: 800, alt: pattern.title }]
        : [{ url: "https://quilthaven.vercel.app/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pattern.title} — Free Quilt Pattern`,
      description: `Free PDF download: ${pattern.title}. No sign-up required.`,
      images: pattern.image_url
        ? [pattern.image_url]
        : ["https://quilthaven.vercel.app/og-image.png"],
    },
  };
}


export default async function PatternPage({ params }) {
  const { slug } = await params;
  const pattern = await getPatternBySlug(slug);
  if (!pattern) notFound();

  const [downloadUrl, related] = await Promise.all([
    getDownloadUrl(pattern),
    getRelatedPatterns(pattern),
  ]);

  const specs = [
    { label: "Finished size", value: pattern.finished_size },
    { label: "Pieces", value: pattern.pieces },
    { label: "Fabric", value: pattern.fabric },
  ];

  return (
    <>
      <section className="bg-linen-light">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <nav aria-label="Breadcrumb" className="measure-label text-ink-soft">
            <Link href="/" className="transition-colors hover:text-thread-deep">
              Home
            </Link>
            <span className="mx-1 text-ink-soft/60">/</span>
            <Link href="/patterns" className="transition-colors hover:text-thread-deep">
              Patterns
            </Link>
            <span className="mx-1 text-ink-soft/60">/</span>
            <span aria-current="page">{pattern.title}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            {/* Preview */}
            <div className="bg-stitch p-2">
              <div className="relative aspect-square overflow-hidden bg-linen-deep quilt-frame">
                <PatternImage
                  src={pattern.image_url}
                  alt={`${pattern.title} finished quilt`}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="measure-label rounded-sm bg-midnight px-2 py-1 text-cream">
                  {pattern.category}
                </span>
                <span className="measure-label rounded-sm border border-ink/20 px-2 py-1 text-ink-soft">
                  {pattern.difficulty}
                </span>
                <span className="measure-label text-ink-soft">
                  {formatCount(pattern.download_count)} downloads
                </span>
              </div>

              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                {pattern.title}
              </h1>

              <p className="mt-5 text-base leading-7 text-ink-soft">
                {pattern.description}
              </p>

              <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="measure-label text-ink-soft">{s.label}</dt>
                    <dd className="text-right text-sm font-medium text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-col gap-3">
                <DownloadModal
                  pattern={{ id: pattern.id, slug: pattern.slug, title: pattern.title }}
                  downloadUrl={downloadUrl}
                  initialCount={pattern.download_count}
                />
                <p className="measure-label text-ink-soft">
                  One short ad view unlocks the PDF — no sign-up.
                </p>
              </div>

              {/* ── Ad: Native banner inside the detail panel ─────────── */}
              <div className="mt-8 border-t border-dashed border-ink/15 pt-6">
                <AdSlot variant="infeed" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ad: Leaderboard between details and related patterns ──── */}
      <div className="border-y-2 border-dashed border-ink/15 bg-linen">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-5 py-8 sm:px-8">
          <AdSlot variant="leaderboard" />
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-linen">
          <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="measure-label text-thread-deep">More {pattern.category.toLowerCase()}s</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  Along the same seam
                </h2>
              </div>
              <Link href="/patterns" className="btn btn-seam btn-sm">
                Browse all
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PatternCard key={p.slug} pattern={p} />
              ))}
            </div>

            {/* ── Ad: Native infeed after related patterns ─────────── */}
            <div className="mt-12 border-t border-dashed border-ink/15 pt-8">
              <AdSlot variant="infeed" />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
