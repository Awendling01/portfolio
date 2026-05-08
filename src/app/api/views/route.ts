import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";
import { isLikelyBot } from "@/lib/bot";
import {
  VISITOR_COOKIE_NAME,
  VISITOR_COOKIE_MAX_AGE_SECONDS,
  getClientIp,
  hashIp,
  isValidVisitorId,
  newVisitorId,
} from "@/lib/visitor";
import { lookupIp } from "@/lib/ipinfo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const slugPattern = /^[a-z0-9/-]{1,64}$/i;

function clip(value: string | null | undefined, max: number): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

export async function POST(request: Request) {
  if (!hasDatabase) {
    return NextResponse.json({ count: 0, persisted: false });
  }

  let body: { slug?: unknown; path?: unknown; referrer?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug : "";
  if (!slug || !slugPattern.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const path = clip(typeof body.path === "string" ? body.path : null, 256);
  const referrer = clip(
    typeof body.referrer === "string" ? body.referrer : null,
    512,
  );
  const userAgent = clip(request.headers.get("user-agent"), 512);
  const country = clip(request.headers.get("x-vercel-ip-country"), 8);
  const region = clip(request.headers.get("x-vercel-ip-country-region"), 16);
  const city = (() => {
    const raw = request.headers.get("x-vercel-ip-city");
    if (!raw) return null;
    try {
      return clip(decodeURIComponent(raw), 128);
    } catch {
      return clip(raw, 128);
    }
  })();

  // Visitor session cookie — anonymous UUID, persisted ~90 days, lets us group
  // page views from the same browser even when their IP shifts.
  const cookieStore = await cookies();
  const existingId = cookieStore.get(VISITOR_COOKIE_NAME)?.value;
  const sessionId = isValidVisitorId(existingId) ? existingId! : newVisitorId();
  const isNewSession = sessionId !== existingId;

  // IP enrichment — hashed IP for grouping, ASN/org name for "is this a
  // recruiter from a known company?" signal.
  const clientIp = getClientIp(request.headers);
  const ipHash = hashIp(clientIp);
  const enrichment = await lookupIp(clientIp);

  const uaBot = isLikelyBot(userAgent);
  const isBot = uaBot || enrichment.isCloudProvider;

  const db = getDb();

  const [row] = await db
    .insert(schema.views)
    .values({ slug, count: 1 })
    .onConflictDoUpdate({
      target: schema.views.slug,
      set: { count: sql`${schema.views.count} + 1` },
    })
    .returning({ count: schema.views.count });

  // Best-effort visit logging — never block the view counter on a failure.
  let visitId: number | null = null;
  try {
    const [visitRow] = await db
      .insert(schema.visits)
      .values({
        slug,
        path,
        referrer,
        userAgent,
        country: enrichment.country ?? country,
        region,
        city,
        sessionId,
        ipHash,
        org: enrichment.org,
        asn: enrichment.asn,
        asDomain: enrichment.asDomain,
        isBot,
      })
      .returning({ id: schema.visits.id });
    visitId = visitRow?.id ?? null;
  } catch (err) {
    console.error("views: visit insert failed", err);
  }

  const response = NextResponse.json({
    count: row?.count ?? 0,
    persisted: true,
    visitId,
  });

  if (isNewSession || existingId !== sessionId) {
    response.cookies.set(VISITOR_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: VISITOR_COOKIE_MAX_AGE_SECONDS,
    });
  }

  return response;
}

export async function GET(request: Request) {
  if (!hasDatabase) {
    return NextResponse.json({ count: 0, persisted: false });
  }
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "";
  if (!slug || !slugPattern.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const db = getDb();
  const rows = await db
    .select({ count: schema.views.count })
    .from(schema.views)
    .where(sql`${schema.views.slug} = ${slug}`);

  return NextResponse.json({ count: rows[0]?.count ?? 0, persisted: true });
}
