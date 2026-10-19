export type WeightClass =
  | "Flyweight"
  | "Bantamweight"
  | "Featherweight"
  | "Lightweight"
  | "Welterweight"
  | "Middleweight"
  | "Light Heavyweight"
  | "Heavyweight"
  | "Women's Strawweight"
  | "Women's Flyweight"
  | "Women's Bantamweight";

export type Stance = "Orthodox" | "Southpaw" | "Switch";

export interface FighterRecord {
  wins: number;
  losses: number;
  draws: number;
  noContests: number;
}

export interface FighterStats {
  sigStrikesLandedPerMin: number;
  sigStrikeAccuracyPct: number;
  takedownAvgPer15Min: number;
  takedownAccuracyPct: number;
  koTkoWins: number;
  submissionWins: number;
  decisionWins: number;
}

export interface Fighter {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  weightClass: WeightClass;
  record: FighterRecord;
  heightCm: number;
  reachCm: number;
  stance: Stance;
  age: number;
  country: string;
  /** Placeholder only — real photos require provider licensing (see project constraints). */
  imageUrl?: string;
  stats: FighterStats;
}
