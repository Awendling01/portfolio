import type { NextConfig } from "next";

// Static security headers applied to every response. The Content-Security-
// Policy header is intentionally NOT set here — it's built per-request in
// `src/proxy.ts` so it can carry a per-request nonce on script-src.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
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
      // OG images are meant to be embedded by third parties (Twitter,
      // LinkedIn, Slack, iMessage, link previewers). The default CORP value
      // above blocks cross-origin fetches; these overrides let share cards
      // actually render the image. Two routes today: the root OG and the
      // per-slug case-study OG. Add new patterns here whenever a new OG
      // image route lands.
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
      {
        // Case-study OG images at /work/moniscope/{slug}/opengraph-image-*.
        // Next emits a build-hash suffix on the served path, so match any
        // file under the slug whose name starts with "opengraph-image-".
        source: "/work/moniscope/:slug/:image(opengraph-image-[a-zA-Z0-9_-]+)",
        headers: [
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/work/kiosk/:slug/:image(opengraph-image-[a-zA-Z0-9_-]+)",
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
