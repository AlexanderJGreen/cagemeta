import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth/schemas";
import { createClient } from "@/lib/supabase/server";

/** Landing point for email confirmation links: trades the one-time code for a session cookie. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/login?error=confirmation`);
}
