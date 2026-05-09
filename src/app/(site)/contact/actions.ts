"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { getDb, hasDatabase, schema } from "@/lib/db";
import ContactMessageEmail from "@/emails/ContactMessage";
import { contact } from "@/lib/content";
import { getClientIp, hashIp } from "@/lib/visitor";
import { checkContactRate } from "@/lib/rate-limit";
import { ContactSchema } from "./schema";
import type { ContactState } from "./state";

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot.length > 0) {
    // Spam bot tripped the honeypot. Return the same UI as a real success
    // — don't reveal the trap, don't persist, don't email.
    return successState();
  }

  // Rate limit by hashed IP before validating, so a flood of submissions
  // can't burn DB time.
  const reqHeaders = await headers();
  const ipHash = hashIp(getClientIp(reqHeaders));
  const rate = await checkContactRate(ipHash);
  if (!rate.allowed) {
    const minutes = Math.ceil(rate.retryAfterSeconds / 60);
    return {
      status: "error",
      message: `You've sent a few messages already — please wait ${minutes} minute${
        minutes === 1 ? "" : "s"
      } before sending another, or email ${contact.email} directly.`,
    };
  }

  const parsed = ContactSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    message: formData.get("message") ?? "",
    website: honeypot,
  });

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        message: fieldErrors.message?.[0],
      },
    };
  }

  const { name, email, message } = parsed.data;

  if (hasDatabase) {
    try {
      const db = getDb();
      await db
        .insert(schema.messages)
        .values({ name, email, message, ipHash });
    } catch (err) {
      console.error("contact: db insert failed", err);
      return {
        status: "error",
        message: `We couldn't save your message right now. Please email ${contact.email} directly.`,
      };
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress =
    process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: fromAddress,
        to: contact.email,
        replyTo: email,
        subject: `Portfolio message from ${name}`,
        react: ContactMessageEmail({ name, email, message }),
      });
      if (error) {
        console.error("contact: resend error", error);
      }
    } catch (err) {
      console.error("contact: resend threw", err);
    }
  }

  return successState();
}

function successState(): ContactState {
  return {
    status: "success",
    message: `Thanks — your message is in. I'll reply within a business day from ${contact.email}.`,
  };
}
