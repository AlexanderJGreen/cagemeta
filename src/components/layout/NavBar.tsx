"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavLinks } from "./nav-links";
import { logout } from "@/app/(auth)/actions";

export function NavBar({
  leagueId,
  displayName,
}: {
  leagueId?: string;
  /** Present when signed in. */
  displayName?: string;
}) {
  const pathname = usePathname();
  const links = getNavLinks(leagueId);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6"
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label="CAGEMETA home">
          <span
            aria-hidden
            className="cut-tag flex h-6 w-7 items-center justify-center bg-accent pr-1 font-display text-sm font-extrabold text-accent-ink"
          >
            CM
          </span>
          <span className="display text-xl font-extrabold tracking-wider">Cagemeta</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = link.match(pathname);
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex h-14 items-center px-3 font-display text-base font-semibold uppercase tracking-wider transition-colors ${
                    active ? "text-ink" : "text-ink-dim hover:text-ink"
                  }`}
                >
                  {link.label}
                  {active ? (
                    <span aria-hidden className="absolute inset-x-3 bottom-0 h-0.5 bg-accent" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {displayName ? (
            <>
              <span className="hidden max-w-32 truncate text-sm text-ink-dim sm:inline">{displayName}</span>
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center px-2 font-display text-base font-semibold uppercase tracking-wider text-ink-dim transition-colors hover:text-ink"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center px-2 font-display text-base font-semibold uppercase tracking-wider text-ink-dim transition-colors hover:text-ink"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex min-h-9 items-center rounded-sm bg-accent px-3 font-display text-base font-bold uppercase tracking-wider text-accent-ink transition-colors hover:bg-accent-hot"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
