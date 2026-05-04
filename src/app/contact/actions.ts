"use server";

import { Resend } from "resend";
import { z } from "zod";
import { getDb, hasDatabase, schema } from "@/lib/db";
import ContactMessageEmail from "@/emails/ContactMessage";
import { contact } from "@/lib/content";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
};

const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(200, "Email is too long."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message is too long."),
  // honeypot - must be empty
  website: z.string().max(0, "Spam detected.").optional(),
});

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = ContactSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    message: formData.get("message") ?? "",
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors: {
        name: flat.name?.[0],
        email: flat.email?.[0],
        message: flat.message?.[0],
      },
    };
  }

  const { name, email, message } = parsed.data;

  if (hasDatabase) {
    try {
      const db = getDb();
      await db.insert(schema.messages).values({ name, email, message });
    } catch (err) {
      console.error("contact: db insert failed", err);
      return {
        status: "error",
        message:
          "We couldn't save your message right now. Please email " +
          contact.email +
          " directly.",
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

  return {
    status: "success",
    message:
      "Thanks — your message is in. I'll reply within a business day from " +
      contact.email +
      ".",
  };
}

export const initialContactState: ContactState = {
  status: "idle",
  message: "",
};
