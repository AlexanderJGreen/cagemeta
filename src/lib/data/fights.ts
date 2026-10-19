import type { Fight, FightResult } from "@/types";
import { mockFights } from "./mock/fights";
import { mockFightResults } from "./mock/fight-results";

export async function getFightsByEventId(eventId: string): Promise<Fight[]> {
  return mockFights
    .filter((f) => f.eventId === eventId)
    .sort((a, b) => a.boutOrder - b.boutOrder);
}

export async function getFightById(id: string): Promise<Fight | undefined> {
  return mockFights.find((f) => f.id === id);
}

export async function getFightResult(fightId: string): Promise<FightResult | undefined> {
  return mockFightResults.find((r) => r.fightId === fightId);
}

export async function getFightResultsByEventId(eventId: string): Promise<FightResult[]> {
  const fightIds = new Set(mockFights.filter((f) => f.eventId === eventId).map((f) => f.id));
  return mockFightResults.filter((r) => fightIds.has(r.fightId));
}
