"use server";

import { auth } from"@/auth";
import { db } from"@/lib/db";
import { authenticators } from"../../../../../schemas";
import { and, eq } from"drizzle-orm";
import { revalidatePath } from"next/cache";

export async function deletePasskey(credentialID: string) {
 const session = await auth();
 if (!session?.user?.id) throw new Error("Unauthorized");

 await db
 .delete(authenticators)
 .where(
 and(
 eq(authenticators.userId, session.user.id),
 eq(authenticators.credentialID, credentialID)
 )
 );

 revalidatePath("/dashboard/profile/passkeys");
}

export async function renamePasskey(credentialID: string, newName: string) {
 const session = await auth();
 if (!session?.user?.id) throw new Error("Unauthorized");

 await db
 .update(authenticators)
 .set({ name: newName })
 .where(
 and(
 eq(authenticators.userId, session.user.id),
 eq(authenticators.credentialID, credentialID)
 )
 );

 revalidatePath("/dashboard/profile/passkeys");
}
