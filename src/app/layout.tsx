import type { Metadata, Viewport } from "next";
import { Outfit, Fira_Code } from "next/font/google";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
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
  metadataBase: new URL("https://andrewwendling.dev"),
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
    url: "https://andrewwendling.dev",
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
        <Nav />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
