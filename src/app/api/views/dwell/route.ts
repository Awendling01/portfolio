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

// Per-session rate limit. Real browsers fire ~2-3 dwell beacons per page
// (visibilitychange, pagehide, unmount). Anything above DWELL_MAX_PER_WINDOW
// is either a buggy client or an attacker spamming sequential IDs.
const DWELL_WINDOW_MS = 60 * 1000;
const DWELL_MAX_PER_WINDOW = 30;
const dwellRate = new Map<string, { count: number; windowStart: number }>();

function checkDwellRate(sessionId: string): boolean {
  const now = Date.now();
  // Sweep expired entries first so the Map stays bounded on long-lived
  // containers. Cheap O(n) scan; n is at most the active session count
  // within the past minute.
  for (const [k, v] of dwellRate) {
    if (now - v.windowStart > DWELL_WINDOW_MS) dwellRate.delete(k);
  }
  const entry = dwellRate.get(sessionId);
  if (!entry) {
    dwellRate.set(sessionId, { count: 1, windowStart: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= DWELL_MAX_PER_WINDOW;
}

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

  // Rate-limit per visitor session before the DB write. Stops a malicious
  // client from spamming sequential `id` values to burn DB roundtrips.
  if (!checkDwellRate(sessionId!)) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(DWELL_WINDOW_MS / 1000)) },
      },
    );
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
