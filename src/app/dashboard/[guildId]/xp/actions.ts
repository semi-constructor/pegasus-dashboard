"use server";

import { db } from"@/lib/db";
import { xpSettings, xpRewards, xpMultipliers, userXp } from"@/../schemas/xp";
import { eq, and, desc } from"drizzle-orm";
import { revalidatePath } from"next/cache";
import { requireGuildAdmin } from"@/lib/auth-guard";

// ── XP Settings ────────────────────────────────────────────────
export async function getXpSettings(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 const res = await db
 .select()
 .from(xpSettings)
 .where(eq(xpSettings.guildId, guildId))
 .limit(1);
 return res[0] || null;
 } catch (error) {
 console.error("Failed to fetch XP settings:", error);
 return null;
 }
}

export async function saveXpSettings(guildId: string, data: any) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .insert(xpSettings)
 .values({
 guildId,
 ...data,
 })
 .onConflictDoUpdate({
 target: xpSettings.guildId,
 set: {
 ...data,
 updatedAt: new Date(),
 },
 });
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
 return await db
 .select()
 .from(xpRewards)
 .where(eq(xpRewards.guildId, guildId))
 .orderBy(xpRewards.level);
 } catch (error) {
 console.error("Failed to fetch XP rewards:", error);
 return [];
 }
}

export async function createXpReward(guildId: string, level: number, roleId: string) {
 await requireGuildAdmin(guildId);
 try {
 await db.insert(xpRewards).values({
 guildId,
 level,
 roleId,
 });
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
 await db
 .delete(xpRewards)
 .where(
 and(
 eq(xpRewards.guildId, guildId),
 eq(xpRewards.level, level),
 eq(xpRewards.roleId, roleId)
 )
 );
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
 return await db
 .select()
 .from(xpMultipliers)
 .where(eq(xpMultipliers.guildId, guildId));
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
 await db.insert(xpMultipliers).values({
 guildId,
 targetId,
 targetType,
 multiplier,
 });
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
 await db
 .delete(xpMultipliers)
 .where(
 and(
 eq(xpMultipliers.guildId, guildId),
 eq(xpMultipliers.targetId, targetId),
 eq(xpMultipliers.targetType, targetType)
 )
 );
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
 return await db
 .select()
 .from(userXp)
 .where(eq(userXp.guildId, guildId))
 .orderBy(desc(userXp.xp))
 .limit(100);
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
 await db
 .insert(userXp)
 .values({
 userId,
 guildId,
 xp,
 level,
 prestigeLevel,
 lastXpGain: new Date(),
 })
 .onConflictDoUpdate({
 target: [userXp.userId, userXp.guildId],
 set: {
 xp,
 level,
 prestigeLevel,
 updatedAt: new Date(),
 },
 });

 revalidatePath(`/dashboard/${guildId}/xp`);
 return { success: true };
 } catch (error) {
 console.error("Failed to override user XP:", error);
 return { success: false, error:"Failed to update user XP"};
 }
}
