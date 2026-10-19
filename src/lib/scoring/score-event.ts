import type { FightResult, FinishCall, Pick, ScoringConfig, UserEventScore } from "@/types";
import { scoreFighterInFight } from "./score-fight";
import { scoreFinishCall } from "./score-finish-call";

/**
 * Pure function: combine a user's drafted-fighter picks and (optional) finish call for one
 * event into a single score. `results` must be keyed by fightId for O(1) lookup per pick.
 */
export function scoreUserEvent(
  userId: string,
  leagueId: string,
  eventId: string,
  userPicks: Pick[],
  fightResultsByFightId: Map<string, FightResult>,
  fighterIdToFightId: Map<string, string>,
  finishCall: FinishCall | undefined,
  config: ScoringConfig,
): UserEventScore {
  const fightScores = userPicks.flatMap((pick) => {
    const fightId = fighterIdToFightId.get(pick.fighterId);
    const result = fightId ? fightResultsByFightId.get(fightId) : undefined;
    if (!result) return [];
    return [scoreFighterInFight(pick.fighterId, result, config)];
  });

  let finishCallResult;
  if (finishCall) {
    const result = fightResultsByFightId.get(finishCall.fightId);
    if (result) {
      finishCallResult = scoreFinishCall(finishCall, result, config);
    }
  }

  const total =
    fightScores.reduce((sum, s) => sum + s.total, 0) + (finishCallResult?.points ?? 0);

  return {
    userId,
    leagueId,
    eventId,
    fightScores,
    finishCallResult,
    total: Math.round(total * 100) / 100,
  };
}
