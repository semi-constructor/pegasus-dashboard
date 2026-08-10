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
 channelId?: string | null;
 requirementChannelId?: string | null;
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
 channelId: data.channelId || null,
 requirementChannelId: data.requirementChannelId || null,
 });
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 console.error("Failed to create achievement:", error);
 return { success: false, error:"Failed to create achievement"};
}
}

export async function updateAchievement(
 guildId: string,
 id: string,
 data: {
 achievementId: string;
 title: string;
 description: string;
 requirementType: string;
 requirementValue: number;
 rewardXp?: number;
 rewardCoins?: number;
 channelId?: string | null;
 requirementChannelId?: string | null;
 }
) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .update(achievements)
 .set({
 achievementId: data.achievementId,
 title: data.title,
 description: data.description,
 requirementType: data.requirementType,
 requirementValue: data.requirementValue,
 rewardXp: data.rewardXp || 0,
 rewardCoins: data.rewardCoins || 0,
 channelId: data.channelId || null,
 requirementChannelId: data.requirementChannelId || null,
 })
 .where(and(eq(achievements.id, id), eq(achievements.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/settings`);
 return { success: true };
 } catch (error) {
 console.error("Failed to update achievement:", error);
 return { success: false, error:"Failed to update achievement"};
 }
}

export async function deleteAchievement(guildId: string, id: string) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .delete(achievements)
 .where(and(eq(achievements.id, id), eq(achievements.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/settings`);
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
 channelId?: string | null;
 requirementChannelId?: string | null;
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
 channelId: data.channelId || null,
 requirementChannelId: data.requirementChannelId || null,
 activeUntil: data.activeUntil,
 });
 revalidatePath(`/dashboard/${guildId}/settings`);
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
 revalidatePath(`/dashboard/${guildId}/settings`);
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

// ── Birthdays ───────────────────────────────────────────
export async function saveBirthdaySettings(
  guildId: string,
  data: { channelId: string | null; message: string; enabled: boolean }
) {
  await requireGuildAdmin(guildId);
  try {
    const { birthdaySettings } = await import("@/../schemas/birthdays");
    await db
      .insert(birthdaySettings)
      .values({
        guildId,
        channelId: data.channelId,
        message: data.message,
        enabled: data.enabled,
      })
      .onConflictDoUpdate({
        target: birthdaySettings.guildId,
        set: {
          channelId: data.channelId,
          message: data.message,
          enabled: data.enabled,
        },
      });
    revalidatePath(`/dashboard/${guildId}/engagement`);
    return { success: true };
  } catch (error) {
    console.error("Failed to save birthday settings:", error);
    return { success: false, error: "Failed to save birthday settings" };
  }
}

// ── Social Feeds ───────────────────────────────────────────
export async function createSocialFeed(
  guildId: string,
  data: {
    feedType: string;
    feedUrl: string;
    channelId: string;
    mentionRole: string | null;
    customMessage: string | null;
    enabled: boolean;
    youtubeLongformOnly?: boolean;
  }
) {
  await requireGuildAdmin(guildId);
  try {
    const { socialFeeds } = await import("@/../schemas/social_feeds");
    let finalFeedUrl = data.feedUrl;
    if (data.feedType === 'youtube' && !finalFeedUrl.startsWith('http')) {
      finalFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${finalFeedUrl}`;
    }

    await db.insert(socialFeeds).values({
      guildId,
      feedType: data.feedType,
      feedUrl: finalFeedUrl,
      channelId: data.channelId,
      mentionRole: data.mentionRole,
      customMessage: data.customMessage,
      enabled: data.enabled,
      youtubeLongformOnly: data.youtubeLongformOnly || false,
    });
    revalidatePath(`/dashboard/${guildId}/engagement`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create social feed:", error);
    return { success: false, error: "Failed to create social feed" };
  }
}

export async function updateSocialFeed(
  guildId: string,
  id: string,
  data: {
    feedType: string;
    feedUrl: string;
    channelId: string;
    mentionRole: string | null;
    customMessage: string | null;
    enabled: boolean;
    youtubeLongformOnly?: boolean;
  }
) {
  await requireGuildAdmin(guildId);
  try {
    const { socialFeeds } = await import("@/../schemas/social_feeds");
    let finalFeedUrl = data.feedUrl;
    if (data.feedType === 'youtube' && !finalFeedUrl.startsWith('http')) {
      finalFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${finalFeedUrl}`;
    }

    await db
      .update(socialFeeds)
      .set({
        feedType: data.feedType,
        feedUrl: finalFeedUrl,
        channelId: data.channelId,
        mentionRole: data.mentionRole,
        customMessage: data.customMessage,
        enabled: data.enabled,
        youtubeLongformOnly: data.youtubeLongformOnly || false,
        updatedAt: new Date(),
      })
      .where(and(eq(socialFeeds.id, id), eq(socialFeeds.guildId, guildId)));
    
    revalidatePath(`/dashboard/${guildId}/engagement`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update social feed:", error);
    return { success: false, error: "Failed to update social feed" };
  }
}

export async function deleteSocialFeed(guildId: string, id: string) {
  await requireGuildAdmin(guildId);
  try {
    const { socialFeeds } = await import("@/../schemas/social_feeds");
    await db
      .delete(socialFeeds)
      .where(and(eq(socialFeeds.id, id), eq(socialFeeds.guildId, guildId)));
    revalidatePath(`/dashboard/${guildId}/engagement`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete social feed" };
  }
}
