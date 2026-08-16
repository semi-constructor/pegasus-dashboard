import { getGuildContext } from "./guild";

export async function sendReactionRolePanelRepo(
  guildId: string,
  channelId: string,
  payload: any
): Promise<{ success: boolean; error?: string }> {
  const context = await getGuildContext(guildId);

  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/guilds/${guildId}/reaction-roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context.apiToken}`,
        },
        body: JSON.stringify({ channelId, payload }),
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        return { success: false, error: errorText || "Failed to send panel via Bot API" };
      }

      return await res.json();
    } catch (e: any) {
      return { success: false, error: e?.message || "Failed to communicate with Hosted Bot API" };
    }
  }

  // Central instance: send directly via Discord API with Bot token
  try {
    const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error("Discord API Error:", errorText);
      return { success: false, error: "Failed to send message to Discord." };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to send panel:", error);
    return { success: false, error: error?.message || "Internal server error." };
  }
}
