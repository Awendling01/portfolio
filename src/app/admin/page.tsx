import Link from "next/link";
import { sql } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";

export const dynamic = "force-dynamic";

async function loadStats() {
  if (!hasDatabase) return null;
  const db = getDb();

  const [visitTotals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      humans: sql<number>`count(*) filter (where is_bot = false)::int`,
      bots: sql<number>`count(*) filter (where is_bot = true)::int`,
      last24h: sql<number>`count(*) filter (where created_at > now() - interval '24 hours' and is_bot = false)::int`,
      last7d: sql<number>`count(*) filter (where created_at > now() - interval '7 days' and is_bot = false)::int`,
    })
    .from(schema.visits);

  const [messageTotals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      last7d: sql<number>`count(*) filter (where created_at > now() - interval '7 days')::int`,
    })
    .from(schema.messages);

  return { visitTotals, messageTotals };
}

const card =
  "rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6";

export default async function AdminIndex() {
  const stats = await loadStats();

  if (!stats) {
    return (
      <div className={card}>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Database not configured
        </h1>
        <p className="mt-2 text-sm text-[var(--text)]">
          Set <code>DATABASE_URL</code> (or one of the
          <code> POSTGRES_*</code> equivalents) in Vercel to enable admin data.
        </p>
      </div>
    );
  }

  const { visitTotals, messageTotals } = stats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Overview
        </h1>
        <p className="mt-1 text-sm text-[var(--text)]">
          Live counts from Postgres. Updates on every page load.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Visits (last 24h)" value={visitTotals.last24h} accent="accent" />
        <Stat label="Visits (last 7d)" value={visitTotals.last7d} accent="accent2" />
        <Stat label="Bot pings" value={visitTotals.bots} accent="amber" />
        <Stat label="Messages (last 7d)" value={messageTotals.last7d} accent="green" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/visitors"
          className={`${card} hover:border-[var(--accent)]/60 transition-colors`}
        >
          <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
            Visitors
          </div>
          <div className="mt-3 text-3xl font-bold text-white tracking-tight">
            {visitTotals.humans.toLocaleString()}
          </div>
          <p className="mt-2 text-xs text-[var(--text)]">
            All-time human visits ({visitTotals.total.toLocaleString()} total
            including bots)
          </p>
          <div className="mt-4 mono text-xs text-[var(--text2)] group-hover:text-[var(--accent)]">
            Open table →
          </div>
        </Link>

        <Link
          href="/admin/messages"
          className={`${card} hover:border-[var(--accent)]/60 transition-colors`}
        >
          <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
            Messages
          </div>
          <div className="mt-3 text-3xl font-bold text-white tracking-tight">
            {messageTotals.total.toLocaleString()}
          </div>
          <p className="mt-2 text-xs text-[var(--text)]">
            All-time contact form submissions
          </p>
          <div className="mt-4 mono text-xs text-[var(--text2)]">
            Open table →
          </div>
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "accent" | "accent2" | "green" | "amber";
}) {
  const color = {
    accent: "text-[var(--accent)]",
    accent2: "text-[var(--accent2)]",
    green: "text-[var(--green)]",
    amber: "text-[var(--amber)]",
  }[accent];

  return (
    <div className={card}>
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text)]">
        {label}
      </div>
      <div className={`mt-2 text-3xl font-bold tracking-tight ${color}`}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}
