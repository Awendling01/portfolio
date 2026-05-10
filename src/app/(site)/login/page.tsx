import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import LoginForm from "@/components/auth/LoginForm";
import {
  safeNextPath,
  SESSION_COOKIE_NAME,
  verifySession,
} from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { next: rawNext } = await searchParams;
  const next = safeNextPath(rawNext);

  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (await verifySession(session)) {
    redirect(next);
  }

  return (
    <>
      <section className="pt-36 pb-10 sm:pt-44 sm:pb-12">
        <Container>
          <SectionHeader
            tag="Admin"
            title="Sign in"
            subtitle="Password-protected admin area for visitor analytics and contact-form submissions."
          />
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="max-w-md">
            <LoginForm next={next} />
          </div>
        </Container>
      </section>
    </>
  );
}
