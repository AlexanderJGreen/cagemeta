/**
 * Loads the Phase 1 mock data into Supabase. Safe to re-run: every row has a deterministic UUID
 * and is upserted. Uses the service-role key, so run it only from your own machine:
 *
 *   npm run seed
 */
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { mockEvents } from "../src/lib/data/mock/events";
import { mockFightResults } from "../src/lib/data/mock/fight-results";
import { mockFighterPrices } from "../src/lib/data/mock/fighter-prices";
import { mockFighters } from "../src/lib/data/mock/fighters";
import { mockFights } from "../src/lib/data/mock/fights";
import { mockLeagueMembers, mockLeagues } from "../src/lib/data/mock/leagues";
import { mockFinishCalls, mockPicks } from "../src/lib/data/mock/picks";
import { mockUsers } from "../src/lib/data/mock/users";
import { nodeRealtimeOptions } from "../src/lib/supabase/node-realtime";
import { userId } from "./seed/ids";
import {
  eventRow,
  fightResultRow,
  fightRow,
  fightStatsRows,
  fighterRow,
  finishCallRow,
  leagueRow,
  memberRow,
  pickRow,
  priceRow,
} from "./seed/rows";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
}

const supabase = createClient(url, serviceKey, {
  realtime: nodeRealtimeOptions,
  auth: { autoRefreshToken: false, persistSession: false },
});

async function upsert(table: string, rows: object[], onConflict: string) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`  ${table}: ${rows.length} rows`);
}

/**
 * Demo players need real auth.users rows (profiles reference them). They get random passwords
 * nobody knows, so they can't be logged into; sign up with your own account and join the demo
 * league with its invite code instead.
 */
async function seedUsers() {
  for (const u of mockUsers) {
    const id = userId(u.id);
    const existing = await supabase.auth.admin.getUserById(id);
    if (existing.data.user) continue;

    const { error } = await supabase.auth.admin.createUser({
      id,
      email: `${u.username}@seed.cagemeta.test`,
      password: randomBytes(24).toString("hex"),
      email_confirm: true,
      user_metadata: { username: u.username, display_name: u.displayName },
    });
    if (error) throw new Error(`auth user ${u.username}: ${error.message}`);
  }
  console.log(`  auth users + profiles: ${mockUsers.length}`);
}

async function main() {
  console.log("Seeding Supabase…");
  await seedUsers();

  await upsert("fighters", mockFighters.map(fighterRow), "id");
  await upsert("events", mockEvents.map(eventRow), "id");
  await upsert("fights", mockFights.map(fightRow), "id");
  await upsert("fight_results", mockFightResults.map(fightResultRow), "fight_id");
  await upsert("fight_fighter_stats", mockFightResults.flatMap(fightStatsRows), "fight_id,fighter_id");
  await upsert("fighter_prices", mockFighterPrices.map(priceRow), "event_id,fighter_id");

  await upsert("leagues", mockLeagues.map(leagueRow), "id");
  await upsert("league_members", mockLeagueMembers.map(memberRow), "league_id,user_id");
  await upsert("picks", mockPicks.map(pickRow), "id");
  await upsert(
    "finish_calls",
    mockFinishCalls.map((c) => finishCallRow(c, mockFights)),
    "id",
  );

  console.log("Done.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
