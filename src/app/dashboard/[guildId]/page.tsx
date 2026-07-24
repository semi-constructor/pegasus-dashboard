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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function GuildOverviewPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const resolvedParams = await params;
  const { guildId } = resolvedParams;

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

  const stats = [
    { label: "Total XP Collected", value: formatCompactNumber(totalXp), icon: <Star className="w-5 h-5 text-white" /> },
    { label: "Total Economy Collected", value: formatCompactNumber(totalEconomy), icon: <Coins className="w-5 h-5 text-white" /> },
    { label: "Open Tickets", value: openTicketsCount.toString(), icon: <Ticket className="w-5 h-5 text-white" /> },
    { label: "Active Giveaways", value: activeGiveawaysCount.toString(), icon: <Gift className="w-5 h-5 text-white" /> },
  ];

  const modules = [
    { name: "Welcome", enabled: settings?.welcomeEnabled ?? false, path: "settings" },
    { name: "Goodbye", enabled: settings?.goodbyeEnabled ?? false, path: "settings" },
    { name: "Logging", enabled: settings?.logsEnabled ?? false, path: "settings" },
    { name: "XP System", enabled: settings?.xpEnabled ?? true, path: "xp" },
    { name: "Level Up Roles", enabled: settings?.autoroleEnabled ?? false, path: "xp" },
    { name: "Security", enabled: settings?.securityEnabled ?? true, path: "settings" },
    { name: "Anti-Raid", enabled: settings?.antiRaidEnabled ?? true, path: "settings" },
    { name: "Anti-Spam", enabled: settings?.antiSpamEnabled ?? true, path: "settings" },
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
            Server Overview
          </h1>
          <p className="text-white/40 mt-3 text-sm font-medium tracking-wide">GUILD ID: {guildId}</p>
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
