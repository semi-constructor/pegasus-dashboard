"use server";

import { db } from"@/lib/db";
import { achievements, engagementQuests, userReputation } from"@/../schemas/engagement";
import { eq, and, desc } from"drizzle-orm";
import { revalidatePath } from"next/cache";
import { requireGuildAdmin } from"@/lib/auth-guard";

// ── Achievements CRUD ──────────────────────────────────────────
export async function getAchievements(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(achievements)
 .where(eq(achievements.guildId, guildId))
 .orderBy(desc(achievements.createdAt));
 } catch (error) {
 console.error("Failed to fetch achievements:", error);
 return [];
 }
}

export async function createAchievement(
 guildId: string,
 data: {
 achievementId: string;
 title: string;
 description: string;
 requirementType: string;
 requirementValue: number;
 rewardXp?: number;
 rewardCoins?: number;
 }
) {
 await requireGuildAdmin(guildId);
 try {
 await db.insert(achievements).values({
 guildId,
 achievementId: data.achievementId,
 title: data.title,
 description: data.description,
 requirementType: data.requirementType,
 requirementValue: data.requirementValue,
 rewardXp: data.rewardXp || 0,
 rewardCoins: data.rewardCoins || 0,
 });
 revalidatePath(`/dashboard/${guildId}/engagement`);
 return { success: true };
 } catch (error) {
 console.error("Failed to create achievement:", error);
 return { success: false, error:"Failed to create achievement"};
 }
}

export async function deleteAchievement(guildId: string, id: string) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .delete(achievements)
 .where(and(eq(achievements.id, id), eq(achievements.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/engagement`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete achievement"};
 }
}

// ── Quests CRUD ────────────────────────────────────────────────
export async function getQuests(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(engagementQuests)
 .where(eq(engagementQuests.guildId, guildId))
 .orderBy(desc(engagementQuests.createdAt));
 } catch (error) {
 console.error("Failed to fetch quests:", error);
 return [];
 }
}

export async function createQuest(
 guildId: string,
 data: {
 questId: string;
 title: string;
 description: string;
 type: string; // daily | weekly | event
 targetType: string;
 targetValue: number;
 rewardXp?: number;
 rewardCoins?: number;
 activeUntil: Date;
 }
) {
 await requireGuildAdmin(guildId);
 try {
 await db.insert(engagementQuests).values({
 guildId,
 questId: data.questId,
 title: data.title,
 description: data.description,
 type: data.type,
 targetType: data.targetType,
 targetValue: data.targetValue,
 rewardXp: data.rewardXp || 0,
 rewardCoins: data.rewardCoins || 0,
 activeUntil: data.activeUntil,
 });
 revalidatePath(`/dashboard/${guildId}/engagement`);
 return { success: true };
 } catch (error) {
 console.error("Failed to create quest:", error);
 return { success: false, error:"Failed to create quest"};
 }
}

export async function deleteQuest(guildId: string, id: string) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .delete(engagementQuests)
 .where(and(eq(engagementQuests.id, id), eq(engagementQuests.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/engagement`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete quest"};
 }
}

// ── User Reputation ───────────────────────────────────────────
export async function getUserReputation(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(userReputation)
 .where(eq(userReputation.guildId, guildId))
 .orderBy(desc(userReputation.createdAt))
 .limit(100);
 } catch (error) {
 return [];
 }
}
