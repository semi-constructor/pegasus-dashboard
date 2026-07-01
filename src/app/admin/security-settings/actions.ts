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
  let internalUserId = session.user.id as string;
  if (!internalUserId || internalUserId === 'undefined') {
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const userCookie = cookieStore.get('discord_user')?.value;
    if (userCookie) {
      try {
        const discordId = JSON.parse(userCookie).id;
        const account = await db.query.accounts.findFirst({
          where: and(
            eq(accounts.providerAccountId, discordId),
            eq(accounts.provider, 'discord')
          )
        });
        if (account) {
          internalUserId = account.userId;
        }
      } catch(e) {}
    }
  }

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

  let internalUserId = session.user.id as string;
  if (!internalUserId || internalUserId === 'undefined') {
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const userCookie = cookieStore.get('discord_user')?.value;
    if (userCookie) {
      try {
        const discordId = JSON.parse(userCookie).id;
        const account = await db.query.accounts.findFirst({
          where: and(
            eq(accounts.providerAccountId, discordId),
            eq(accounts.provider, 'discord')
          )
        });
        if (account) {
          internalUserId = account.userId;
        }
      } catch(e) {}
    }
  }

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
