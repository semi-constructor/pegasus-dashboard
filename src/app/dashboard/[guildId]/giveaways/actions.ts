"use server";

import { db } from"@/lib/db";
import { giveaways, giveawayEntries } from"@/../schemas/giveaways";
import { eq, and, desc } from"drizzle-orm";
import { revalidatePath } from"next/cache";
import { requireGuildAdmin } from"@/lib/auth-guard";

export async function getGiveaways(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(giveaways)
 .where(eq(giveaways.guildId, guildId))
 .orderBy(desc(giveaways.createdAt));
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
   const apiUrl = process.env.API_URL || "http://localhost:2000";
   const duration = data.endTime.getTime() - Date.now();
   
   const res = await fetch(`${apiUrl}/guilds/${guildId}/giveaways`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${process.env.BOT_API_TOKEN}`
     },
     body: JSON.stringify({
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
     })
   });

   if (!res.ok) {
     console.error('Bot API error:', await res.text());
     return { success: false, error: "Failed to create giveaway via Bot API" };
   }

   revalidatePath(`/dashboard/${guildId}/giveaways`);
   return { success: true };
 } catch (error) {
 console.error("Failed to create giveaway:", error);
 return { success: false, error:"Failed to create giveaway"};
 }
}

export async function updateGiveawayStatus(
 guildId: string,
 giveawayId: string,
 status:"active"|"ended"|"cancelled"
) {
 await requireGuildAdmin(guildId);
 try {
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
       return { success: false, error: "Failed to end giveaway via Bot API" };
     }
   } else {
     await db
     .update(giveaways)
     .set({
     status,
     endedAt: null,
     updatedAt: new Date(),
     })
     .where(and(eq(giveaways.giveawayId, giveawayId), eq(giveaways.guildId, guildId)));
   }

   revalidatePath(`/dashboard/${guildId}/giveaways`);
   return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to update giveaway status"};
 }
}

export async function deleteGiveaway(guildId: string, giveawayId: string) {
 await requireGuildAdmin(guildId);
 try {
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
     return { success: false, error: "Failed to delete giveaway via Bot API" };
   }

   revalidatePath(`/dashboard/${guildId}/giveaways`);
   return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete giveaway"};
 }
}

export async function getGiveawayEntries(giveawayId: string) {
 try {
 const [giveaway] = await db.select({ guildId: giveaways.guildId }).from(giveaways).where(eq(giveaways.giveawayId, giveawayId)).limit(1);
 if (!giveaway) return [];
 await requireGuildAdmin(giveaway.guildId);

 return await db
 .select()
 .from(giveawayEntries)
 .where(eq(giveawayEntries.giveawayId, giveawayId));
 } catch (error) {
 return [];
 }
}
