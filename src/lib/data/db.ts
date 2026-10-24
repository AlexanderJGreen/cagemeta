import "server-only";
import type { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/** Supabase client acting as the signed-in user (or anonymous), so Row Level Security applies. */
export const db = createClient;

/** Returns a query's data or throws with the table context, so pages hit the nearest error boundary. */
export function unwrap<T>(
  result: { data: T | null; error: PostgrestError | null },
  what: string,
): T {
  if (result.error) throw new Error(`Failed to load ${what}: ${result.error.message}`);
  return result.data as T;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** IDs come from URLs; Postgres throws on a malformed uuid, so lookups check first and return "not found". */
export const isUuid = (value: string) => UUID_PATTERN.test(value);
