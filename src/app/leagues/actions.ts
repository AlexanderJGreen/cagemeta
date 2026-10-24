"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { generateInviteCode } from "@/lib/leagues/invite-code";
import { MAX_LEAGUE_MEMBERS, createLeagueSchema, joinLeagueSchema } from "@/lib/leagues/schemas";
import { defaultScoringConfig } from "@/lib/scoring/config";
import { createAdminClient } from "@/lib/supabase/admin";

export interface LeagueFormState {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

const UNIQUE_VIOLATION = "23505";

/**
 * Creates a league owned by the caller. The insert uses the admin client because clients have no
 * INSERT policy on leagues; identity comes from the verified session, never from form input.
 * A database trigger adds the owner as a member in the same transaction.
 */
export async function createLeague(
  _prev: LeagueFormState,
  formData: FormData,
): Promise<LeagueFormState> {
  const user = await requireUser("/leagues");
  const parsed = createLeagueSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  const { name, budget, maxDraftPicks, lockMode } = parsed.data;

  const admin = createAdminClient();
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await admin
      .from("leagues")
      .insert({
        name,
        owner_id: user.id,
        invite_code: generateInviteCode(),
        budget,
        max_draft_picks: maxDraftPicks,
        lock_mode: lockMode,
        scoring_config: defaultScoringConfig,
      })
      .select("id")
      .single();

    if (!error) redirect(`/leagues/${data.id}`);
    if (error.code !== UNIQUE_VIOLATION) break; // only retry invite-code collisions
  }
  return { error: "Couldn't create the league. Please try again." };
}

export async function joinLeague(
  _prev: LeagueFormState,
  formData: FormData,
): Promise<LeagueFormState> {
  const user = await requireUser("/leagues");
  const parsed = joinLeagueSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  // Non-members can't read leagues under RLS, so the code lookup needs the admin client.
  const admin = createAdminClient();
  const { data: league } = await admin
    .from("leagues")
    .select("id")
    .eq("invite_code", parsed.data.inviteCode)
    .maybeSingle();
  if (!league) return { fieldErrors: { inviteCode: ["No league has that code"] } };

  const { count } = await admin
    .from("league_members")
    .select("user_id", { count: "exact", head: true })
    .eq("league_id", league.id);
  if ((count ?? 0) >= MAX_LEAGUE_MEMBERS) return { error: "That league is full." };

  const { error } = await admin
    .from("league_members")
    .insert({ league_id: league.id, user_id: user.id, role: "member" });
  // Already a member is fine: just take them to the league.
  if (error && error.code !== UNIQUE_VIOLATION) return { error: "Couldn't join the league. Please try again." };

  redirect(`/leagues/${league.id}`);
}
