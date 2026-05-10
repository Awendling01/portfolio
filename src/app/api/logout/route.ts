import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, revokeSession } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Same-origin check using Sec-Fetch-Site (sent by all modern browsers) with
 * an Origin header fallback. Defends against a malicious site auto-POSTing
 * to /api/logout in a hidden form to log the admin out.
 */
function isSameOriginRequest(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) {
    return fetchSite === "same-origin" || fetchSite === "same-site";
  }
  // Fallback: compare Origin to Host. (Older browsers may not send
  // Sec-Fetch-Site; reject anything we can't positively confirm.)
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const cookieStore = await cookies();
  const existing = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  // Revoke server-side first, then drop the cookie. If the DB delete fails,
  // the cookie still gets cleared so the user is logged out client-side.
  await revokeSession(existing);
  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.redirect(new URL("/", request.url), {
    status: 303,
  });
}
