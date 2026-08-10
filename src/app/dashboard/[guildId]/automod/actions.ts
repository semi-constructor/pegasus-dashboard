"use server";

import { db } from"@/lib/db";
import { autoModRules, autoModInfractions, quarantineVault } from"@/../schemas/automod";
import { eq, and, desc } from"drizzle-orm";
import { revalidatePath } from"next/cache";
import { requireGuildAdmin } from"@/lib/auth-guard";

// ── AutoMod Rules CRUD ─────────────────────────────────────────
export async function getAutoModRules(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(autoModRules)
 .where(eq(autoModRules.guildId, guildId))
 .orderBy(desc(autoModRules.createdAt));
 } catch (error) {
 console.error("Failed to fetch automod rules:", error);
 return [];
 }
}

export async function createAutoModRule(
 guildId: string,
 data: {
 name: string;
 description?: string;
 eventType: string;
 triggerType: string;
 triggerMetadata: any;
 conditions: any;
 exemptRoles: string[];
 exemptChannels: string[];
 actions: any;
 enabled: boolean;
 }
) {
 const { session } = await requireGuildAdmin(guildId);
 try {
 await db.insert(autoModRules).values({
 guildId,
 name: data.name,
 description: data.description || null,
 eventType: data.eventType,
 triggerType: data.triggerType,
 triggerMetadata: data.triggerMetadata,
 conditions: data.conditions,
 exemptRoles: data.exemptRoles,
 exemptChannels: data.exemptChannels,
 actions: data.actions,
 enabled: data.enabled,
 createdBy: session.user.discordId,
 });
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 console.error("Failed to create automod rule:", error);
 return { success: false, error:"Failed to create AutoMod rule"};
 }
}

export async function toggleAutoModRule(guildId: string, ruleId: string, enabled: boolean) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .update(autoModRules)
 .set({ enabled, updatedAt: new Date() })
 .where(and(eq(autoModRules.id, ruleId), eq(autoModRules.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to toggle rule"};
 }
}

export async function deleteAutoModRule(guildId: string, ruleId: string) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .delete(autoModRules)
 .where(and(eq(autoModRules.id, ruleId), eq(autoModRules.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete rule"};
 }
}

// ── AutoMod Infractions List ───────────────────────────────────
export async function getAutoModInfractions(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(autoModInfractions)
 .where(eq(autoModInfractions.guildId, guildId))
 .orderBy(desc(autoModInfractions.createdAt))
 .limit(100);
 } catch (error) {
 console.error("Failed to fetch automod infractions:", error);
 return [];
 }
}

// ── Quarantine Vault ───────────────────────────────────────────
export async function getQuarantineVault(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(quarantineVault)
 .where(eq(quarantineVault.guildId, guildId))
 .orderBy(desc(quarantineVault.createdAt));
 } catch (error) {
 console.error("Failed to fetch quarantine vault:", error);
 return [];
 }
}

export async function releaseFromQuarantine(guildId: string, vaultId: string) {
 const { session } = await requireGuildAdmin(guildId);
 try {
 await db
 .update(quarantineVault)
 .set({
 released: true,
 releasedBy: session.user.discordId,
 releasedAt: new Date(),
 })
 .where(and(eq(quarantineVault.id, vaultId), eq(quarantineVault.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 console.error("Failed to release from quarantine:", error);
 return { success: false, error:"Failed to release user"};
 }
}
