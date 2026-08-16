"use server";

import {
  repoGetXpSettings,
  repoSaveXpSettings,
  repoGetXpRewards,
  repoCreateXpReward,
  repoDeleteXpReward,
  repoGetXpMultipliers,
  repoCreateXpMultiplier,
  repoDeleteXpMultiplier,
  repoGetUserXpList,
  repoUpdateUserXpOverride
} from "@/lib/repository/xp";
import { revalidatePath } from"next/cache";
import { requireGuildAdmin } from"@/lib/auth-guard";

// ── XP Settings ────────────────────────────────────────────────
export async function getXpSettings(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 const res = await repoGetXpSettings(guildId);
 return res || null;
 } catch (error) {
 console.error("Failed to fetch XP settings:", error);
 return null;
 }
}

export async function saveXpSettings(guildId: string, data: any) {
 await requireGuildAdmin(guildId);
 try {
 await repoSaveXpSettings(guildId, data);
 revalidatePath(`/dashboard/${guildId}/xp`);
 return { success: true };
 } catch (error) {
 console.error("Failed to save XP settings:", error);
 return { success: false, error:"Failed to save XP settings"};
 }
}

// ── Level Rewards CRUD ─────────────────────────────────────────
export async function getXpRewards(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await repoGetXpRewards(guildId);
 } catch (error) {
 console.error("Failed to fetch XP rewards:", error);
 return [];
 }
}

export async function createXpReward(guildId: string, level: number, roleId: string) {
 await requireGuildAdmin(guildId);
 try {
 await repoCreateXpReward(guildId, level, roleId);
 revalidatePath(`/dashboard/${guildId}/xp`);
 return { success: true };
 } catch (error) {
 console.error("Failed to create XP reward:", error);
 return { success: false, error:"Failed to create level reward"};
 }
}

export async function deleteXpReward(guildId: string, level: number, roleId: string) {
 await requireGuildAdmin(guildId);
 try {
 await repoDeleteXpReward(guildId, level, roleId);
 revalidatePath(`/dashboard/${guildId}/xp`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete reward"};
 }
}

// ── XP Multipliers CRUD ────────────────────────────────────────
export async function getXpMultipliers(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await repoGetXpMultipliers(guildId);
 } catch (error) {
 console.error("Failed to fetch XP multipliers:", error);
 return [];
 }
}

export async function createXpMultiplier(
 guildId: string,
 targetId: string,
 targetType: string,
 multiplier: number
) {
 await requireGuildAdmin(guildId);
 try {
 await repoCreateXpMultiplier(guildId, targetId, targetType, multiplier);
 revalidatePath(`/dashboard/${guildId}/xp`);
 return { success: true };
 } catch (error) {
 console.error("Failed to create XP multiplier:", error);
 return { success: false, error:"Failed to create XP multiplier"};
 }
}

export async function deleteXpMultiplier(
 guildId: string,
 targetId: string,
 targetType: string
) {
 await requireGuildAdmin(guildId);
 try {
 await repoDeleteXpMultiplier(guildId, targetId, targetType);
 revalidatePath(`/dashboard/${guildId}/xp`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete multiplier"};
 }
}

// ── User XP Management & Leaderboard (User XP Override) ───────
export async function getUserXpList(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await repoGetUserXpList(guildId);
 } catch (error) {
 console.error("Failed to fetch user XP list:", error);
 return [];
 }
}

export async function updateUserXpOverride(
 guildId: string,
 userId: string,
 xp: number,
 level: number,
 prestigeLevel: number
) {
 await requireGuildAdmin(guildId);
 try {
 await repoUpdateUserXpOverride(guildId, userId, xp, level, prestigeLevel);

 revalidatePath(`/dashboard/${guildId}/xp`);
 return { success: true };
 } catch (error) {
 console.error("Failed to override user XP:", error);
 return { success: false, error:"Failed to update user XP"};
 }
}
