/**
 * Checks Row Level Security against the live project using a throwaway user, then deletes it.
 * Run after changing policies:  npm run verify:rls
 */
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { nodeRealtimeOptions } from "../src/lib/supabase/node-realtime";
import { leagueId, eventId, fighterId } from "./seed/ids";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anonKey || !serviceKey) throw new Error("Missing Supabase env vars in .env.local");

const opts = { realtime: nodeRealtimeOptions, auth: { autoRefreshToken: false, persistSession: false } };
const admin = createClient(url, serviceKey, opts);
const anon = createClient(url, anonKey, opts);

let failures = 0;
function check(name: string, ok: boolean, detail = "") {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  ${detail}`}`);
}

async function main() {
  const email = `rls-${randomBytes(4).toString("hex")}@seed.cagemeta.test`;
  const password = randomBytes(16).toString("hex");
  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username: `rls_${randomBytes(3).toString("hex")}`, display_name: "RLS Test" },
  });
  if (created.error) throw created.error;
  const userId = created.data.user.id;

  try {
    const league = leagueId("l01");
    const completedEvent = eventId("e02");
    const upcomingEvent = eventId("e01");

    // --- signed-out (anon) ---
    const anonLeagues = await anon.from("leagues").select("id");
    check("anon sees no leagues", (anonLeagues.data ?? []).length === 0);
    const anonProfiles = await anon.from("profiles").select("id");
    check("anon sees no profiles", (anonProfiles.data ?? []).length === 0);
    const anonFighters = await anon.from("fighters").select("id");
    check("anon can read fighters", (anonFighters.data ?? []).length === 20);

    // --- signed-in, not a member ---
    const user = createClient(url!, anonKey!, opts);
    const signIn = await user.auth.signInWithPassword({ email, password });
    check("test user can sign in", !signIn.error, signIn.error?.message);

    const profile = await user.from("profiles").select("id, display_name").eq("id", userId);
    check("signup trigger created the profile", profile.data?.[0]?.display_name === "RLS Test");
    check("non-member sees no leagues", ((await user.from("leagues").select("id")).data ?? []).length === 0);
    check("non-member sees no picks", ((await user.from("picks").select("id")).data ?? []).length === 0);
    check("non-member sees no finish calls", ((await user.from("finish_calls").select("id")).data ?? []).length === 0);
    check("non-member sees no league_members", ((await user.from("league_members").select("user_id")).data ?? []).length === 0);

    // --- writes a client must never be able to make ---
    const joinSelf = await user.from("league_members").insert({ league_id: league, user_id: userId });
    check("client cannot add itself to a league", !!joinSelf.error);
    const makeLeague = await user.from("leagues").insert({
      name: "Sneaky", owner_id: userId, invite_code: "CAGE-XXXX", scoring_config: {},
    });
    check("client cannot create a league directly", !!makeLeague.error);
    const pick = await user.from("picks").insert({
      user_id: userId, league_id: league, event_id: upcomingEvent, fighter_id: fighterId("f01"),
    });
    check("client cannot insert a pick", !!pick.error);
    const editFighter = await user.from("fighters").update({ wins: 99 }).eq("id", fighterId("f01")).select();
    check("client cannot edit fighters", (editFighter.data ?? []).length === 0);
    const editPrice = await user.from("fighter_prices").update({ price: 1 }).eq("event_id", upcomingEvent).select();
    check("client cannot edit prices", (editPrice.data ?? []).length === 0);
    const fakeResult = await user.from("fight_results").insert({ fight_id: "00000000-0000-0000-0000-000000000000" });
    check("client cannot insert results", !!fakeResult.error);
    const otherProfile = await user.from("profiles").update({ display_name: "hax" }).neq("id", userId).select();
    check("client cannot edit another profile", (otherProfile.data ?? []).length === 0);

    // --- as a league member ---
    const join = await admin.from("league_members").insert({ league_id: league, user_id: userId, role: "member" });
    check("(setup) admin adds the user to the league", !join.error, join.error?.message);

    check("member sees the league", ((await user.from("leagues").select("id")).data ?? []).length === 1);
    check("member sees fellow members", ((await user.from("league_members").select("user_id")).data ?? []).length === 5);
    const donePicks = await user.from("picks").select("id").eq("event_id", completedEvent);
    check("member sees others' picks for a finished event", (donePicks.data ?? []).length === 12);
    const futurePicks = await user.from("picks").select("id").eq("event_id", upcomingEvent);
    check("member sees no picks for an unlocked event", (futurePicks.data ?? []).length === 0);
    const editLeague = await user.from("leagues").update({ name: "Mine now" }).eq("id", league).select();
    check("member cannot edit league settings", (editLeague.data ?? []).length === 0);
    const leave = await user.from("league_members").delete().eq("user_id", userId).eq("league_id", league).select();
    check("member can leave", (leave.data ?? []).length === 1);
  } finally {
    await admin.auth.admin.deleteUser(userId);
  }

  console.log(failures === 0 ? "\nAll RLS checks passed." : `\n${failures} check(s) FAILED.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
