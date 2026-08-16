import { db } from "@/lib/db";
import { jtcConfigs, jtcChannels } from "schemas/jtc";
import { eq, and, desc } from "drizzle-orm";
import { getGuildContext } from "./guild";

export async function getJtcConfigRepo(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/jtc/config/${guildId}`, {
      headers: { Authorization: `Bearer ${context.apiToken}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.config || null;
  } else {
    const res = await db
      .select()
      .from(jtcConfigs)
      .where(eq(jtcConfigs.guildId, guildId))
      .limit(1);
    return res[0] || null;
  }
}

export async function saveJtcConfigRepo(
  guildId: string,
  data: {
    baseVoiceChannelId: string;
    categoryId: string;
    panelChannelId: string;
    channelNameFormat: string;
  }
) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/jtc/config`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${context.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guildId, ...data }),
      cache: "no-store",
    });
    if (!res.ok) return { success: false, error: "Failed to save JTC config" };
    return { success: true };
  } else {
    const existing = await getJtcConfigRepo(guildId);
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
    return { success: true };
  }
}

export async function getActiveJtcChannelsRepo(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/jtc/channels/${guildId}`, {
      headers: { Authorization: `Bearer ${context.apiToken}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    return await db
      .select()
      .from(jtcChannels)
      .where(eq(jtcChannels.guildId, guildId))
      .orderBy(desc(jtcChannels.createdAt));
  }
}

export async function deleteActiveJtcChannelRepo(guildId: string, channelId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/jtc/channels/${guildId}/${channelId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${context.apiToken}` },
      cache: "no-store",
    });
    if (!res.ok) return { success: false, error: "Failed to delete active JTC channel" };
    return { success: true };
  } else {
    await db
      .delete(jtcChannels)
      .where(and(eq(jtcChannels.channelId, channelId), eq(jtcChannels.guildId, guildId)));
    return { success: true };
  }
}
