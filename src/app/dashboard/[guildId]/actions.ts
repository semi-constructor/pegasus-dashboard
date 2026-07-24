"use server";

import { db } from"@/lib/db";
import { guildSettings } from"schemas/guilds";
import { eq } from"drizzle-orm";
import { revalidatePath } from"next/cache";
import { invalidateCache } from"@/lib/redis";

export async function updateLoggingSettings(guildId: string, data: { logsEnabled: boolean, logsChannel: string }) {
 try {
 await db.insert(guildSettings).values({
 guildId,
 logsEnabled: data.logsEnabled,
 logsChannel: data.logsChannel,
 }).onConflictDoUpdate({
 target: guildSettings.guildId,
 set: {
 logsEnabled: data.logsEnabled,
 logsChannel: data.logsChannel,
 updatedAt: new Date(),
 }
 });
 await invalidateCache(`guild:${guildId}:settings`);
 revalidatePath(`/dashboard/${guildId}/settings`);
 revalidatePath(`/dashboard/${guildId}`);
 return { success: true };
 } catch (error) {
 console.error("Failed to update logging settings:", error);
 return { success: false, error:"Failed to update settings"};
 }
}

export async function updateModerationSettings(guildId: string, data: { securityEnabled: boolean, antiRaidEnabled: boolean, antiSpamEnabled: boolean }) {
 try {
 await db.insert(guildSettings).values({
 guildId,
 ...data,
 }).onConflictDoUpdate({
 target: guildSettings.guildId,
 set: {
 ...data,
 updatedAt: new Date(),
 }
 });
 await invalidateCache(`guild:${guildId}:settings`);
 revalidatePath(`/dashboard/${guildId}/settings`);
 revalidatePath(`/dashboard/${guildId}`);
 return { success: true };
 } catch (error) {
 console.error("Failed to update moderation settings:", error);
 return { success: false, error:"Failed to update settings"};
 }
}

export async function getDiscordChannels(guildId: string) {
 try {
 const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
 headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
 next: { revalidate: 60 }
 });
 if (!res.ok) return [];
 const channels = await res.json();
 return channels.filter((c: any) => c.type === 0 || c.type === 5);
 } catch (e) {
 return [];
 }
}

export async function resetGuildSettings(guildId: string) {
 try {
 await db.delete(guildSettings).where(eq(guildSettings.guildId, guildId));
 await invalidateCache(`guild:${guildId}:settings`);
 revalidatePath(`/dashboard/${guildId}`);
 return { success: true };
 } catch (e) {
 return { success: false, error:"Failed to reset settings"};
 }
}
export async function updateGuildConfig(guildId: string, data: { prefix: string, language: string }) {
 try {
 const { guilds } = await import("schemas/guilds");
 await db.update(guilds).set({
 prefix: data.prefix,
 language: data.language,
 updatedAt: new Date()
 }).where(eq(guilds.id, guildId));
 await invalidateCache(`guild:${guildId}:settings`);
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 console.error("Failed to update guild config:", error);
 return { success: false, error:"Failed to update config"};
 }
}

export async function updateGuildSettingsData(guildId: string, data: any) {
 try {
 await db.insert(guildSettings).values({
 guildId,
 ...data,
 }).onConflictDoUpdate({
 target: guildSettings.guildId,
 set: {
 ...data,
 updatedAt: new Date(),
 }
 });
 await invalidateCache(`guild:${guildId}:settings`);
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 console.error("Failed to update guild settings:", error);
 return { success: false, error:"Failed to update settings"};
 }
}

export async function getGiveaways(guildId: string) {
 const { giveaways } = await import("schemas/giveaways");
 try {
 return await db.select().from(giveaways).where(eq(giveaways.guildId, guildId));
 } catch (e) {
 return [];
 }
}

export async function createGiveaway(guildId: string, data: any) {
 const { giveaways } = await import("schemas/giveaways");
 try {
 await db.insert(giveaways).values({
 giveawayId: Math.random().toString(36).substring(7),
 guildId,
 ...data,
 });
 revalidatePath(`/dashboard/${guildId}/giveaways`);
 return { success: true };
 } catch (error) {
 console.error("Failed to create giveaway:", error);
 return { success: false, error:"Failed to create giveaway"};
 }
}

export async function deleteGiveaway(guildId: string, giveawayId: string) {
 const { giveaways } = await import("schemas/giveaways");
 try {
 await db.delete(giveaways).where(eq(giveaways.giveawayId, giveawayId));
 revalidatePath(`/dashboard/${guildId}/giveaways`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete giveaway"};
 }
}

export async function getWordFilters(guildId: string) {
 const { wordFilterRules } = await import("schemas/moderation");
 try {
 return await db.select().from(wordFilterRules).where(eq(wordFilterRules.guildId, guildId));
 } catch (e) {
 return [];
 }
}

export async function createWordFilter(guildId: string, data: { pattern: string, severity: string, autoDelete: boolean }) {
 const { wordFilterRules } = await import("schemas/moderation");
 try {
 await db.insert(wordFilterRules).values({
 guildId,
 ...data,
 });
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to create word filter"};
 }
}

export async function deleteWordFilter(guildId: string, id: number) {
 const { wordFilterRules } = await import("schemas/moderation");
 try {
 await db.delete(wordFilterRules).where(eq(wordFilterRules.id, id));
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete word filter"};
 }
}

export async function getJtcConfig(guildId: string) {
 const { jtcConfigs } = await import("schemas/jtc");
 try {
 const res = await db.select().from(jtcConfigs).where(eq(jtcConfigs.guildId, guildId)).limit(1);
 return res[0] || null;
 } catch (e) {
 return null;
 }
}

export async function updateJtcConfig(guildId: string, data: any) {
 const { jtcConfigs } = await import("schemas/jtc");
 try {
 const existing = await getJtcConfig(guildId);
 if (!existing) {
 await db.insert(jtcConfigs).values({
 guildId,
 ...data,
 });
 } else {
 await db.update(jtcConfigs).set({
 ...data,
 updatedAt: new Date(),
 }).where(eq(jtcConfigs.guildId, guildId));
 }
 revalidatePath(`/dashboard/${guildId}/jtc`);
 return { success: true };
 } catch (error) {
 console.error(error);
 return { success: false, error:"Failed to update JTC config"};
 }
}
