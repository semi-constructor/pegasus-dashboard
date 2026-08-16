"use server";

import { revalidatePath } from "next/cache";
import { requireGuildAdmin } from "@/lib/auth-guard";
import {
  getAchievementsRepo,
  createAchievementRepo,
  updateAchievementRepo,
  deleteAchievementRepo,
  getQuestsRepo,
  createQuestRepo,
  deleteQuestRepo,
  getUserReputationRepo,
  saveBirthdaySettingsRepo,
  createSocialFeedRepo,
  updateSocialFeedRepo,
  deleteSocialFeedRepo,
} from "@/lib/repository/engagement";

// ── Achievements CRUD ──────────────────────────────────────────
export async function getAchievements(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await getAchievementsRepo(guildId);
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
    const result = await createAchievementRepo(guildId, {
      ...data,
      rewardXp: data.rewardXp || 0,
      rewardCoins: data.rewardCoins || 0,
      channelId: data.channelId || null,
      requirementChannelId: data.requirementChannelId || null,
    });
    if (!result.success) return result;
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create achievement:", error);
    return { success: false, error: "Failed to create achievement" };
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
    const result = await updateAchievementRepo(guildId, id, {
      ...data,
      rewardXp: data.rewardXp || 0,
      rewardCoins: data.rewardCoins || 0,
      channelId: data.channelId || null,
      requirementChannelId: data.requirementChannelId || null,
    });
    if (!result.success) return result;
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update achievement:", error);
    return { success: false, error: "Failed to update achievement" };
  }
}

export async function deleteAchievement(guildId: string, id: string) {
  await requireGuildAdmin(guildId);
  try {
    const result = await deleteAchievementRepo(guildId, id);
    if (!result.success) return result;
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete achievement" };
  }
}

// ── Quests CRUD ────────────────────────────────────────────────
export async function getQuests(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await getQuestsRepo(guildId);
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
    const result = await createQuestRepo(guildId, {
      ...data,
      rewardXp: data.rewardXp || 0,
      rewardCoins: data.rewardCoins || 0,
      channelId: data.channelId || null,
      requirementChannelId: data.requirementChannelId || null,
    });
    if (!result.success) return result;
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create quest:", error);
    return { success: false, error: "Failed to create quest" };
  }
}

export async function deleteQuest(guildId: string, id: string) {
  await requireGuildAdmin(guildId);
  try {
    const result = await deleteQuestRepo(guildId, id);
    if (!result.success) return result;
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete quest" };
  }
}

// ── User Reputation ───────────────────────────────────────────
export async function getUserReputation(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await getUserReputationRepo(guildId);
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
    const result = await saveBirthdaySettingsRepo(guildId, data);
    if (!result.success) return result;
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
    let finalFeedUrl = data.feedUrl;
    if (data.feedType === 'youtube' && !finalFeedUrl.startsWith('http')) {
      finalFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${finalFeedUrl}`;
    }

    const result = await createSocialFeedRepo(guildId, {
      ...data,
      feedUrl: finalFeedUrl,
      youtubeLongformOnly: data.youtubeLongformOnly || false,
    });
    if (!result.success) return result;
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
    let finalFeedUrl = data.feedUrl;
    if (data.feedType === 'youtube' && !finalFeedUrl.startsWith('http')) {
      finalFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${finalFeedUrl}`;
    }

    const result = await updateSocialFeedRepo(guildId, id, {
      ...data,
      feedUrl: finalFeedUrl,
      youtubeLongformOnly: data.youtubeLongformOnly || false,
    });
    if (!result.success) return result;
    
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
    const result = await deleteSocialFeedRepo(guildId, id);
    if (!result.success) return result;
    revalidatePath(`/dashboard/${guildId}/engagement`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete social feed" };
  }
}
