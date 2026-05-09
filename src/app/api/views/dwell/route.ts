import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq, sql } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";
import {
  VISITOR_COOKIE_NAME,
  isValidVisitorId,
} from "@/lib/visitor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_DWELL_MS = 30 * 60 * 1000; // 30 minutes — anything more is junk

export async function POST(request: Request) {
  if (!hasDatabase) return NextResponse.json({ ok: false });

  // Authorization: only allow updating dwell time on visits that belong to
  // the calling browser's session. Without this check, anyone could PATCH
  // arbitrary visits by guessing sequential IDs.
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(VISITOR_COOKIE_NAME)?.value;
  if (!isValidVisitorId(sessionId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
    // The WHERE clause includes the session check — if the visit belongs
    // to a different browser, no row matches and nothing updates.
    await db
      .update(schema.visits)
      .set({
        dwellMs: sql`greatest(coalesce(${schema.visits.dwellMs}, 0), ${dwell})`,
      })
      .where(
        and(
          eq(schema.visits.id, id),
          eq(schema.visits.sessionId, sessionId!),
        ),
      );
  } catch (err) {
    console.error("views/dwell: update failed", err);
  }

  return NextResponse.json({ ok: true });
}
