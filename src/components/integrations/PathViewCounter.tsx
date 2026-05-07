"use client";

import { usePathname } from "next/navigation";
import ViewCounter from "./ViewCounter";

export default function PathViewCounter() {
  const pathname = usePathname() ?? "/";
  const slug = pathname === "/" ? "home" : pathname.replace(/^\//, "");
  return <ViewCounter slug={slug} path={pathname} />;
}
