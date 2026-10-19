export interface FightScoreBreakdown {
  fighterId: string;
  won: boolean;
  winPoints: number;
  methodBonusPoints: number;
  earlyFinishBonusPoints: number;
  statBonusPoints: number;
  total: number;
}

export interface FinishCallResult {
  fightId: string;
  hit: boolean;
  points: number;
}

export interface UserEventScore {
  userId: string;
  leagueId: string;
  eventId: string;
  fightScores: FightScoreBreakdown[];
  finishCallResult?: FinishCallResult;
  total: number;
}

export interface LeaderboardRow {
  userId: string;
  displayName: string;
  totalPoints: number;
  eventsPlayed: number;
  rank: number;
}
