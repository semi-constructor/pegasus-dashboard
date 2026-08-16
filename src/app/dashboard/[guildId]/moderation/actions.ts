"use server";

import { revalidatePath } from "next/cache";
import { requireGuildAdmin } from "@/lib/auth-guard";
import * as repo from "@/lib/repository/moderation";

// ── Mod Cases ──────────────────────────────────────────────────
export async function getModCases(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await repo.getModCases(guildId);
  } catch (error) {
    console.error("Failed to fetch mod cases:", error);
    return [];
  }
}

// ── Warnings CRUD ──────────────────────────────────────────────
export async function getWarnings(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await repo.getWarnings(guildId);
  } catch (error) {
    console.error("Failed to fetch warnings:", error);
    return [];
  }
}

export async function createWarning(
  guildId: string,
  data: {
    userId: string;
    title: string;
    description?: string;
    level?: number;
    proof?: string;
  }
) {
  const { session } = await requireGuildAdmin(guildId);
  try {
    await repo.createWarning(guildId, {
      userId: data.userId,
      moderatorId: session.user.discordId,
      title: data.title,
      description: data.description || null,
      level: data.level || 1,
      proof: data.proof || null,
    });
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create warning:", error);
    return { success: false, error: "Failed to issue warning" };
  }
}

export async function toggleWarningStatus(guildId: string, warningId: number, active: boolean) {
  const { session } = await requireGuildAdmin(guildId);
  try {
    await repo.toggleWarningStatus(guildId, warningId, active, session.user.discordId);
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update warning status:", error);
    return { success: false, error: "Failed to update warning status" };
  }
}

export async function deleteWarning(guildId: string, warningId: number) {
  await requireGuildAdmin(guildId);
  try {
    await repo.deleteWarning(guildId, warningId);
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete warning:", error);
    return { success: false, error: "Failed to delete warning" };
  }
}

// ── Warning Automations CRUD ────────────────────────────────────
export async function getWarningAutomations(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await repo.getWarningAutomations(guildId);
  } catch (error) {
    console.error("Failed to fetch warning automations:", error);
    return [];
  }
}

export async function createWarningAutomation(
  guildId: string,
  data: {
    name: string;
    description?: string;
    triggerType: string;
    triggerValue: number;
    actions: any;
    notifyChannelId?: string;
    notifyMessage?: string;
  }
) {
  const { session } = await requireGuildAdmin(guildId);
  try {
    await repo.createWarningAutomation(guildId, {
      name: data.name,
      description: data.description || null,
      triggerType: data.triggerType,
      triggerValue: data.triggerValue,
      actions: data.actions,
      notifyChannelId: data.notifyChannelId || null,
      notifyMessage: data.notifyMessage || null,
      createdBy: session.user.discordId,
    });
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create warning automation:", error);
    return { success: false, error: "Failed to create warning automation" };
  }
}

export async function deleteWarningAutomation(guildId: string, id: number) {
  await requireGuildAdmin(guildId);
  try {
    await repo.deleteWarningAutomation(guildId, id);
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete warning automation" };
  }
}

// ── Word Filters CRUD ──────────────────────────────────────────
export async function getWordFilters(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await repo.getWordFilters(guildId);
  } catch (error) {
    console.error("Failed to fetch word filters:", error);
    return [];
  }
}

export async function createWordFilterRule(
  guildId: string,
  data: {
    pattern: string;
    matchType: string;
    caseSensitive: boolean;
    wholeWord: boolean;
    severity: string;
    autoDelete: boolean;
    notifyChannelId?: string;
    actions: any;
  }
) {
  const { session } = await requireGuildAdmin(guildId);
  try {
    await repo.createWordFilterRule(guildId, {
      pattern: data.pattern,
      matchType: data.matchType,
      caseSensitive: data.caseSensitive,
      wholeWord: data.wholeWord,
      severity: data.severity,
      autoDelete: data.autoDelete,
      notifyChannelId: data.notifyChannelId || null,
      actions: data.actions,
      createdBy: session.user.discordId,
    });
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create word filter rule:", error);
    return { success: false, error: "Failed to create word filter rule" };
  }
}

export async function deleteWordFilterRule(guildId: string, id: number) {
  await requireGuildAdmin(guildId);
  try {
    await repo.deleteWordFilterRule(guildId, id);
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete word filter rule" };
  }
}

// ── Mod Log Settings CRUD ──────────────────────────────────────
export async function getModLogSettings(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await repo.getModLogSettings(guildId);
  } catch (error) {
    console.error("Failed to fetch mod log settings:", error);
    return [];
  }
}

export async function saveModLogSetting(
  guildId: string,
  data: { category: string; channelId: string; enabled: boolean }
) {
  await requireGuildAdmin(guildId);
  try {
    await repo.saveModLogSetting(guildId, {
      category: data.category,
      channelId: data.channelId,
      enabled: data.enabled,
    });
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Failed to save mod log setting:", error);
    return { success: false, error: "Failed to save mod log setting" };
  }
}
