import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-linen-light">
      <div className="mx-auto w-full max-w-2xl px-5 py-24 text-center sm:px-8 sm:py-32">
        <p className="measure-label text-thread-deep">404 · a seam unraveled</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight text-ink">
          This block isn&apos;t on the wall
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-ink-soft">
          The page you&apos;re looking for was moved, renamed, or never cut.
          The fabric room still has plenty to choose from.
        </p>
        <Link href="/patterns" className="btn btn-gold mt-8">
          Back to the pattern wall
        </Link>
      </div>
    </section>
  );
}
