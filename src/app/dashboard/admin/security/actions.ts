"use server";

import { db } from"@/lib/db";
import {
 securityLogs,
 blacklist,
 auditLogs,
 rateLimitViolations,
 securityIncidents,
 apiKeys,
} from"@/../schemas/security";
import { eq, desc } from"drizzle-orm";
import { revalidatePath } from"next/cache";
import { requireBotOwner } from"@/lib/auth-guard";

export async function getSecurityData() {
 await requireBotOwner();
 try {
 const [
 secLogs,
 blacklists,
 audits,
 rateLimits,
 incidents,
 keys,
 ] = await Promise.all([
 db.select().from(securityLogs).orderBy(desc(securityLogs.createdAt)).limit(100),
 db.select().from(blacklist).orderBy(desc(blacklist.createdAt)),
 db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(100),
 db.select().from(rateLimitViolations).orderBy(desc(rateLimitViolations.createdAt)).limit(100),
 db.select().from(securityIncidents).orderBy(desc(securityIncidents.createdAt)),
 db.select().from(apiKeys).orderBy(desc(apiKeys.createdAt)),
 ]);

 return {
 secLogs,
 blacklists,
 audits,
 rateLimits,
 incidents,
 keys,
 };
 } catch (error) {
 console.error("Failed to fetch security data:", error);
 return {
 secLogs: [],
 blacklists: [],
 audits: [],
 rateLimits: [],
 incidents: [],
 keys: [],
 };
 }
}

export async function addToBlacklist(
 entityType: string,
 entityId: string,
 reason: string
) {
 const { session } = await requireBotOwner();
 try {
 await db.insert(blacklist).values({
 entityType,
 entityId,
 reason,
 addedBy: session.user.discordId,
 active: true,
 });
 revalidatePath("/dashboard/admin/security");
 return { success: true };
 } catch (error) {
 console.error("Failed to add to blacklist:", error);
 return { success: false, error:"Failed to blacklist entity"};
 }
}

export async function toggleBlacklistStatus(id: string, active: boolean) {
 await requireBotOwner();
 try {
 await db.update(blacklist).set({ active, updatedAt: new Date() }).where(eq(blacklist.id, id));
 revalidatePath("/dashboard/admin/security");
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to update blacklist"};
 }
}

export async function updateIncidentStatus(incidentId: string, status: string) {
 const { session } = await requireBotOwner();
 try {
 await db
 .update(securityIncidents)
 .set({
 status,
 resolvedBy: session.user.discordId,
 resolvedAt: status ==="resolved"? new Date() : null,
 updatedAt: new Date(),
 })
 .where(eq(securityIncidents.id, incidentId));
 revalidatePath("/dashboard/admin/security");
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to update incident"};
 }
}
