import Link from "next/link";
import { navLinks } from "./nav-links";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-start">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="cut-tag flex h-6 w-7 items-center justify-center bg-accent pr-1 font-display text-sm font-extrabold text-accent-ink"
            >
              CM
            </span>
            <span className="display text-xl font-extrabold tracking-wider">Cagemeta</span>
          </div>
          <p className="mt-3 text-sm text-ink-dim">
            Fantasy MMA scored the way fights actually end. Draft the card, call the finish, settle it
            with your league.
          </p>
        </div>

        <nav aria-label="Footer" className="hidden md:block">
          <ul className="flex gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-display text-base font-semibold uppercase tracking-wider text-ink-dim transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/compare"
                className="font-display text-base font-semibold uppercase tracking-wider text-ink-dim transition-colors hover:text-ink"
              >
                Matchup
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-4 text-xs text-ink-faint sm:flex-row sm:justify-between sm:px-6">
          <p>Points only. No real money, no betting.</p>
          <p>Independent fan project. Not affiliated with or endorsed by the UFC or any fighter. Stats are approximate.</p>
        </div>
      </div>
    </footer>
  );
}
