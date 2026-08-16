import { db } from "@/lib/db";
import { guilds, guildSettings } from "schemas/guilds";
import { eq } from "drizzle-orm";
import { getGuildContext } from "./guild";

export async function saveGuildConfigRepo(guildId: string, data: { prefix: string; language: string }) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/settings/${guildId}/settings/raw/config`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${context.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    if (!res.ok) return { success: false, error: "Failed to update config" };
    return { success: true };
  } else {
    await db
      .update(guilds)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(guilds.id, guildId));
    return { success: true };
  }
}

export async function saveGuildSettingsRepo(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/settings/${guildId}/settings/raw`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${context.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    if (!res.ok) return { success: false, error: "Failed to update settings" };
    return { success: true };
  } else {
    await db
      .insert(guildSettings)
      .values({
        guildId,
        ...data,
      })
      .onConflictDoUpdate({
        target: guildSettings.guildId,
        set: {
          ...data,
          updatedAt: new Date(),
        },
      });
    return { success: true };
  }
}

export async function resetGuildSettingsRepo(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/settings/${guildId}/settings/raw`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${context.apiToken}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return { success: false, error: "Failed to reset settings" };
    return { success: true };
  } else {
    await db.delete(guildSettings).where(eq(guildSettings.guildId, guildId));
    return { success: true };
  }
}
