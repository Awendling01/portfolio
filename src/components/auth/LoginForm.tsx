"use client";

import { useActionState } from "react";
import { login } from "@/app/login/actions";
import { initialLoginState, type LoginState } from "@/app/login/state";

type Props = { next?: string };

export default function LoginForm({ next }: Props) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    initialLoginState,
  );

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-7 sm:p-8 space-y-5"
    >
      <input type="hidden" name="next" value={next ?? "/admin"} />

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)]"
        >
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          autoFocus
          aria-invalid={state.status === "error"}
          aria-describedby={
            state.status === "error" ? "login-error" : undefined
          }
          className={`w-full rounded-lg border bg-[var(--bg)]/60 px-4 py-3 text-[15px] text-[var(--text2)] placeholder:text-[var(--text)]/70 outline-none transition focus:ring-2 ${
            state.status === "error"
              ? "border-[var(--rose)]/70 focus:border-[var(--rose)] focus:ring-[var(--rose)]/25"
              : "border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/30"
          }`}
        />
        {state.status === "error" ? (
          <p
            id="login-error"
            className="text-xs text-[var(--rose)]"
            aria-live="polite"
          >
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4 pt-1">
        <p className="text-xs text-[var(--text)]">
          Authorized access only. Session lasts 7 days.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[#0b1224] whitespace-nowrap shrink-0 transition disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-[1px]"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </form>
  );
}
