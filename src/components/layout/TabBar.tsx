"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./nav-links";

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 backdrop-blur-sm md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="grid h-[var(--tabbar-h)] grid-cols-4">
        {navLinks.map((link) => {
          const active = link.match(pathname);
          const Icon = link.icon;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-full flex-col items-center justify-center gap-1 transition-colors ${
                  active ? "text-ink" : "text-ink-faint hover:text-ink-dim"
                }`}
              >
                {active ? (
                  <span aria-hidden className="absolute inset-x-6 top-0 h-0.5 bg-accent" />
                ) : null}
                <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                <span className="font-display text-xs font-semibold uppercase tracking-wider">
                  {link.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
