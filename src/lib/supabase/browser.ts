import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** Supabase client for Client Components. Uses the anon key; every query is subject to RLS. */
export function createClient() {
  return createBrowserClient(supabaseUrl(), supabaseAnonKey());
}
