export type LockMode = "per-fight" | "event-start";

export interface ScoringConfig {
  winPoints: number;
  methodBonus: {
    koTko: number;
    submission: number;
    decision: number;
  };
  /** Bonus added on top of the method bonus for finishing early, keyed by round number. */
  earlyFinishBonusByRound: Record<number, number>;
  statBonus: {
    perSigStrikeLanded: number;
    perTakedown: number;
    perKnockdown: number;
  };
  /** Awarded once per event for an exact method + round "Call the Finish" hit. */
  finishCallBonus: number;
}

export interface League {
  id: string;
  name: string;
  ownerId: string;
  inviteCode: string;
  budget: number;
  maxDraftPicks: number;
  lockMode: LockMode;
  scoringConfig: ScoringConfig;
  createdAt: string;
}

export type LeagueRole = "owner" | "member";

export interface LeagueMember {
  leagueId: string;
  userId: string;
  role: LeagueRole;
  joinedAt: string;
}
