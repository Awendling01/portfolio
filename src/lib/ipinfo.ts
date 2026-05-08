// IPinfo Lite client + cloud-ASN bot heuristic.
// Free tier: 50k lookups / month. We cache per-instance to avoid burning quota
// on path-scanning bots that hit the same IP across many pages.

export type IpEnrichment = {
  org: string | null;
  asn: string | null;
  asDomain: string | null;
  country: string | null;
  isCloudProvider: boolean;
};

type IpinfoLiteResponse = {
  ip?: string;
  asn?: string;
  as_name?: string;
  as_domain?: string;
  country_code?: string;
  country?: string;
};

// In-process cache. Vercel keeps the same instance warm for ~minutes between
// requests, so the same IP hammering /, /about, /work resolves to one lookup.
const cache = new Map<string, { value: IpEnrichment; expiresAt: number }>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 min
const CACHE_MAX = 1000;

// AS domains/keywords that mean "datacenter, not a residential or corporate
// office". These visits are virtually always automation — flag as bot.
const CLOUD_AS_DOMAINS = new Set([
  "amazon.com",
  "amazonaws.com",
  "google.com",
  "googleusercontent.com",
  "googlecloud.com",
  "microsoft.com",
  "azure.com",
  "digitalocean.com",
  "linode.com",
  "akamai.com",
  "akamaitechnologies.com",
  "ovh.com",
  "ovh.net",
  "hetzner.com",
  "hetzner.de",
  "scaleway.com",
  "vultr.com",
  "contabo.com",
  "leaseweb.com",
  "oracle.com",
  "alibabacloud.com",
  "tencent.com",
  "fastly.com",
  "cloudflare.com",
  "ibm.com",
  "github.com",
]);

const CLOUD_AS_NAME_PATTERNS = [
  /amazon/i,
  /google.*cloud/i,
  /\bgoogle llc\b/i,
  /microsoft.*azure/i,
  /\bazure\b/i,
  /digitalocean/i,
  /\blinode\b/i,
  /\bakamai\b/i,
  /\bovh\b/i,
  /hetzner/i,
  /scaleway/i,
  /\bvultr\b/i,
  /contabo/i,
  /leaseweb/i,
  /\boracle\b.*cloud/i,
  /alibaba.*cloud/i,
  /\btencent\b.*cloud/i,
  /\bfastly\b/i,
  /cloudflare/i,
  /\bcensys\b/i,
  /\bshodan\b/i,
  /\binternet measurement\b/i,
  /\binternet census\b/i,
];

function isCloudOrg(asName: string | null, asDomain: string | null): boolean {
  if (asDomain && CLOUD_AS_DOMAINS.has(asDomain.toLowerCase())) return true;
  if (asName) {
    return CLOUD_AS_NAME_PATTERNS.some((re) => re.test(asName));
  }
  return false;
}

function emptyResult(): IpEnrichment {
  return {
    org: null,
    asn: null,
    asDomain: null,
    country: null,
    isCloudProvider: false,
  };
}

export async function lookupIp(ip: string | null): Promise<IpEnrichment> {
  if (!ip) return emptyResult();

  const cached = cache.get(ip);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const token = process.env.IPINFO_TOKEN;
  if (!token) {
    // No token configured — gracefully skip enrichment. The visit still gets
    // logged with whatever Vercel headers gave us.
    return emptyResult();
  }

  try {
    // Aggressive timeout: this runs inline with the visit insert; we never
    // want to delay /api/views by more than ~1.5s.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(
      `https://api.ipinfo.io/lite/${encodeURIComponent(ip)}?token=${encodeURIComponent(token)}`,
      {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );
    clearTimeout(timer);

    if (!res.ok) return emptyResult();
    const data: IpinfoLiteResponse = await res.json();

    const asName = data.as_name ?? null;
    const asDomain = data.as_domain ?? null;

    const value: IpEnrichment = {
      org: asName,
      asn: data.asn ?? null,
      asDomain,
      country: data.country_code ?? null,
      isCloudProvider: isCloudOrg(asName, asDomain),
    };

    if (cache.size >= CACHE_MAX) {
      // Drop the oldest entry to keep the map bounded.
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }
    cache.set(ip, { value, expiresAt: Date.now() + CACHE_TTL_MS });

    return value;
  } catch {
    return emptyResult();
  }
}
