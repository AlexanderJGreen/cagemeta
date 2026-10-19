import type { Fight, FightResult, FinishCall, LeaderboardRow, League, Pick, UserProfile } from "@/types";
import { scoreUserEvent } from "./score-event";

/**
 * Pure function: build a ranked leaderboard for one league/event from raw picks + results.
 * Ties share a rank (standard competition ranking: 1, 2, 2, 4).
 */
export function buildLeaderboard(
  league: League,
  users: UserProfile[],
  picks: Pick[],
  fights: Fight[],
  results: FightResult[],
  finishCalls: FinishCall[],
): LeaderboardRow[] {
  const resultsByFightId = new Map(results.map((r) => [r.fightId, r]));
  const fighterIdToFightId = new Map<string, string>();
  for (const fight of fights) {
    fighterIdToFightId.set(fight.fighterAId, fight.id);
    fighterIdToFightId.set(fight.fighterBId, fight.id);
  }

  const rows = users.map((user) => {
    const userPicks = picks.filter((p) => p.userId === user.id);
    const finishCall = finishCalls.find((c) => c.userId === user.id);
    const score = scoreUserEvent(
      user.id,
      league.id,
      picks[0]?.eventId ?? "",
      userPicks,
      resultsByFightId,
      fighterIdToFightId,
      finishCall,
      league.scoringConfig,
    );
    return { userId: user.id, displayName: user.displayName, totalPoints: score.total };
  });

  rows.sort((a, b) => b.totalPoints - a.totalPoints);

  let rank = 0;
  let lastScore: number | null = null;
  return rows.map((row, index) => {
    if (row.totalPoints !== lastScore) {
      rank = index + 1;
      lastScore = row.totalPoints;
    }
    return { ...row, eventsPlayed: 1, rank };
  });
}
