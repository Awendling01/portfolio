import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="relative z-10 flex-1">
        <section className="pt-36 pb-24 sm:pt-44 sm:pb-32 min-h-[60vh] grid place-items-center">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <p className="mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
                404 · Not found
              </p>
              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                That page doesn&apos;t exist.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[var(--text)] leading-relaxed">
                You&apos;ve hit a URL that isn&apos;t part of this site. The
                link you followed may be out of date, or the page may have
                been renamed.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Button href="/">← Home</Button>
                <Button href="/work" variant="outline">
                  See projects
                </Button>
                <Button href="/contact" variant="outline">
                  Contact
                </Button>
              </div>
              <div className="mt-12 mono text-xs text-[var(--text)]">
                Or{" "}
                <Link
                  href="/about"
                  className="text-[var(--accent)] hover:underline"
                >
                  read the about page →
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
