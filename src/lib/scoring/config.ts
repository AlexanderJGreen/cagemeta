import type { ScoringConfig } from "@/types";

export const defaultScoringConfig: ScoringConfig = {
  winPoints: 10,
  methodBonus: {
    koTko: 8,
    submission: 7,
    decision: 3,
  },
  earlyFinishBonusByRound: {
    1: 6,
    2: 4,
    3: 2,
  },
  statBonus: {
    perSigStrikeLanded: 0.05,
    perTakedown: 1,
    perKnockdown: 3,
  },
  finishCallBonus: 15,
};
