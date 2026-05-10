import type { ReactNode } from "react";
import Card from "@/components/ui/Card";

type Accent = "accent" | "accent2" | "green" | "amber";

type WhatIBringCard = {
  title: string;
  body: string;
  accent: Accent;
  icon: ReactNode;
};

const accentBadge: Record<Accent, string> = {
  accent: "bg-[var(--accent)]/10 text-[var(--accent)]",
  accent2: "bg-[var(--accent2)]/10 text-[var(--accent2)]",
  green: "bg-[var(--green)]/10 text-[var(--green)]",
  amber: "bg-[var(--amber)]/10 text-[var(--amber)]",
};

const cards: WhatIBringCard[] = [
  {
    title: "Ships production AI",
    body: "OpenAI image generation shipped at a real trade-show. Anthropic agents architected into a pre-launch self-storage SaaS. Not tutorial demos.",
    accent: "accent",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
  {
    title: "Multi-tenant SaaS architecture",
    body: "MONISCOPE: tenant isolation, RBAC, billing, a 9-stage delinquency state machine, Alabama lien law. Not CRUD.",
    accent: "accent2",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m4.5-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
        />
      </svg>
    ),
  },
  {
    title: "Most devs can't sell. Most salespeople can't code.",
    body: "Top 3% nationally at AT&T, top 5% district at T-Mobile, 2 stores at uBreakiFix — the whole career before engineering. The metrics are real and so is the test suite.",
    accent: "green",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
        />
      </svg>
    ),
  },
  {
    title: "Customer-facing native",
    body: "Already comfortable in customer and exec rooms. Most engineers learn this on the job. I started there.",
    accent: "amber",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
        />
      </svg>
    ),
  },
];

export default function WhatIBring() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
      {cards.map((c) => (
        <Card
          key={c.title}
          hover={false}
          padding="compact"
          className="h-full flex flex-col"
        >
          <div
            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4 ${accentBadge[c.accent]}`}
          >
            {c.icon}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight lg:min-h-[7.5rem]">
            {c.title}
          </h3>
          <p className="mt-4 text-sm text-[var(--text)] leading-relaxed lg:min-h-[8.75rem]">
            {c.body}
          </p>
        </Card>
      ))}
    </div>
  );
}
