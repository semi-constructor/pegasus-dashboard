import { Activity, Server, Zap, Database, ArrowUpRight, BarChart3, Users, Layers } from "lucide-react";
import { db } from "@/lib/db";
import { auditLogs, guilds, users } from "../../../../schemas";
import { sql } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { AutoRefresh } from "@/components/AutoRefresh";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const t = await getTranslations('adminPages');
  
  const apiUrl = process.env.API_URL || "http://localhost:2000";
  const [statsRes, statusRes, auditRes] = await Promise.all([
    fetch(`${apiUrl}/stats`, {
      headers: { Authorization: `Bearer ${process.env.BOT_API_TOKEN}` },
      cache: 'no-store'
    }).catch(() => null),
    fetch(`${apiUrl}/status`, {
      headers: { Authorization: `Bearer ${process.env.BOT_API_TOKEN}` },
      cache: 'no-store'
    }).catch(() => null),
    db.select({ count: sql<number>`COUNT(*)` }).from(auditLogs).catch(() => [{ count: 0 }])
  ]);

  let totalGuilds = 0;
  let totalUsers = 0;
  let status = "offline";
  let activeShards = 1;

  if (statsRes?.ok) {
    const stats = await statsRes.json();
    totalGuilds = stats.guilds?.total || 0;
    totalUsers = stats.users?.total || 0;
    status = stats.status || "offline";
  } else {
    // Fallback to db if bot is unreachable
    const [gRes, uRes] = await Promise.all([
      db.select({ count: sql<number>`COUNT(*)` }).from(guilds),
      db.select({ count: sql<number>`COUNT(*)` }).from(users)
    ]);
    totalGuilds = gRes[0]?.count || 0;
    totalUsers = uRes[0]?.count || 0;
  }

  if (statusRes?.ok) {
    const statusData = await statusRes.json();
    activeShards = statusData.services?.discord?.shards?.length || 1;
  }

  const totalActions = auditRes[0]?.count || 0;

  const metrics = [
    { label: t('page.metrics.totalUsers') || 'Total Users', value: totalUsers.toString(), icon: Zap, color: "text-foreground" },
    { label: t('page.metrics.activeGuilds') || 'Total Guilds', value: totalGuilds.toString(), icon: Users, color: "text-foreground" },
    { label: "Total Actions", value: totalActions.toString(), icon: Activity, color: "text-foreground" },
    { label: "Bot Status", value: status.toUpperCase(), icon: Server, color: "text-foreground" },
    { label: "Active Shards", value: activeShards.toString(), icon: Layers, color: "text-foreground" },
  ];

  return (
    <div className="space-y-8">
      <AutoRefresh interval={5000} />
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          {t('page.title')}
        </h2>
        <p className="text-white/40 mt-1">{t('page.description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map((metric, i) => (
          <div key={i} className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden group shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                <metric.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-white/90 tracking-tight">{metric.value}</h3>
              <p className="text-sm text-white/50 mt-1 uppercase tracking-wider font-bold">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
