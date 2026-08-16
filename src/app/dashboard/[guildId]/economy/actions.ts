"use server";

import { revalidatePath } from "next/cache";
import { requireGuildAdmin } from "@/lib/auth-guard";
import * as repo from "@/lib/repository/economy";

// ── Economy Settings CRUD ──────────────────────────────────────
export async function getEconomySettings(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await repo.getEconomySettings(guildId);
  } catch (error) {
    console.error("Failed to fetch economy settings:", error);
    return null;
  }
}

export async function saveEconomySettings(guildId: string, data: any) {
  await requireGuildAdmin(guildId);
  try {
    await repo.saveEconomySettings(guildId, data);
    revalidatePath(`/dashboard/${guildId}/economy`);
    return { success: true };
  } catch (error) {
    console.error("Failed to save economy settings:", error);
    return { success: false, error: "Failed to save economy settings" };
  }
}

// ── Shop Items CRUD ────────────────────────────────────────────
export async function getEconomyShopItems(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await repo.getEconomyShopItems(guildId);
  } catch (error) {
    console.error("Failed to fetch shop items:", error);
    return [];
  }
}

export async function createShopItem(
  guildId: string,
  data: {
    name: string;
    description: string;
    price: number;
    type: string;
    effectType?: string;
    effectValue?: any;
    stock: number;
    requiresRole?: string;
    enabled: boolean;
    tradeable?: boolean;
  }
) {
  await requireGuildAdmin(guildId);
  try {
    await repo.createShopItem(guildId, {
      name: data.name,
      description: data.description,
      price: data.price,
      type: data.type,
      effectType: data.effectType || null,
      effectValue: data.effectValue || null,
      stock: data.stock ?? -1,
      requiresRole: data.requiresRole || null,
      enabled: data.enabled,
      tradeable: data.tradeable ?? true,
    });
    revalidatePath(`/dashboard/${guildId}/economy`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create shop item:", error);
    return { success: false, error: "Failed to create shop item" };
  }
}

export async function deleteShopItem(guildId: string, itemId: string) {
  await requireGuildAdmin(guildId);
  try {
    await repo.deleteShopItem(guildId, itemId);
    revalidatePath(`/dashboard/${guildId}/economy`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete shop item" };
  }
}

// ── User Balances Admin Override ──────────────────────────────
export async function getEconomyBalances(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await repo.getEconomyBalances(guildId);
  } catch (error) {
    console.error("Failed to fetch economy balances:", error);
    return [];
  }
}

export async function updateUserBalanceOverride(
  guildId: string,
  userId: string,
  walletBalance: number,
  bankBalance: number
) {
  const { session } = await requireGuildAdmin(guildId);
  try {
    await repo.updateUserBalanceOverride(guildId, userId, walletBalance, bankBalance, session.user.discordId);
    revalidatePath(`/dashboard/${guildId}/economy`);
    return { success: true };
  } catch (error) {
    console.error("Failed to override user balance:", error);
    return { success: false, error: "Failed to update user balance" };
  }
}

// ── Transaction History ────────────────────────────────────────
export async function getEconomyTransactions(guildId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await repo.getEconomyTransactions(guildId);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}
