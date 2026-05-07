import { z } from "zod";

export const ContactFieldSchemas = {
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
} as const;

export const ContactSchema = z.object({
  ...ContactFieldSchemas,
  // honeypot — must be empty string. We accept submissions where this is
  // filled but silently succeed (see actions.ts) so spam bots don't learn.
  website: z.string().optional(),
});

export type ContactFieldName = keyof typeof ContactFieldSchemas;

export const ContactFieldNames: ContactFieldName[] = [
  "name",
  "email",
  "message",
];

export function validateField(
  name: ContactFieldName,
  value: string,
): string | undefined {
  const result = ContactFieldSchemas[name].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}
