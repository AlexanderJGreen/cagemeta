import type { League, LeagueMember } from "@/types";
import { db, isUuid, unwrap } from "./db";
import { toLeague, toLeagueMember, type LeagueMemberRow, type LeagueRow } from "./mappers";

// RLS already limits leagues to ones the caller belongs to, so these never leak other leagues.

export async function getLeaguesForUser(userId: string): Promise<League[]> {
  const supabase = await db();
  const memberships = unwrap(
    await supabase.from("league_members").select("league_id").eq("user_id", userId),
    "memberships",
  ) as { league_id: string }[];
  if (memberships.length === 0) return [];

  const rows = unwrap(
    await supabase
      .from("leagues")
      .select("*")
      .in(
        "id",
        memberships.map((m) => m.league_id),
      )
      .order("created_at"),
    "leagues",
  ) as LeagueRow[];
  return rows.map(toLeague);
}

export async function getLeagueById(id: string): Promise<League | undefined> {
  if (!isUuid(id)) return undefined;
  const supabase = await db();
  const row = unwrap(
    await supabase.from("leagues").select("*").eq("id", id).maybeSingle(),
    "league",
  ) as LeagueRow | null;
  return row ? toLeague(row) : undefined;
}

export async function getLeagueMembers(leagueId: string): Promise<LeagueMember[]> {
  const supabase = await db();
  const rows = unwrap(
    await supabase.from("league_members").select("*").eq("league_id", leagueId).order("joined_at"),
    "league members",
  ) as LeagueMemberRow[];
  return rows.map(toLeagueMember);
}
