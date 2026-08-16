"use server";

import { revalidatePath } from "next/cache";
import { requireGuildAdmin } from "@/lib/auth-guard";
import { getJtcConfigRepo, saveJtcConfigRepo, getActiveJtcChannelsRepo, deleteActiveJtcChannelRepo } from "@/lib/repository/jtc";

export async function getJtcConfig(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await getJtcConfigRepo(guildId);
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
    const result = await saveJtcConfigRepo(guildId, data);
    if (!result.success) return result;
    revalidatePath(`/dashboard/${guildId}/jtc`);
    return { success: true };
  } catch (error) {
    console.error("Failed to save JTC config:", error);
    return { success: false, error: "Failed to save JTC config" };
  }
}

export async function getActiveJtcChannels(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await getActiveJtcChannelsRepo(guildId);
  } catch (error) {
    console.error("Failed to fetch active JTC channels:", error);
    return [];
  }
}

export async function deleteActiveJtcChannel(guildId: string, channelId: string) {
  await requireGuildAdmin(guildId);
  try {
    const result = await deleteActiveJtcChannelRepo(guildId, channelId);
    if (!result.success) return result;
    revalidatePath(`/dashboard/${guildId}/jtc`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete active JTC channel" };
  }
}
