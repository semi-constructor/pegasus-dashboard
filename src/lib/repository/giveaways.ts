import { db } from "@/lib/db";
import { giveaways, giveawayEntries } from "@/../schemas/giveaways";
import { eq, and, desc } from "drizzle-orm";
import { getGuildContext } from "./guild";

export async function getGiveaways(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/giveaways`, {
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (!res.ok) return [];
    return await res.json();
  }

  return await db
    .select()
    .from(giveaways)
    .where(eq(giveaways.guildId, guildId))
    .orderBy(desc(giveaways.createdAt));
}

export async function updateGiveawayStatus(guildId: string, giveawayId: string, status: "active" | "ended" | "cancelled") {
  const context = await getGuildContext(guildId);
  // Using direct Drizzle updates for statuses besides ended to match existing non-hosted behavior
  if (context.isHosted) {
      if (status === "ended") {
        const res = await fetch(`${context.apiUrl}/guilds/${guildId}/giveaways/${giveawayId}/end`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${context.apiToken}`
          }
        });
        if (!res.ok) throw new Error("Failed to end giveaway via Bot API");
      } else {
        const res = await fetch(`${context.apiUrl}/guilds/${guildId}/giveaways/${giveawayId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${context.apiToken}`
            },
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error("Failed to update giveaway status via Bot API");
      }
      return;
  }

  if (status === "ended") {
     const apiUrl = process.env.API_URL || "http://localhost:2000";
     const res = await fetch(`${apiUrl}/guilds/${guildId}/giveaways/${giveawayId}/end`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${process.env.BOT_API_TOKEN}`
       }
     });
     if (!res.ok) {
       console.error('Bot API error:', await res.text());
       throw new Error("Failed to end giveaway via Bot API");
     }
  } else {
      await db
        .update(giveaways)
        .set({ status, endedAt: null, updatedAt: new Date() })
        .where(and(eq(giveaways.giveawayId, giveawayId), eq(giveaways.guildId, guildId)));
  }
}

export async function getGiveawayEntries(guildId: string, giveawayId: string) {
    const context = await getGuildContext(guildId);
    if (context.isHosted) {
        const res = await fetch(`${context.apiUrl}/guilds/${guildId}/giveaways/${giveawayId}/entries`, {
            headers: { Authorization: `Bearer ${context.apiToken}` }
        });
        if (!res.ok) return [];
        return await res.json();
    }
    return await db.select().from(giveawayEntries).where(eq(giveawayEntries.giveawayId, giveawayId));
}

export async function deleteGiveaway(guildId: string, giveawayId: string) {
    const context = await getGuildContext(guildId);
    if (context.isHosted) {
        const res = await fetch(`${context.apiUrl}/guilds/${guildId}/giveaways/${giveawayId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${context.apiToken}`
          }
        });
        if (!res.ok) throw new Error("Failed to delete giveaway via Bot API");
        return;
    }

    const apiUrl = process.env.API_URL || "http://localhost:2000";
    const res = await fetch(`${apiUrl}/guilds/${guildId}/giveaways/${giveawayId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BOT_API_TOKEN}`
      }
    });
    
    if (!res.ok) {
      console.error('Bot API error:', await res.text());
      throw new Error("Failed to delete giveaway via Bot API");
    }
}
