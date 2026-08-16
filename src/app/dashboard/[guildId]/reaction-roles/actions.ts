"use server";

import { requireGuildAdmin } from "@/lib/auth-guard";
import { getGuildChannels } from "@/lib/discord-api";
import { sendReactionRolePanelRepo } from "@/lib/repository/reaction-roles";

export async function sendReactionRolePanel(guildId: string, channelId: string, payload: any) {
  await requireGuildAdmin(guildId);

  try {
    // SECURITY FIX: Verify the channel actually belongs to this guild to prevent IDOR
    const channels = await getGuildChannels(guildId, "all");
    if (!channels.find((c) => c.id === channelId)) {
      return { success: false, error: "Invalid channel or channel does not belong to this guild." };
    }

    return await sendReactionRolePanelRepo(guildId, channelId, payload);
  } catch (error) {
    console.error("Failed to send panel:", error);
    return { success: false, error: "Internal server error." };
  }
}
