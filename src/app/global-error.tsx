"use client";

import { useEffect } from "react";

// Last-resort fallback when even the root layout has crashed. This file
// REPLACES the root layout, so it has to render <html> and <body> itself.
// Keep it dependency-free — no imports of components that touch globals.css
// (which itself may be the cause of the crash).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("global error boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0a0e1a",
          color: "#cbd5e1",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 560, textAlign: "center" }}>
          <p
            style={{
              fontFamily: "ui-monospace, Menlo, Consolas, monospace",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#fb7185",
              margin: 0,
            }}
          >
            Application error
          </p>
          <h1
            style={{
              marginTop: 20,
              fontSize: "2.25rem",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.025em",
            }}
          >
            The site couldn&apos;t render.
          </h1>
          <p style={{ marginTop: 20, lineHeight: 1.6 }}>
            A serious error stopped the page from loading. Reloading usually
            fixes it. The error has been logged.
          </p>
          {error.digest ? (
            <p
              style={{
                marginTop: 12,
                fontFamily: "ui-monospace, Menlo, Consolas, monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#94a3b8",
              }}
            >
              Reference: {error.digest}
            </p>
          ) : null}
          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                background: "linear-gradient(to right, #38bdf8, #818cf8)",
                color: "#0b1224",
                border: 0,
                padding: "0.625rem 1.25rem",
                borderRadius: 9999,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* Raw <a> intentional: next/link soft-navigation relies on the
                same rendering pipeline that just crashed. A hard navigation
                forces a full reload, which is exactly what a recovery page
                needs. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                border: "1px solid #334155",
                color: "#cbd5e1",
                padding: "0.625rem 1.25rem",
                borderRadius: 9999,
                textDecoration: "none",
              }}
            >
              ← Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
