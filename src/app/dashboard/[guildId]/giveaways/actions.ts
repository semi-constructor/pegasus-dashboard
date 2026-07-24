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
 requirements: any;
 bonusEntries: any;
 embedTitle?: string;
 embedColor?: number;
 embedImage?: string;
 }
) {
 const { session } = await requireGuildAdmin(guildId);
 try {
 const giveawayId = `GW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
 await db.insert(giveaways).values({
 giveawayId,
 guildId,
 channelId: data.channelId,
 hostedBy: session.user.discordId,
 prize: data.prize,
 description: data.description || null,
 winnerCount: data.winnerCount || 1,
 endTime: data.endTime,
 status:"active",
 requirements: data.requirements || {},
 bonusEntries: data.bonusEntries || {},
 embedTitle: data.embedTitle || null,
 embedColor: data.embedColor || 0x0099ff,
 embedImage: data.embedImage || null,
 });
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
 await db
 .update(giveaways)
 .set({
 status,
 endedAt: status ==="ended"? new Date() : null,
 updatedAt: new Date(),
 })
 .where(and(eq(giveaways.giveawayId, giveawayId), eq(giveaways.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/giveaways`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to update giveaway status"};
 }
}

export async function deleteGiveaway(guildId: string, giveawayId: string) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .delete(giveaways)
 .where(and(eq(giveaways.giveawayId, giveawayId), eq(giveaways.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/giveaways`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete giveaway"};
 }
}

export async function getGiveawayEntries(giveawayId: string) {
 try {
 return await db
 .select()
 .from(giveawayEntries)
 .where(eq(giveawayEntries.giveawayId, giveawayId));
 } catch (error) {
 return [];
 }
}
