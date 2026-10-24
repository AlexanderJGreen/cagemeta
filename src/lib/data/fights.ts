import type { Fight, FightResult } from "@/types";
import { db, isUuid, unwrap } from "./db";
import { toFight, toFightResult, type FightResultRow, type FightRow } from "./mappers";

// Stats hang off the fight, not the result, so they're embedded through the fights relation.
const RESULT_SELECT = "*, fights!inner(event_id, fight_fighter_stats(*))";

export async function getFightsByEventId(eventId: string): Promise<Fight[]> {
  const supabase = await db();
  const rows = unwrap(
    await supabase.from("fights").select("*").eq("event_id", eventId).order("bout_order"),
    "fights",
  ) as FightRow[];
  return rows.map(toFight);
}

export async function getFightById(id: string): Promise<Fight | undefined> {
  if (!isUuid(id)) return undefined;
  const supabase = await db();
  const row = unwrap(
    await supabase.from("fights").select("*").eq("id", id).maybeSingle(),
    "fight",
  ) as FightRow | null;
  return row ? toFight(row) : undefined;
}

export async function getFightResult(fightId: string): Promise<FightResult | undefined> {
  if (!isUuid(fightId)) return undefined;
  const supabase = await db();
  const row = unwrap(
    await supabase.from("fight_results").select(RESULT_SELECT).eq("fight_id", fightId).maybeSingle(),
    "fight result",
  ) as FightResultRow | null;
  return row ? toFightResult(row) : undefined;
}

export async function getFightResultsByEventId(eventId: string): Promise<FightResult[]> {
  const supabase = await db();
  const rows = unwrap(
    await supabase.from("fight_results").select(RESULT_SELECT).eq("fights.event_id", eventId),
    "fight results",
  ) as FightResultRow[];
  return rows.map(toFightResult);
}
