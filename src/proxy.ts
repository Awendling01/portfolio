import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/auth";

// Generate a per-request CSP nonce using Web Crypto (works on both edge
// and node runtimes). 16 bytes = 128 bits, base64-encoded.
function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  // Standard base64 (not base64url) is what CSP nonces conventionally use.
  return btoa(bin);
}

// CSP allows exactly what this site loads. Nonce-gated script-src — no
// 'unsafe-inline' — with 'strict-dynamic' so scripts loaded by trusted
// scripts inherit the trust (modern recommended pattern; old browsers
// fall back to the host allowlist).
//
// 'unsafe-inline' on style-src is intentional: Tailwind v4 + Next emit
// hashed inline styles that don't easily support nonces. Lower-impact
// surface than scripts (CSS injection ≠ RCE).
function buildCsp(nonce: string): string {
  // React 19 in dev mode uses eval() to reconstruct stack traces from worker
  // frames and for fast-refresh wiring. Allowing 'unsafe-eval' in dev only
  // keeps the strict prod policy intact (React never uses eval in prod
  // builds — it's a dev-tooling-only path).
  const isDev = process.env.NODE_ENV !== "production";
  const scriptSrc = [
    "script-src",
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    isDev ? "'unsafe-eval'" : null,
    "https://va.vercel-scripts.com",
  ]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    scriptSrc,
    "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://vercel.live",
    // Spotify album art (https://i.scdn.co) loaded by SpotifyNowPlaying.
    "img-src 'self' data: blob: https://*.scdn.co",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Build a per-request nonce + CSP. Forward the nonce on the request so
  // the React tree (root layout) can read it via headers() and attach
  // it to inline scripts. Next.js auto-applies the nonce to scripts it
  // injects (Vercel Analytics, etc.) when the CSP header carries a nonce.
  const nonce = generateNonce();
  const csp = buildCsp(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  // Admin gate. Lock the admin out entirely if the password isn't
  // configured — better than letting traffic through an unconfigured gate.
  if (pathname.startsWith("/admin")) {
    if (!process.env.ADMIN_PASSWORD) {
      return new NextResponse("Admin not configured.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!(await verifySession(session))) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      const redirect = NextResponse.redirect(loginUrl);
      redirect.headers.set("Content-Security-Policy", csp);
      return redirect;
    }
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // Run on every page request so CSP applies site-wide. Skip:
  //   - /api/*               (JSON/binary, CSP not meaningful)
  //   - /_next/static, /_next/image  (framework assets)
  //   - common static files at the root (favicon, robots, sitemap)
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image).*)",
  ],
};
