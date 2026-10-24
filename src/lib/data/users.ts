import type { UserProfile } from "@/types";
import { db, isUuid, unwrap } from "./db";
import { toProfile, type ProfileRow } from "./mappers";

export async function getUserById(id: string): Promise<UserProfile | undefined> {
  if (!isUuid(id)) return undefined;
  const supabase = await db();
  const row = unwrap(
    await supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
    "profile",
  ) as ProfileRow | null;
  return row ? toProfile(row) : undefined;
}

export async function getUsersByIds(ids: string[]): Promise<UserProfile[]> {
  if (ids.length === 0) return [];
  const supabase = await db();
  const rows = unwrap(
    await supabase.from("profiles").select("*").in("id", ids),
    "profiles",
  ) as ProfileRow[];
  return rows.map(toProfile);
}
