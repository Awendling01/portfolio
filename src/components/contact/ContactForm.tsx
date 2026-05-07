"use client";

import { useActionState, useState } from "react";
import { submitContact } from "@/app/contact/actions";
import {
  initialContactState,
  type ContactState,
} from "@/app/contact/state";
import {
  ContactFieldNames,
  validateField,
  type ContactFieldName,
} from "@/app/contact/schema";

const inputClass =
  "w-full rounded-lg border bg-[var(--bg)]/60 px-4 py-3 text-[15px] text-[var(--text2)] placeholder:text-[var(--text)]/70 outline-none transition focus:ring-2";

const inputOk =
  "border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/30";

const inputError =
  "border-[var(--rose)]/70 focus:border-[var(--rose)] focus:ring-[var(--rose)]/25";

const labelClass =
  "mono text-[11px] uppercase tracking-[0.18em] text-[var(--text)]";

type FieldErrors = Partial<Record<ContactFieldName, string>>;
type Touched = Partial<Record<ContactFieldName, boolean>>;

const emptyValues: Record<ContactFieldName, string> = {
  name: "",
  email: "",
  message: "",
};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    submitContact,
    initialContactState,
  );

  const [values, setValues] = useState<Record<ContactFieldName, string>>(
    emptyValues,
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Touched>({});

  // React the action result during render (instead of in an effect).
  // Using a stored copy of the state we've already reacted to so we only
  // do the reset / merge once per server response.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    if (state.status === "success") {
      setValues(emptyValues);
      setErrors({});
      setTouched({});
    } else if (state.status === "error" && state.errors) {
      setErrors((prev) => ({ ...prev, ...state.errors }));
      const newlyTouched: Touched = {};
      for (const name of ContactFieldNames) {
        if (state.errors[name]) newlyTouched[name] = true;
      }
      setTouched((prev) => ({ ...prev, ...newlyTouched }));
    }
  }

  const handleChange =
    (name: ContactFieldName) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = e.target.value;
      setValues((prev) => ({ ...prev, [name]: next }));
      // Clear the field's error as soon as the user starts editing — they're
      // already correcting whatever was wrong.
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    };

  const handleBlur = (name: ContactFieldName) => () => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const issue = validateField(name, values[name]);
    setErrors((prev) => ({ ...prev, [name]: issue }));
  };

  const showError = (name: ContactFieldName) =>
    Boolean(touched[name] && errors[name]);

  const errorClassFor = (name: ContactFieldName) =>
    `${inputClass} ${showError(name) ? inputError : inputOk}`;

  const statusToneClass =
    state.status === "success"
      ? "text-[var(--green)]"
      : state.status === "error"
        ? "text-[var(--rose)]"
        : "text-[var(--text)]";

  const statusMessage =
    state.message ||
    "Replies usually come from the address above within a business day.";

  return (
    <form
      action={formAction}
      noValidate
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-7 sm:p-8 space-y-5"
    >
      {/* honeypot — visually hidden, off-screen, hidden from assistive tech */}
      <div
        className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden"
        aria-hidden="true"
      >
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
            value={values.name}
            onChange={handleChange("name")}
            onBlur={handleBlur("name")}
            aria-invalid={showError("name")}
            aria-describedby={showError("name") ? "name-error" : undefined}
            className={errorClassFor("name")}
          />
          {showError("name") ? (
            <p
              id="name-error"
              className="text-xs text-[var(--rose)]"
              aria-live="polite"
            >
              {errors.name}
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
            value={values.email}
            onChange={handleChange("email")}
            onBlur={handleBlur("email")}
            aria-invalid={showError("email")}
            aria-describedby={showError("email") ? "email-error" : undefined}
            className={errorClassFor("email")}
          />
          {showError("email") ? (
            <p
              id="email-error"
              className="text-xs text-[var(--rose)]"
              aria-live="polite"
            >
              {errors.email}
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
          value={values.message}
          onChange={handleChange("message")}
          onBlur={handleBlur("message")}
          aria-invalid={showError("message")}
          aria-describedby={
            showError("message") ? "message-error" : undefined
          }
          className={`${errorClassFor("message")} resize-y`}
        />
        {showError("message") ? (
          <p
            id="message-error"
            className="text-xs text-[var(--rose)]"
            aria-live="polite"
          >
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <p
          className={`text-sm leading-relaxed ${statusToneClass}`}
          aria-live="polite"
        >
          {statusMessage}
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
