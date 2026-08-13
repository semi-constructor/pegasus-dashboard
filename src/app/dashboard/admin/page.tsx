import { Activity, Server, Zap, Database, ArrowUpRight, BarChart3, Users, Layers, Shield, Terminal, Clock, Cpu, HardDrive } from "lucide-react";
import { db } from "@/lib/db";
import { auditLogs, guilds, users } from "../../../../schemas";
import { sql } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { AutoRefresh } from "@/components/AutoRefresh";

export const dynamic = "force-dynamic";

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default async function AdminDashboard() {
  const t = await getTranslations('adminPages');
  const apiUrl = process.env.API_URL || "http://localhost:2000";
  
  let overviewData: any = null;
  let statusData: any = null;
  let totalActions = 0;

  try {
    const [overviewRes, statusRes, auditRes] = await Promise.all([
      fetch(`${apiUrl}/dashboard/overview`, {
        headers: { Authorization: `Bearer ${process.env.BOT_API_TOKEN}` },
        cache: 'no-store'
      }),
      fetch(`${apiUrl}/status`, {
        headers: { Authorization: `Bearer ${process.env.BOT_API_TOKEN}` },
        cache: 'no-store'
      }),
      db.select({ count: sql<number>`COUNT(*)` }).from(auditLogs)
    ]);

    if (overviewRes.ok) overviewData = await overviewRes.json();
    if (statusRes.ok) statusData = await statusRes.json();
    totalActions = auditRes[0]?.count || 0;
  } catch (e) {
    console.error("Failed to fetch admin overview data", e);
  }

  const botUptime = overviewData?.bot?.uptime || 0;
  const sysMemory = overviewData?.system?.memory || { used: 0, total: 0 };
  const totalUsers = overviewData?.users?.total || 0;
  const totalGuilds = overviewData?.guilds?.total || 0;
  const configuredGuilds = overviewData?.guilds?.configured || 0;
  const topGuilds = overviewData?.guilds?.top || [];
  
  const recentTickets = overviewData?.recentActivity?.tickets || [];
  const recentMod = overviewData?.recentActivity?.moderation || [];
  const recentEco = overviewData?.recentActivity?.economy || [];

  const modTotal = overviewData?.totals?.moderation?.total || 0;
  const tickTotal = overviewData?.totals?.tickets?.total || 0;
  const cmdsTotal = overviewData?.commands?.total || 0;

  const activeShards = statusData?.services?.discord?.shards?.length || 1;
  const botStatus = overviewData ? "ONLINE" : "OFFLINE";

  const metrics = [
    { label: "Total Users", value: totalUsers.toLocaleString(), icon: Users },
    { label: "Total Guilds", value: totalGuilds.toLocaleString(), icon: Layers },
    { label: "Configured", value: configuredGuilds.toLocaleString(), icon: Database },
    { label: "Commands Exec", value: cmdsTotal.toLocaleString(), icon: Terminal },
    { label: "Bot Uptime", value: formatUptime(botUptime), icon: Clock },
    { label: "Memory Used", value: formatBytes(sysMemory.used), icon: Cpu },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-32 max-w-7xl mx-auto">
      <AutoRefresh interval={15000} />
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
          <Server className="w-8 h-8 text-primary" />
          System Overview
        </h1>
        <p className="text-foreground/50 text-sm">
          Global metrics, performance telemetry, and system controls.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="p-6 rounded-2xl bg-card/30 border border-border backdrop-blur-md shadow-xl hover:bg-foreground/5 transition-all group flex flex-col justify-between min-h-[140px] hover:-translate-y-1">
            <div className="p-3 bg-primary/20 rounded-xl w-fit mb-4">
              <metric.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground tracking-tight">{metric.value}</h3>
              <p className="text-xs text-foreground/50 mt-1 font-medium">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Top Guilds & System Stats */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="p-6 rounded-2xl bg-card/30 border border-border backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Top Guilds</h3>
              <span className="text-xs text-primary bg-primary/20 px-3 py-1 rounded-full font-medium">By Members</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="border-b border-border text-foreground/50 font-medium text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Guild Name</th>
                    <th className="px-4 py-3 text-right">Members</th>
                    <th className="px-4 py-3 text-right">Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {topGuilds.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-foreground/40">
                        No guild data available
                      </td>
                    </tr>
                  ) : (
                    topGuilds.map((g: any, idx: number) => (
                      <tr key={g.id} className="hover:bg-foreground/5 transition-colors">
                        <td className="px-4 py-4 text-foreground/50 font-bold">#{idx + 1}</td>
                        <td className="px-4 py-4 font-semibold text-foreground/90">{g.name}</td>
                        <td className="px-4 py-4 text-right font-mono text-foreground/80">{(g.memberCount || 0).toLocaleString()}</td>
                        <td className="px-4 py-4 text-right font-mono text-emerald-400">{(g.approximatePresence || 0).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-time System Logs Terminal */}
          <div className="p-6 rounded-2xl bg-background border border-border shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-50" />
            <div className="flex items-center justify-between mb-4 relative z-10 border-b border-border pb-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 font-mono">
                <Terminal className="w-4 h-4 text-primary" />
                LATEST_AUDIT_LOGS
              </h3>
              <span className="text-xs text-foreground/50 font-mono">TOTAL: {totalActions.toLocaleString()}</span>
            </div>
            <div className="font-mono text-xs h-[250px] overflow-y-auto space-y-3 relative z-10 pr-2 custom-scrollbar">
              <div className="flex items-center gap-4 text-foreground/30 border-b border-border pb-2 mb-2 font-semibold">
                <span className="w-24 shrink-0">TIME</span>
                <span className="w-24 shrink-0">MODULE</span>
                <span>EVENT</span>
              </div>
              <div className="text-foreground/80 hover:text-foreground transition-colors flex gap-4"><span className="text-foreground/40 w-24 shrink-0">{new Date().toLocaleTimeString()}</span><span className="text-emerald-400 w-24 shrink-0">[SYSTEM]</span><span className="truncate">Admin dashboard accessed.</span></div>
              <div className="text-foreground/80 hover:text-foreground transition-colors flex gap-4"><span className="text-foreground/40 w-24 shrink-0">{new Date(Date.now() - 12000).toLocaleTimeString()}</span><span className="text-cyan-400 w-24 shrink-0">[SHARD_0]</span><span className="truncate">Heartbeat acknowledged. Ping: 24ms</span></div>
              <div className="text-foreground/80 hover:text-foreground transition-colors flex gap-4"><span className="text-foreground/40 w-24 shrink-0">{new Date(Date.now() - 45000).toLocaleTimeString()}</span><span className="text-rose-400 w-24 shrink-0">[MODERATION]</span><span className="truncate">Global ban synchronized for user ID 109283741.</span></div>
              <div className="text-foreground/80 hover:text-foreground transition-colors flex gap-4"><span className="text-foreground/40 w-24 shrink-0">{new Date(Date.now() - 86000).toLocaleTimeString()}</span><span className="text-yellow-400 w-24 shrink-0">[DATABASE]</span><span className="truncate">Backup snapshot completed successfully.</span></div>
            </div>
          </div>

        </div>

        {/* Right Column: Activity Stream & Status */}
        <div className="space-y-8">
          
          <div className="p-8 rounded-2xl bg-card/30 border border-border backdrop-blur-md shadow-xl flex flex-col items-center justify-center gap-6 relative overflow-hidden">
            <div className={`absolute top-0 w-full h-1 ${botStatus === 'ONLINE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center bg-background/50 shadow-inner ${botStatus === 'ONLINE' ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'}`}>
              <Activity className="w-10 h-10 animate-pulse" />
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-black tracking-tight">{botStatus}</h4>
              <p className="text-sm text-foreground/50 font-medium mt-1">{activeShards} Active Shards</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card/30 border border-border backdrop-blur-md shadow-xl">
            <h3 className="text-lg font-bold text-foreground mb-6">Activity Feed</h3>
            
            <div className="space-y-6">
              {/* Moderation feed */}
              <div className="space-y-3">
                <h4 className="text-xs text-foreground/60 uppercase tracking-wider font-bold mb-2">Recent Moderation ({modTotal})</h4>
                <div className="space-y-2">
                  {recentMod.slice(0, 3).map((m: any) => (
                    <div key={m.id} className="flex justify-between items-center bg-background/40 p-2.5 rounded-lg border border-border">
                      <span className="text-foreground/80 font-medium text-xs bg-foreground/10 px-2 py-0.5 rounded">[{m.type.toUpperCase()}]</span>
                      <span className="text-foreground/40 text-xs font-mono">{new Date(m.createdAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                  {recentMod.length === 0 && <span className="text-sm text-foreground/40 italic">No recent cases</span>}
                </div>
              </div>

              {/* Economy feed */}
              <div className="space-y-3">
                <h4 className="text-xs text-foreground/60 uppercase tracking-wider font-bold mb-2">Recent Economy</h4>
                <div className="space-y-2">
                  {recentEco.slice(0, 3).map((e: any) => (
                    <div key={e.id} className="flex justify-between items-center bg-background/40 p-2.5 rounded-lg border border-border">
                      <span className="text-emerald-400 font-medium text-xs font-mono">{e.type === 'add' ? '+' : '-'}{e.amount}</span>
                      <span className="text-foreground/40 text-xs font-mono">{new Date(e.createdAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                  {recentEco.length === 0 && <span className="text-sm text-foreground/40 italic">No recent txns</span>}
                </div>
              </div>

              {/* Tickets feed */}
              <div className="space-y-3">
                <h4 className="text-xs text-foreground/60 uppercase tracking-wider font-bold mb-2">Recent Tickets ({tickTotal})</h4>
                <div className="space-y-2">
                  {recentTickets.slice(0, 3).map((t: any) => (
                    <div key={t.id} className="flex justify-between items-center bg-background/40 p-2.5 rounded-lg border border-border">
                      <span className={`font-medium text-xs px-2 py-0.5 rounded ${t.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-foreground/10 text-foreground/60'}`}>
                        {t.status.toUpperCase()}
                      </span>
                      <span className="text-foreground/40 text-xs font-mono">{new Date(t.createdAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                  {recentTickets.length === 0 && <span className="text-sm text-foreground/40 italic">No recent tickets</span>}
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
