"use server";

import { db } from"@/lib/db";
import {
 economySettings,
 economyShopItems,
 economyBalances,
 economyTransactions,
} from"@/../schemas/economy";
import { eq, and, desc } from"drizzle-orm";
import { revalidatePath } from"next/cache";
import { requireGuildAdmin } from"@/lib/auth-guard";

// ── Economy Settings CRUD ──────────────────────────────────────
export async function getEconomySettings(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 const res = await db
 .select()
 .from(economySettings)
 .where(eq(economySettings.guildId, guildId))
 .limit(1);
 return res[0] || null;
 } catch (error) {
 console.error("Failed to fetch economy settings:", error);
 return null;
 }
}

export async function saveEconomySettings(guildId: string, data: any) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .insert(economySettings)
 .values({
 guildId,
 ...data,
 })
 .onConflictDoUpdate({
 target: economySettings.guildId,
 set: {
 ...data,
 updatedAt: new Date(),
 },
 });
 revalidatePath(`/dashboard/${guildId}/economy`);
 return { success: true };
 } catch (error) {
 console.error("Failed to save economy settings:", error);
 return { success: false, error:"Failed to save economy settings"};
 }
}

// ── Shop Items CRUD ────────────────────────────────────────────
export async function getEconomyShopItems(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(economyShopItems)
 .where(eq(economyShopItems.guildId, guildId))
 .orderBy(desc(economyShopItems.createdAt));
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
 await db.insert(economyShopItems).values({
 guildId,
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
 return { success: false, error:"Failed to create shop item"};
 }
}

export async function deleteShopItem(guildId: string, itemId: string) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .delete(economyShopItems)
 .where(and(eq(economyShopItems.id, itemId), eq(economyShopItems.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/economy`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete shop item"};
 }
}

// ── User Balances Admin Override ──────────────────────────────
export async function getEconomyBalances(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(economyBalances)
 .where(eq(economyBalances.guildId, guildId))
 .orderBy(desc(economyBalances.balance))
 .limit(100);
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
 await db
 .insert(economyBalances)
 .values({
 userId,
 guildId,
 balance: walletBalance,
 bankBalance,
 })
 .onConflictDoUpdate({
 target: [economyBalances.userId, economyBalances.guildId],
 set: {
 balance: walletBalance,
 bankBalance,
 updatedAt: new Date(),
 },
 });

 // Record admin transaction log
 await db.insert(economyTransactions).values({
 userId,
 guildId,
 type:"admin",
 amount: walletBalance,
 description: `Admin balance override by ${session.user.discordId} (Wallet: ${walletBalance}, Bank: ${bankBalance})`,
 });

 revalidatePath(`/dashboard/${guildId}/economy`);
 return { success: true };
 } catch (error) {
 console.error("Failed to override user balance:", error);
 return { success: false, error:"Failed to update user balance"};
 }
}

// ── Transaction History ────────────────────────────────────────
export async function getEconomyTransactions(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(economyTransactions)
 .where(eq(economyTransactions.guildId, guildId))
 .orderBy(desc(economyTransactions.createdAt))
 .limit(100);
 } catch (error) {
 console.error("Failed to fetch transactions:", error);
 return [];
 }
}
