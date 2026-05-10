// Case-study data is per-file (one TypeScript module per case study) so each
// is editable in isolation. All MONISCOPE source content baked here as
// string literals — the public repo never reads from a case-studies/
// folder, so private source can't accidentally leak into a deploy.
//
// Two project sets are wired today: MONISCOPE (5 deep dives) and the
// off-roading e-commerce kiosk engagement (2 deep dives — client name
// withheld under standard confidentiality). The shape is the same; the
// per-project export below keeps lookups type-safe.

import type { ReactNode } from "react";
import { aiAssistant } from "./moniscope-ai-assistant";
import { payments } from "./moniscope-payments";
import { automation } from "./moniscope-automation";
import { events } from "./moniscope-events";
import { reporting } from "./moniscope-reporting";
import { kioskAiPipeline } from "./kiosk-ai-pipeline";
import { kioskPromptEngineering } from "./kiosk-prompt-engineering";

export type CodeSnippet = {
  filename: string;
  lang: "php" | "ts";
  stepLabel: string;
  stepHeading: string;
  stepBlurb: string;
  code: string;
};

export type WhyTile = {
  number: number;
  title: string;
  body: string;
  ref: string;
};

export type WhereItShowsUp =
  | { kind: "table"; intro: string; columns: string[]; rows: string[][] }
  | {
      kind: "answer-types";
      intro: string;
      types: {
        ic: string;
        iconColor: "green" | "accent2" | "rose" | "accent" | "amber";
        name: string;
        desc: string;
      }[];
    }
  | {
      kind: "stats";
      entries: {
        value: string;
        label: string;
        color: "accent" | "accent2" | "green" | "amber";
      }[];
    }
  | { kind: "report-grid"; entries: { name: string; desc: string }[] }
  | { kind: "rule-example"; example: string };

export type CaseStudy = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  oneLiner: string;
  lede: string;
  pullQuote?: string;
  prelaunchNote: string;
  whereSection: { tag: string; heading: string };
  whereItShowsUp: WhereItShowsUp;
  whySection: { tag: string; heading: string };
  whyTiles: WhyTile[];
  architectureSection: { tag: string; heading: string };
  /** JSX tree composed from `@/components/case-study/diagram` primitives. */
  architectureDiagram: ReactNode;
  snippetsSection: { tag: string; heading: string; intro: string };
  snippets: CodeSnippet[];
  sourceFooter: string;
};

// ── MONISCOPE ──────────────────────────────────────────────────────────────

export const moniscopeCaseStudyOrder = [
  "ai-assistant",
  "payments",
  "automation",
  "events",
  "reporting",
] as const;

export type MoniscopeCaseStudySlug = (typeof moniscopeCaseStudyOrder)[number];

export const moniscopeCaseStudies: Record<MoniscopeCaseStudySlug, CaseStudy> = {
  "ai-assistant": aiAssistant,
  payments,
  automation,
  events,
  reporting,
};

export function getMoniscopeCaseStudy(slug: string): CaseStudy | null {
  if ((moniscopeCaseStudyOrder as readonly string[]).includes(slug)) {
    return moniscopeCaseStudies[slug as MoniscopeCaseStudySlug];
  }
  return null;
}

export function getAdjacentCaseStudies(slug: MoniscopeCaseStudySlug): {
  prev: CaseStudy | null;
  next: CaseStudy | null;
} {
  const idx = moniscopeCaseStudyOrder.indexOf(slug);
  return {
    prev: idx > 0 ? moniscopeCaseStudies[moniscopeCaseStudyOrder[idx - 1]] : null,
    next:
      idx >= 0 && idx < moniscopeCaseStudyOrder.length - 1
        ? moniscopeCaseStudies[moniscopeCaseStudyOrder[idx + 1]]
        : null,
  };
}

// ── Kiosk (off-roading e-commerce client) ────────────────────────────────

export const kioskCaseStudyOrder = [
  "ai-pipeline",
  "prompt-engineering",
] as const;

export type KioskCaseStudySlug = (typeof kioskCaseStudyOrder)[number];

export const kioskCaseStudies: Record<KioskCaseStudySlug, CaseStudy> = {
  "ai-pipeline": kioskAiPipeline,
  "prompt-engineering": kioskPromptEngineering,
};

export function getKioskCaseStudy(slug: string): CaseStudy | null {
  if ((kioskCaseStudyOrder as readonly string[]).includes(slug)) {
    return kioskCaseStudies[slug as KioskCaseStudySlug];
  }
  return null;
}

export function getAdjacentKioskCaseStudies(slug: KioskCaseStudySlug): {
  prev: CaseStudy | null;
  next: CaseStudy | null;
} {
  const idx = kioskCaseStudyOrder.indexOf(slug);
  return {
    prev: idx > 0 ? kioskCaseStudies[kioskCaseStudyOrder[idx - 1]] : null,
    next:
      idx >= 0 && idx < kioskCaseStudyOrder.length - 1
        ? kioskCaseStudies[kioskCaseStudyOrder[idx + 1]]
        : null,
  };
}
