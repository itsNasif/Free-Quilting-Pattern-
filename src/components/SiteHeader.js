import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { signOutUser } from "@/actions/auth";

export default async function SiteHeader() {
  const { isLoggedIn, user, profile, isAdmin } = await getAuthSession();

  const navLinks = [
    { href: "/patterns", label: "Patterns" },
    { href: "/#how", label: "How it works" },
    // Only display Admin link if the user has the admin role or passcode
    ...(isAdmin ? [{ href: "/admin", label: "Admin Workshop" }] : []),
  ];

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Quilter";
  const avatarUrl = profile?.avatar_url;

  return (
    <header className="relative z-40 border-b border-thread-deep/40 bg-midnight text-cream">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-3.5 sm:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-semibold leading-none tracking-tight sm:text-[1.7rem]"
          aria-label="QuiltHaven home"
        >
          <span className="text-cream">Quilt</span>
          <span className="text-thread-light">Haven</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="ml-6 hidden items-center gap-6 md:flex" aria-label="Primary">
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

        {/* Search Bar */}
        <form action="/patterns" method="get" role="search" className="ml-auto md:ml-auto">
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
              className="w-24 bg-transparent text-xs text-cream outline-none placeholder:text-cream-dim/70 sm:w-36 sm:text-sm"
            />
          </div>
        </form>

        {/* Desktop User Account Controls */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-sm border border-cream/20 bg-char/40 px-2.5 py-1 text-sm font-medium text-cream hover:border-thread transition-colors [&::-webkit-details-marker]:hidden">
                <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-cream/30 bg-linen-deep flex items-center justify-center text-ink text-xs font-serif font-bold">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    displayName[0].toUpperCase()
                  )}
                </div>
                <span className="max-w-[100px] truncate text-xs text-cream-dim group-hover:text-cream">
                  {displayName}
                </span>
                <svg
                  aria-hidden="true"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform group-open:rotate-180 text-cream-dim"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>

              <div className="absolute right-0 top-full mt-1 w-48 rounded-sm border border-thread-deep/40 bg-midnight p-2 shadow-lg z-50">
                <div className="border-b border-cream/10 px-3 py-2">
                  <p className="text-xs font-semibold text-cream truncate">{displayName}</p>
                  <span className="inline-block mt-0.5 rounded bg-char/60 px-1.5 py-0.2 font-mono text-[0.65rem] text-thread-light">
                    {isAdmin ? "Admin" : "Quilter"}
                  </span>
                </div>

                <Link
                  href="/profile"
                  className="block rounded-sm px-3 py-1.5 text-xs text-cream-dim hover:bg-char/60 hover:text-thread-light transition-colors mt-1"
                >
                  My Profile & Avatar
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block rounded-sm px-3 py-1.5 text-xs text-thread-light hover:bg-char/60 transition-colors"
                  >
                    👑 Pattern Workshop
                  </Link>
                )}

                <div className="border-t border-cream/10 mt-1 pt-1">
                  <form action={signOutUser}>
                    <button
                      type="submit"
                      className="w-full text-left rounded-sm px-3 py-1.5 text-xs text-burgundy-light hover:bg-burgundy/20 transition-colors"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>
            </details>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-sm border border-cream/20 px-3 py-1 text-xs font-medium text-cream-dim hover:border-cream/40 hover:text-cream transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-sm bg-thread px-3 py-1 text-xs font-semibold text-char hover:bg-thread-light transition-colors"
              >
                Join
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        <details className="group relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-sm border border-cream/20 px-2.5 py-1 text-xs font-medium text-cream [&::-webkit-details-marker]:hidden">
            Menu
            <svg
              aria-hidden="true"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform group-open:rotate-180"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <nav
            className="absolute right-0 top-full mt-1 w-52 rounded-sm border border-thread-deep/40 bg-midnight p-2.5 shadow-xl z-50"
            aria-label="Mobile"
          >
            {isLoggedIn && (
              <div className="border-b border-cream/10 pb-2 mb-2 px-1">
                <p className="text-xs font-semibold text-cream truncate">{displayName}</p>
                <span className="font-mono text-[0.65rem] text-thread-light">
                  {isAdmin ? "Role: Admin" : "Role: Quilter (User)"}
                </span>
              </div>
            )}

            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded-sm px-3 py-1.5 text-xs text-cream-dim transition-colors hover:bg-char/60 hover:text-thread-light"
              >
                {l.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="block rounded-sm px-3 py-1.5 text-xs text-cream-dim transition-colors hover:bg-char/60 hover:text-thread-light"
                >
                  My Profile
                </Link>
                <div className="border-t border-cream/10 mt-1.5 pt-1.5">
                  <form action={signOutUser}>
                    <button
                      type="submit"
                      className="w-full text-left rounded-sm px-3 py-1.5 text-xs text-burgundy-light hover:bg-burgundy/20 transition-colors"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="border-t border-cream/10 mt-2 pt-2 flex flex-col gap-1.5">
                <Link
                  href="/login"
                  className="block rounded-sm px-3 py-1.5 text-center text-xs font-medium text-cream border border-cream/20 hover:border-cream/40"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block rounded-sm bg-thread px-3 py-1.5 text-center text-xs font-semibold text-char hover:bg-thread-light"
                >
                  Join QuiltHaven
                </Link>
              </div>
            )}
          </nav>
        </details>
      </div>
    </header>
  );
}
