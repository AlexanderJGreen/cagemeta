import { CalendarDays, Home, Trophy, Users, type LucideIcon } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Path prefix that marks this link active. */
  match: (pathname: string) => boolean;
}

export const navLinks: NavLink[] = [
  { href: "/", label: "Home", icon: Home, match: (p) => p === "/" },
  { href: "/events", label: "Events", icon: CalendarDays, match: (p) => p.startsWith("/events") },
  {
    href: "/leagues/l01",
    label: "League",
    icon: Users,
    match: (p) => p.startsWith("/leagues") && !p.endsWith("/leaderboard"),
  },
  {
    href: "/leagues/l01/leaderboard",
    label: "Ranks",
    icon: Trophy,
    match: (p) => p.endsWith("/leaderboard"),
  },
];
