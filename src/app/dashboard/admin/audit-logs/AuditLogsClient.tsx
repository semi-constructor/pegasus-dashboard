"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Activity, Users, History, BarChart3, TrendingDown, Clock, Shield, Database } from "lucide-react";
import { useTranslations } from "next-intl";

type Stats = {
  total: number;
  actionCounts: { action: string; count: number }[];
  uniqueUsers: number;
};

type Analytics = {
  topUsers: { userId: string; count: number }[];
  topGuilds: { guildId: string; count: number }[];
  leastUsedActions: { action: string; count: number }[];
  peakHours: { hour: number; count: number }[];
};

export default function AuditLogsClient({
  stats,
  recentLogs,
  analytics,
}: {
  stats: Stats;
  recentLogs: any[];
  analytics: Analytics;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "analytics">("overview");
  const t = useTranslations('adminPages');

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-lg md:text-xl font-medium tracking-[0.3em] uppercase flex items-center gap-4 text-foreground">
          <FileText className="w-6 h-6" />
          {t('auditLogs.title')}
        </h1>
        <p className="text-foreground/50 text-sm tracking-wide">
          {t('auditLogs.description')}
        </p>
      </div>

      <div className="flex border-b border-border w-full overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-8 py-4 font-medium text-xs tracking-[0.2em] uppercase transition-colors relative whitespace-nowrap ${
            activeTab === "overview" ? "text-foreground bg-foreground/5" : "text-foreground/50 hover:text-foreground/80"
          }`}
        >
          {t('auditLogs.tabs.overview')}
          {activeTab === "overview" && (
            <motion.div
              layoutId="auditLogsTab"
              className="absolute bottom-0 left-0 right-0 h-px bg-foreground"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-8 py-4 font-medium text-xs tracking-[0.2em] uppercase transition-colors relative whitespace-nowrap ${
            activeTab === "analytics" ? "text-foreground bg-foreground/5" : "text-foreground/50 hover:text-foreground/80"
          }`}
        >
          {t('auditLogs.tabs.analytics')}
          {activeTab === "analytics" && (
            <motion.div
              layoutId="auditLogsTab"
              className="absolute bottom-0 left-0 right-0 h-px bg-foreground"
            />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground/10 border border-border">
              <div className="p-8 bg-background hover:bg-foreground/5 transition-colors group flex flex-col justify-between">
                <div className="flex items-center justify-between mb-12">
                  <div className="text-foreground/30 group-hover:text-foreground transition-colors">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-medium text-foreground tracking-[0.1em]">{stats.total.toLocaleString()}</h3>
                  <p className="text-xs text-foreground/50 mt-4 tracking-[0.2em] uppercase">{t('auditLogs.totalEvents')}</p>
                </div>
              </div>

              <div className="p-8 bg-background hover:bg-foreground/5 transition-colors group flex flex-col justify-between">
                <div className="flex items-center justify-between mb-12">
                  <div className="text-foreground/30 group-hover:text-foreground transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-medium text-foreground tracking-[0.1em]">{stats.actionCounts.length}</h3>
                  <p className="text-xs text-foreground/50 mt-4 tracking-[0.2em] uppercase">{t('auditLogs.uniqueActions')}</p>
                </div>
              </div>

              <div className="p-8 bg-background hover:bg-foreground/5 transition-colors group flex flex-col justify-between">
                <div className="flex items-center justify-between mb-12">
                  <div className="text-foreground/30 group-hover:text-foreground transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-medium text-foreground tracking-[0.1em]">{stats.uniqueUsers.toLocaleString()}</h3>
                  <p className="text-xs text-foreground/50 mt-4 tracking-[0.2em] uppercase">{t('auditLogs.uniqueActors')}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 border border-border bg-background p-8">
                <h3 className="text-sm tracking-[0.2em] uppercase text-foreground mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {t('auditLogs.topActions')}
                </h3>
                <p className="text-xs text-foreground/50 mb-8">{t('auditLogs.topActionsDesc')}</p>
                
                <div className="space-y-4">
                  {stats.actionCounts.slice(0, 8).map((a, i) => (
                    <div key={a.action} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <span className="text-xs tracking-[0.2em] text-foreground/30">{String(i + 1).padStart(2, '0')}</span>
                        <span className="text-sm font-medium text-foreground/80 uppercase tracking-widest">{a.action}</span>
                      </div>
                      <span className="text-xs text-foreground font-mono">{a.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 border border-border bg-background p-0 overflow-hidden">
                <div className="p-8 border-b border-border">
                  <h3 className="text-sm tracking-[0.2em] uppercase text-foreground mb-2 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    {t('auditLogs.recentLogs')}
                  </h3>
                  <p className="text-xs text-foreground/50">{t('auditLogs.recentLogsDesc')}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[10px] text-foreground/30 uppercase tracking-[0.3em] bg-foreground/5 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-normal">{t('auditLogs.action')}</th>
                        <th className="px-6 py-4 font-normal">{t('auditLogs.guildId')}</th>
                        <th className="px-6 py-4 font-normal">{t('auditLogs.userId')}</th>
                        <th className="px-6 py-4 font-normal">{t('auditLogs.targetId')}</th>
                        <th className="px-6 py-4 font-normal">{t('auditLogs.time')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLogs.map((log) => (
                        <tr key={log.id} className="border-b border-border hover:bg-foreground/5 transition-colors">
                          <td className="px-6 py-4 text-foreground text-xs tracking-wider uppercase font-medium">
                            {log.action}
                          </td>
                          <td className="px-6 py-4 text-foreground/50 font-mono text-xs">{log.guildId}</td>
                          <td className="px-6 py-4 text-foreground/50 font-mono text-xs">{log.userId}</td>
                          <td className="px-6 py-4 text-foreground/50 font-mono text-xs">{log.targetId || "-"}</td>
                          <td className="px-6 py-4 text-foreground/30 text-xs">
                            {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-foreground/10 border border-border">
              
              <div className="bg-background p-8 group">
                <div className="mb-8">
                  <h3 className="text-sm tracking-[0.2em] uppercase text-foreground mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {t('auditLogs.topUsers')}
                  </h3>
                  <p className="text-xs text-foreground/50">{t('auditLogs.topUsersDesc')}</p>
                </div>
                <div className="space-y-0">
                  {analytics.topUsers.map((u, i) => (
                    <div key={u.userId} className="flex items-center justify-between py-4 border-b border-border last:border-0 hover:bg-foreground/5 px-2 -mx-2 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-foreground/30">{String(i + 1).padStart(2, '0')}</span>
                        <span className="font-mono text-xs text-foreground">{u.userId}</span>
                      </div>
                      <span className="text-xs text-foreground/70 tracking-widest uppercase">
                        {u.count.toLocaleString()} {t('auditLogs.actions')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-background p-8 group">
                <div className="mb-8">
                  <h3 className="text-sm tracking-[0.2em] uppercase text-foreground mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {t('auditLogs.topGuilds')}
                  </h3>
                  <p className="text-xs text-foreground/50">{t('auditLogs.topGuildsDesc')}</p>
                </div>
                <div className="space-y-0">
                  {analytics.topGuilds.map((g, i) => (
                    <div key={g.guildId} className="flex items-center justify-between py-4 border-b border-border last:border-0 hover:bg-foreground/5 px-2 -mx-2 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-foreground/30">{String(i + 1).padStart(2, '0')}</span>
                        <span className="font-mono text-xs text-foreground">{g.guildId}</span>
                      </div>
                      <span className="text-xs text-foreground/70 tracking-widest uppercase">
                        {g.count.toLocaleString()} {t('auditLogs.actions')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-background p-8 group">
                <div className="mb-8">
                  <h3 className="text-sm tracking-[0.2em] uppercase text-foreground mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    {t('auditLogs.mostUsedActions')}
                  </h3>
                </div>
                <div className="space-y-4">
                  {stats.actionCounts.slice(0, 5).map((a, i) => (
                    <div key={a.action} className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground uppercase tracking-widest w-1/3">{a.action}</span>
                      <div className="flex items-center gap-4 w-2/3 justify-end">
                        <div className="h-1 flex-1 max-w-[150px] bg-foreground/10">
                          <div 
                            className="h-full bg-foreground transition-all duration-1000" 
                            style={{ width: `${Math.max(2, (a.count / stats.actionCounts[0].count) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-foreground font-mono w-12 text-right">{a.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-background p-8 group">
                <div className="mb-8">
                  <h3 className="text-sm tracking-[0.2em] uppercase text-foreground mb-2 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    {t('auditLogs.leastUsedActions')}
                  </h3>
                </div>
                <div className="space-y-0">
                  {analytics.leastUsedActions.slice(0, 5).map((a, i) => (
                    <div key={a.action} className="flex items-center justify-between py-4 border-b border-border last:border-0 hover:bg-foreground/5 px-2 -mx-2 transition-colors">
                      <span className="text-xs font-medium text-foreground uppercase tracking-widest">{a.action}</span>
                      <span className="text-xs text-foreground/50 tracking-widest uppercase">
                        {a.count} {a.count === 1 ? t('auditLogs.timeOne') : t('auditLogs.timesMany')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-border bg-background p-8">
              <div className="mb-8">
                <h3 className="text-sm tracking-[0.2em] uppercase text-foreground mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t('auditLogs.peakUsage')}
                </h3>
                <p className="text-xs text-foreground/50">{t('auditLogs.peakUsageDesc')}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-foreground/10 border border-border">
                {analytics.peakHours.slice(0, 12).map((h) => (
                  <div key={h.hour} className="p-6 bg-background flex flex-col gap-2 hover:bg-foreground/5 transition-colors">
                    <span className="text-xl font-medium text-foreground tracking-[0.1em]">
                      {h.hour.toString().padStart(2, '0')}:00
                    </span>
                    <span className="text-[10px] text-foreground/50 uppercase tracking-widest">
                      {h.count.toLocaleString()} {t('auditLogs.actions')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
