import type { FinishCall, FinishCallResult, FightResult, ScoringConfig } from "@/types";

/**
 * Pure function: a "Call the Finish" hit requires both method and round to match exactly.
 */
export function scoreFinishCall(
  call: FinishCall,
  result: FightResult,
  config: ScoringConfig,
): FinishCallResult {
  const hit = call.predictedMethod === result.method && call.predictedRound === result.round;
  return {
    fightId: call.fightId,
    hit,
    points: hit ? config.finishCallBonus : 0,
  };
}
