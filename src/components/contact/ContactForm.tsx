"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/contact/actions";
import {
  initialContactState,
  type ContactState,
} from "@/app/contact/state";

const inputClass =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--bg)]/60 px-4 py-3 text-[15px] text-[var(--text2)] placeholder:text-[var(--text)]/70 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30";

const labelClass =
  "mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)]";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    submitContact,
    initialContactState,
  );

  return (
    <form
      action={formAction}
      noValidate
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-7 sm:p-8 space-y-5"
    >
      {/* honeypot */}
      <div className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby={state.errors?.name ? "name-error" : undefined}
            className={inputClass}
          />
          {state.errors?.name ? (
            <p
              id="name-error"
              className="text-xs text-[var(--rose)]"
              aria-live="polite"
            >
              {state.errors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={state.errors?.email ? "email-error" : undefined}
            className={inputClass}
          />
          {state.errors?.email ? (
            <p
              id="email-error"
              className="text-xs text-[var(--rose)]"
              aria-live="polite"
            >
              {state.errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder="Role, team, what you're hiring for, timeline — whatever helps."
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={
            state.errors?.message ? "message-error" : undefined
          }
          className={`${inputClass} resize-y`}
        />
        {state.errors?.message ? (
          <p
            id="message-error"
            className="text-xs text-[var(--rose)]"
            aria-live="polite"
          >
            {state.errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <p
          className={`text-sm leading-relaxed ${
            state.status === "success"
              ? "text-[var(--green)]"
              : state.status === "error"
                ? "text-[var(--rose)]"
                : "text-[var(--text)]"
          }`}
          aria-live="polite"
        >
          {state.message ||
            "Replies usually come from the address above within a business day."}
        </p>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[#0b1224] transition disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-[1px]"
        >
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
