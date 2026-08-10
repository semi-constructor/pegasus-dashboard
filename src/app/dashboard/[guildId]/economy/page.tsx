import { requireGuildAdmin } from"@/lib/auth-guard";
import { getGuildRoles } from"@/lib/discord-api";
import {
 getEconomySettings,
 getEconomyShopItems,
 getEconomyBalances,
 getEconomyTransactions,
} from"./actions";
import EconomyClient from"./_components/economy-client";
import { notFound } from"next/navigation";

export default async function EconomyPage({
 params,
}: {
 params: Promise<{ guildId: string }>;
}) {
 const resolvedParams = await params;
 const { guildId } = resolvedParams;
 if (!guildId) return notFound();

 await requireGuildAdmin(guildId);

 const [settings, shopItems, userBalances, transactions, roles] = await Promise.all([
 getEconomySettings(guildId),
 getEconomyShopItems(guildId),
 getEconomyBalances(guildId),
 getEconomyTransactions(guildId),
 getGuildRoles(guildId),
 ]);

 const roleOptions = roles.map((r) => ({
 id: r.id,
 name: r.name,
 color: r.color,
 position: r.position,
 }));

 return (
 <EconomyClient
 guildId={guildId}
 initialSettings={settings}
 initialShopItems={shopItems}
 initialUserBalances={userBalances}
 initialTransactions={transactions}
 roles={roleOptions}
 />
 );
}
