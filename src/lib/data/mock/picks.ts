import type { FinishCall, Pick } from "@/types";

// Picks for the completed event (e02), so the leaderboard has something to score.
export const mockPicks: Pick[] = [
  { id: "p01", userId: "u01", leagueId: "l01", eventId: "e02", fighterId: "f13", createdAt: "2026-10-02T00:00:00Z" },
  { id: "p02", userId: "u01", leagueId: "l01", eventId: "e02", fighterId: "f12", createdAt: "2026-10-02T00:00:00Z" },
  { id: "p03", userId: "u01", leagueId: "l01", eventId: "e02", fighterId: "f15", createdAt: "2026-10-02T00:00:00Z" },

  { id: "p04", userId: "u02", leagueId: "l01", eventId: "e02", fighterId: "f14", createdAt: "2026-10-02T00:00:00Z" },
  { id: "p05", userId: "u02", leagueId: "l01", eventId: "e02", fighterId: "f11", createdAt: "2026-10-02T00:00:00Z" },
  { id: "p06", userId: "u02", leagueId: "l01", eventId: "e02", fighterId: "f18", createdAt: "2026-10-02T00:00:00Z" },

  { id: "p07", userId: "u03", leagueId: "l01", eventId: "e02", fighterId: "f13", createdAt: "2026-10-02T00:00:00Z" },
  { id: "p08", userId: "u03", leagueId: "l01", eventId: "e02", fighterId: "f17", createdAt: "2026-10-02T00:00:00Z" },
  { id: "p09", userId: "u03", leagueId: "l01", eventId: "e02", fighterId: "f19", createdAt: "2026-10-02T00:00:00Z" },

  { id: "p10", userId: "u04", leagueId: "l01", eventId: "e02", fighterId: "f16", createdAt: "2026-10-02T00:00:00Z" },
  { id: "p11", userId: "u04", leagueId: "l01", eventId: "e02", fighterId: "f20", createdAt: "2026-10-02T00:00:00Z" },
  { id: "p12", userId: "u04", leagueId: "l01", eventId: "e02", fighterId: "f12", createdAt: "2026-10-02T00:00:00Z" },
];

export const mockFinishCalls: FinishCall[] = [
  { id: "fc01", userId: "u01", leagueId: "l01", fightId: "fi06", predictedMethod: "Submission", predictedRound: 3, createdAt: "2026-10-02T00:00:00Z" },
  { id: "fc02", userId: "u02", leagueId: "l01", fightId: "fi09", predictedMethod: "KO/TKO", predictedRound: 1, createdAt: "2026-10-02T00:00:00Z" },
  { id: "fc03", userId: "u03", leagueId: "l01", fightId: "fi06", predictedMethod: "KO/TKO", predictedRound: 1, createdAt: "2026-10-02T00:00:00Z" },
  { id: "fc04", userId: "u04", leagueId: "l01", fightId: "fi10", predictedMethod: "Decision - Split", predictedRound: 3, createdAt: "2026-10-02T00:00:00Z" },
];
