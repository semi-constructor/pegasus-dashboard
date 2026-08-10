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
import { OverviewClientWrapper, StatCard, ModulesCard } from "./overview-client";
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
    { label: t('totalXpCollected'), value: formatCompactNumber(totalXp), icon: <Star className="w-5 h-5 text-white" /> },
    { label: t('totalEconomyCollected'), value: formatCompactNumber(totalEconomy), icon: <Coins className="w-5 h-5 text-white" /> },
    { label: t('openTickets'), value: openTicketsCount.toString(), icon: <Ticket className="w-5 h-5 text-white" /> },
    { label: t('activeGiveaways'), value: activeGiveawaysCount.toString(), icon: <Gift className="w-5 h-5 text-white" /> },
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
    <OverviewClientWrapper>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            {t('serverOverview')}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <p className="text-white/40 text-sm font-medium tracking-wide uppercase">{guildName}</p>
            {shardId !== undefined && (
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                Shard #{shardId}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} stat={stat} i={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <ModulesCard modules={modules} guildId={guildId} />
      </div>
    </OverviewClientWrapper>
  );
}
