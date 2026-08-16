import { db } from "@/lib/db";
import { achievements, engagementQuests, userReputation } from "schemas/engagement";
import { birthdaySettings } from "schemas/birthdays";
import { socialFeeds } from "schemas/social_feeds";
import { eq, and, desc } from "drizzle-orm";
import { getGuildContext } from "./guild";

export async function getAchievementsRepo(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/engagement/achievements/${guildId}`, { headers: { Authorization: `Bearer ${context.apiToken}` } });
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  }
  return await db.select().from(achievements).where(eq(achievements.guildId, guildId)).orderBy(desc(achievements.createdAt));
}

export async function createAchievementRepo(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/engagement/achievements`, {
        method: "POST", headers: { Authorization: `Bearer ${context.apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ guildId, ...data })
      });
      return { success: res.ok };
    } catch (e) { return { success: false, error: "Failed" }; }
  }
  await db.insert(achievements).values({ guildId, ...data });
  return { success: true };
}

export async function updateAchievementRepo(guildId: string, id: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/engagement/achievements/${id}`, {
        method: "PATCH", headers: { Authorization: `Bearer ${context.apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ guildId, ...data })
      });
      return { success: res.ok };
    } catch (e) { return { success: false, error: "Failed" }; }
  }
  await db.update(achievements).set({ ...data }).where(and(eq(achievements.id, id as any), eq(achievements.guildId, guildId)));
  return { success: true };
}

export async function deleteAchievementRepo(guildId: string, id: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/engagement/achievements/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${context.apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ guildId })
      });
      return { success: res.ok };
    } catch (e) { return { success: false, error: "Failed" }; }
  }
  await db.delete(achievements).where(and(eq(achievements.id, id as any), eq(achievements.guildId, guildId)));
  return { success: true };
}

export async function getQuestsRepo(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/engagement/quests/${guildId}`, { headers: { Authorization: `Bearer ${context.apiToken}` } });
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  }
  return await db.select().from(engagementQuests).where(eq(engagementQuests.guildId, guildId)).orderBy(desc(engagementQuests.createdAt));
}

export async function createQuestRepo(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/engagement/quests`, {
        method: "POST", headers: { Authorization: `Bearer ${context.apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ guildId, ...data })
      });
      return { success: res.ok };
    } catch (e) { return { success: false, error: "Failed" }; }
  }
  await db.insert(engagementQuests).values({ guildId, ...data });
  return { success: true };
}

export async function deleteQuestRepo(guildId: string, id: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/engagement/quests/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${context.apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ guildId })
      });
      return { success: res.ok };
    } catch (e) { return { success: false, error: "Failed" }; }
  }
  await db.delete(engagementQuests).where(and(eq(engagementQuests.id, id as any), eq(engagementQuests.guildId, guildId)));
  return { success: true };
}

export async function getUserReputationRepo(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/engagement/reputation/${guildId}`, { headers: { Authorization: `Bearer ${context.apiToken}` } });
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  }
  return await db.select().from(userReputation).where(eq(userReputation.guildId, guildId)).orderBy(desc(userReputation.createdAt)).limit(100);
}

export async function saveBirthdaySettingsRepo(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/engagement/birthdays`, {
        method: "POST", headers: { Authorization: `Bearer ${context.apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ guildId, ...data })
      });
      return { success: res.ok };
    } catch (e) { return { success: false, error: "Failed" }; }
  }
  await db.insert(birthdaySettings).values({ guildId, ...data }).onConflictDoUpdate({
    target: birthdaySettings.guildId, set: { ...data }
  });
  return { success: true };
}

export async function createSocialFeedRepo(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/engagement/socials`, {
        method: "POST", headers: { Authorization: `Bearer ${context.apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ guildId, ...data })
      });
      return { success: res.ok };
    } catch (e) { return { success: false, error: "Failed" }; }
  }
  await db.insert(socialFeeds).values({ guildId, ...data });
  return { success: true };
}

export async function updateSocialFeedRepo(guildId: string, id: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/engagement/socials/${id}`, {
        method: "PATCH", headers: { Authorization: `Bearer ${context.apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ guildId, ...data })
      });
      return { success: res.ok };
    } catch (e) { return { success: false, error: "Failed" }; }
  }
  await db.update(socialFeeds).set({ ...data, updatedAt: new Date() }).where(and(eq(socialFeeds.id, id as any), eq(socialFeeds.guildId, guildId)));
  return { success: true };
}

export async function deleteSocialFeedRepo(guildId: string, id: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/engagement/socials/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${context.apiToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ guildId })
      });
      return { success: res.ok };
    } catch (e) { return { success: false, error: "Failed" }; }
  }
  await db.delete(socialFeeds).where(and(eq(socialFeeds.id, id as any), eq(socialFeeds.guildId, guildId)));
  return { success: true };
}
