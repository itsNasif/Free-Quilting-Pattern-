import Link from "next/link";

const navLinks = [
  { href: "/patterns", label: "Patterns" },
  { href: "/#how", label: "How it works" },
  { href: "/admin", label: "Admin" },
];

export default function SiteHeader() {
  return (
    <header className="relative z-40 border-b border-thread-deep/40 bg-midnight text-cream">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="font-display text-2xl font-semibold leading-none tracking-tight sm:text-[1.7rem]"
          aria-label="QuiltHaven home"
        >
          <span className="text-cream">Quilt</span>
          <span className="text-thread-light">Haven</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-6 md:flex" aria-label="Primary">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-cream-dim transition-colors hover:text-thread-light"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form action="/patterns" method="get" role="search" className="ml-auto md:ml-0">
          <label className="sr-only" htmlFor="header-search">
            Search patterns
          </label>
          <div className="flex items-center gap-1 rounded-sm border border-cream/20 bg-char/40 px-2.5 py-1.5 transition-colors focus-within:border-thread">
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-cream-dim"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="header-search"
              type="search"
              name="q"
              placeholder="Search patterns…"
              className="w-28 bg-transparent text-sm text-cream outline-none placeholder:text-cream-dim/70 sm:w-44"
            />
          </div>
        </form>

        {/* Mobile nav — plain <details> disclosure, no JS required */}
        <details className="group relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-sm border border-cream/20 px-3 py-1.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
            Menu
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="transition-transform group-open:rotate-180"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <nav
            className="absolute right-0 top-full mt-1 w-44 rounded-sm border border-thread-deep/40 bg-midnight p-2 shadow-[var(--shadow-lift)]"
            aria-label="Mobile"
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded-sm px-3 py-2 text-sm text-cream-dim transition-colors hover:bg-char/60 hover:text-thread-light"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
