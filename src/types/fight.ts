import type { WeightClass } from "./fighter";

export type CardPosition = "main" | "co-main" | "main-card" | "prelim" | "early-prelim";

export type FightStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface Fight {
  id: string;
  eventId: string;
  fighterAId: string;
  fighterBId: string;
  weightClass: WeightClass;
  cardPosition: CardPosition;
  /** Lower number = earlier on the card. */
  boutOrder: number;
  scheduledRounds: 3 | 5;
  status: FightStatus;
  /** ISO 8601 date-time string; used for per-fight pick locking. */
  scheduledStartTime: string;
}

export type FinishMethod =
  | "KO/TKO"
  | "Submission"
  | "Decision - Unanimous"
  | "Decision - Split"
  | "Decision - Majority"
  | "Draw"
  | "No Contest";

export interface FighterFightStats {
  fighterId: string;
  sigStrikesLanded: number;
  takedowns: number;
  knockdowns: number;
}

export interface FightResult {
  fightId: string;
  /** undefined for a Draw or No Contest. */
  winnerId?: string;
  method: FinishMethod;
  methodDetail?: string;
  round: number;
  /** Time of the stoppage/finish within the round, formatted "m:ss". */
  time: string;
  stats: FighterFightStats[];
}
