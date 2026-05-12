import type { Metadata, Viewport } from "next";
import { Outfit, Fira_Code } from "next/font/google";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://andrewwendling.info"),
  title: {
    default: "Andrew Wendling — Full-Stack Engineer with Top-3% Sales Background",
    template: "%s | Andrew Wendling",
  },
  description:
    "Full-stack engineer with 5+ years shipping production SaaS — Laravel, Next.js, multi-tenant architecture, integrations against Shopify, Stripe, Twilio, Klaviyo, Recharge, Plaid, EZPost, and Google Business Profile. Top-3% national sales background. Open to Solutions Engineer, Implementation Engineer, and Developer Relations roles.",
  applicationName: "Andrew Wendling",
  authors: [{ name: "Andrew Wendling" }],
  creator: "Andrew Wendling",
  keywords: [
    "Andrew Wendling",
    "Full-Stack Developer",
    "Solutions Engineer",
    "Implementation Engineer",
    "Developer Relations",
    "Laravel",
    "Next.js",
    "Vue",
    "React",
    "TypeScript",
    "Shopify",
    "Stripe",
    "Twilio",
    "Klaviyo",
    "Spanish Fort",
  ],
  openGraph: {
    title: "Andrew Wendling — Full-Stack Engineer with Top-3% Sales Background",
    description:
      "5+ years shipping production SaaS — Laravel, Next.js, multi-tenant SaaS, AI integrations. Built against Shopify, Stripe, Twilio, Klaviyo, Recharge, Plaid, EZPost, Google Business Profile. Top-3% national sales background. Open to SE / IE / DevRel.",
    url: "https://andrewwendling.info",
    siteName: "Andrew Wendling",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrew Wendling — Full-Stack Engineer with Top-3% Sales Background",
    description:
      "5+ years shipping production SaaS — Laravel, Next.js, multi-tenant SaaS, AI integrations. Built against Shopify, Stripe, Twilio, Klaviyo, Recharge, Plaid, EZPost, Google Business Profile. Top-3% national sales background. Open to SE / IE / DevRel.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: "n-zkP_WEZIk9xpNxWclBmrLUHFLRWiQNzDM7afm000A",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Per-request CSP nonce set by the proxy. Inline scripts must carry it,
  // otherwise the strict CSP blocks them.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text2 relative overflow-x-hidden">
        <div className="noise" aria-hidden="true" />
        <div className="glow glow-accent" aria-hidden="true" />
        <div className="glow glow-accent2" aria-hidden="true" />
        {/* JSON-LD Person schema. Helps Google build a Knowledge Panel for
            "Andrew Wendling" and signals identity to AI search tools. */}
        <script
          nonce={nonce}
          // The browser strips `nonce` from the DOM once CSP has applied,
          // so React hydration sees nonce="" and complains. The mismatch is
          // cosmetic — the real nonce was applied at parse time. Suppress.
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Andrew Wendling",
              url: "https://andrewwendling.info",
              image: "https://andrewwendling.info/headshot.jpg",
              jobTitle: "Full-Stack Software Engineer",
              description:
                "Full-stack engineer with 5+ years shipping production SaaS — built integrations against Shopify, Stripe, Twilio, Klaviyo, Recharge, Plaid, EZPost, and Google Business Profile. Top-3% national sales background. Open to Solutions Engineer, Implementation Engineer, and Developer Relations roles.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Spanish Fort",
                addressRegion: "AL",
                addressCountry: "US",
              },
              sameAs: [
                "https://linkedin.com/in/awendling01",
                "https://github.com/Awendling01",
              ],
              knowsAbout: [
                "Full-Stack Development",
                "Laravel",
                "Next.js",
                "TypeScript",
                "React",
                "Vue",
                "Multi-Tenant SaaS",
                "Shopify Integrations",
                "Stripe Integrations",
                "Twilio SMS",
                "Klaviyo Automation",
                "Recharge Subscriptions",
                "Solutions Engineering",
                "Implementation Engineering",
                "Developer Relations",
              ],
            }),
          }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
