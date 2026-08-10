"use server";

import { requireGuildAdmin } from "@/lib/auth-guard";
import { getGuildChannels } from "@/lib/discord-api";

export async function sendReactionRolePanel(guildId: string, channelId: string, payload: any) {
  await requireGuildAdmin(guildId);

  try {
    // SECURITY FIX: Verify the channel actually belongs to this guild to prevent IDOR
    const channels = await getGuildChannels(guildId, "all");
    if (!channels.find((c) => c.id === channelId)) {
      return { success: false, error: "Invalid channel or channel does not belong to this guild." };
    }

    const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Discord API Error:", errorText);
      return { success: false, error: "Failed to send message to Discord." };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send panel:", error);
    return { success: false, error: "Internal server error." };
  }
}
