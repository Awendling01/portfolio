import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Andrew Wendling — Full-Stack Engineer + Sales Background";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
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
              fontSize: 20,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#94a3b8",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            andrewwendling.dev
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
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex" }}>
              Six years selling. Five years building.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <span>Engineer who can&nbsp;</span>
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #38bdf8, #818cf8, #34d399)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                carry a quota
              </span>
              <span>.</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#cbd5e1",
              maxWidth: 980,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            Andrew Wendling. Open to Developer · Solutions Engineer · Sales
            Engineer · Customer Success Manager roles.
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
          <div>5+ Yrs Engineering</div>
          <div>·</div>
          <div>6+ Yrs Sales</div>
          <div>·</div>
          <div>1,850+ Tests</div>
          <div>·</div>
          <div>Top 3% National</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
