import type { CaseStudy } from "./index";
import {
  Diagram,
  DiagramBox,
  DiagramArrow,
  DiagramStep,
  DiagramCode,
} from "@/components/case-study/diagram";

export const kioskPromptEngineering: CaseStudy = {
  slug: "prompt-engineering",
  number: "02",
  title: "Eight prompt strategies for an 11.68:1 aspect ratio",
  shortTitle: "Prompt Engineering",
  oneLiner:
    "Image models trained on 1:1 / 16:9 data don't have a useful prior for 11.68:1. The prompt has to do composition work the model wasn't trained for — so I built a switchable harness with eight strategies and shipped the one with the most stacked constraints.",
  lede:
    "An A/B testing harness wired into the kiosk admin: same scene description × 8 prompt approaches × 3 expanded variants = 24 candidate images per test. Each approach attacks the same problem from a different angle (panoramic mural, drone overhead, letterbox, tilt-shift, mini-figures, etc.). Approach 8 — the production winner — stacks vague language, explicit numerics, and complete-bodies framing into one prompt. A separate gpt-4o-mini layer expands user input into 3 variants under a strict word-preservation rule.",
  pullQuote:
    "Without strict word preservation, gpt-4o-mini \"improves\" user input by softening it (\"neon green\" → \"bright green\") and that drift cascades into the image model. Every adjective the user types has to survive verbatim into the image prompt. The rule is enforced in the prompt itself plus structural validation.",
  prelaunchNote:
    "Eight strategies still ship as a switchable feature for ongoing iteration; Approach 8 is the production default. Scene-style and identity-preservation are reusable constants so improvements propagate across all eight.",
  whereSection: {
    tag: "The harness",
    heading: "Eight strategies, one switchable parameter",
  },
  whereItShowsUp: {
    kind: "table",
    intro:
      "The kiosk admin's `?promptApproach=N` URL parameter selects which strategy generates the prompt. Same scene description, same expansion, eight different composition philosophies. Approach 8 won because it stacks three independent constraints in one prompt.",
    columns: ["#", "Strategy", "Mental model"],
    rows: [
      ["1", "Control (no constraints)", "Baseline — naive prompt for diffing against"],
      ["2", "EWS + numeric crop band", "\"Subjects in middle distance, vertically centered\""],
      ["3", "Panoramic mural / Bayeux Tapestry", "Frame the AI as painting a horizontal frieze"],
      ["4", "High-overhead drone (45°)", "Ground plane fills 80%, subjects shrink naturally"],
      ["5", "Letterbox display", "Tell model the format is letterboxed; content lives in the band"],
      ["6", "Tilt-shift diorama", "\"Detailed miniature… razor sharp across horizontal center\""],
      ["7", "Mini — small distant figures", "Pure size language — \"hundreds of yards away\""],
      ["8 ✓", "Combined (production winner)", "Mini's size words + grouping + explicit 43%–57% band"],
    ],
  },
  whySection: {
    tag: "The engineering \"why\"",
    heading: "Six things that make this real prompt engineering",
  },
  whyTiles: [
    {
      number: 1,
      title: "Switchable harness, not opinion",
      body: "Eight strategies hidden behind a single `promptApproach` parameter. Same scene × 8 × 3 expansions = 24 candidates per test. Selected the production strategy from real comparison data, not from guesses about what \"should\" work for an ultra-wide aspect.",
      ref: "snippet 01",
    },
    {
      number: 2,
      title: "Stacked constraints beat any single technique",
      body: "Approach 8 wins because it layers three independent biases: vague language (\"tiny and distant, hundreds of yards away\") to bias the latent space, explicit numerics (\"between 43 percent and 57 percent of image height\") to anchor placement, and complete-bodies language to keep the group cohesive.",
      ref: "snippet 01",
    },
    {
      number: 3,
      title: "Reusable constants — improvements propagate",
      body: "SCENE_STYLE locks aesthetic across all 8 (\"professional airbrush-style illustration… not photographic, not cartoon, not anime\"). IDENTITY_PRESERVATION lists what must survive (faces, hairstyles, markings, body proportions). NEGATIVE_TAIL is the negative-prompt guardrail.",
      ref: "snippet 02",
    },
    {
      number: 4,
      title: "Word-preservation rule on the expansion model",
      body: "gpt-4o-mini sits in front of the image generator and expands one user line into 3 variants. Without an explicit rule, the model softens user intent (\"neon green\" → \"bright green\"). The system prompt is load-bearing: \"copy their exact adjectives word-for-word.\"",
      ref: "snippet 03",
    },
    {
      number: 5,
      title: "Structured-output validation, not vibes",
      body: "Expansion returns JSON with exactly 3 `{ title, description }` objects. Zod-style runtime validation rejects malformed responses; user can fall back to their raw description after 3 failed expansions. The model has one job and is held to it.",
      ref: "snippet 03",
    },
    {
      number: 6,
      title: "\"Intended use\" sentence in the negative-prompt tail",
      body: "Every approach ends with: \"…intended use: a custom printed display product — high-impact ultra-wide panoramic display.\" Surprisingly nudges the model toward more dramatic, display-aware compositions. Cheap to include, measurable lift across all 8.",
      ref: "snippet 02",
    },
  ],
  architectureSection: {
    tag: "Architecture",
    heading: "Two-stage prompt pipeline",
  },
  architectureDiagram: (
    <Diagram>
      <DiagramBox label="Customer input" tone="neutral">
        <em>e.g.</em> &ldquo;upside down pineapples on fire on a beach&rdquo;
      </DiagramBox>

      <DiagramArrow />

      <DiagramBox
        label="POST /api/expand-prompt · gpt-4o-mini"
        tone="accent"
      >
        <DiagramStep>
          System prompt:{" "}
          <span className="text-white font-semibold">
            PRESERVE EVERY WORD
          </span>{" "}
          — every adjective the customer used must survive verbatim
        </DiagramStep>
        <DiagramStep>
          returns <DiagramCode>3 × {`{ title, description }`}</DiagramCode>
        </DiagramStep>
        <DiagramStep>
          Zod validates shape · retry up to 3× · after 3 failures the user
          can bypass with their raw description
        </DiagramStep>
      </DiagramBox>

      <DiagramArrow label="customer picks one of 3 variants" />

      <DiagramBox
        label="buildPrompt(variant, promptApproach)"
        tone="accent2"
      >
        <DiagramStep>
          <DiagramCode>APPROACHES[1..8]</DiagramCode> · switchable via{" "}
          <DiagramCode>?promptApproach=N</DiagramCode>
        </DiagramStep>
        <div className="pl-3 mt-1 grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-0.5 text-[11.5px] text-[var(--text)]">
          <span>1 control</span>
          <span>2 EWS + numerics</span>
          <span>3 panoramic mural</span>
          <span>4 drone overhead</span>
          <span>5 letterbox</span>
          <span>6 tilt-shift diorama</span>
          <span>7 mini / distant</span>
          <span className="text-[var(--accent)]">
            8 combined ✓ (winner)
          </span>
        </div>
        <div className="pl-3 mt-2 text-[var(--text)]">
          each composes:{" "}
          <DiagramCode>SCENE_STYLE</DiagramCode> +{" "}
          <DiagramCode>IDENTITY_PRESERVATION</DiagramCode> +
          approach-specific composition +{" "}
          <DiagramCode>NEGATIVE_TAIL</DiagramCode>
        </div>
      </DiagramBox>

      <DiagramArrow />

      <DiagramBox label="POST /api/generate-image" tone="green">
        gpt-image-1.5 → variance scoring → smart crop
      </DiagramBox>
    </Diagram>
  ),
  snippetsSection: {
    tag: "The Code · how it flows",
    heading: "Three snippets, in execution order",
    intro:
      "Real excerpts from `app/api/generate-image/route.ts` (the 8 approaches), `lib/promptConstants.ts` (the reusable constants), and `app/api/expand-prompt/route.ts` (the word-preservation expansion). Reading order: catalog the strategies → see the shared building blocks → see the rule that protects user intent.",
  },
  snippets: [
    {
      filename: "app/api/generate-image/route.ts · APPROACHES[1..8]",
      lang: "ts",
      stepLabel: "Step 1 · The catalog",
      stepHeading: "Eight strategies under one switchable parameter",
      stepBlurb:
        "Each approach is a function that composes the four shared blocks (SCENE_STYLE, IDENTITY_PRESERVATION, approach-specific composition, NEGATIVE_TAIL) into a single image-model prompt. A `?promptApproach=N` URL parameter selects which one runs. Approach 8 — the production winner — stacks three independent biases in one prompt; that's the source of its lift over single-technique approaches.",
      code: `// app/api/generate-image/route.ts
import { SCENE_STYLE, IDENTITY_PRESERVATION, NEGATIVE_TAIL } from "@/lib/promptConstants";

type ApproachId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const APPROACHES: Record<ApproachId, (subject: string, scene: string) => string> = {
  // 1 — Control. Naive prompt; baseline for diffing against.
  1: (subject, scene) =>
    \`\${subject} in \${scene}. \${SCENE_STYLE} \${IDENTITY_PRESERVATION} \${NEGATIVE_TAIL}\`,

  // 2 — EWS + numeric crop constraint. "Establishing wide shot, vertically centered."
  2: (subject, scene) =>
    \`Establishing wide shot of \${subject} in \${scene}. Subjects positioned in the middle
     distance, vertically centered. \${SCENE_STYLE} \${IDENTITY_PRESERVATION} \${NEGATIVE_TAIL}\`,

  // 3 — Panoramic mural / Bayeux Tapestry. Reframes the model's task as "paint a frieze."
  3: (subject, scene) =>
    \`A panoramic horizontal mural in the style of a Bayeux Tapestry register: \${subject}
     within \${scene}, rendered as a continuous narrative band across the frame.
     \${SCENE_STYLE} \${IDENTITY_PRESERVATION} \${NEGATIVE_TAIL}\`,

  // 4 — High-overhead drone (45°). Ground plane fills 80%, subjects shrink naturally.
  4: (subject, scene) =>
    \`High-overhead drone view (45-degree angle) of \${subject} in \${scene}. Ground plane
     fills approximately 80 percent of the frame; subjects appear small from this elevation.
     \${SCENE_STYLE} \${IDENTITY_PRESERVATION} \${NEGATIVE_TAIL}\`,

  // 5 — Letterbox display. "Format is letterboxed and content lives in the band."
  5: (subject, scene) =>
    \`A letterbox display showing \${subject} in \${scene}. The format is letterboxed and all
     subject content lives within the central horizontal band. \${SCENE_STYLE}
     \${IDENTITY_PRESERVATION} \${NEGATIVE_TAIL}\`,

  // 6 — Tilt-shift diorama. Miniature world, razor sharp across the horizontal center.
  6: (subject, scene) =>
    \`A detailed miniature tilt-shift diorama: \${subject} arranged within \${scene}, razor
     sharp across the horizontal center, soft falloff above and below. \${SCENE_STYLE}
     \${IDENTITY_PRESERVATION} \${NEGATIVE_TAIL}\`,

  // 7 — Mini / distant figures. Pure size language: "hundreds of yards away."
  7: (subject, scene) =>
    \`\${subject} appearing tiny and distant within \${scene}, like seeing them from hundreds
     of yards away. \${SCENE_STYLE} \${IDENTITY_PRESERVATION} \${NEGATIVE_TAIL}\`,

  // 8 — PRODUCTION WINNER. Stacks three independent biases:
  //   - vague size language ("tiny and distant, hundreds of yards away")
  //   - explicit numeric crop constraint ("43%–57% of image height")
  //   - complete-bodies-grouping language (head to feet, all together at center)
  8: (subject, scene) =>
    \`Everything from the reference photo appears tiny and distant, far away in the
     landscape, like seeing it from hundreds of yards away. \${subject} are all close
     beside each other at the center of the frame, complete head to feet, roof to tires.
     All important content fits between 43 percent and 57 percent of the image height.
     The scene is \${scene}. \${SCENE_STYLE} \${IDENTITY_PRESERVATION} \${NEGATIVE_TAIL}\`,
};

export function buildPrompt(
  variant: { subject: string; scene: string },
  approach: ApproachId = 8,
): string {
  return APPROACHES[approach](variant.subject, variant.scene)
    .replace(/\\s+/g, " ")
    .trim();
}`,
    },
    {
      filename: "lib/promptConstants.ts · shared building blocks",
      lang: "ts",
      stepLabel: "Step 2 · The reusable constants",
      stepHeading: "Improvements propagate across all 8 strategies",
      stepBlurb:
        "Each approach composes the same four blocks. SCENE_STYLE locks the aesthetic. IDENTITY_PRESERVATION is the explicit list of what must survive intact. NEGATIVE_TAIL is the guardrail. Editing any one of these improves all 8 approaches simultaneously — that's the whole point of the structure.",
      code: `// lib/promptConstants.ts

/**
 * Aesthetic lock — the same across all 8 approaches. Prevents the model
 * from drifting into photographic realism, cartoon, or digital painting
 * styles that don't match the airbrush-style printed product.
 */
export const SCENE_STYLE = \`
Professional airbrush-style illustration. Vibrant high-saturation colors,
visible brush technique, soft glow on highlights, subtle gradient backgrounds.
NOT photographic realism. NOT cartoon. NOT anime. NOT digital painting. NOT 3D render.
Render style: hand-painted panoramic mural with airbrushed depth.
\`.trim();

/**
 * Explicit list of what MUST survive into the generated image. Without this,
 * the model "improves" subjects by reshaping faces, dropping markings, or
 * changing brand identifiers — all of which break the use case (a customer's
 * own scene printed onto their own hardware).
 */
export const IDENTITY_PRESERVATION = \`
Preserve all of the following from the reference photo intact:
faces, hairstyles, fur and markings on pets, clothing, accessories,
body proportions, poses, expressions, subject identity,
visible logos and brand marks, stickers, text, colors and finishes.
Cast realistic shadows consistent with the scene's lighting direction.
\`.trim();

/**
 * Negative-prompt tail. The "intended use" sentence at the end was a
 * surprise win — measurably nudges the model toward more dramatic,
 * display-aware compositions across every approach.
 */
export const NEGATIVE_TAIL = \`
Do not add any text, words, watermarks, borders, logos, or signatures.
No frames, no captions, no UI overlays.
Intended use: a custom printed display product —
high-impact ultra-wide panoramic display.
\`.trim();`,
    },
    {
      filename: "app/api/expand-prompt/route.ts · word-preservation expansion",
      lang: "ts",
      stepLabel: "Step 3 · Protecting user intent",
      stepHeading: "Word-preservation rule + structural validation",
      stepBlurb:
        "Without an explicit rule, gpt-4o-mini softens user input (\"upside down pineapples on fire\" → \"unique pineapple themed scene\"). That drift cascades — the image model then misses what the customer actually asked for. The system prompt is load-bearing: it forces the model to copy adjectives word-for-word into all 3 variants. Then a Zod schema rejects malformed responses; after 3 retries the user can bypass and use their raw description.",
      code: `// app/api/expand-prompt/route.ts
import OpenAI from "openai";
import { z } from "zod";

const ExpansionSchema = z.object({
  variants: z
    .array(
      z.object({
        title: z.string().min(2).max(80),
        description: z.string().min(10).max(280),
      }),
    )
    .length(3),
});

const SYSTEM_PROMPT = \`You expand a customer's one-line scene description into
exactly 3 fuller scene options for an AI image generator.

CRITICAL — WORD PRESERVATION RULE:
Preserve EVERY word the customer used. Copy their exact adjectives, modifiers,
and descriptors into ALL 3 options word-for-word. If they said
"upside down pineapples", write "upside down pineapples" — NOT just "pineapples"
and NOT "unusual pineapple-themed scene." Do not soften, generalize, or
"improve" their language. Their words are load-bearing.

Each option should:
  - Add atmosphere, environment, and mood AROUND the customer's exact words
  - Stay 1–2 sentences
  - Be visually concrete (lighting, surroundings, time of day)
  - Never invent subjects the customer didn't mention

Return JSON: { "variants": [ {"title", "description"}, ... ] } with exactly 3 entries.\`;

export async function POST(req: Request) {
  const { rawDescription } = await req.json();

  const openai = new OpenAI();
  const MAX_ATTEMPTS = 3;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 1.0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: rawDescription },
        ],
      });

      const json = JSON.parse(completion.choices[0].message.content ?? "{}");
      const parsed = ExpansionSchema.safeParse(json);
      if (!parsed.success) {
        lastError = parsed.error;
        continue;
      }

      // Bonus check: every variant must include each significant word from the
      // customer's input. Catches the model's most common cheat — paraphrasing
      // adjectives into synonyms.
      const significantWords = extractSignificant(rawDescription);
      const allPreserved = parsed.data.variants.every((v) =>
        significantWords.every((w) => v.description.toLowerCase().includes(w)),
      );
      if (!allPreserved) {
        lastError = new Error("word-preservation check failed");
        continue;
      }

      return Response.json({ variants: parsed.data.variants, attempts: attempt });
    } catch (err) {
      lastError = err;
    }
  }

  // Graceful degrade — after 3 failures the kiosk UI offers the user
  // a "skip expansion, use my exact words" path.
  return Response.json(
    { error: "expansion_failed", canUseRaw: true, lastError: String(lastError) },
    { status: 502 },
  );
}

function extractSignificant(input: string): string[] {
  // Strip stop words; lowercase. Keeps "upside", "down", "pineapples", "fire".
  const STOP = new Set(["a", "an", "the", "of", "in", "on", "at", "and", "or", "to", "with"]);
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\\s'-]/g, "")
    .split(/\\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}`,
    },
  ],
  sourceFooter:
    "Excerpts from `app/api/generate-image/route.ts`, `lib/promptConstants.ts`, and `app/api/expand-prompt/route.ts` in the kiosk configurator. The full setup also includes a kiosk admin route (`app/design/steps/StepGenerateTest.tsx`) that runs all 8 approaches × 3 variants = 24 images side-by-side for live A/B comparison — that's how Approach 8 was selected from real data, not a guess. Pairs with the AI Pipeline case study (variance scoring, 7-level fallback, opentype.js text burn-in). Happy to walk through the harness on a call.",
};
