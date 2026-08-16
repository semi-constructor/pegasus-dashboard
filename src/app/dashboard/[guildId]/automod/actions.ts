"use server";

import { revalidatePath } from "next/cache";
import { requireGuildAdmin } from "@/lib/auth-guard";
import {
  getAutoModRulesRepo,
  createAutoModRuleRepo,
  toggleAutoModRuleRepo,
  deleteAutoModRuleRepo,
  getAutoModInfractionsRepo,
  getQuarantineVaultRepo,
  releaseFromQuarantineRepo,
} from "@/lib/repository/automod";

// ── AutoMod Rules CRUD ─────────────────────────────────────────
export async function getAutoModRules(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await getAutoModRulesRepo(guildId);
  } catch (error) {
    console.error("Failed to fetch automod rules:", error);
    return [];
  }
}

export async function createAutoModRule(
  guildId: string,
  data: {
    name: string;
    description?: string;
    eventType: string;
    triggerType: string;
    triggerMetadata: any;
    conditions: any;
    exemptRoles: string[];
    exemptChannels: string[];
    actions: any;
    enabled: boolean;
  }
) {
  const { session } = await requireGuildAdmin(guildId);
  try {
    const result = await createAutoModRuleRepo(guildId, data, session.user.discordId);
    if (!result.success) return result;
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create automod rule:", error);
    return { success: false, error: "Failed to create AutoMod rule" };
  }
}

export async function toggleAutoModRule(guildId: string, ruleId: string, enabled: boolean) {
  await requireGuildAdmin(guildId);
  try {
    const result = await toggleAutoModRuleRepo(guildId, ruleId, enabled);
    if (!result.success) return result;
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to toggle rule" };
  }
}

export async function deleteAutoModRule(guildId: string, ruleId: string) {
  await requireGuildAdmin(guildId);
  try {
    const result = await deleteAutoModRuleRepo(guildId, ruleId);
    if (!result.success) return result;
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete rule" };
  }
}

// ── AutoMod Infractions List ───────────────────────────────────
export async function getAutoModInfractions(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await getAutoModInfractionsRepo(guildId);
  } catch (error) {
    console.error("Failed to fetch automod infractions:", error);
    return [];
  }
}

// ── Quarantine Vault ───────────────────────────────────────────
export async function getQuarantineVault(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await getQuarantineVaultRepo(guildId);
  } catch (error) {
    console.error("Failed to fetch quarantine vault:", error);
    return [];
  }
}

export async function releaseFromQuarantine(guildId: string, vaultId: string) {
  const { session } = await requireGuildAdmin(guildId);
  try {
    const result = await releaseFromQuarantineRepo(guildId, vaultId, session.user.discordId);
    if (!result.success) return result;
    revalidatePath(`/dashboard/${guildId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Failed to release from quarantine:", error);
    return { success: false, error: "Failed to release user" };
  }
}
