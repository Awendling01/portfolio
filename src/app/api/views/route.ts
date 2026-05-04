import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const slugPattern = /^[a-z0-9/-]{1,64}$/i;

export async function POST(request: Request) {
  if (!hasDatabase) {
    return NextResponse.json({ count: 0, persisted: false });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug =
    body && typeof body === "object" && "slug" in body
      ? String((body as { slug: unknown }).slug)
      : "";

  if (!slug || !slugPattern.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const db = getDb();
  const [row] = await db
    .insert(schema.views)
    .values({ slug, count: 1 })
    .onConflictDoUpdate({
      target: schema.views.slug,
      set: { count: sql`${schema.views.count} + 1` },
    })
    .returning({ count: schema.views.count });

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
