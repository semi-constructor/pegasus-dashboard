"use server";

import { revalidatePath } from"next/cache";
import { invalidateCache } from "@/lib/redis";
import { requireGuildAdmin } from "@/lib/auth-guard";
import { updateGuildSettings, resetGuildSettings as resetGuildSettingsRepo, updateGuildConfig as updateGuildConfigRepo, getWordFilters as getWordFiltersRepo, createWordFilter as createWordFilterRepo, deleteWordFilter as deleteWordFilterRepo } from "@/lib/repository/guild";
import { getGiveawaysRepo, createGiveawayRepo, deleteGiveawayRepo } from "@/lib/repository/giveaway";
import { getJtcConfigRepo, saveJtcConfigRepo as updateJtcConfigRepo } from "@/lib/repository/jtc";
import { updateStarboardConfigRepo } from "@/lib/repository/starboard";

export async function updateLoggingSettings(guildId: string, data: { logsEnabled: boolean, logsChannel: string }) {
 await requireGuildAdmin(guildId);
 try {
 const success = await updateGuildSettings(guildId, data);
 if (!success) throw new Error("Failed to update settings via repository");
 
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
 await requireGuildAdmin(guildId);
 try {
 const success = await updateGuildSettings(guildId, data);
 if (!success) throw new Error("Failed to update settings via repository");
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
 await requireGuildAdmin(guildId);
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
 await requireGuildAdmin(guildId);
 try {
 const success = await resetGuildSettingsRepo(guildId);
 if (!success) throw new Error("Failed");
 await invalidateCache(`guild:${guildId}:settings`);
 revalidatePath(`/dashboard/${guildId}`);
 return { success: true };
 } catch (e) {
 return { success: false, error:"Failed to reset settings"};
 }
}
export async function updateGuildConfig(guildId: string, data: { prefix: string, language: string }) {
 await requireGuildAdmin(guildId);
 try {
 const success = await updateGuildConfigRepo(guildId, data);
 if (!success) throw new Error("Failed");
 await invalidateCache(`guild:${guildId}:settings`);
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 console.error("Failed to update guild config:", error);
 return { success: false, error:"Failed to update config"};
 }
}

export async function updateGuildSettingsData(guildId: string, data: any) {
 await requireGuildAdmin(guildId);
 try {
 const success = await updateGuildSettings(guildId, data);
 if (!success) throw new Error("Failed");
 await invalidateCache(`guild:${guildId}:settings`);
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 console.error("Failed to update guild settings:", error);
 return { success: false, error:"Failed to update settings"};
 }
}

export async function getGiveaways(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await getGiveawaysRepo(guildId);
 } catch (e) {
 return [];
 }
}

export async function createGiveaway(guildId: string, data: any) {
 await requireGuildAdmin(guildId);
 try {
 await createGiveawayRepo(guildId, data);
 revalidatePath(`/dashboard/${guildId}/giveaways`);
 return { success: true };
 } catch (error) {
 console.error("Failed to create giveaway:", error);
 return { success: false, error:"Failed to create giveaway"};
 }
}

export async function deleteGiveaway(guildId: string, giveawayId: string) {
 await requireGuildAdmin(guildId);
 try {
 await deleteGiveawayRepo(guildId, giveawayId);
 revalidatePath(`/dashboard/${guildId}/giveaways`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete giveaway"};
 }
}

export async function getWordFilters(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await getWordFiltersRepo(guildId);
 } catch (e) {
 return [];
 }
}

export async function createWordFilter(guildId: string, data: { pattern: string, severity: string, autoDelete: boolean }) {
 await requireGuildAdmin(guildId);
 try {
 await createWordFilterRepo(guildId, data);
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to create word filter"};
 }
}

export async function deleteWordFilter(guildId: string, id: number) {
 await requireGuildAdmin(guildId);
 try {
 await deleteWordFilterRepo(guildId, id);
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete word filter"};
 }
}

export async function getJtcConfig(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await getJtcConfigRepo(guildId);
 } catch (e) {
 return null;
 }
}

export async function updateJtcConfig(guildId: string, data: any) {
 await requireGuildAdmin(guildId);
 try {
 await updateJtcConfigRepo(guildId, data);
 revalidatePath(`/dashboard/${guildId}/jtc`);
 return { success: true };
 } catch (error) {
 console.error(error);
 return { success: false, error:"Failed to update JTC config"};
 }
}

import { searchGuildMembers, type DiscordMember, getGuild } from "@/lib/discord-api";

export async function searchDiscordMembersAction(guildId: string, query: string): Promise<DiscordMember[]> {
  await requireGuildAdmin(guildId);
  if (!query || query.length < 2) return [];
  return await searchGuildMembers(guildId, query, 15);
}

export async function getGuildInfoAction(guildId: string) {
  await requireGuildAdmin(guildId);
  return await getGuild(guildId);
}

export async function updateStarboardConfig(guildId: string, data: any) {
  await requireGuildAdmin(guildId);
  try {
    await updateStarboardConfigRepo(guildId, data);
    revalidatePath(`/dashboard/${guildId}/starboard`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update Starboard config" };
  }
}
