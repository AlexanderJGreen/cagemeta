import type { Event, LeaderboardRow, League } from "@/types";
import { getEvents } from "@/lib/data/events";
import { getFightsByEventId, getFightResultsByEventId } from "@/lib/data/fights";
import { getFinishCallsForEvent, getPicks } from "@/lib/data/picks";
import { getLeagueMembers } from "@/lib/data/leagues";
import { getUsersByIds } from "@/lib/data/users";
import { buildLeaderboard } from "@/lib/scoring/leaderboard";

export interface LeagueStandings {
  scoredEvent: Event;
  rows: LeaderboardRow[];
}

/** Standings through the most recent completed event, or undefined before anything is scored. */
export async function getLeagueStandings(league: League): Promise<LeagueStandings | undefined> {
  const [members, events] = await Promise.all([getLeagueMembers(league.id), getEvents()]);
  const scoredEvent = events.find((e) => e.status === "completed");
  if (!scoredEvent) return undefined;

  const [users, fights] = await Promise.all([
    getUsersByIds(members.map((m) => m.userId)),
    getFightsByEventId(scoredEvent.id),
  ]);
  const [results, picks, finishCalls] = await Promise.all([
    getFightResultsByEventId(scoredEvent.id),
    getPicks(league.id, scoredEvent.id),
    getFinishCallsForEvent(
      league.id,
      fights.map((f) => f.id),
    ),
  ]);

  return {
    scoredEvent,
    rows: buildLeaderboard(league, users, picks, fights, results, finishCalls),
  };
}
