import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { nodeRealtimeOptions } from "./node-realtime";
import { supabaseUrl } from "./env";

/**
 * Service-role client. BYPASSES Row Level Security, so use it only in server code after the
 * caller has been authenticated and the input validated (picks, joins, scoring, seeding).
 * The `server-only` import makes the build fail if this is ever pulled into a Client Component.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY");

  return createSupabaseClient(supabaseUrl(), key, {
    realtime: nodeRealtimeOptions,
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
