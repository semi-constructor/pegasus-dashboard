import { Activity, Coins, Star, Ticket, Database, AlertCircle } from"lucide-react";
import { db } from"@/lib/db";
import { userXp } from"schemas/xp";
import { economyBalances } from"schemas/economy";
import { tickets } from"schemas/tickets";
import { guildSettings } from"schemas/guilds";
import { members } from"schemas/members";
import { eq, sql } from"drizzle-orm";
import Link from"next/link";
import { formatNumber } from"@/lib/utils";
import { OverviewClientWrapper, StatCard } from"./overview-client";
import { getCachedData } from"@/lib/redis";

export default async function GuildOverviewPage({
 params,
}: {
 params: Promise<{ guildId: string }>;
}) {
 const resolvedParams = await params;
 const { guildId } = resolvedParams;
 
 // Fetch Data from DB with Redis Caching
 const xpData = await getCachedData(`guild:${guildId}:xpData`, () => 
 db.select({ totalXp: sql<number>`COALESCE(SUM(${userXp.xp}), 0)` }).from(userXp).where(eq(userXp.guildId, guildId))
 );
 
 const balanceData = await getCachedData(`guild:${guildId}:balanceData`, () =>
 db.select({ totalBalance: sql<number>`COALESCE(SUM(${economyBalances.balance} + ${economyBalances.bankBalance}), 0)` }).from(economyBalances).where(eq(economyBalances.guildId, guildId))
 );

 const ticketCountRes = await getCachedData(`guild:${guildId}:ticketCount`, () =>
 db.select({ count: sql<number>`COUNT(*)` }).from(tickets).where(eq(tickets.guildId, guildId))
 );

 const memberCountRes = await getCachedData(`guild:${guildId}:memberCount`, () =>
 db.select({ count: sql<number>`COUNT(*)` }).from(members).where(eq(members.guildId, guildId))
 );

 const settingsRes = await getCachedData(`guild:${guildId}:settings`, () =>
 db.select().from(guildSettings).where(eq(guildSettings.guildId, guildId)).limit(1)
 );

 const totalXp = xpData[0]?.totalXp || 0;
 const totalBalance = balanceData[0]?.totalBalance || 0;
 const ticketCount = ticketCountRes[0]?.count || 0;
 const totalMembers = memberCountRes[0]?.count || 0;
 const settings = settingsRes[0];

 const stats = [
 { label:"Total XP", value: formatNumber(totalXp), icon: <Star className="w-5 h-5 text-foreground"/> },
 { label:"Economy Balance", value: formatNumber(totalBalance), icon: <Coins className="w-5 h-5 text-foreground"/> },
 { label:"Total Tickets", value: formatNumber(ticketCount), icon: <Ticket className="w-5 h-5 text-foreground"/> },
 { label:"Members", value: formatNumber(totalMembers), icon: <Database className="w-5 h-5 text-foreground"/> },
 ];

 const unconfiguredFeatures = [];
 if (!settings?.logsEnabled) unconfiguredFeatures.push({ name:"Logging System", path:"logging"});
 if (!settings?.securityEnabled) unconfiguredFeatures.push({ name:"Security & Automod", path:"moderation"});
 if (!settings?.autoroleEnabled) unconfiguredFeatures.push({ name:"Level Up Roles", path:"xp"});

 return (
 <OverviewClientWrapper>
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tighter uppercase flex items-center gap-3">
 <Activity className="w-10 h-10 text-primary"/>Server Overview</h1>
 <p className="text-muted-foreground mt-2 text-sm">Guild ID: {guildId}</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 {stats.map((stat, i) => (
 <StatCard key={i} stat={stat} i={i} />
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">


 {/* Unconfigured Features */}
 <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden shadow-sm hover:shadow-sm transition-all duration-300 hover:translate-y-[4px] hover:translate-x-[4px]">
 <h3 className="text-xl font-black text-primary mb-2 flex items-center gap-3">
 <AlertCircle className="w-6 h-6 text-primary"/>Attention Reqd</h3>
 <p className="text-sm font-bold text-muted-foreground uppercase mb-6 tracking-wider">Unconfigured core modules detected.</p>
 <div className="space-y-4 relative z-10">
 {unconfiguredFeatures.length > 0 ? unconfiguredFeatures.map((feat, i) => (
 <div key={i} className="flex items-center justify-between p-4 bg-background border border-border shadow-sm">
 <p className="text-sm font-bold text-primary">{feat.name}</p>
 <Link 
 href={`/dashboard/${guildId}/${feat.path}`}
 className="px-6 py-2 bg-primary text-primary-foreground text-sm font-black hover:bg-primary/90 transition-all border border-border hover:-translate-y-[2px] hover:-translate-x-[2px]"
 >Config Sys</Link>
 </div>
 )) : (
 <div className="text-sm text-primary p-4 bg-primary/10 border border-border flex items-center gap-3 font-black shadow-sm">
 <div className="w-3 h-3 bg-primary border border-border animate-pulse"/>All Systems Operational</div>
 )}
 </div>
 </div>
 </div>
 </OverviewClientWrapper>
 );
}
