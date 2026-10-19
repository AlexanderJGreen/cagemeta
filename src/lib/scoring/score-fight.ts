import type { FightResult, FightScoreBreakdown, ScoringConfig } from "@/types";

/**
 * Pure function: given a fight result and the scoring rules, compute the points a single
 * drafted fighter earned. No I/O, no dates, no randomness — easy to unit test exhaustively.
 */
export function scoreFighterInFight(
  fighterId: string,
  result: FightResult,
  config: ScoringConfig,
): FightScoreBreakdown {
  const won = result.winnerId === fighterId;
  const stats = result.stats.find((s) => s.fighterId === fighterId);

  const winPoints = won ? config.winPoints : 0;

  let methodBonusPoints = 0;
  let earlyFinishBonusPoints = 0;
  if (won) {
    if (result.method === "KO/TKO") {
      methodBonusPoints = config.methodBonus.koTko;
      earlyFinishBonusPoints = config.earlyFinishBonusByRound[result.round] ?? 0;
    } else if (result.method === "Submission") {
      methodBonusPoints = config.methodBonus.submission;
      earlyFinishBonusPoints = config.earlyFinishBonusByRound[result.round] ?? 0;
    } else if (result.method.startsWith("Decision")) {
      methodBonusPoints = config.methodBonus.decision;
    }
  }

  const statBonusPoints = stats
    ? stats.sigStrikesLanded * config.statBonus.perSigStrikeLanded +
      stats.takedowns * config.statBonus.perTakedown +
      stats.knockdowns * config.statBonus.perKnockdown
    : 0;

  const total = winPoints + methodBonusPoints + earlyFinishBonusPoints + statBonusPoints;

  return {
    fighterId,
    won,
    winPoints,
    methodBonusPoints,
    earlyFinishBonusPoints,
    statBonusPoints: roundToTwo(statBonusPoints),
    total: roundToTwo(total),
  };
}

function roundToTwo(n: number): number {
  return Math.round(n * 100) / 100;
}
