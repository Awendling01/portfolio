"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  has: string;
  does: string;
  how: string;
};

// Hover-on-desktop + click-to-pin tooltip. Click outside or press Escape
// to close a pinned tooltip. Used in <Stat> on admin pages.
export default function InfoTooltip({ has, does, how }: Props) {
  const [pinned, setPinned] = useState(false);
  const [hovering, setHovering] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinned) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setPinned(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPinned(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [pinned]);

  const open = pinned || hovering;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setPinned((p) => !p)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        aria-label="What is this metric?"
        aria-expanded={open}
        className="flex items-center justify-center w-4 h-4 rounded-full border border-[var(--border)] text-[9px] font-bold leading-none text-[var(--text)] hover:text-white hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 transition-colors"
      >
        i
      </button>
      {open ? (
        <div
          role="tooltip"
          className="absolute z-50 right-0 top-6 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] text-left"
        >
          <Section title="Has" body={has} />
          <Section title="Does" body={does} />
          <Section title="How it works" body={how} last />
        </div>
      ) : null}
    </div>
  );
}

function Section({
  title,
  body,
  last,
}: {
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-3"}>
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--text)] mb-1">
        {title}
      </div>
      <p className="text-xs text-[var(--text2)] leading-relaxed">{body}</p>
    </div>
  );
}
