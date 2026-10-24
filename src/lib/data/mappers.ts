import type {
  CardPosition,
  Event,
  EventStatus,
  Fight,
  FightResult,
  FightStatus,
  Fighter,
  FighterPrice,
  FinishCall,
  FinishMethod,
  League,
  LeagueMember,
  LeagueRole,
  LockMode,
  Pick,
  Stance,
  UserProfile,
  WeightClass,
} from "@/types";
import { scoringConfigSchema } from "@/lib/scoring/config-schema";

// Database rows (snake_case) -> app types (camelCase). Rows are typed by hand because the
// project doesn't generate Supabase types; the column names match supabase/migrations.

export interface FighterRow {
  id: string;
  first_name: string;
  last_name: string;
  nickname: string | null;
  weight_class: WeightClass;
  wins: number;
  losses: number;
  draws: number;
  no_contests: number;
  height_cm: number;
  reach_cm: number;
  stance: Stance;
  age: number;
  country: string;
  image_url: string | null;
  sig_strikes_landed_per_min: number;
  sig_strike_accuracy_pct: number;
  takedown_avg_per_15_min: number;
  takedown_accuracy_pct: number;
  ko_tko_wins: number;
  submission_wins: number;
  decision_wins: number;
}

export const toFighter = (r: FighterRow): Fighter => ({
  id: r.id,
  firstName: r.first_name,
  lastName: r.last_name,
  nickname: r.nickname ?? undefined,
  weightClass: r.weight_class,
  record: { wins: r.wins, losses: r.losses, draws: r.draws, noContests: r.no_contests },
  heightCm: r.height_cm,
  reachCm: r.reach_cm,
  stance: r.stance,
  age: r.age,
  country: r.country,
  imageUrl: r.image_url ?? undefined,
  stats: {
    sigStrikesLandedPerMin: Number(r.sig_strikes_landed_per_min),
    sigStrikeAccuracyPct: Number(r.sig_strike_accuracy_pct),
    takedownAvgPer15Min: Number(r.takedown_avg_per_15_min),
    takedownAccuracyPct: Number(r.takedown_accuracy_pct),
    koTkoWins: r.ko_tko_wins,
    submissionWins: r.submission_wins,
    decisionWins: r.decision_wins,
  },
});

export interface EventRow {
  id: string;
  name: string;
  short_name: string;
  starts_at: string;
  venue: string;
  city: string;
  country: string;
  status: EventStatus;
  fights: { id: string; bout_order: number }[];
}

export const toEvent = (r: EventRow): Event => ({
  id: r.id,
  name: r.name,
  shortName: r.short_name,
  date: r.starts_at,
  location: { venue: r.venue, city: r.city, country: r.country },
  status: r.status,
  fightIds: [...r.fights].sort((a, b) => a.bout_order - b.bout_order).map((f) => f.id),
});

export interface FightRow {
  id: string;
  event_id: string;
  fighter_a_id: string;
  fighter_b_id: string;
  weight_class: WeightClass;
  card_position: CardPosition;
  bout_order: number;
  scheduled_rounds: 3 | 5;
  status: FightStatus;
  scheduled_start_time: string;
}

export const toFight = (r: FightRow): Fight => ({
  id: r.id,
  eventId: r.event_id,
  fighterAId: r.fighter_a_id,
  fighterBId: r.fighter_b_id,
  weightClass: r.weight_class,
  cardPosition: r.card_position,
  boutOrder: r.bout_order,
  scheduledRounds: r.scheduled_rounds,
  status: r.status,
  scheduledStartTime: r.scheduled_start_time,
});

export interface FightResultRow {
  fight_id: string;
  winner_id: string | null;
  method: FinishMethod;
  method_detail: string | null;
  round: number;
  time: string;
  fights: {
    fight_fighter_stats: {
      fighter_id: string;
      sig_strikes_landed: number;
      takedowns: number;
      knockdowns: number;
    }[];
  };
}

export const toFightResult = (r: FightResultRow): FightResult => ({
  fightId: r.fight_id,
  winnerId: r.winner_id ?? undefined,
  method: r.method,
  methodDetail: r.method_detail ?? undefined,
  round: r.round,
  time: r.time,
  stats: r.fights.fight_fighter_stats.map((s) => ({
    fighterId: s.fighter_id,
    sigStrikesLanded: s.sig_strikes_landed,
    takedowns: s.takedowns,
    knockdowns: s.knockdowns,
  })),
});

export interface FighterPriceRow {
  fighter_id: string;
  event_id: string;
  price: number;
  odds: number | null;
}

export const toFighterPrice = (r: FighterPriceRow): FighterPrice => ({
  fighterId: r.fighter_id,
  eventId: r.event_id,
  price: r.price,
  odds: r.odds ?? undefined,
});

export interface LeagueRow {
  id: string;
  name: string;
  owner_id: string;
  invite_code: string;
  budget: number;
  max_draft_picks: number;
  lock_mode: LockMode;
  scoring_config: unknown;
  created_at: string;
}

export const toLeague = (r: LeagueRow): League => ({
  id: r.id,
  name: r.name,
  ownerId: r.owner_id,
  inviteCode: r.invite_code,
  budget: r.budget,
  maxDraftPicks: r.max_draft_picks,
  lockMode: r.lock_mode,
  scoringConfig: scoringConfigSchema.parse(r.scoring_config),
  createdAt: r.created_at,
});

export interface LeagueMemberRow {
  league_id: string;
  user_id: string;
  role: LeagueRole;
  joined_at: string;
}

export const toLeagueMember = (r: LeagueMemberRow): LeagueMember => ({
  leagueId: r.league_id,
  userId: r.user_id,
  role: r.role,
  joinedAt: r.joined_at,
});

export interface PickRow {
  id: string;
  user_id: string;
  league_id: string;
  event_id: string;
  fighter_id: string;
  created_at: string;
}

export const toPick = (r: PickRow): Pick => ({
  id: r.id,
  userId: r.user_id,
  leagueId: r.league_id,
  eventId: r.event_id,
  fighterId: r.fighter_id,
  createdAt: r.created_at,
});

export interface FinishCallRow {
  id: string;
  user_id: string;
  league_id: string;
  fight_id: string;
  predicted_method: FinishMethod;
  predicted_round: number;
  created_at: string;
}

export const toFinishCall = (r: FinishCallRow): FinishCall => ({
  id: r.id,
  userId: r.user_id,
  leagueId: r.league_id,
  fightId: r.fight_id,
  predictedMethod: r.predicted_method,
  predictedRound: r.predicted_round,
  createdAt: r.created_at,
});

export interface ProfileRow {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
}

export const toProfile = (r: ProfileRow): UserProfile => ({
  id: r.id,
  username: r.username,
  displayName: r.display_name,
  avatarUrl: r.avatar_url ?? undefined,
  createdAt: r.created_at,
});
