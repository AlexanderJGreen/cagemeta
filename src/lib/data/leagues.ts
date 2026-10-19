import type { League, LeagueMember } from "@/types";
import { mockLeagues, mockLeagueMembers } from "./mock/leagues";

export async function getLeaguesForUser(userId: string): Promise<League[]> {
  const leagueIds = new Set(
    mockLeagueMembers.filter((m) => m.userId === userId).map((m) => m.leagueId),
  );
  return mockLeagues.filter((l) => leagueIds.has(l.id));
}

export async function getLeagueById(id: string): Promise<League | undefined> {
  return mockLeagues.find((l) => l.id === id);
}

export async function getLeagueMembers(leagueId: string): Promise<LeagueMember[]> {
  return mockLeagueMembers.filter((m) => m.leagueId === leagueId);
}
