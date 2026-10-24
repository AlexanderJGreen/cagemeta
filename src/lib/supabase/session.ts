import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { nodeRealtimeOptions } from "./node-realtime";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** Signed-out visitors to these paths are redirected to /login. */
const PROTECTED_PREFIXES = ["/leagues"];

/**
 * Refreshes the auth session cookie on each request and redirects signed-out visitors away from
 * protected pages. This is an optimistic check only; Server Actions and data queries still
 * re-verify the user, because a proxy must never be the sole line of defence.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl(), supabaseAnonKey(), {
    realtime: nodeRealtimeOptions,
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getClaims validates the JWT signature, unlike getSession, and refreshes it when expired.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!signedIn && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return response;
}
