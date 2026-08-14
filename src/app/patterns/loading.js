export default function PatternsLoading() {
  return (
    <section className="bg-linen min-h-[45vh]">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <p className="measure-label animate-pulse text-ink-soft">
          Warming the fabric room…
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-sm quilt-frame bg-linen-light">
              <div className="aspect-square animate-pulse bg-linen-deep/50" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-1/3 animate-pulse rounded bg-linen-deep/60" />
                <div className="h-5 w-2/3 animate-pulse rounded bg-linen-deep/60" />
                <div className="h-3 w-full animate-pulse rounded bg-linen-deep/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
