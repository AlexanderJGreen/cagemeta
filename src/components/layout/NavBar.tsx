import Link from "next/link";
import { Swords } from "lucide-react";

const links = [
  { href: "/events", label: "Events" },
  { href: "/leagues/l01", label: "My League" },
  { href: "/leagues/l01/leaderboard", label: "Leaderboard" },
];

export function NavBar() {
  return (
    <header className="border-b border-line bg-surface">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-wide text-ink">
          <Swords className="h-5 w-5 text-accent" strokeWidth={2} />
          CAGEMETA
        </Link>
        <ul className="flex items-center gap-4 text-sm sm:gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-ink-dim transition-colors hover:text-ink">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
