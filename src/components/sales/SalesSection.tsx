import type { ReactNode } from "react";
import Container from "@/components/ui/Container";

type Props = {
  children: ReactNode;
  id?: string;
};

export default function SalesSection({ children, id }: Props) {
  return (
    <section
      id={id}
      className="relative py-20 sm:py-24 overflow-hidden"
      aria-label="Sales and leadership experience"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 80% at 80% 10%, rgba(129,140,248,0.08), transparent 70%), radial-gradient(70% 80% at 0% 100%, rgba(52,211,153,0.06), transparent 70%)",
        }}
      />
      <Container className="relative z-10">{children}</Container>
    </section>
  );
}
