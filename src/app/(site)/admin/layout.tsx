import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Admin lives under (site) so it inherits the public Nav + Footer chrome.
// This layout exists only to (a) set the noindex metadata and (b) widen the
// content area beyond the standard Container's reading width — admin tables
// need the room. No own nav, no logout button: both are wired into the
// global Nav and render only for authenticated visitors.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pt-28 pb-16">
      {children}
    </div>
  );
}
