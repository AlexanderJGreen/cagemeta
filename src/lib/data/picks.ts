import type { FinishCall, Pick } from "@/types";
import { mockPicks, mockFinishCalls } from "./mock/picks";

export async function getPicks(leagueId: string, eventId: string): Promise<Pick[]> {
  return mockPicks.filter((p) => p.leagueId === leagueId && p.eventId === eventId);
}

export async function getPicksForUser(
  leagueId: string,
  eventId: string,
  userId: string,
): Promise<Pick[]> {
  return mockPicks.filter(
    (p) => p.leagueId === leagueId && p.eventId === eventId && p.userId === userId,
  );
}

export async function getFinishCallsForEvent(
  leagueId: string,
  fightIds: string[],
): Promise<FinishCall[]> {
  const fightIdSet = new Set(fightIds);
  return mockFinishCalls.filter((c) => c.leagueId === leagueId && fightIdSet.has(c.fightId));
}
