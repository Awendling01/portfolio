import type { Metadata, Viewport } from "next";
import { Outfit, Fira_Code } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
    default: "Andrew Wendling — Full-Stack Engineer + Sales Background",
    template: "%s | Andrew Wendling",
  },
  description:
    "Full-stack software engineer with 5+ years building SaaS platforms and 6+ years sales experience. Open to Developer, Solutions Engineer, and Customer Success Manager roles.",
  applicationName: "Andrew Wendling",
  authors: [{ name: "Andrew Wendling" }],
  creator: "Andrew Wendling",
  keywords: [
    "Andrew Wendling",
    "Full-Stack Developer",
    "Solutions Engineer",
    "Sales Engineer",
    "Customer Success Manager",
    "Laravel",
    "Next.js",
    "Vue",
    "React",
    "TypeScript",
    "Nashville",
    "Spanish Fort",
  ],
  openGraph: {
    title: "Andrew Wendling — Full-Stack Engineer + Sales Background",
    description:
      "Software engineer + sales leader. Building toward Solutions Engineering.",
    url: "https://andrewwendling.info",
    siteName: "Andrew Wendling",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrew Wendling",
    description:
      "Full-stack engineer + sales leader. Open to Developer, SE, and CSM roles.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Andrew Wendling",
              url: "https://andrewwendling.info",
              image: "https://andrewwendling.info/opengraph-image",
              jobTitle: "Full-Stack Software Engineer",
              description:
                "Full-stack engineer with 5+ years shipping production SaaS and 6+ years sales experience. Open to Developer, Solutions Engineer, Sales Engineer, and Customer Success Manager roles.",
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
                "Solutions Engineering",
                "Customer Success",
                "Sales Engineering",
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
