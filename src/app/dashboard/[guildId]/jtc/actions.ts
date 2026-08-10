"use server";

import { db } from"@/lib/db";
import { jtcConfigs, jtcChannels } from"@/../schemas/jtc";
import { eq, and, desc } from"drizzle-orm";
import { revalidatePath } from"next/cache";
import { requireGuildAdmin } from"@/lib/auth-guard";

export async function getJtcConfig(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 const res = await db
 .select()
 .from(jtcConfigs)
 .where(eq(jtcConfigs.guildId, guildId))
 .limit(1);
 return res[0] || null;
 } catch (error) {
 console.error("Failed to fetch JTC config:", error);
 return null;
 }
}

export async function saveJtcConfig(
 guildId: string,
 data: {
 baseVoiceChannelId: string;
 categoryId: string;
 panelChannelId: string;
 channelNameFormat: string;
 }
) {
 await requireGuildAdmin(guildId);
 try {
 const existing = await getJtcConfig(guildId);
 if (!existing) {
 await db.insert(jtcConfigs).values({
 guildId,
 ...data,
 });
 } else {
 await db
 .update(jtcConfigs)
 .set({
 ...data,
 updatedAt: new Date(),
 })
 .where(eq(jtcConfigs.guildId, guildId));
 }
 revalidatePath(`/dashboard/${guildId}/jtc`);
 return { success: true };
 } catch (error) {
 console.error("Failed to save JTC config:", error);
 return { success: false, error:"Failed to save JTC config"};
 }
}

export async function getActiveJtcChannels(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(jtcChannels)
 .where(eq(jtcChannels.guildId, guildId))
 .orderBy(desc(jtcChannels.createdAt));
 } catch (error) {
 console.error("Failed to fetch active JTC channels:", error);
 return [];
 }
}

export async function deleteActiveJtcChannel(guildId: string, channelId: string) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .delete(jtcChannels)
 .where(and(eq(jtcChannels.channelId, channelId), eq(jtcChannels.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/jtc`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete active JTC channel"};
 }
}
