"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSession,
  passwordMatches,
  safeNextPath,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";
import { getDb, hasDatabase, schema } from "@/lib/db";
import { getClientIp, hashIp } from "@/lib/visitor";
import { lookupIp } from "@/lib/ipinfo";
import { checkLoginRate } from "@/lib/rate-limit";
import type { LoginState } from "./state";

async function logAttempt(opts: {
  ipHash: string | null;
  succeeded: boolean;
  userAgent: string | null;
  country: string | null;
  org: string | null;
}) {
  if (!hasDatabase) return;
  try {
    const db = getDb();
    await db.insert(schema.loginAttempts).values(opts);
  } catch (err) {
    console.error("login: attempt log failed", err);
  }
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? ""));

  if (!process.env.ADMIN_PASSWORD) {
    return {
      status: "error",
      message: "Admin login isn't configured on the server.",
    };
  }

  const reqHeaders = await headers();
  const clientIp = getClientIp(reqHeaders);
  const ipHash = hashIp(clientIp);
  const userAgent = reqHeaders.get("user-agent");
  const country = reqHeaders.get("x-vercel-ip-country");

  // Cheap fast path: rate-limit before doing the IPinfo lookup so a flood of
  // attempts doesn't burn quota.
  const rate = await checkLoginRate(ipHash);
  if (!rate.allowed) {
    return {
      status: "error",
      message: `Too many attempts. Try again in ${Math.ceil(
        rate.retryAfterSeconds / 60,
      )} minute${rate.retryAfterSeconds >= 120 ? "s" : ""}.`,
    };
  }

  if (!password) {
    return { status: "error", message: "Enter the admin password." };
  }

  const ok = passwordMatches(password);

  // IPinfo has a 1.5s internal timeout. If it fails or times out we still
  // log the attempt with whatever Vercel headers gave us.
  const enrichment = await lookupIp(clientIp);

  await logAttempt({
    ipHash,
    succeeded: ok,
    userAgent,
    country: enrichment.country ?? country,
    org: enrichment.org,
  });

  if (!ok) {
    return { status: "error", message: "Incorrect password." };
  }

  // Server-side session record. Rotates on every login (any prior cookie is
  // orphaned and pruned by the periodic expired-row sweep). Wiping the
  // `admin_sessions` table revokes every active session immediately.
  const sessionToken = await createSession({
    ipHash,
    userAgent,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect(next);
}
