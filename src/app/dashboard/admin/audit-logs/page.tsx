import { db } from "@/lib/db";
import { auditLogs } from "../../../../../schemas/security";
import { sql, desc, asc } from "drizzle-orm";
import AuditLogsClient from "./AuditLogsClient";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  // --- Existing Queries ---
  const totalRes = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(auditLogs);
  
  const totalLogs = totalRes[0]?.count || 0;

  const uniqueUsersRes = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${auditLogs.userId})` })
    .from(auditLogs);
  
  const uniqueUsers = uniqueUsersRes[0]?.count || 0;

  const actionCountsRes = await db
    .select({
      action: auditLogs.action,
      count: sql<number>`COUNT(*)`,
    })
    .from(auditLogs)
    .groupBy(auditLogs.action)
    .orderBy(desc(sql<number>`COUNT(*)`));

  const recentLogs = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(50);

  // --- New Analytics Queries ---
  const topUsersRes = await db
    .select({
      userId: auditLogs.userId,
      count: sql<number>`COUNT(*)`,
    })
    .from(auditLogs)
    .groupBy(auditLogs.userId)
    .orderBy(desc(sql<number>`COUNT(*)`))
    .limit(5);

  const topGuildsRes = await db
    .select({
      guildId: auditLogs.guildId,
      count: sql<number>`COUNT(*)`,
    })
    .from(auditLogs)
    .groupBy(auditLogs.guildId)
    .orderBy(desc(sql<number>`COUNT(*)`))
    .limit(5);

  const leastUsedActionsRes = await db
    .select({
      action: auditLogs.action,
      count: sql<number>`COUNT(*)`,
    })
    .from(auditLogs)
    .groupBy(auditLogs.action)
    .orderBy(asc(sql<number>`COUNT(*)`))
    .limit(10);

  const peakHoursRes = await db
    .select({
      hour: sql<number>`EXTRACT(HOUR FROM ${auditLogs.createdAt})::integer`,
      count: sql<number>`COUNT(*)`,
    })
    .from(auditLogs)
    .groupBy(sql`EXTRACT(HOUR FROM ${auditLogs.createdAt})`)
    .orderBy(desc(sql`COUNT(*)`))
    .limit(24);

  const stats = {
    total: Number(totalLogs),
    uniqueUsers: Number(uniqueUsers),
    actionCounts: actionCountsRes.map(a => ({ action: a.action, count: Number(a.count) })),
  };

  const analytics = {
    topUsers: topUsersRes.map(u => ({ userId: u.userId, count: Number(u.count) })),
    topGuilds: topGuildsRes.map(g => ({ guildId: g.guildId, count: Number(g.count) })),
    leastUsedActions: leastUsedActionsRes.map(a => ({ action: a.action, count: Number(a.count) })),
    peakHours: peakHoursRes.map(h => ({ hour: Number(h.hour), count: Number(h.count) })).sort((a, b) => b.count - a.count),
  };

  return <AuditLogsClient stats={stats} recentLogs={recentLogs} analytics={analytics} />;
}
