"use server";

import { revalidatePath } from "next/cache";
import { requireGuildAdmin } from "@/lib/auth-guard";
import * as repo from "@/lib/repository/giveaways";
import { getGuildContext } from "@/lib/repository/guild";

export async function getGiveaways(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await repo.getGiveaways(guildId);
  } catch (error) {
    console.error("Failed to fetch giveaways:", error);
    return [];
  }
}

export async function createGiveaway(
  guildId: string,
  data: {
    channelId: string;
    prize: string;
    description?: string;
    winnerCount: number;
    endTime: Date;
    startTime?: Date;
    requirements: any;
    bonusEntries: any;
    embedTitle?: string;
    embedColor?: number;
    embedImage?: string;
  }
) {
  const { session } = await requireGuildAdmin(guildId);
  try {
    const context = await getGuildContext(guildId);
    const duration = data.endTime.getTime() - Date.now();
    const payload = {
        prize: data.prize,
        description: data.description,
        channelId: data.channelId,
        duration: duration > 0 ? duration : 60000,
        winnerCount: data.winnerCount,
        hostedBy: session.user.discordId,
        requiredRole: data.requirements?.requiredRole || undefined,
        bonusEntries: data.bonusEntries || [],
        embedTitle: data.embedTitle,
        embedColor: data.embedColor,
        embedImage: data.embedImage,
        startTime: data.startTime?.toISOString()
    };
    
    let res;
    if (context.isHosted) {
      res = await fetch(`${context.apiUrl}/guilds/${guildId}/giveaways`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${context.apiToken}`
        },
        body: JSON.stringify(payload)
      });
    } else {
      const apiUrl = process.env.API_URL || "http://localhost:2000";
      res = await fetch(`${apiUrl}/guilds/${guildId}/giveaways`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BOT_API_TOKEN}`
        },
        body: JSON.stringify(payload)
      });
    }

    if (!res.ok) {
      console.error('Bot API error:', await res.text());
      return { success: false, error: "Failed to create giveaway via Bot API" };
    }

    revalidatePath(`/dashboard/${guildId}/giveaways`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create giveaway:", error);
    return { success: false, error: "Failed to create giveaway" };
  }
}

export async function updateGiveawayStatus(
  guildId: string,
  giveawayId: string,
  status: "active" | "ended" | "cancelled"
) {
  await requireGuildAdmin(guildId);
  try {
    await repo.updateGiveawayStatus(guildId, giveawayId, status);
    revalidatePath(`/dashboard/${guildId}/giveaways`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update giveaway status" };
  }
}

export async function deleteGiveaway(guildId: string, giveawayId: string) {
  await requireGuildAdmin(guildId);
  try {
    await repo.deleteGiveaway(guildId, giveawayId);
    revalidatePath(`/dashboard/${guildId}/giveaways`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete giveaway" };
  }
}

export async function getGiveawayEntries(guildId: string, giveawayId: string) {
  try {
    await requireGuildAdmin(guildId);
    return await repo.getGiveawayEntries(guildId, giveawayId);
  } catch (error) {
    return [];
  }
}
