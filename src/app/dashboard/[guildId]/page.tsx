import Link from 'next/link';
import { getGuildOverview } from '@/lib/api';
import { getGuildSettings, getGuildMembers } from '@/app/actions';
import { db } from '@/lib/db';
import * as schema from '../../../../schemas/index';
import { eq, sql } from 'drizzle-orm';
import { Shield, TrendingUp, Coins, Ticket, Activity, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';

export default async function GuildOverviewPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const overview = await getGuildOverview(guildId);
  const settings = await getGuildSettings(guildId);
  const members = await getGuildMembers(guildId);

  const membersMap = new Map(members.map(m => [m.id, m.username || m.displayName]));

  // Fetch real statistics from Drizzle ORM Database
  let totalXp = 0;
  let totalCoins = 0;
  let totalWarns = 0;
  let totalTickets = 0;
  let recentLogs: any[] = [];

  try {
    const xpQuery = await db.select({ total: sql<number>`sum(${schema.userXp.xp})` })
      .from(schema.userXp).where(eq(schema.userXp.guildId, guildId));
    totalXp = Number(xpQuery[0]?.total || 0);

    const ecoQuery = await db.select({ total: sql<number>`sum(${schema.economyBalances.balance})` })
      .from(schema.economyBalances).where(eq(schema.economyBalances.guildId, guildId));
    totalCoins = Number(ecoQuery[0]?.total || 0);

    const warnQuery = await db.select({ count: sql<number>`count(*)` })
      .from(schema.warnings).where(eq(schema.warnings.guildId, guildId));
    totalWarns = Number(warnQuery[0]?.count || 0);

    const ticketQuery = await db.select({ count: sql<number>`count(*)` })
      .from(schema.tickets).where(eq(schema.tickets.guildId, guildId));
    totalTickets = Number(ticketQuery[0]?.count || 0);

    recentLogs = await db.select().from(schema.auditLogs)
      .where(eq(schema.auditLogs.guildId, guildId))
      .orderBy(sql`${schema.auditLogs.createdAt} desc`)
      .limit(5);
  } catch (error) {
    console.error('DB fetch error in GuildOverviewPage:', error);
  }

  const modules = [
    { name: 'Welcome & Goodbye System', enabled: settings.welcomeEnabled, href: `/dashboard/${guildId}/settings` },
    { name: 'XP & Leveling Matrix', enabled: settings.xpEnabled, href: `/dashboard/${guildId}/xp-matrix` },
    { name: 'Automated Roles', enabled: settings.autoroleEnabled, href: `/dashboard/${guildId}/settings` },
    { name: 'Server Security & Mod Log', enabled: settings.securityEnabled, href: `/dashboard/${guildId}/moderation` },
  ];

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
      <StaggerContainer>
      {/* Header */}
      <StaggerItem>
      <div className="border-b border-white/5 pb-8 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 border border-white/5 px-3 py-1 bg-white/[0.01] mb-4 text-xs font-mono tracking-wide text-neutral-400">
            <Shield className="w-3.5 h-3.5 text-[#5E5CE6]" />
            <span>Server Diagnostics</span>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">{(overview as any)?.name || `Guild (${guildId})`}</h1>
          <p className="text-sm text-neutral-400 font-mono tracking-wide">
            ID: {guildId} • {((overview as any)?.memberCount || 0).toLocaleString()} Total Members
          </p>
        </div>
        <Link
          href={`/dashboard/${guildId}/settings`}
          className="border border-[#5E5CE6] bg-[#5E5CE6]/10 px-6 py-3 text-xs font-mono text-white hover:bg-[#5E5CE6] hover:text-black transition-all rounded-none self-start md:self-center"
        >
          Configure Server Settings
        </Link>
      </div>
      </StaggerItem>

      {/* Server Statistics (Rule of Three Minimalism) */}
      <StaggerItem>
      <div className="mb-16">
        <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3">// Database Aggregations</div>
        <h2 className="text-2xl font-light tracking-tight text-white mb-6">Real-Time Server Telemetry</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat 1 */}
          <div className="border border-white/5 p-8 bg-white/[0.01] flex flex-col justify-between rounded-none">
            <TrendingUp className="w-6 h-6 text-neutral-400 mb-6" />
            <div className="text-4xl font-light tracking-tight text-white mb-2" title={totalXp.toLocaleString()}>{formatNumber(totalXp)}</div>
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Total XP Collected</div>
          </div>
          {/* Stat 2 */}
          <div className="border border-white/5 p-8 bg-white/[0.01] flex flex-col justify-between rounded-none">
            <Coins className="w-6 h-6 text-neutral-400 mb-6" />
            <div className="text-4xl font-light tracking-tight text-white mb-2" title={totalCoins.toLocaleString()}>{formatNumber(totalCoins)}</div>
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Total Economy Balance</div>
          </div>
          {/* Stat 3 */}
          <div className="border border-white/5 p-8 bg-white/[0.01] flex flex-col justify-between rounded-none">
            <Shield className="w-6 h-6 text-neutral-400 mb-6" />
            <div className="text-4xl font-light tracking-tight text-white mb-2" title={totalWarns.toLocaleString()}>{formatNumber(totalWarns)}</div>
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Active Warning Records</div>
          </div>
          {/* Stat 4 */}
          <div className="border border-white/5 p-8 bg-white/[0.01] flex flex-col justify-between rounded-none">
            <Ticket className="w-6 h-6 text-neutral-400 mb-6" />
            <div className="text-4xl font-light tracking-tight text-white mb-2" title={totalTickets.toLocaleString()}>{formatNumber(totalTickets)}</div>
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Total Support Tickets</div>
          </div>
        </div>
      </div>
      </StaggerItem>

      {/* Module Configuration Status */}
      <StaggerItem>
      <div className="mb-16">
        <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3">// System State</div>
        <h2 className="text-2xl font-light tracking-tight text-white mb-6">Enabled Server Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod) => (
            <div key={mod.name} className="border border-white/5 p-6 bg-white/[0.01] flex items-center justify-between rounded-none">
              <div className="flex items-center gap-4">
                {mod.enabled ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-neutral-600" />
                )}
                <div>
                  <h3 className="text-base font-normal text-white mb-1">{mod.name}</h3>
                  <p className="text-xs font-mono text-neutral-500">
                    Status: {mod.enabled ? 'Active / Automated' : 'Disabled / Standby'}
                  </p>
                </div>
              </div>
              <Link
                href={mod.href}
                className="border border-white/10 bg-white/[0.02] px-4 py-2 text-xs font-mono text-neutral-300 hover:border-[#5E5CE6] hover:text-[#5E5CE6] transition-colors rounded-none"
              >
                Configure
              </Link>
            </div>
          ))}
        </div>
      </div>
      </StaggerItem>

      {/* Recent Server Activity */}
      <StaggerItem>
      <div>
        <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3">// Audit Trail</div>
        <h2 className="text-2xl font-light tracking-tight text-white mb-6">Recent Server Security Activity</h2>
        <div className="border border-white/5 bg-white/[0.01] rounded-none overflow-hidden">
          {recentLogs.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-neutral-500 bg-white/[0.01]">
                  <th className="py-4 px-6 font-medium">ACTION</th>
                  <th className="py-4 px-6 font-medium">USER</th>
                  <th className="py-4 px-6 font-medium">DETAILS / REASON</th>
                  <th className="py-4 px-6 font-medium text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-6 font-medium text-white flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-[#5E5CE6]" />
                      <span>{log.action}</span>
                    </td>
                    <td className="py-4 px-6 text-neutral-400">
                      {membersMap.get(log.userId) || log.userId}
                    </td>
                    <td className="py-4 px-6 text-neutral-400">
                      {JSON.stringify(log.details || {})}
                    </td>
                    <td className="py-4 px-6 text-right text-neutral-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-xs font-mono text-neutral-500 flex flex-col items-center gap-3">
              <Clock className="w-6 h-6 text-neutral-600" />
              <span>No recent audit logs recorded in the database for this guild.</span>
            </div>
          )}
        </div>
      </div>
      </StaggerItem>
      </StaggerContainer>
    </main>
  );
}
