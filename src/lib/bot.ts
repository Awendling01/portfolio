// Best-effort bot detection from a User-Agent string.
// Catches the common stuff: search engines, link previewers, scrapers,
// headless browsers, and Vercel's own screenshot/crawl tools.
// False negatives are fine — bots that don't run JS never hit our view
// counter in the first place, so this is a second filter, not the only one.

const BOT_PATTERNS = [
  // Generic
  /\bbot\b/,
  /\bcrawler\b/,
  /\bspider\b/,
  /\bslurp\b/,
  /\bscrape/,
  /\bfetch\b/,
  /\bcurl\b/,
  /\bwget\b/,
  /\bnode-fetch\b/,
  /\baxios\b/,
  // Search / web indexing
  /googlebot/,
  /bingbot/,
  /baiduspider/,
  /yandex/,
  /duckduckbot/,
  /sogou/,
  /applebot/,
  /mediapartners-google/,
  /adsbot-google/,
  // Link preview / social
  /facebookexternalhit/,
  /facebot/,
  /twitterbot/,
  /linkedinbot/,
  /slackbot/,
  /discordbot/,
  /telegrambot/,
  /whatsapp/,
  /redditbot/,
  /pinterest/,
  /skypeuripreview/,
  /embedly/,
  // Headless / automation
  /headlesschrome/,
  /phantomjs/,
  /puppeteer/,
  /playwright/,
  /selenium/,
  /chrome-lighthouse/,
  /lighthouse/,
  /pagespeed/,
  // Performance / SEO scanners
  /ahrefsbot/,
  /semrushbot/,
  /mj12bot/,
  /dotbot/,
  /screaming frog/,
  /gtmetrix/,
  /pingdom/,
  /uptime/,
  // Vercel / monitoring
  /vercel-screenshot/,
  /vercelbot/,
  // Misc
  /python-requests/,
  /go-http-client/,
  /java\//,
];

export function isLikelyBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true; // missing UA is suspicious
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some((re) => re.test(ua));
}
