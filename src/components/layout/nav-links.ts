import { CalendarDays, Home, Trophy, Users, type LucideIcon } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Decides whether this link is active for the current pathname. */
  match: (pathname: string) => boolean;
}

/** `leagueId` is the signed-in user's first league; without one, league links lead to /leagues. */
export function getNavLinks(leagueId?: string): NavLink[] {
  return [
    { href: "/", label: "Home", icon: Home, match: (p) => p === "/" },
    { href: "/events", label: "Events", icon: CalendarDays, match: (p) => p.startsWith("/events") },
    {
      href: leagueId ? `/leagues/${leagueId}` : "/leagues",
      label: "League",
      icon: Users,
      match: (p) => p.startsWith("/leagues") && !p.endsWith("/leaderboard"),
    },
    {
      href: leagueId ? `/leagues/${leagueId}/leaderboard` : "/leagues",
      label: "Ranks",
      icon: Trophy,
      match: (p) => p.endsWith("/leaderboard"),
    },
  ];
}
