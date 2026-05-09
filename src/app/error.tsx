"use client";

import { useEffect } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface unexpected errors so they show up in Vercel logs / Sentry.
    console.error("app error boundary:", error);
  }, [error]);

  return (
    <section className="pt-36 pb-24 sm:pt-44 sm:pb-32 min-h-[60vh] grid place-items-center">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <p className="mono text-[11px] uppercase tracking-[0.22em] text-[var(--rose)]">
            Something broke
          </p>
          <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            That didn&apos;t go to plan.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[var(--text)] leading-relaxed">
            An unexpected error occurred while rendering this page. The issue
            has been logged. You can try again, or head back home.
          </p>
          {error.digest ? (
            <p className="mt-3 mono text-[10px] uppercase tracking-[0.18em] text-[var(--text)]">
              Reference: {error.digest}
            </p>
          ) : null}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium tracking-tight whitespace-nowrap transition-all duration-200 will-change-transform bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[#0b1224] hover:-translate-y-[1px]"
            >
              Try again
            </button>
            <Button href="/" variant="outline">
              ← Home
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
