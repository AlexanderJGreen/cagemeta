import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { UserProfile } from "@/types";
import { getUserById } from "@/lib/data/users";
import { createClient } from "@/lib/supabase/server";

/**
 * The signed-in user's profile, or null. getClaims verifies the JWT signature, so unlike
 * reading the cookie directly it can't be spoofed. Cached per request.
 */
export const getCurrentUser = cache(async (): Promise<UserProfile | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const id = data?.claims?.sub;
  if (!id) return null;
  return (await getUserById(id)) ?? null;
});

/** For pages and actions that need a user: redirects to /login (remembering where to return) if signed out. */
export async function requireUser(returnTo?: string): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) redirect(returnTo ? `/login?next=${encodeURIComponent(returnTo)}` : "/login");
  return user;
}
