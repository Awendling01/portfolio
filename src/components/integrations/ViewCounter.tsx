"use client";

import { useEffect, useState } from "react";

type Props = {
  slug: string;
  path?: string;
  className?: string;
};

const formatter = new Intl.NumberFormat("en-US");

export default function ViewCounter({ slug, path, className }: Props) {
  const [count, setCount] = useState<number | null>(null);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const referrer =
      typeof document !== "undefined" && document.referrer
        ? document.referrer
        : null;

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, path, referrer }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("bad response");
        const data: { count: number; persisted: boolean } = await res.json();
        if (cancelled) return;
        if (!data.persisted) {
          setAvailable(false);
          return;
        }
        setCount(data.count);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, path]);

  if (!available) return null;

  return (
    <span
      className={
        className ??
        "mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)]"
      }
      aria-live="polite"
    >
      {count === null ? "···" : formatter.format(count)} views
    </span>
  );
}
