"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { getEventById } from "@/lib/data/events";
import { getPricesForEvent } from "@/lib/data/fighter-prices";
import { getFightsByEventId } from "@/lib/data/fights";
import { getLeagueById } from "@/lib/data/leagues";
import { getFinishCallForUser, getPicksForUser } from "@/lib/data/picks";
import { saveDraftSchema } from "@/lib/draft/schemas";
import { validateDraft } from "@/lib/draft/validate-draft";
import { createAdminClient } from "@/lib/supabase/admin";

export type SaveDraftResult = { ok: true } | { ok: false; errors: string[] };

/**
 * Saves the caller's picks and Call the Finish for one event. The browser only says WHAT it wants;
 * identity, prices, budget, roster size, lock times and membership all come from the server.
 */
export async function saveDraft(input: unknown): Promise<SaveDraftResult> {
  const parsed = saveDraftSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: ["That draft wasn't valid. Reload and try again."] };
  const { leagueId, eventId, fighterIds, finishCall } = parsed.data;

  const user = await requireUser(`/leagues/${leagueId}/draft/${eventId}`);

  // getLeagueById runs under RLS, so it returns nothing unless the caller is a member.
  const [league, event] = await Promise.all([getLeagueById(leagueId), getEventById(eventId)]);
  if (!league) return { ok: false, errors: ["You're not a member of that league."] };
  if (!event) return { ok: false, errors: ["That event doesn't exist."] };

  const [fights, prices, existingPicks, existingCall] = await Promise.all([
    getFightsByEventId(event.id),
    getPricesForEvent(event.id),
    getPicksForUser(league.id, event.id, user.id),
    getFinishCallForUser(league.id, event.id, user.id),
  ]);

  const errors = validateDraft({
    league,
    event,
    fights,
    priceByFighterId: new Map(prices.map((p) => [p.fighterId, p.price])),
    existingFighterIds: existingPicks.map((p) => p.fighterId),
    existingFinishCall: existingCall && {
      fightId: existingCall.fightId,
      method: existingCall.predictedMethod,
      round: existingCall.predictedRound,
    },
    proposed: {
      fighterIds,
      finishCall: finishCall && {
        fightId: finishCall.fightId,
        method: finishCall.method,
        round: finishCall.round,
      },
    },
    now: new Date(),
  });
  if (errors.length > 0) return { ok: false, errors };

  const { error } = await createAdminClient().rpc("save_draft", {
    p_user_id: user.id,
    p_league_id: league.id,
    p_event_id: event.id,
    p_fighter_ids: fighterIds,
    p_call_fight_id: finishCall?.fightId ?? null,
    p_call_method: finishCall?.method ?? null,
    p_call_round: finishCall?.round ?? null,
  });
  if (error) return { ok: false, errors: ["Couldn't save your picks. Please try again."] };

  revalidatePath(`/leagues/${league.id}/draft/${event.id}`);
  return { ok: true };
}
