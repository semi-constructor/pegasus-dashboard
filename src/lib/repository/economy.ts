import { db } from "@/lib/db";
import {
  economySettings,
  economyShopItems,
  economyBalances,
  economyTransactions,
} from "@/../schemas/economy";
import { eq, and, desc } from "drizzle-orm";
import { getGuildContext } from "./guild";

export async function getEconomySettings(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/economy/settings`, {
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (!res.ok) return null;
    return await res.json();
  }

  const res = await db.select().from(economySettings).where(eq(economySettings.guildId, guildId)).limit(1);
  return res[0] || null;
}

export async function saveEconomySettings(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/economy/settings`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${context.apiToken}` 
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to save economy settings");
    return;
  }

  await db
    .insert(economySettings)
    .values({ guildId, ...data })
    .onConflictDoUpdate({
      target: economySettings.guildId,
      set: { ...data, updatedAt: new Date() },
    });
}

export async function getEconomyShopItems(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/economy/shop-items`, {
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (!res.ok) return [];
    return await res.json();
  }

  return await db
    .select()
    .from(economyShopItems)
    .where(eq(economyShopItems.guildId, guildId))
    .orderBy(desc(economyShopItems.createdAt));
}

export async function createShopItem(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/economy/shop-items`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${context.apiToken}` 
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create shop item");
    return;
  }

  await db.insert(economyShopItems).values({ guildId, ...data });
}

export async function deleteShopItem(guildId: string, itemId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/economy/shop-items/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (!res.ok) throw new Error("Failed to delete shop item");
    return;
  }

  await db.delete(economyShopItems).where(and(eq(economyShopItems.id, itemId), eq(economyShopItems.guildId, guildId)));
}

export async function getEconomyBalances(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/economy/balances`, {
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (!res.ok) return [];
    return await res.json();
  }

  return await db
    .select()
    .from(economyBalances)
    .where(eq(economyBalances.guildId, guildId))
    .orderBy(desc(economyBalances.balance))
    .limit(100);
}

export async function updateUserBalanceOverride(guildId: string, userId: string, walletBalance: number, bankBalance: number, adminId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/economy/balances/${userId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${context.apiToken}` 
      },
      body: JSON.stringify({ walletBalance, bankBalance, adminId })
    });
    if (!res.ok) throw new Error("Failed to override user balance");
    return;
  }

  await db
    .insert(economyBalances)
    .values({ userId, guildId, balance: walletBalance, bankBalance })
    .onConflictDoUpdate({
      target: [economyBalances.userId, economyBalances.guildId],
      set: { balance: walletBalance, bankBalance, updatedAt: new Date() },
    });

  await db.insert(economyTransactions).values({
    userId,
    guildId,
    type: "admin",
    amount: walletBalance,
    description: `Admin balance override by ${adminId} (Wallet: ${walletBalance}, Bank: ${bankBalance})`,
  });
}

export async function getEconomyTransactions(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/economy/transactions`, {
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (!res.ok) return [];
    return await res.json();
  }

  return await db
    .select()
    .from(economyTransactions)
    .where(eq(economyTransactions.guildId, guildId))
    .orderBy(desc(economyTransactions.createdAt))
    .limit(100);
}
