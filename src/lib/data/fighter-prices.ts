import type { FighterPrice } from "@/types";
import { db, unwrap } from "./db";
import { toFighterPrice, type FighterPriceRow } from "./mappers";

export async function getPricesForEvent(eventId: string): Promise<FighterPrice[]> {
  const supabase = await db();
  const rows = unwrap(
    await supabase.from("fighter_prices").select("*").eq("event_id", eventId),
    "fighter prices",
  ) as FighterPriceRow[];
  return rows.map(toFighterPrice);
}

export async function getFighterPrice(
  fighterId: string,
  eventId: string,
): Promise<FighterPrice | undefined> {
  const supabase = await db();
  const row = unwrap(
    await supabase
      .from("fighter_prices")
      .select("*")
      .eq("fighter_id", fighterId)
      .eq("event_id", eventId)
      .maybeSingle(),
    "fighter price",
  ) as FighterPriceRow | null;
  return row ? toFighterPrice(row) : undefined;
}
