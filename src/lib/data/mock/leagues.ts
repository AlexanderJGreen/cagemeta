import type { League, LeagueMember } from "@/types";
import { defaultScoringConfig } from "@/lib/scoring/config";

export const mockLeagues: League[] = [
  {
    id: "l01",
    name: "Cage Side Chaos",
    ownerId: "u01",
    inviteCode: "CAGE-7F2K",
    budget: 100,
    maxDraftPicks: 5,
    lockMode: "per-fight",
    scoringConfig: defaultScoringConfig,
    createdAt: "2026-08-10T00:00:00Z",
  },
];

export const mockLeagueMembers: LeagueMember[] = [
  { leagueId: "l01", userId: "u01", role: "owner", joinedAt: "2026-08-10T00:00:00Z" },
  { leagueId: "l01", userId: "u02", role: "member", joinedAt: "2026-08-11T00:00:00Z" },
  { leagueId: "l01", userId: "u03", role: "member", joinedAt: "2026-08-11T00:00:00Z" },
  { leagueId: "l01", userId: "u04", role: "member", joinedAt: "2026-08-12T00:00:00Z" },
];
