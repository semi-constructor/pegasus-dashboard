"use server";

import { revalidatePath } from "next/cache";
import { saveGuildConfigRepo, saveGuildSettingsRepo, resetGuildSettingsRepo } from "@/lib/repository/settings";
import { invalidateCache } from"@/lib/redis";
import { requireGuildAdmin } from"@/lib/auth-guard";
import { getGuildChannels, getGuildRoles } from"@/lib/discord-api";
import type { ChannelOption } from"@/components/dashboard/pickers/DiscordChannelPicker";
import type { RoleOption } from"@/components/dashboard/pickers/DiscordRolePicker";

// ── Data Fetching ──────────────────────────────────────────────

export async function fetchGuildChannels(guildId: string): Promise<ChannelOption[]> {
 await requireGuildAdmin(guildId);
 const channels = await getGuildChannels(guildId,"text");
 return channels.map((c) => ({
 id: c.id,
 name: c.name,
 type: c.type,
 parent_id: c.parent_id,
 }));
}

export async function fetchGuildRoles(guildId: string): Promise<RoleOption[]> {
 await requireGuildAdmin(guildId);
 const roles = await getGuildRoles(guildId);
 return roles.map((r) => ({
 id: r.id,
 name: r.name,
 color: r.color,
 position: r.position,
 }));
}

export async function fetchAllGuildChannels(guildId: string): Promise<ChannelOption[]> {
 await requireGuildAdmin(guildId);
 const channels = await getGuildChannels(guildId,"all");
 return channels.map((c) => ({
 id: c.id,
 name: c.name,
 type: c.type,
 parent_id: c.parent_id,
 }));
}

// ── Guild Config (guilds table) ────────────────────────────────

export async function saveGuildConfig(
 guildId: string,
 data: { prefix: string; language: string }
) {
 await requireGuildAdmin(guildId);

 try {
    const result = await saveGuildConfigRepo(guildId, data);
    if (!result.success) return result;

 await invalidateCache(`guild:${guildId}:settings`);
 revalidatePath(`/dashboard/${guildId}/settings`);
 revalidatePath(`/dashboard/${guildId}`);
 return { success: true };
 } catch (error) {
 console.error("Failed to update guild config:", error);
 return { success: false, error:"Failed to update config"};
 }
}

// ── Guild Settings (guild_settings table) ──────────────────────

export interface GuildSettingsFormData {
 // Welcome
 welcomeEnabled: boolean;
 welcomeChannel: string | null;
 welcomeMessage: string | null;
 welcomeEmbedEnabled: boolean;
 welcomeEmbedColor: string | null;
 welcomeEmbedTitle: string | null;
 welcomeImageEnabled: boolean;
 welcomeEmbedImage: string | null;
 welcomeEmbedThumbnail: string | null;
 welcomeDmEnabled: boolean;
 welcomeDmMessage: string | null;
 // Goodbye
 goodbyeEnabled: boolean;
 goodbyeChannel: string | null;
 goodbyeMessage: string | null;
 goodbyeEmbedEnabled: boolean;
 goodbyeEmbedColor: string | null;
 goodbyeEmbedTitle: string | null;
 goodbyeImageEnabled: boolean;
 goodbyeEmbedImage: string | null;
 goodbyeEmbedThumbnail: string | null;
 // Logging
 logsEnabled: boolean;
 logsChannel: string | null;
 // XP
 xpEnabled: boolean;
 xpRate: number;
 xpPerMessage: number;
 xpPerVoiceMinute: number;
 xpCooldown: number;
 xpAnnounceLevelUp: boolean;
 xpBoosterRole: string | null;
 xpBoosterMultiplier: number;
 levelUpMessage: string | null;
 levelUpChannel: string | null;
 achievementsChannel: string | null;
 // Autorole
 autoroleEnabled: boolean;
 autoroleRoles: string; // JSON string of role IDs
 // AI Assistant
 aiEnabled: boolean;
 aiChannel: string | null;
 aiPersona: string;
 // Security
 securityEnabled: boolean;
 securityAlertRole: string | null;
 antiRaidEnabled: boolean;
 antiSpamEnabled: boolean;
 maxMentions: number;
 maxDuplicates: number;
 // Public
 publicLevels: boolean;
 publicEco: boolean;
 // V3 Features
 honeypotChannelId: string | null;
 stickies: string;
}

export async function saveGuildSettings(
 guildId: string,
 data: GuildSettingsFormData
) {
 await requireGuildAdmin(guildId);

 try {
    const result = await saveGuildSettingsRepo(guildId, data);
    if (!result.success) return result;

 await invalidateCache(`guild:${guildId}:settings`);
 revalidatePath(`/dashboard/${guildId}/settings`);
 revalidatePath(`/dashboard/${guildId}`);
 return { success: true };
 } catch (error) {
 console.error("Failed to update guild settings:", error);
 return { success: false, error:"Failed to update settings"};
 }
}

// ── Reset ──────────────────────────────────────────────────────

export async function resetGuildSettingsAction(guildId: string) {
 await requireGuildAdmin(guildId);

 try {
    const result = await resetGuildSettingsRepo(guildId);
    if (!result?.success) return result;
 await invalidateCache(`guild:${guildId}:settings`);
 revalidatePath(`/dashboard/${guildId}`);
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 console.error("Failed to reset guild settings:", error);
 return { success: false, error:"Failed to reset settings"};
 }
}
