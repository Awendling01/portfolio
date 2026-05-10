import { ImageResponse } from "next/og";
import {
  getMoniscopeCaseStudy,
  moniscopeCaseStudyOrder,
} from "@/lib/case-studies";

// Static-rendered at build time via generateStaticParams (one image per
// case-study slug). Edge runtime conflicts with generateStaticParams in
// Next 16 — nodejs is the right choice for prebuilt OG images.
export const alt = "MONISCOPE engineering case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return moniscopeCaseStudyOrder.map((slug) => ({ slug }));
}

export default async function CaseStudyOG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getMoniscopeCaseStudy(slug);
  const number = study?.number ?? "00";
  const title = study?.shortTitle ?? "MONISCOPE";
  const oneLiner =
    study?.oneLiner ??
    "Multi-tenant self-storage SaaS — engineering deep dive.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(60% 80% at 80% 0%, rgba(56,189,248,0.22), transparent 70%), radial-gradient(70% 80% at 0% 100%, rgba(129,140,248,0.18), transparent 70%), #0f172a",
          padding: "72px",
          color: "#f1f5f9",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              color: "#0b1224",
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
            }}
          >
            AW
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#94a3b8",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            {`MONISCOPE · Case Study ${number}`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              color: "#f1f5f9",
              maxWidth: 1080,
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#cbd5e1",
              maxWidth: 1040,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            {oneLiner}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 18,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#94a3b8",
          }}
        >
          <div>andrewwendling.info</div>
          <div>·</div>
          <div>Engineering Deep Dive</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
