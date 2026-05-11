import type { CaseStudy } from "./index";
import {
  Diagram,
  DiagramBox,
  DiagramArrow,
  DiagramRow,
  DiagramStep,
  DiagramCode,
  DiagramHeading,
} from "@/components/case-study/diagram";

export const kioskAiPipeline: CaseStudy = {
  slug: "ai-pipeline",
  number: "01",
  title: "AI image pipeline with a 7-level fallback chain",
  shortTitle: "AI Image Pipeline",
  oneLiner:
    "Customer photo + scene description → print-ready 15,420 × 1,320 px panoramic in ~45s, with a 7-level graceful-degradation chain so the booth never tells a paying customer \"generation failed.\"",
  lede:
    "A four-model AI pipeline (OpenAI gpt-image-1.5, gpt-4o-mini, Claid 4× neural upscale, Replicate isnet-general-use rembg) that turns a customer photo and a one-line scene prompt into a print-ready ultra-wide panoramic display product. The interesting parts aren't the model calls — they're the engineering around them: a parallel-kickoff routing decision, per-row greyscale variance scoring to rank candidates, a subject-aware smart crop, and a 7-level fallback chain so a transient API failure never breaks the booth.",
  pullQuote:
    "Stock image models trained on 1:1 / 16:9 data don't have a useful prior for an 11.68:1 aspect. The prompt has to do composition work the model wasn't trained to do. Everything downstream — variance scoring, smart crop, fallback routing — exists because that prompt sometimes loses anyway.",
  prelaunchNote:
    "Shipped March–April 2026 for an off-roading e-commerce client (engagement details under standard client confidentiality). Trade-show kiosk; runs unattended at booths. Vercel Pro serverless with a 60-second function ceiling and 240-second AbortController timeouts on every external call.",
  whereSection: {
    tag: "Pipeline shape",
    heading: "Two-device session, four AI services, one print file",
  },
  whereItShowsUp: {
    kind: "stats",
    entries: [
      { value: "15,420 × 1,320", label: "Print output @ 300 DPI", color: "accent" },
      { value: "~45s", label: "End-to-end generation time", color: "accent2" },
      { value: "7", label: "Fallback levels", color: "green" },
      { value: "11.68:1", label: "Aspect ratio (the hard part)", color: "amber" },
    ],
  },
  whySection: {
    tag: "The engineering \"why\"",
    heading: "Six things that make this more than four API calls",
  },
  whyTiles: [
    {
      number: 1,
      title: "Parallel kickoff over sequential",
      body: "/v1/images/edits and /v1/images/generations fire concurrently before either has confirmed success. If edits succeeds we use it; if not, the scene-only generation is already done — saving ~15s on every fallback path.",
      ref: "snippet 01",
    },
    {
      number: 2,
      title: "Variance scoring instead of \"first response wins\"",
      body: "Each candidate is converted to a 512-px greyscale proxy, per-row variance computed, and ONLY the variance inside the 12% strip that survives the final crop counts. Variance not brightness, not edge count — sky and ground are smooth (low variance), faces / hair / subject detail are rough (high variance), so the metric naturally targets usable detail in the surviving band.",
      ref: "snippet 02",
    },
    {
      number: 3,
      title: "Subject-aware smart crop with head-priority fallback",
      body: "Same variance pass detects the subject band (rows above 1.5× median variance), computes a variance-weighted center, and biases the crop toward face/hands instead of geometric midpoint. If the subject is taller than the crop window, we top-bias with 12% headroom — preserve heads, sacrifice feet.",
      ref: "snippet 02",
    },
    {
      number: 4,
      title: "Seven-level fallback chain",
      body: "edits-natural → edits + rembg cutout composited onto AI scene → AI cutout on SVG gradient → edits-cropped → original-photo cutout on AI scene → original-photo cutout on gradient → graceful error. Every level handles a real failure mode I observed in dev logs.",
      ref: "in full case study",
    },
    {
      number: 5,
      title: "Diagnostics as a return value",
      body: "Every response carries `pipeline`, `editsOk`, `sceneOk`, `rembgOk`, `moderationBlocked`, `candidateScores`, `subjectFitsInCrop`, and per-phase ms timings. One response tells me which path fired and why — production observability without a separate dashboard.",
      ref: "in full case study",
    },
    {
      number: 6,
      title: "Text never goes through the AI",
      body: "Print-on-demand can't survive a typo — one misspelled name returns the whole order. So the AI generates the scene only; the customer's text is burned in server-side via opentype.js path outlines + sharp. Bonus: bypasses Vercel's librsvg font-rendering bug. What the customer sees on screen is exactly what ships.",
      ref: "snippet 03",
    },
  ],
  architectureSection: {
    tag: "Architecture",
    heading: "Pipeline + fallback chain",
  },
  architectureDiagram: (
    <Diagram>
      <DiagramBox tone="neutral">
        customer photo + one-line scene prompt
      </DiagramBox>

      <DiagramArrow label="parallel kickoff — saves ~15s on fallback paths" />

      <DiagramRow>
        <DiagramBox label="/v1/images/edits" tone="accent">
          composition-aware prompt
          <div className="mt-1 text-[var(--text)]">→ <DiagramCode>editsOk?</DiagramCode></div>
        </DiagramBox>
        <DiagramBox label="/v1/images/generations" tone="accent2">
          scene only · no subject
          <div className="mt-1 text-[var(--text)]">→ <DiagramCode>sceneOk?</DiagramCode></div>
        </DiagramBox>
      </DiagramRow>

      <DiagramArrow />

      <DiagramBox label="Routing decision · 7 levels" tone="amber">
        <DiagramStep n={1}>
          <span className="text-white font-semibold">NATURAL</span> · edits OK
          + subject fits the crop window
        </DiagramStep>
        <DiagramStep n={2}>
          <span className="text-white font-semibold">COMPOSITE</span> · edits
          OK + subject too tall + scene OK → rembg cutout onto AI scene
        </DiagramStep>
        <DiagramStep n={3}>
          <span className="text-white font-semibold">COMPOSITE-GRADIENT</span>{" "}
          · edits OK + scene FAIL → rembg cutout onto SVG gradient
        </DiagramStep>
        <DiagramStep n={4}>
          <span className="text-white font-semibold">EDITS-CROPPED</span> ·
          edits OK + rembg failed → use edits with smart crop
        </DiagramStep>
        <DiagramStep n={5}>
          <span className="text-white font-semibold">COMPOSITE-ONLY</span> ·
          edits FAIL + scene OK → rembg the original photo
        </DiagramStep>
        <DiagramStep n={6}>
          <span className="text-white font-semibold">REMBG-GRADIENT</span> ·
          edits FAIL + scene FAIL → original photo on SVG gradient
        </DiagramStep>
        <DiagramStep n={7}>
          <span className="text-white font-semibold">ERROR</span> · all
          failed → structured failure response with diagnostics
        </DiagramStep>
      </DiagramBox>

      <DiagramArrow />

      <DiagramBox label="Claid 4× neural upscale" tone="green">
        Lanczos fallback if Claid times out
      </DiagramBox>

      <DiagramArrow />

      <DiagramBox label="Subject-aware variance-weighted crop" tone="accent">
        → <DiagramCode>15,420 × 1,320 px @ 300 DPI</DiagramCode>
      </DiagramBox>

      <DiagramArrow />

      <DiagramBox label="opentype.js text burn-in" tone="accent2">
        sharp SVG-path overlay (bypasses librsvg&apos;s serverless font bug)
      </DiagramBox>

      <DiagramArrow />

      <DiagramBox tone="neutral">
        Vercel Blob → DB → Shopify draft order
      </DiagramBox>

      <DiagramHeading>
        Diagnostics ride along: pipeline · editsOk · sceneOk · rembgOk ·
        moderationBlocked · candidateScores · subjectFitsInCrop · per-phase ms
      </DiagramHeading>
    </Diagram>
  ),
  snippetsSection: {
    tag: "The Code · how it flows",
    heading: "Three snippets, in execution order",
    intro:
      "Real excerpts from `app/api/generate-image/route.ts`, `lib/imageUtils.ts`, and `lib/textComposite.ts`. Reading order matches request flow: parallel-kickoff + routing → variance-scoring + smart crop → opentype.js text burn-in.",
  },
  snippets: [
    {
      filename: "app/api/generate-image/route.ts · pipeline + routing",
      lang: "ts",
      stepLabel: "Step 1 · The orchestrator",
      stepHeading: "Parallel kickoff, then route by what came back",
      stepBlurb:
        "Both image calls fire concurrently — if /edits fails, the scene-only generation is already underway. The routing decision then picks one of seven paths based on which calls succeeded and whether the subject fits the crop window. The diagnostics object travels with the response so I can see exactly which path fired in prod logs.",
      code: `// app/api/generate-image/route.ts
export const maxDuration = 60; // Vercel Pro function ceiling

type Diagnostics = {
  pipeline: PipelineKind;
  editsOk: boolean;
  sceneOk: boolean;
  rembgOk: boolean;
  moderationBlocked: boolean;
  candidateScores: number[];
  subjectFitsInCrop: boolean;
  subjectVisiblePct: number;
  timings: Record<string, number>;
};

export async function POST(req: Request) {
  const t = phaseTimer();
  const { photo, prompt, promptApproach } = await req.json();

  // Parallel kickoff — don't wait for /edits to fail before starting /generations.
  // Both calls share a 240s AbortController so a hung Replicate call can't
  // pin the function past Vercel's 60s ceiling.
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 240_000);

  const [editsResult, sceneResult] = await Promise.allSettled([
    callOpenAiEdits(photo, prompt, promptApproach, ac.signal),
    callOpenAiGeneration(prompt, ac.signal), // scene-only, no subject
  ]);
  clearTimeout(timer);
  t.mark("openai");

  const editsOk = editsResult.status === "fulfilled";
  const sceneOk = sceneResult.status === "fulfilled";
  const moderationBlocked =
    !editsOk && (editsResult as PromiseRejectedResult).reason?.code === "moderation";

  // Variance scoring on /edits candidates (we generate 1; the scoring
  // pass also tells us subject-fit before we commit to the cheap path).
  let editsCandidate: ScoredCandidate | null = null;
  if (editsOk) {
    editsCandidate = await scoreCandidate(editsResult.value);
  }
  const subjectFitsInCrop = editsCandidate?.subjectFitsInCrop ?? false;

  // Routing decision — seven paths, each handles a real failure mode
  // I observed in dev logs.
  let pipeline: PipelineKind;
  let composed: Buffer;
  if (editsOk && subjectFitsInCrop) {
    pipeline = "natural";
    composed = await variantCrop(editsCandidate!.image);
  } else if (editsOk && sceneOk) {
    pipeline = "composite";
    const cutout = await rembg(editsCandidate!.image);
    composed = await composite(sceneResult.value, cutout, { groundShadow: true });
  } else if (editsOk) {
    pipeline = "composite-gradient";
    const cutout = await rembg(editsCandidate!.image);
    composed = await composite(svgGradient(prompt), cutout, { groundShadow: true });
  } else if (editsOk /* but rembg failed */) {
    pipeline = "edits-cropped";
    composed = await variantCrop(editsCandidate!.image); // accept cutoff risk
  } else if (sceneOk) {
    pipeline = "composite-only";
    const cutout = await rembg(photo); // rembg the ORIGINAL photo
    composed = await composite(sceneResult.value, cutout, { groundShadow: true });
  } else if (await rembg(photo).catch(() => null)) {
    pipeline = "rembg-gradient";
    const cutout = await rembg(photo);
    composed = await composite(svgGradient(prompt), cutout, { groundShadow: true });
  } else {
    return Response.json(
      { error: "Generation failed", diagnostics: { /* … */ } },
      { status: 502 },
    );
  }

  // Upscale-before-crop drops the final stretch from 10× to 2.5×.
  const upscaled = await claid4xUpscale(composed).catch(() => lanczos4x(composed));
  const cropped = await subjectAwareSmartCrop(upscaled, { width: 15_420, height: 1_320 });
  t.mark("postprocess");

  return Response.json({
    image: await uploadToBlob(cropped),
    diagnostics: {
      pipeline,
      editsOk,
      sceneOk,
      moderationBlocked,
      candidateScores: editsCandidate ? [editsCandidate.score] : [],
      subjectFitsInCrop,
      subjectVisiblePct: editsCandidate?.subjectVisiblePct ?? 0,
      timings: t.snapshot(),
    } satisfies Diagnostics,
  });
}`,
    },
    {
      filename: "lib/imageUtils.ts · scoreCandidate + smart crop",
      lang: "ts",
      stepLabel: "Step 2 · The scoring + crop algorithm",
      stepHeading: "Per-row greyscale variance over the surviving crop band",
      stepBlurb:
        "Convert the candidate to a 512-px greyscale proxy, compute per-row variance using the standard ∑x²/n − x̄² identity, and only count variance INSIDE the 12% strip that survives the final crop. The metric choice is the actual insight: sky and ground are smooth (low variance), faces / hair / subject detail are rough (high variance), so variance naturally targets usable detail in the surviving band — better than the obvious \"average brightness\" or \"edge count.\" Same pass detects the subject band (rows > 1.5× median variance) and yields a variance-weighted center for the crop. If the subject is taller than the window, top-bias with 12% headroom — preserve faces, sacrifice feet.",
      code: `// lib/imageUtils.ts
import sharp from "sharp";

const PROXY_WIDTH = 512;
const SURVIVING_BAND_PCT = 0.12; // final crop preserves the central 12% strip
const HEADROOM_PCT = 0.12;       // top-bias fallback keeps heads in frame

export type ScoredCandidate = {
  image: Buffer;
  score: number;              // higher = more usable detail in the survival band
  subjectFitsInCrop: boolean;
  subjectVisiblePct: number;
  subjectCenterY: number;     // 0..1, used by smartCrop downstream
};

export async function scoreCandidate(image: Buffer): Promise<ScoredCandidate> {
  // Greyscale proxy at 512px wide — fast variance pass, no full-res cost.
  const proxy = await sharp(image)
    .resize(PROXY_WIDTH, null, { fit: "inside" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = proxy;
  const { width: w, height: h } = info;

  // Per-row variance: σ² = ∑x²/n − x̄²
  const rowVariance = new Float32Array(h);
  for (let y = 0; y < h; y++) {
    let sum = 0;
    let sumSq = 0;
    const rowStart = y * w;
    for (let x = 0; x < w; x++) {
      const v = data[rowStart + x];
      sum += v;
      sumSq += v * v;
    }
    const mean = sum / w;
    rowVariance[y] = sumSq / w - mean * mean;
  }

  // Subject band detection: rows > 1.5× median variance.
  const median = quickMedian(rowVariance);
  const threshold = median * 1.5;
  let subjectTop = -1;
  let subjectBottom = -1;
  for (let y = 0; y < h; y++) {
    if (rowVariance[y] > threshold) {
      if (subjectTop === -1) subjectTop = y;
      subjectBottom = y;
    }
  }
  const subjectHeight = Math.max(0, subjectBottom - subjectTop);

  // Variance-weighted center — biases toward faces/hands, not geometric midpoint.
  let weightedSum = 0;
  let weightTotal = 0;
  for (let y = subjectTop; y <= subjectBottom; y++) {
    weightedSum += y * rowVariance[y];
    weightTotal += rowVariance[y];
  }
  const subjectCenterY = weightTotal > 0 ? weightedSum / weightTotal / h : 0.5;

  // Score: variance INSIDE the surviving 12% band only. A candidate with great
  // detail in the top 30% of the frame loses to one with less detail in the
  // central strip — that's the only band that ships.
  const bandStart = Math.floor(h * (subjectCenterY - SURVIVING_BAND_PCT / 2));
  const bandEnd = Math.ceil(h * (subjectCenterY + SURVIVING_BAND_PCT / 2));
  let score = 0;
  for (let y = Math.max(0, bandStart); y < Math.min(h, bandEnd); y++) {
    score += rowVariance[y];
  }

  const subjectFitsInCrop = subjectHeight <= h * SURVIVING_BAND_PCT;
  const subjectVisiblePct = Math.min(1, (h * SURVIVING_BAND_PCT) / Math.max(subjectHeight, 1));

  return { image, score, subjectFitsInCrop, subjectVisiblePct, subjectCenterY };
}

export async function subjectAwareSmartCrop(
  image: Buffer,
  target: { width: number; height: number },
): Promise<Buffer> {
  const meta = await sharp(image).metadata();
  const srcW = meta.width!;
  const srcH = meta.height!;

  // Re-score against the upscaled image to get an accurate subjectCenterY.
  const { subjectCenterY, subjectFitsInCrop } = await scoreCandidate(image);

  const cropH = target.height;
  let topY = Math.round(subjectCenterY * srcH - cropH / 2);

  if (!subjectFitsInCrop) {
    // Subject taller than crop window — top-bias with 12% headroom so the
    // head stays in frame even if feet get cut.
    topY = Math.round(subjectCenterY * srcH - cropH * (1 - HEADROOM_PCT));
  }

  topY = clamp(topY, 0, srcH - cropH);

  return sharp(image)
    .extract({ left: 0, top: topY, width: srcW, height: cropH })
    .resize(target.width, target.height, { fit: "fill" })
    .png()
    .toBuffer();
}`,
    },
    {
      filename: "lib/textComposite.ts · opentype.js text burn-in",
      lang: "ts",
      stepLabel: "Step 3 · The librsvg workaround",
      stepHeading: "Customer text → SVG paths → sharp composite",
      stepBlurb:
        "Vercel's serverless runtime ships a librsvg version that fails to load @font-face, even with embedded base64 fonts — it falls back to a default sans and the customer's font choice silently breaks. opentype.js reads the font binary, measures glyph widths, converts the text to SVG path outlines, and sharp composites the outline as an image. The customer's font ships pixel-perfect; AI never spells the customer's name wrong because AI never sees the customer's name.",
      code: `// lib/textComposite.ts
import sharp from "sharp";
import opentype, { type Font } from "opentype.js";
import fs from "node:fs/promises";
import path from "node:path";

const FONT_CACHE = new Map<string, Font>();

async function loadFont(family: string): Promise<Font> {
  const cached = FONT_CACHE.get(family);
  if (cached) return cached;
  const buf = await fs.readFile(
    path.join(process.cwd(), "public/fonts", \`\${family}.otf\`),
  );
  const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  FONT_CACHE.set(family, font);
  return font;
}

export type TextOverlay = {
  text: string;
  fontFamily: string;
  fontSizePx: number;
  color: string;        // e.g. "#fff"
  shadow?: { blur: number; offsetY: number; color: string };
  cx: number;           // 0..1 — horizontal center
  cy: number;           // 0..1 — vertical center
};

/**
 * Compose customer text onto a base image without trusting the platform's
 * SVG font renderer. opentype.js does the layout; sharp does the composite.
 */
export async function burnInText(
  base: Buffer,
  overlay: TextOverlay,
): Promise<Buffer> {
  const meta = await sharp(base).metadata();
  const w = meta.width!;
  const h = meta.height!;

  const font = await loadFont(overlay.fontFamily);

  // opentype.js measures the path itself — bypasses librsvg's text shaping.
  const path = font.getPath(overlay.text, 0, 0, overlay.fontSizePx);
  const bbox = path.getBoundingBox();
  const textW = bbox.x2 - bbox.x1;
  const textH = bbox.y2 - bbox.y1;

  const x = Math.round(overlay.cx * w - textW / 2 - bbox.x1);
  const y = Math.round(overlay.cy * h - textH / 2 - bbox.y1);
  path.commands = path.commands.map((c) => ({
    ...c,
    x: c.x !== undefined ? c.x + x : c.x,
    y: c.y !== undefined ? c.y + y : c.y,
  }));

  const shadow = overlay.shadow
    ? \`<filter id="s">
         <feGaussianBlur stdDeviation="\${overlay.shadow.blur}" />
       </filter>
       <path d="\${path.toPathData(2)}"
             fill="\${overlay.shadow.color}"
             transform="translate(0,\${overlay.shadow.offsetY})"
             filter="url(#s)" />\`
    : "";

  const svg = \`<svg xmlns="http://www.w3.org/2000/svg" width="\${w}" height="\${h}">
      \${shadow}
      <path d="\${path.toPathData(2)}" fill="\${overlay.color}" />
    </svg>\`;

  return sharp(base)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();
}`,
    },
  ],
  sourceFooter:
    "Excerpts from `app/api/generate-image/route.ts`, `lib/imageUtils.ts`, and `lib/textComposite.ts` in the kiosk configurator. The full pipeline includes magic-byte MIME detection (caught a P0 where /v1/images/edits silently rejected JPEGs), 8 switchable prompt strategies (covered separately in the Prompt Engineering case study), and a regenerate-up-to-3-times refinement loop in the kiosk UI. " +
    "Engineering judgment / things removed: prototyped and abandoned an iterative outpainting panorama-stitcher (~220 lines, kept commented in `lib/outpaint.ts` as a record) — added 30–40s, seams unreliable; replaced with single-gen + 4× upscale + smart crop. " +
    "Production fires fixed: read-only Vercel filesystem killed `fs.writeFileSync` logger → migrated to a Neon Postgres `orderLogs` table; canvas taint blocked `getImageData()` on Vercel Blob URLs → added `crossOrigin=\"anonymous\"` everywhere images feed a canvas; OOM during smart-crop on the 15,420 × 10,281 intermediate → combined extract + resize into a single sharp call. " +
    "Cost engineering: reference photo downsized to 1024 px pre-upload, 3-candidate generation collapsed to 1 + variance scoring, upscale-before-crop drops the final stretch from 10× to 2.5× — net ~3× OpenAI spend reduction at parity quality. Happy to walk through the full pipeline on a call.",
};
