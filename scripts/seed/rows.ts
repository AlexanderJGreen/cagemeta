import type {
  Event,
  Fight,
  FightResult,
  Fighter,
  FighterPrice,
  FinishCall,
  League,
  LeagueMember,
  Pick,
} from "../../src/types";
import {
  eventId,
  fightId,
  fighterId,
  finishCallId,
  leagueId,
  pickId,
  userId,
} from "./ids";

// Mappers from the camelCase app types to snake_case table rows, with mock IDs swapped for UUIDs.

export const fighterRow = (f: Fighter) => ({
  id: fighterId(f.id),
  first_name: f.firstName,
  last_name: f.lastName,
  nickname: f.nickname ?? null,
  weight_class: f.weightClass,
  wins: f.record.wins,
  losses: f.record.losses,
  draws: f.record.draws,
  no_contests: f.record.noContests,
  height_cm: f.heightCm,
  reach_cm: f.reachCm,
  stance: f.stance,
  age: f.age,
  country: f.country,
  image_url: f.imageUrl ?? null,
  sig_strikes_landed_per_min: f.stats.sigStrikesLandedPerMin,
  sig_strike_accuracy_pct: f.stats.sigStrikeAccuracyPct,
  takedown_avg_per_15_min: f.stats.takedownAvgPer15Min,
  takedown_accuracy_pct: f.stats.takedownAccuracyPct,
  ko_tko_wins: f.stats.koTkoWins,
  submission_wins: f.stats.submissionWins,
  decision_wins: f.stats.decisionWins,
});

export const eventRow = (e: Event) => ({
  id: eventId(e.id),
  name: e.name,
  short_name: e.shortName,
  starts_at: e.date,
  venue: e.location.venue,
  city: e.location.city,
  country: e.location.country,
  status: e.status,
});

export const fightRow = (f: Fight) => ({
  id: fightId(f.id),
  event_id: eventId(f.eventId),
  fighter_a_id: fighterId(f.fighterAId),
  fighter_b_id: fighterId(f.fighterBId),
  weight_class: f.weightClass,
  card_position: f.cardPosition,
  bout_order: f.boutOrder,
  scheduled_rounds: f.scheduledRounds,
  status: f.status,
  scheduled_start_time: f.scheduledStartTime,
});

export const fightResultRow = (r: FightResult) => ({
  fight_id: fightId(r.fightId),
  winner_id: r.winnerId ? fighterId(r.winnerId) : null,
  method: r.method,
  method_detail: r.methodDetail ?? null,
  round: r.round,
  time: r.time,
});

export const fightStatsRows = (r: FightResult) =>
  r.stats.map((s) => ({
    fight_id: fightId(r.fightId),
    fighter_id: fighterId(s.fighterId),
    sig_strikes_landed: s.sigStrikesLanded,
    takedowns: s.takedowns,
    knockdowns: s.knockdowns,
  }));

export const priceRow = (p: FighterPrice) => ({
  fighter_id: fighterId(p.fighterId),
  event_id: eventId(p.eventId),
  price: p.price,
  odds: p.odds ?? null,
});

export const leagueRow = (l: League) => ({
  id: leagueId(l.id),
  name: l.name,
  owner_id: userId(l.ownerId),
  invite_code: l.inviteCode,
  budget: l.budget,
  max_draft_picks: l.maxDraftPicks,
  lock_mode: l.lockMode,
  scoring_config: l.scoringConfig,
  created_at: l.createdAt,
});

export const memberRow = (m: LeagueMember) => ({
  league_id: leagueId(m.leagueId),
  user_id: userId(m.userId),
  role: m.role,
  joined_at: m.joinedAt,
});

export const pickRow = (p: Pick) => ({
  id: pickId(p.id),
  user_id: userId(p.userId),
  league_id: leagueId(p.leagueId),
  event_id: eventId(p.eventId),
  fighter_id: fighterId(p.fighterId),
  created_at: p.createdAt,
});

/** finish_calls stores event_id too (for the one-per-event constraint), so it needs the fight's event. */
export const finishCallRow = (c: FinishCall, fights: Fight[]) => {
  const fight = fights.find((f) => f.id === c.fightId);
  if (!fight) throw new Error(`Finish call ${c.id} references unknown fight ${c.fightId}`);
  return {
    id: finishCallId(c.id),
    user_id: userId(c.userId),
    league_id: leagueId(c.leagueId),
    event_id: eventId(fight.eventId),
    fight_id: fightId(c.fightId),
    predicted_method: c.predictedMethod,
    predicted_round: c.predictedRound,
    created_at: c.createdAt,
  };
};
