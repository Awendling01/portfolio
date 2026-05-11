"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb, hasDatabase, schema } from "@/lib/db";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/auth";

// Server actions are POST-able from anywhere if the encoded action ID
// leaks, so re-verify the session on every call. proxy.ts gates the
// /admin pages themselves, but defense-in-depth here is cheap.
async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session || !(await verifySession(session))) {
    throw new Error("unauthorized");
  }
}

function parseId(formData: FormData): number {
  const raw = formData.get("id");
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("invalid id");
  }
  return id;
}

export async function markMessageRead(formData: FormData): Promise<void> {
  await requireAdmin();
  if (!hasDatabase) return;
  const id = parseId(formData);
  const db = getDb();
  await db
    .update(schema.messages)
    .set({ readAt: new Date() })
    .where(eq(schema.messages.id, id));
  revalidatePath("/admin/messages");
}

export async function toggleMessageResponded(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  if (!hasDatabase) return;
  const id = parseId(formData);
  const db = getDb();
  const [row] = await db
    .select({ respondedAt: schema.messages.respondedAt })
    .from(schema.messages)
    .where(eq(schema.messages.id, id))
    .limit(1);
  if (!row) return;
  // Flipping responded ON also marks read (you can't respond to something
  // you haven't read). Flipping it off leaves read state alone.
  await db
    .update(schema.messages)
    .set(
      row.respondedAt
        ? { respondedAt: null }
        : { respondedAt: new Date(), readAt: new Date() },
    )
    .where(eq(schema.messages.id, id));
  revalidatePath("/admin/messages");
}

export async function softDeleteMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  if (!hasDatabase) return;
  const id = parseId(formData);
  const db = getDb();
  await db
    .update(schema.messages)
    .set({ deletedAt: new Date() })
    .where(eq(schema.messages.id, id));
  revalidatePath("/admin/messages");
}

export async function restoreMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  if (!hasDatabase) return;
  const id = parseId(formData);
  const db = getDb();
  await db
    .update(schema.messages)
    .set({ deletedAt: null })
    .where(eq(schema.messages.id, id));
  revalidatePath("/admin/messages");
}
