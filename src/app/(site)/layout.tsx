import { cookies } from "next/headers";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/auth";

// Server component — reads the admin session cookie and passes auth state
// down to the (client-side) Nav so it can render the admin tab block when
// the visitor is signed in. Avoids a client-side fetch / hydration flash.
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const isAuthed = await verifySession(session);

  return (
    <>
      <Nav isAuthed={isAuthed} />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </>
  );
}
