import Link from "next/link";
import PatternImage from "./PatternImage";
import { formatCount } from "@/lib/format";

export default function PatternCard({ pattern }) {
  return (
    <Link
      href={`/patterns/${pattern.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm quilt-frame transition-transform duration-200 hover:-translate-y-1"
      aria-label={`View ${pattern.title}`}
    >
      <div className="relative aspect-square overflow-hidden bg-linen-deep">
        <PatternImage src={pattern.image_url} alt={`${pattern.title} preview`} sizes="(max-width: 768px) 50vw, 25vw" />
        <span className="measure-label absolute left-2 top-2 rounded-sm bg-char/70 px-2 py-1 text-cream backdrop-blur-sm">
          {pattern.difficulty}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 bg-linen-light p-4">
        <p className="measure-label text-thread-deep">{pattern.category}</p>
        <h3 className="font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-indigo">
          {pattern.title}
        </h3>
        <p className="clamp-2 text-sm leading-6 text-ink-soft">{pattern.description}</p>
        <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-3">
          <span className="measure-label text-ink-soft">
            {formatCount(pattern.download_count)} downloads
          </span>
          <span className="text-sm font-semibold text-thread-deep stitch-link">
            View pattern
          </span>
        </div>
      </div>
    </Link>
  );
}
