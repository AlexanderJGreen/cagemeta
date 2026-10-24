/**
 * Exercises the save_draft database function and the draft validator against the live project
 * with a throwaway league member, then deletes the user.  npm run verify:draft
 */
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { validateDraft } from "../src/lib/draft/validate-draft";
import { toFight, type FightRow } from "../src/lib/data/mappers";
import { nodeRealtimeOptions } from "../src/lib/supabase/node-realtime";
import { eventId, fighterId, fightId, leagueId } from "./seed/ids";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const opts = { realtime: nodeRealtimeOptions, auth: { autoRefreshToken: false, persistSession: false } };
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, opts);
const anon = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, opts);

let failures = 0;
const check = (name: string, ok: boolean, detail = "") => {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  ${detail}`}`);
};

async function main() {
  const email = `draft-${randomBytes(4).toString("hex")}@seed.cagemeta.test`;
  const password = randomBytes(16).toString("hex");
  const created = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { username: `dr_${randomBytes(3).toString("hex")}`, display_name: "Draft Test" },
  });
  if (created.error) throw created.error;
  const userId = created.data.user.id;
  const [league, event] = [leagueId("l01"), eventId("e01")];

  try {
    await admin.from("league_members").insert({ league_id: league, user_id: userId, role: "member" });
    const user = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, opts);
    await user.auth.signInWithPassword({ email, password });

    const save = (fighters: string[], call?: { fight: string; method: string; round: number }) =>
      admin.rpc("save_draft", {
        p_user_id: userId, p_league_id: league, p_event_id: event, p_fighter_ids: fighters,
        p_call_fight_id: call?.fight ?? null, p_call_method: call?.method ?? null, p_call_round: call?.round ?? null,
      });
    const myPicks = async () =>
      ((await user.from("picks").select("fighter_id").eq("event_id", event)).data ?? []).map((r) => r.fighter_id).sort();
    const myCall = async () => (await user.from("finish_calls").select("fight_id, predicted_round").eq("event_id", event)).data ?? [];

    const [f01, f03, f05] = [fighterId("f01"), fighterId("f03"), fighterId("f05")];
    const first = await save([f01, f03], { fight: fightId("fi01"), method: "KO/TKO", round: 2 });
    check("save_draft stores picks and call", !first.error, first.error?.message);
    check("user reads back own picks", JSON.stringify(await myPicks()) === JSON.stringify([f01, f03].sort()));
    check("user reads back own finish call", (await myCall())[0]?.predicted_round === 2);

    const second = await save([f03, f05]);
    check("re-save replaces picks (drops f01, adds f05)", JSON.stringify(await myPicks()) === JSON.stringify([f03, f05].sort()));
    check("re-save without a call clears it", (await myCall()).length === 0 && !second.error);

    const same = await save([f03, f05]);
    check("saving the same draft twice is idempotent", !same.error && (await myPicks()).length === 2);

    await save([]);
    check("empty draft clears all picks", (await myPicks()).length === 0);

    const badCall = await save([f01], { fight: fightId("fi06"), method: "KO/TKO", round: 1 }); // fi06 belongs to e02
    check("finish call on another event's fight is rejected by FK", !!badCall.error);
    check("failed save left picks untouched (atomic)", (await myPicks()).length === 0);

    check("client cannot call save_draft", !!(await user.rpc("save_draft", {
      p_user_id: userId, p_league_id: league, p_event_id: event, p_fighter_ids: [f01],
      p_call_fight_id: null, p_call_method: null, p_call_round: null,
    })).error);
    check("anon cannot call save_draft", !!(await anon.rpc("save_draft", {
      p_user_id: userId, p_league_id: league, p_event_id: event, p_fighter_ids: [f01],
      p_call_fight_id: null, p_call_method: null, p_call_round: null,
    })).error);

    // Validator against real DB data: prices, fights and league rules as the Server Action loads them.
    const fightRows = (await admin.from("fights").select("*").eq("event_id", event)).data as FightRow[];
    const prices = (await admin.from("fighter_prices").select("fighter_id, price").eq("event_id", event)).data ?? [];
    const rules = (await admin.from("leagues").select("budget, max_draft_picks, lock_mode").eq("id", league).single()).data!;
    const ev = (await admin.from("events").select("starts_at, status").eq("id", event).single()).data!;
    const run = (ids: string[]) =>
      validateDraft({
        league: { budget: rules.budget, maxDraftPicks: rules.max_draft_picks, lockMode: rules.lock_mode },
        event: { date: ev.starts_at, status: ev.status },
        fights: fightRows.map(toFight),
        priceByFighterId: new Map(prices.map((p) => [p.fighter_id, p.price])),
        existingFighterIds: [], proposed: { fighterIds: ids }, now: new Date(),
      });
    check("validator accepts a legal draft on real data", run([f01, fighterId("f04")]).length === 0, run([f01, fighterId("f04")]).join("; "));
    check("validator rejects both fighters in one bout", run([f01, fighterId("f02")]).length > 0);
    const everyone = fightRows.flatMap((f) => [f.fighter_a_id, f.fighter_b_id]);
    check("validator rejects an oversized roster", run(everyone).length > 0);
  } finally {
    await admin.auth.admin.deleteUser(userId);
  }
  console.log(failures === 0 ? "\nAll draft checks passed." : `\n${failures} check(s) FAILED.`);
  process.exit(failures === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });
