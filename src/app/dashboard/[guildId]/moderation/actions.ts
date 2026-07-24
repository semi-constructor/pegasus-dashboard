"use server";

import { db } from"@/lib/db";
import {
 modCases,
 warnings,
 warningAutomations,
 modLogSettings,
 wordFilterRules,
} from"@/../schemas/moderation";
import { eq, and, desc } from"drizzle-orm";
import { revalidatePath } from"next/cache";
import { requireGuildAdmin } from"@/lib/auth-guard";

// ── Mod Cases ──────────────────────────────────────────────────
export async function getModCases(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(modCases)
 .where(eq(modCases.guildId, guildId))
 .orderBy(desc(modCases.createdAt))
 .limit(100);
 } catch (error) {
 console.error("Failed to fetch mod cases:", error);
 return [];
 }
}

// ── Warnings CRUD ──────────────────────────────────────────────
export async function getWarnings(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(warnings)
 .where(eq(warnings.guildId, guildId))
 .orderBy(desc(warnings.createdAt))
 .limit(100);
 } catch (error) {
 console.error("Failed to fetch warnings:", error);
 return [];
 }
}

export async function createWarning(
 guildId: string,
 data: {
 userId: string;
 title: string;
 description?: string;
 level?: number;
 proof?: string;
 }
) {
 const { session } = await requireGuildAdmin(guildId);
 try {
 const warnId = `WARN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
 await db.insert(warnings).values({
 warnId,
 guildId,
 userId: data.userId,
 moderatorId: session.user.discordId,
 title: data.title,
 description: data.description || null,
 level: data.level || 1,
 proof: data.proof || null,
 active: true,
 });
 revalidatePath(`/dashboard/${guildId}/moderation`);
 return { success: true };
 } catch (error) {
 console.error("Failed to create warning:", error);
 return { success: false, error:"Failed to issue warning"};
 }
}

export async function toggleWarningStatus(guildId: string, warningId: number, active: boolean) {
 const { session } = await requireGuildAdmin(guildId);
 try {
 await db
 .update(warnings)
 .set({
 active,
 editedAt: new Date(),
 editedBy: session.user.discordId,
 })
 .where(and(eq(warnings.id, warningId), eq(warnings.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/moderation`);
 return { success: true };
 } catch (error) {
 console.error("Failed to update warning status:", error);
 return { success: false, error:"Failed to update warning status"};
 }
}

export async function deleteWarning(guildId: string, warningId: number) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .delete(warnings)
 .where(and(eq(warnings.id, warningId), eq(warnings.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/moderation`);
 return { success: true };
 } catch (error) {
 console.error("Failed to delete warning:", error);
 return { success: false, error:"Failed to delete warning"};
 }
}

// ── Warning Automations CRUD ────────────────────────────────────
export async function getWarningAutomations(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(warningAutomations)
 .where(eq(warningAutomations.guildId, guildId))
 .orderBy(desc(warningAutomations.createdAt));
 } catch (error) {
 console.error("Failed to fetch warning automations:", error);
 return [];
 }
}

export async function createWarningAutomation(
 guildId: string,
 data: {
 name: string;
 description?: string;
 triggerType: string; // warn_count | warn_level
 triggerValue: number;
 actions: any;
 notifyChannelId?: string;
 notifyMessage?: string;
 }
) {
 const { session } = await requireGuildAdmin(guildId);
 try {
 const automationId = `AUTO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
 await db.insert(warningAutomations).values({
 automationId,
 guildId,
 name: data.name,
 description: data.description || null,
 triggerType: data.triggerType,
 triggerValue: data.triggerValue,
 actions: data.actions,
 notifyChannelId: data.notifyChannelId || null,
 notifyMessage: data.notifyMessage || null,
 enabled: true,
 createdBy: session.user.discordId,
 });
 revalidatePath(`/dashboard/${guildId}/moderation`);
 return { success: true };
 } catch (error) {
 console.error("Failed to create warning automation:", error);
 return { success: false, error:"Failed to create warning automation"};
 }
}

export async function deleteWarningAutomation(guildId: string, id: number) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .delete(warningAutomations)
 .where(and(eq(warningAutomations.id, id), eq(warningAutomations.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/moderation`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete warning automation"};
 }
}

// ── Word Filters CRUD ──────────────────────────────────────────
export async function getWordFilters(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(wordFilterRules)
 .where(eq(wordFilterRules.guildId, guildId))
 .orderBy(desc(wordFilterRules.createdAt));
 } catch (error) {
 console.error("Failed to fetch word filters:", error);
 return [];
 }
}

export async function createWordFilterRule(
 guildId: string,
 data: {
 pattern: string;
 matchType: string;
 caseSensitive: boolean;
 wholeWord: boolean;
 severity: string;
 autoDelete: boolean;
 notifyChannelId?: string;
 actions: any;
 }
) {
 const { session } = await requireGuildAdmin(guildId);
 try {
 await db.insert(wordFilterRules).values({
 guildId,
 pattern: data.pattern,
 matchType: data.matchType,
 caseSensitive: data.caseSensitive,
 wholeWord: data.wholeWord,
 severity: data.severity,
 autoDelete: data.autoDelete,
 notifyChannelId: data.notifyChannelId || null,
 actions: data.actions,
 createdBy: session.user.discordId,
 });
 revalidatePath(`/dashboard/${guildId}/moderation`);
 return { success: true };
 } catch (error) {
 console.error("Failed to create word filter rule:", error);
 return { success: false, error:"Failed to create word filter rule"};
 }
}

export async function deleteWordFilterRule(guildId: string, id: number) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .delete(wordFilterRules)
 .where(and(eq(wordFilterRules.id, id), eq(wordFilterRules.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/moderation`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete word filter rule"};
 }
}

// ── Mod Log Settings CRUD ──────────────────────────────────────
export async function getModLogSettings(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(modLogSettings)
 .where(eq(modLogSettings.guildId, guildId));
 } catch (error) {
 console.error("Failed to fetch mod log settings:", error);
 return [];
 }
}

export async function saveModLogSetting(
 guildId: string,
 data: { category: string; channelId: string; enabled: boolean }
) {
 await requireGuildAdmin(guildId);
 try {
 const existing = await db
 .select()
 .from(modLogSettings)
 .where(
 and(
 eq(modLogSettings.guildId, guildId),
 eq(modLogSettings.category, data.category)
 )
 )
 .limit(1);

 if (existing.length > 0) {
 await db
 .update(modLogSettings)
 .set({
 channelId: data.channelId,
 enabled: data.enabled,
 updatedAt: new Date(),
 })
 .where(eq(modLogSettings.id, existing[0].id));
 } else {
 await db.insert(modLogSettings).values({
 guildId,
 category: data.category,
 channelId: data.channelId,
 enabled: data.enabled,
 });
 }

 revalidatePath(`/dashboard/${guildId}/moderation`);
 return { success: true };
 } catch (error) {
 console.error("Failed to save mod log setting:", error);
 return { success: false, error:"Failed to save mod log setting"};
 }
}
