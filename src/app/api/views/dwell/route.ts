import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_DWELL_MS = 30 * 60 * 1000; // 30 minutes — anything more is junk

export async function POST(request: Request) {
  if (!hasDatabase) return NextResponse.json({ ok: false });

  let body: { id?: unknown; ms?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = Number(body.id);
  const ms = Number(body.ms);
  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    !Number.isFinite(ms) ||
    ms < 0 ||
    ms > MAX_DWELL_MS
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const dwell = Math.floor(ms);

  try {
    const db = getDb();
    // Take the larger of the existing value and the new one. Beacons can
    // arrive twice (visibilitychange + pagehide) and we want the longest.
    await db
      .update(schema.visits)
      .set({
        dwellMs: sql`greatest(coalesce(${schema.visits.dwellMs}, 0), ${dwell})`,
      })
      .where(sql`${schema.visits.id} = ${id}`);
  } catch (err) {
    console.error("views/dwell: update failed", err);
  }

  return NextResponse.json({ ok: true });
}
