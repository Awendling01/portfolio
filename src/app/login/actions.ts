"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSessionValue,
  passwordMatches,
  safeNextPath,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";
import type { LoginState } from "./state";

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? ""));

  if (!password) {
    return { status: "error", message: "Enter the admin password." };
  }

  if (!process.env.ADMIN_PASSWORD) {
    return {
      status: "error",
      message: "Admin login isn't configured on the server.",
    };
  }

  if (!passwordMatches(password)) {
    return { status: "error", message: "Incorrect password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect(next);
}
