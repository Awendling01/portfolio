import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";
import { isLikelyBot } from "@/lib/bot";

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

  const db = getDb();

  const [row] = await db
    .insert(schema.views)
    .values({ slug, count: 1 })
    .onConflictDoUpdate({
      target: schema.views.slug,
      set: { count: sql`${schema.views.count} + 1` },
    })
    .returning({ count: schema.views.count });

  // Best-effort visit logging — never block the view counter on a failure here.
  try {
    await db.insert(schema.visits).values({
      slug,
      path,
      referrer,
      userAgent,
      country,
      region,
      city,
      isBot: isLikelyBot(userAgent),
    });
  } catch (err) {
    console.error("views: visit insert failed", err);
  }

  return NextResponse.json({ count: row?.count ?? 0, persisted: true });
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
