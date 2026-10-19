import type { FinishMethod } from "./fight";

export interface Pick {
  id: string;
  userId: string;
  leagueId: string;
  eventId: string;
  fighterId: string;
  createdAt: string;
}

export interface FinishCall {
  id: string;
  userId: string;
  leagueId: string;
  fightId: string;
  predictedMethod: FinishMethod;
  predictedRound: number;
  createdAt: string;
}
