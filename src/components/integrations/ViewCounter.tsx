"use client";

import { useEffect, useState } from "react";

type Props = {
  slug: string;
  path?: string;
  className?: string;
};

const formatter = new Intl.NumberFormat("en-US");

function sendDwell(visitId: number, ms: number) {
  if (!visitId || ms <= 0) return;
  const payload = JSON.stringify({ id: visitId, ms });
  // sendBeacon is the right tool here: fires reliably on pagehide / tab close,
  // unlike fetch() which the browser may cancel during unload.
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon("/api/views/dwell", blob);
    return;
  }
  fetch("/api/views/dwell", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

export default function ViewCounter({ slug, path, className }: Props) {
  const [count, setCount] = useState<number | null>(null);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const startedAt = performance.now();
    let visitId: number | null = null;
    let lastSentMs = 0;

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
        const data: {
          count: number;
          persisted: boolean;
          visitId?: number | null;
        } = await res.json();
        if (cancelled) return;
        if (!data.persisted) {
          setAvailable(false);
          return;
        }
        if (typeof data.visitId === "number") {
          visitId = data.visitId;
        }
        setCount(data.count);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });

    const flushDwell = () => {
      if (visitId === null) return;
      const ms = Math.round(performance.now() - startedAt);
      // Skip duplicate beacons within ~1s of each other.
      if (ms - lastSentMs < 1000) return;
      lastSentMs = ms;
      sendDwell(visitId, ms);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushDwell();
    };
    const onPageHide = () => flushDwell();

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      // Final flush on unmount (e.g. SPA navigation between pages).
      flushDwell();
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
