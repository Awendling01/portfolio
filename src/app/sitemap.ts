import type { MetadataRoute } from "next";

const SITE = "https://andrewwendling.info";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE}/`, lastModified: now, priority: 1.0 },
    { url: `${SITE}/work`, lastModified: now, priority: 0.9 },
    { url: `${SITE}/work/moniscope`, lastModified: now, priority: 0.85 },
    { url: `${SITE}/work/moniscope/ai-assistant`, lastModified: now, priority: 0.75 },
    { url: `${SITE}/work/moniscope/payments`, lastModified: now, priority: 0.75 },
    { url: `${SITE}/work/moniscope/automation`, lastModified: now, priority: 0.75 },
    { url: `${SITE}/work/moniscope/events`, lastModified: now, priority: 0.75 },
    { url: `${SITE}/work/moniscope/reporting`, lastModified: now, priority: 0.75 },
    { url: `${SITE}/work/shopify`, lastModified: now, priority: 0.85 },
    { url: `${SITE}/work/shopify/ai-pipeline`, lastModified: now, priority: 0.75 },
    { url: `${SITE}/work/shopify/prompt-engineering`, lastModified: now, priority: 0.75 },
    { url: `${SITE}/work/shopify/personalization`, lastModified: now, priority: 0.75 },
    { url: `${SITE}/work/futureshirts`, lastModified: now, priority: 0.85 },
    { url: `${SITE}/about`, lastModified: now, priority: 0.8 },
    { url: `${SITE}/uses`, lastModified: now, priority: 0.5 },
    { url: `${SITE}/contact`, lastModified: now, priority: 0.7 },
  ];
}
