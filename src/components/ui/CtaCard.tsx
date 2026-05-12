import type { ReactNode } from "react";
import Button from "./Button";
import Card from "./Card";

// Bottom-of-page "talk to me" CTA — heading + body + Get In Touch
// button on the right. Used on /work and the three project deep-dive
// pages (/work/moniscope, /work/shopify, /work/futureshirts), all
// with the same Card + className shape and a /contact button.
//
// The home page CTA is intentionally NOT migrated here — it has a
// gradient background overlay, two buttons (LinkedIn + GitHub), and
// an extra link. Different shape; keeping it inline keeps both
// implementations clean rather than overloading this primitive with
// conditional gradient + multi-button branches.

type Props = {
  heading: string;
  body: ReactNode;
};

export default function CtaCard({ heading, body }: Props) {
  return (
    <Card
      padding="large"
      hover={false}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
    >
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {heading}
        </h3>
        <p className="mt-2 text-sm text-[var(--text)] max-w-xl">
          {body}
        </p>
      </div>
      <Button href="/contact">Get In Touch</Button>
    </Card>
  );
}
