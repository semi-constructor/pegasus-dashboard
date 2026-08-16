import { db } from "@/lib/db";
import { giveaways } from "schemas/giveaways";
import { eq } from "drizzle-orm";
import { getGuildContext } from "./guild";

export async function getGiveawaysRepo(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/giveaways-data`, {
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (res.ok) return await res.json();
    return [];
  }
  return await db.select().from(giveaways).where(eq(giveaways.guildId, guildId));
}

export async function createGiveawayRepo(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/giveaways-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${context.apiToken}` },
      body: JSON.stringify(data)
    });
    return res.ok;
  }
  await db.insert(giveaways).values({
    giveawayId: Math.random().toString(36).substring(7),
    guildId,
    ...data,
  });
  return true;
}

export async function deleteGiveawayRepo(guildId: string, giveawayId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/giveaways-data/${giveawayId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    return res.ok;
  }
  await db.delete(giveaways).where(eq(giveaways.giveawayId, giveawayId));
  return true;
}
