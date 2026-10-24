import type { Event, Fight, FinishMethod, League } from "@/types";
import { isFightLocked } from "./locking";

/** Methods a user can call. Draw / No Contest can't be called, they're not a finish. */
export const CALLABLE_METHODS = [
  "KO/TKO",
  "Submission",
  "Decision - Unanimous",
  "Decision - Split",
  "Decision - Majority",
] as const satisfies readonly FinishMethod[];

export interface DraftFinishCall {
  fightId: string;
  method: FinishMethod;
  round: number;
}

export interface DraftValidationInput {
  league: Pick<League, "budget" | "maxDraftPicks" | "lockMode">;
  event: Pick<Event, "date" | "status">;
  fights: Fight[];
  /** Credits per fighter for this event, from the database. */
  priceByFighterId: Map<string, number>;
  existingFighterIds: string[];
  existingFinishCall?: DraftFinishCall;
  proposed: { fighterIds: string[]; finishCall?: DraftFinishCall };
  now: Date;
}

/** Returns human-readable problems; an empty array means the draft may be saved. Pure: no I/O. */
export function validateDraft(input: DraftValidationInput): string[] {
  const { league, event, fights, priceByFighterId, existingFighterIds, proposed, now } = input;
  const errors: string[] = [];

  if (event.status !== "upcoming") {
    return ["This event is no longer open for picks."];
  }

  const fightByFighterId = new Map<string, Fight>();
  for (const fight of fights) {
    fightByFighterId.set(fight.fighterAId, fight);
    fightByFighterId.set(fight.fighterBId, fight);
  }
  const locked = (fight: Fight) => isFightLocked(league.lockMode, fight, event, now);

  // Duplicates, unknown fighters, one fighter per bout.
  const unique = new Set(proposed.fighterIds);
  if (unique.size !== proposed.fighterIds.length) errors.push("A fighter was picked more than once.");

  const seenFights = new Set<string>();
  let spent = 0;
  for (const fighterId of unique) {
    const fight = fightByFighterId.get(fighterId);
    const price = priceByFighterId.get(fighterId);
    if (!fight || price === undefined) {
      errors.push("A picked fighter isn't on this card.");
      continue;
    }
    if (seenFights.has(fight.id)) errors.push("You can only pick one fighter from each bout.");
    seenFights.add(fight.id);
    spent += price;
  }

  if (unique.size > league.maxDraftPicks) {
    errors.push(`You can pick at most ${league.maxDraftPicks} fighters.`);
  }
  if (spent > league.budget) {
    errors.push(`That roster costs ${spent} credits; the budget is ${league.budget}.`);
  }

  // Locks: a locked pick can't be dropped, and nothing new can be added on a locked fight.
  const existing = new Set(existingFighterIds);
  for (const fighterId of existing) {
    const fight = fightByFighterId.get(fighterId);
    if (fight && locked(fight) && !unique.has(fighterId)) {
      errors.push("A pick on a fight that has already locked can't be removed.");
    }
  }
  for (const fighterId of unique) {
    const fight = fightByFighterId.get(fighterId);
    if (fight && locked(fight) && !existing.has(fighterId)) {
      errors.push("Picks are locked for a fight you tried to add.");
    }
  }

  errors.push(...validateFinishCall(input, locked));
  return [...new Set(errors)];
}

function validateFinishCall(
  { fights, existingFinishCall, proposed }: DraftValidationInput,
  locked: (fight: Fight) => boolean,
): string[] {
  const call = proposed.finishCall;
  const previous = existingFinishCall;
  const same = (a?: DraftFinishCall, b?: DraftFinishCall) =>
    a?.fightId === b?.fightId && a?.method === b?.method && a?.round === b?.round;

  const errors: string[] = [];
  const fightById = new Map(fights.map((f) => [f.id, f]));

  // An existing call on a locked fight is frozen.
  const previousFight = previous ? fightById.get(previous.fightId) : undefined;
  if (previous && previousFight && locked(previousFight) && !same(previous, call)) {
    errors.push("Your Call the Finish is locked and can't be changed.");
  }

  if (call && !same(previous, call)) {
    const fight = fightById.get(call.fightId);
    if (!fight) {
      errors.push("Call the Finish must be on a fight from this card.");
    } else {
      if (locked(fight)) errors.push("That fight has already locked, so you can't call it.");
      if (call.round < 1 || call.round > fight.scheduledRounds) {
        errors.push(`That fight is scheduled for ${fight.scheduledRounds} rounds.`);
      }
      if (!(CALLABLE_METHODS as readonly string[]).includes(call.method)) {
        errors.push("Pick a method to call: KO/TKO, Submission, or a decision.");
      }
    }
  }
  return errors;
}
