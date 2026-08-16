import { db } from "@/lib/db";
import { starboardSettings } from "schemas/starboard";
import { eq } from "drizzle-orm";
import { getGuildContext } from "./guild";

export async function updateStarboardConfigRepo(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/starboard`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${context.apiToken}` },
      body: JSON.stringify(data)
    });
    return res.ok;
  }

  const existing = await db.select().from(starboardSettings).where(eq(starboardSettings.guildId, guildId)).limit(1);
  if (existing.length === 0) {
    await db.insert(starboardSettings).values({ guildId, ...data });
  } else {
    await db.update(starboardSettings).set({ ...data, updatedAt: new Date() }).where(eq(starboardSettings.guildId, guildId));
  }
  return true;
}
