import type { FinishCall, Pick } from "@/types";
import { db, unwrap } from "./db";
import { toFinishCall, toPick, type FinishCallRow, type PickRow } from "./mappers";

// RLS hides other members' picks until they lock, so callers see only what they're allowed to.

export async function getPicks(leagueId: string, eventId: string): Promise<Pick[]> {
  const supabase = await db();
  const rows = unwrap(
    await supabase.from("picks").select("*").eq("league_id", leagueId).eq("event_id", eventId),
    "picks",
  ) as PickRow[];
  return rows.map(toPick);
}

export async function getPicksForUser(
  leagueId: string,
  eventId: string,
  userId: string,
): Promise<Pick[]> {
  const supabase = await db();
  const rows = unwrap(
    await supabase
      .from("picks")
      .select("*")
      .eq("league_id", leagueId)
      .eq("event_id", eventId)
      .eq("user_id", userId),
    "picks",
  ) as PickRow[];
  return rows.map(toPick);
}

export async function getFinishCallsForEvent(
  leagueId: string,
  fightIds: string[],
): Promise<FinishCall[]> {
  if (fightIds.length === 0) return [];
  const supabase = await db();
  const rows = unwrap(
    await supabase.from("finish_calls").select("*").eq("league_id", leagueId).in("fight_id", fightIds),
    "finish calls",
  ) as FinishCallRow[];
  return rows.map(toFinishCall);
}

/** The caller's own Call the Finish for one league/event, if they've made one. */
export async function getFinishCallForUser(
  leagueId: string,
  eventId: string,
  userId: string,
): Promise<FinishCall | undefined> {
  const supabase = await db();
  const row = unwrap(
    await supabase
      .from("finish_calls")
      .select("*")
      .eq("league_id", leagueId)
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .maybeSingle(),
    "finish call",
  ) as FinishCallRow | null;
  return row ? toFinishCall(row) : undefined;
}
