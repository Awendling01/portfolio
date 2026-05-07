import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionValue } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lock the admin out entirely if the password isn't configured —
  // better than letting traffic through an unconfigured gate.
  if (!process.env.ADMIN_PASSWORD) {
    return new NextResponse("Admin not configured.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (verifySessionValue(session)) {
    return NextResponse.next();
  }

  // Not logged in — bounce to /login, remembering where they were headed.
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: "/admin/:path*",
};
