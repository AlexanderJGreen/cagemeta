import type { Fighter } from "@/types";
import { db, isUuid, unwrap } from "./db";
import { toFighter, type FighterRow } from "./mappers";

export async function getFighters(): Promise<Fighter[]> {
  const supabase = await db();
  const rows = unwrap(await supabase.from("fighters").select("*"), "fighters") as FighterRow[];
  return rows.map(toFighter);
}

export async function getFighterById(id: string): Promise<Fighter | undefined> {
  if (!isUuid(id)) return undefined;
  const supabase = await db();
  const row = unwrap(
    await supabase.from("fighters").select("*").eq("id", id).maybeSingle(),
    "fighter",
  ) as FighterRow | null;
  return row ? toFighter(row) : undefined;
}

export async function getFightersByIds(ids: string[]): Promise<Fighter[]> {
  if (ids.length === 0) return [];
  const supabase = await db();
  const rows = unwrap(
    await supabase.from("fighters").select("*").in("id", ids),
    "fighters",
  ) as FighterRow[];
  return rows.map(toFighter);
}
