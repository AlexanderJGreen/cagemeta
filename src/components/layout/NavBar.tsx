"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./nav-links";

export function NavBar() {
  const pathname = usePathname();

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
          {navLinks.map((link) => {
            const active = link.match(pathname);
            return (
              <li key={link.href}>
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
      </nav>
    </header>
  );
}
