import type { NextConfig } from "next";

// CSP allows exactly what this site loads:
// - Vercel Analytics + Speed Insights (va.vercel-scripts.com, vitals.vercel-insights.com)
// - Google Fonts via next/font (self-hosted by next/font, no runtime origins needed)
// 'unsafe-inline' on style-src is required for Tailwind/Next's hashed inline
// styles. 'unsafe-inline' on script-src covers Next's small bootstrap scripts;
// removing it would require nonce-based CSP.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://vercel.live",
  // Spotify album art (https://i.scdn.co) loaded by SpotifyNowPlaying when
  // the integration is configured. Wildcard covers other scdn.co subdomains
  // (mosaic.scdn.co, dailymix-images.scdn.co, etc.) Spotify rotates between.
  "img-src 'self' data: blob: https://*.scdn.co",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Cross-origin isolation (cheap defense-in-depth)
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // The OG image is meant to be embedded by third parties (Twitter,
      // LinkedIn, Slack, iMessage, link previewers). The default CORP value
      // above blocks cross-origin fetches; this override lets share cards
      // actually render the image.
      {
        source: "/opengraph-image",
        headers: [
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
