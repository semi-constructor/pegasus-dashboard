import { Activity, Coins, Star, Ticket, Gift, Box, AlertCircle, LayoutDashboard, Database, ToggleRight } from "lucide-react";
import { db } from "@/lib/db";
import { userXp } from "schemas/xp";
import { economyBalances } from "schemas/economy";
import { tickets } from "schemas/tickets";
import { giveaways } from "schemas/giveaways";
import { guildSettings } from "schemas/guilds";
import { eq, sql, and } from "drizzle-orm";
import Link from "next/link";
import { formatCompactNumber } from "@/lib/utils";
import { OverviewUI } from "./overview-ui";
import { getCachedData } from "@/lib/redis";
import { getGuild } from "@/lib/discord-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from 'next-intl/server';

export default async function GuildOverviewPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const resolvedParams = await params;
  const { guildId } = resolvedParams;
  const t = await getTranslations('guild');

  const apiUrl = process.env.API_URL || "http://localhost:2000";
  const botOverviewRes = await fetch(`${apiUrl}/dashboard/guilds/${guildId}/overview`, {
    headers: { Authorization: `Bearer ${process.env.BOT_API_TOKEN}` },
    next: { revalidate: 10 } // Note: 10s is good for standard data, but during a shard restart there may be a slight visual delay for transfers.
  }).catch(() => null);

  const botOverview = botOverviewRes?.ok ? await botOverviewRes.json() : null;
  const shardId = botOverview?.guild?.shard;

  const xpData = await getCachedData(
    `guild:${guildId}:xpData`,
    () => db.select({ totalXp: sql<number>`COALESCE(SUM(${userXp.xp}), 0)` }).from(userXp).where(eq(userXp.guildId, guildId)),
    5
  );

  const balanceData = await getCachedData(
    `guild:${guildId}:balanceData`,
    () => db.select({ totalEconomy: sql<number>`COALESCE(SUM(${economyBalances.totalEarned}), 0)` }).from(economyBalances).where(eq(economyBalances.guildId, guildId)),
    5
  );

  const openTicketsData = await getCachedData(
    `guild:${guildId}:openTickets`,
    () => db.select({ count: sql<number>`COUNT(*)` }).from(tickets).where(and(eq(tickets.guildId, guildId), eq(tickets.status, 'open'))),
    5
  );

  const activeGiveawaysData = await getCachedData(
    `guild:${guildId}:activeGiveaways`,
    () => db.select({ count: sql<number>`COUNT(*)` }).from(giveaways).where(and(eq(giveaways.guildId, guildId), eq(giveaways.status, 'active'))),
    5
  );

  const settingsRes = await getCachedData(
    `guild:${guildId}:settings`,
    () => db.select().from(guildSettings).where(eq(guildSettings.guildId, guildId)).limit(1),
    5
  );

  const totalXp = xpData[0]?.totalXp || 0;
  const totalEconomy = balanceData[0]?.totalEconomy || 0;
  const openTicketsCount = openTicketsData[0]?.count || 0;
  const activeGiveawaysCount = activeGiveawaysData[0]?.count || 0;
  const settings = settingsRes[0];

  const guildInfo = await getGuild(guildId);
  const guildName = guildInfo?.name || `GUILD ID: ${guildId}`;

  const stats = [
    { label: t('totalXpCollected'), value: formatCompactNumber(totalXp), icon: <Star className="w-5 h-5 text-foreground" /> },
    { label: t('totalEconomyCollected'), value: formatCompactNumber(totalEconomy), icon: <Coins className="w-5 h-5 text-foreground" /> },
    { label: t('openTickets'), value: openTicketsCount.toString(), icon: <Ticket className="w-5 h-5 text-foreground" /> },
    { label: t('activeGiveaways'), value: activeGiveawaysCount.toString(), icon: <Gift className="w-5 h-5 text-foreground" /> },
  ];

  const modules = [
    { name: t('welcome'), enabled: settings?.welcomeEnabled ?? false, path: "settings" },
    { name: t('goodbye'), enabled: settings?.goodbyeEnabled ?? false, path: "settings" },
    { name: t('logging'), enabled: settings?.logsEnabled ?? false, path: "settings" },
    { name: t('xpSystem'), enabled: settings?.xpEnabled ?? true, path: "xp" },
    { name: t('levelUpRoles'), enabled: settings?.autoroleEnabled ?? false, path: "xp" },
    { name: t('security'), enabled: settings?.securityEnabled ?? true, path: "settings" },
    { name: t('antiRaid'), enabled: settings?.antiRaidEnabled ?? true, path: "settings" },
    { name: t('antiSpam'), enabled: settings?.antiSpamEnabled ?? true, path: "settings" },
  ];

  const enabledModules = modules.filter(m => m.enabled);
  const disabledModules = modules.filter(m => !m.enabled);

  return (
    <OverviewUI 
      guildName={guildName}
      shardId={shardId}
      stats={stats}
      modules={modules}
      guildId={guildId}
      t={t as any}
    />
  );
}
