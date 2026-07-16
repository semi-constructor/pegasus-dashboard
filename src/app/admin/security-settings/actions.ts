"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { authenticators, accounts } from "../../../../schemas/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deletePasskey(credentialID: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Get real database userId
  const internalUserId = session.user.id as string;
  if (!internalUserId) throw new Error("Could not verify internal user ID");

  await db.delete(authenticators).where(
    and(
      eq(authenticators.credentialID, credentialID),
      eq(authenticators.userId, internalUserId)
    )
  );

  revalidatePath("/admin/security-settings");
}

export async function renamePasskey(credentialID: string, newName: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const internalUserId = session.user.id as string;
  if (!internalUserId) throw new Error("Could not verify internal user ID");

  await db.update(authenticators)
    .set({ name: newName })
    .where(
      and(
        eq(authenticators.credentialID, credentialID),
        eq(authenticators.userId, internalUserId)
      )
    );

  revalidatePath("/admin/security-settings");
}
