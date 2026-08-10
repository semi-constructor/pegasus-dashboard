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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
          <FileText className="w-8 h-8 text-primary" />
          {t('auditLogs.title')}
        </h1>
        <p className="text-white/40">
          {t('auditLogs.description')}
        </p>
      </div>

      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === "overview" ? "text-primary" : "text-white/50 hover:text-white/80"
          }`}
        >
          {t('auditLogs.tabs.overview')}
          {activeTab === "overview" && (
            <motion.div
              layoutId="auditLogsTab"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${
            activeTab === "analytics" ? "text-primary" : "text-white/50 hover:text-white/80"
          }`}
        >
          {t('auditLogs.tabs.analytics')}
          {activeTab === "analytics" && (
            <motion.div
              layoutId="auditLogsTab"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
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
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white/50 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    {t('auditLogs.totalEvents')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black text-white">{stats.total.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white/50 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {t('auditLogs.uniqueActions')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black text-white">{stats.actionCounts.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white/50 uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {t('auditLogs.uniqueActors')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black text-white">{stats.uniqueUsers.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      {t('auditLogs.topActions')}
                    </CardTitle>
                    <CardDescription>{t('auditLogs.topActionsDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.actionCounts.slice(0, 8).map((a, i) => (
                        <div key={a.action} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                              {i + 1}
                            </div>
                            <span className="text-sm font-medium text-white/80">{a.action}</span>
                          </div>
                          <Badge variant="secondary" className="bg-white/10 hover:bg-white/20">
                            {a.count.toLocaleString()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <History className="w-5 h-5 text-primary" />
                      {t('auditLogs.recentLogs')}
                    </CardTitle>
                    <CardDescription>{t('auditLogs.recentLogsDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-white/50 uppercase bg-black/40">
                          <tr>
                            <th className="px-4 py-3 rounded-tl-lg">{t('auditLogs.action')}</th>
                            <th className="px-4 py-3">{t('auditLogs.guildId')}</th>
                            <th className="px-4 py-3">{t('auditLogs.userId')}</th>
                            <th className="px-4 py-3">{t('auditLogs.targetId')}</th>
                            <th className="px-4 py-3 rounded-tr-lg">{t('auditLogs.time')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentLogs.map((log) => (
                            <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 font-medium text-white/90">
                                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                                  {log.action}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-white/60 font-mono text-xs">{log.guildId}</td>
                              <td className="px-4 py-3 text-white/60 font-mono text-xs">{log.userId}</td>
                              <td className="px-4 py-3 text-white/60 font-mono text-xs">{log.targetId || "-"}</td>
                              <td className="px-4 py-3 text-white/40">
                                {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
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
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    {t('auditLogs.topUsers')}
                  </CardTitle>
                  <CardDescription>{t('auditLogs.topUsersDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topUsers.map((u, i) => (
                      <div key={u.userId} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">
                            #{i + 1}
                          </div>
                          <span className="font-mono text-sm text-white/80">{u.userId}</span>
                        </div>
                        <Badge variant="secondary" className="bg-white/10 text-white/90">
                          {u.count.toLocaleString()} {t('auditLogs.actions')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    {t('auditLogs.topGuilds')}
                  </CardTitle>
                  <CardDescription>{t('auditLogs.topGuildsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topGuilds.map((g, i) => (
                      <div key={g.guildId} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400">
                            #{i + 1}
                          </div>
                          <span className="font-mono text-sm text-white/80">{g.guildId}</span>
                        </div>
                        <Badge variant="secondary" className="bg-white/10 text-white/90">
                          {g.count.toLocaleString()} {t('auditLogs.actions')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    {t('auditLogs.mostUsedActions')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.actionCounts.slice(0, 5).map((a, i) => (
                      <div key={a.action} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white/80">{a.action}</span>
                        <div className="flex items-center gap-3 w-1/2 justify-end">
                          <div className="h-2 flex-1 max-w-[100px] bg-black/40 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${Math.max(10, (a.count / stats.actionCounts[0].count) * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/50 w-8 text-right">{a.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-rose-400" />
                    {t('auditLogs.leastUsedActions')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.leastUsedActions.slice(0, 5).map((a, i) => (
                      <div key={a.action} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white/80">{a.action}</span>
                        <Badge variant="outline" className="border-rose-500/30 text-rose-400">
                          {a.count} {a.count === 1 ? t('auditLogs.timeOne') : t('auditLogs.timesMany')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    {t('auditLogs.peakUsage')}
                  </CardTitle>
                  <CardDescription>{t('auditLogs.peakUsageDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {analytics.peakHours.slice(0, 12).map((h) => (
                      <div key={h.hour} className="p-4 rounded-xl bg-black/20 border border-white/5 text-center flex flex-col gap-1 hover:bg-white/5 transition-colors">
                        <span className="text-2xl font-black text-white">
                          {h.hour.toString().padStart(2, '0')}:00
                        </span>
                        <span className="text-xs font-medium text-amber-400/80 uppercase tracking-wider">
                          {h.count.toLocaleString()} {t('auditLogs.actions')}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
