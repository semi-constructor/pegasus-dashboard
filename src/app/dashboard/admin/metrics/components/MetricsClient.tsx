"use client";

import { motion } from"framer-motion";
import { Activity, Server, Database, Clock, ShieldCheck, Zap, Layers } from"lucide-react";
import { useEffect, useState } from"react";
import { useTranslations } from "next-intl";

type MetricsData = {
 status: string;
 uptime: number;
  guilds: { total: number };
  users: { total: number };
  commands?: { perMinute: number };
  system: { memory_usage: number; memory_total: number; cpu_usage: number; latency: number; shard_count?: number };
 shards?: Array<{ id: number; status: number; statusText: string; ping: number; guildCount: number; uptime: number }>;
 health: {
 components: {
 database: { latency: number; size?: number };
 cache: { hitRate: number; size: number };
 }
 }
};

export default function MetricsClient({ data }: { data: MetricsData }) {
  const t = useTranslations('adminPages');
  const [mounted, setMounted] = useState(false);
  
  // Track history arrays in state
  const [historicalRequests, setHistoricalRequests] = useState<number[]>(Array(15).fill(0));
  const [latencyHistory, setLatencyHistory] = useState<number[]>(Array(15).fill(0));

  useEffect(() => {
    setMounted(true);
  }, []);

  // When new data comes in, shift the arrays
  useEffect(() => {
    if (data.status !== "offline") {
      // Use real data from the bot's stats aggregator
      const realReqs = data.commands?.perMinute || 0;
      
      setHistoricalRequests(prev => {
        const newArr = [...prev.slice(1), realReqs];
        return newArr;
      });

      setLatencyHistory(prev => {
        const newArr = [...prev.slice(1), data.system.latency || 0];
        return newArr;
      });
    } else {
      setHistoricalRequests(Array(15).fill(0));
      setLatencyHistory(Array(15).fill(0));
    }
  }, [data]);

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${seconds % 60}s`;
  };

 const formatBytes = (bytes: number) => {
 if (bytes === 0) return"0 B";
 const k = 1024;
 const sizes = ["B","KB","MB","GB"];
 const i = Math.floor(Math.log(bytes) / Math.log(k));
 return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +""+ sizes[i];
 };

 const memUsagePercent = (data.system.memory_usage / data.system.memory_total) * 100;

  const maxReq = Math.max(...historicalRequests, 1);
  const maxLat = Math.max(...latencyHistory, 1);

 if (!mounted) return null;

 return (
 <div className="space-y-6">
 <div>
 <h2 className="text-2xl font-bold tracking-tight">{t('metrics.title')}</h2>
 <p className="text-white/40">{t('metrics.description')}</p>
 </div>

 {/* Top Stats Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
 {[
 { label: t('metrics.botStatus'), value: data.status, icon: Activity, color:"text-emerald-400"},
 { label: t('metrics.uptime'), value: formatUptime(data.uptime), icon: Clock, color:"text-purple-400"},
 { label: t('metrics.activeShards') || 'Active Shards', value: data.system.shard_count?.toString() || "1", icon: Layers, color: "text-indigo-400"},
 { label: t('metrics.apiLatency') || 'API Latency', value: `${data.system.latency}ms`, icon: Zap, color: "text-amber-400"},
 { label: t('metrics.dbLatency') || 'DB Latency', value: `${data.health?.components?.database?.latency || 0}ms`, icon: Database, color: "text-blue-400"},
 { label: 'DB Size', value: formatBytes(data.health?.components?.database?.size || 0), icon: Server, color: "text-emerald-400"}
 ].map((stat, i) => (
 <motion.div 
 key={i}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.1 }}
 className="p-6 rounded-xl border border-white/10 bg-card/20 backdrop-blur-xl shadow-lg flex items-center gap-4"
 >
 <div className={`p-3 rounded-lg bg-black/30 ${stat.color}`}>
 <stat.icon className="h-6 w-6"/>
 </div>
 <div>
 <p className="text-sm text-white/40">{stat.label}</p>
 <p className="text-2xl font-bold text-white/90 capitalize">{stat.value}</p>
 </div>
 </motion.div>
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Memory & CPU Usage */}
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.3 }}
 className="col-span-1 border border-white/10 rounded-xl bg-card/20 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between"
 >
 <div>
 <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
 <Server className="h-5 w-5 text-purple-400"/>
 {t('metrics.resourceUsage')}
 </h3>
 <div className="space-y-6">
 <div>
 <div className="flex justify-between text-sm mb-2">
 <span className="text-white/80">{t('metrics.cpuUsage')}</span>
 <span className="text-white">{data.system.cpu_usage.toFixed(1)}%</span>
 </div>
 <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${Math.min(100, data.system.cpu_usage)}%` }}
 transition={{ duration: 1, ease:"easeOut"}}
 className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
 />
 </div>
 </div>

 <div>
 <div className="flex justify-between text-sm mb-2">
 <span className="text-white/80">{t('metrics.memoryUsage')}</span>
 <span className="text-white">{formatBytes(data.system.memory_usage)} / {formatBytes(data.system.memory_total)}</span>
 </div>
 <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${Math.min(100, memUsagePercent)}%` }}
 transition={{ duration: 1, ease:"easeOut"}}
 className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
 />
 </div>
 </div>

 <div>
 <div className="flex justify-between text-sm mb-2">
 <span className="text-white/80">{t('metrics.cacheHitRate')}</span>
 <span className="text-white">{((data.health?.components?.cache?.hitRate || 0) * 100).toFixed(1)}%</span>
 </div>
 <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${Math.min(100, (data.health?.components?.cache?.hitRate || 0) * 100)}%` }}
 transition={{ duration: 1, ease:"easeOut"}}
 className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
 />
 </div>
 <p className="text-xs text-white/40 mt-2 text-right">Cache size: {data.health?.components?.cache?.size || 0} keys</p>
 </div>
 </div>
 </div>
 </motion.div>

 {/* Requests over time chart */}
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.4 }}
 className="col-span-1 lg:col-span-2 border border-white/10 rounded-xl bg-card/20 backdrop-blur-xl p-6 shadow-2xl"
 >
 <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
 <Activity className="h-5 w-5 text-purple-400"/>
 {t('metrics.requestVolume')}
 </h3>
 
 <div className="h-[200px] flex items-end justify-between gap-1 mt-4">
 {historicalRequests.map((req, i) => {
 const heightPct = (req / maxReq) * 100;
 return (
 <div key={i} className="relative w-full flex justify-center group">
 <motion.div 
 initial={{ height: 0 }}
 animate={{ height: `${heightPct}%` }}
 transition={{ duration: 0.8, delay: i * 0.05 }}
 className="w-full max-w-[24px] bg-purple-500/30 hover:bg-purple-500/60 rounded-t-sm border-t border-purple-400 transition-colors"
 />
 {/* Tooltip */}
 <div className="absolute -top-8 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
 {req} req
 </div>
 </div>
 );
 })}
 </div>
 <div className="flex justify-between mt-2 text-xs text-white/40 border-t border-white/10 pt-2">
 <span>{t('metrics.fifteenMinAgo')}</span>
 <span>{t('metrics.now')}</span>
 </div>
 </motion.div>

 {/* Latency History */}
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.5 }}
 className="col-span-1 lg:col-span-3 border border-white/10 rounded-xl bg-card/20 backdrop-blur-xl p-6 shadow-2xl"
 >
 <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
 <ShieldCheck className="h-5 w-5 text-purple-400"/>{t('metrics.apiLatency')}
 </h3>
 <div className="relative h-[150px] w-full">
 <svg viewBox="0 0 100 100"preserveAspectRatio="none"className="w-full h-full overflow-visible">
 <motion.path 
 initial={{ pathLength: 0 }}
 animate={{ pathLength: 1 }}
 transition={{ duration: 1.5, ease:"easeInOut"}}
 d={`M ${latencyHistory.map((lat, i) => {
 const x = (i / (latencyHistory.length - 1)) * 100;
 const y = 100 - ((lat - (Math.min(...latencyHistory) - 2)) / (maxLat - Math.min(...latencyHistory) + 4)) * 100;
 return `${i === 0 ?"":"L"} ${x} ${y}`;
 }).join("")}`}
 fill="none"
 stroke="url(#gradient)"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
 />
 <defs>
 <linearGradient id="gradient"x1="0%"y1="0%"x2="100%"y2="0%">
 <stop offset="0%"stopColor="#8b5cf6"/>
 <stop offset="100%"stopColor="#3b82f6"/>
 </linearGradient>
 </defs>
 {latencyHistory.map((lat, i) => {
 const x = (i / (latencyHistory.length - 1)) * 100;
 const y = 100 - ((lat - (Math.min(...latencyHistory) - 2)) / (maxLat - Math.min(...latencyHistory) + 4)) * 100;
 return (
 <motion.circle 
 key={i}
 initial={{ scale: 0, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 transition={{ delay: 1 + i * 0.05 }}
 cx={x} 
 cy={y} 
 r="1.5"
 fill="#fff"
 className="drop-shadow-lg cursor-pointer hover:r-[3]"
 />
 )
 })}
 </svg>
 </div>
 <div className="flex justify-between mt-4 text-xs text-white/40 border-t border-white/10 pt-2">
 <span>{t('metrics.fifteenMinAgo')}</span>
 <span>{t('metrics.now')}</span>
 </div>
 </motion.div>
 </div>

 {data.shards && data.shards.length > 0 && (
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.6 }}
 className="col-span-1 lg:col-span-3 border border-white/10 rounded-xl bg-card/20 backdrop-blur-xl p-6 shadow-2xl mt-6"
 >
 <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
 <Server className="h-5 w-5 text-indigo-400"/>
 {t('metrics.clusterHealth')}
 </h3>
 <div className="overflow-x-auto">
 <table className="w-full text-sm text-left">
 <thead className="text-xs text-white/60 uppercase border-b border-white/10">
 <tr>
 <th className="px-4 py-3">Shard ID</th>
 <th className="px-4 py-3">Status</th>
 <th className="px-4 py-3">Ping</th>
 <th className="px-4 py-3">Guilds</th>
 <th className="px-4 py-3">Uptime</th>
 </tr>
 </thead>
 <tbody>
 {data.shards.map((shard) => (
 <tr key={shard.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
 <td className="px-4 py-3 font-medium text-white">Shard {shard.id}</td>
 <td className="px-4 py-3">
 <span className={`px-2 py-1 rounded text-xs ${shard.status === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
 {shard.statusText || 'READY'}
 </span>
 </td>
 <td className="px-4 py-3 text-white/80">{shard.ping}ms</td>
 <td className="px-4 py-3 text-white/80">{shard.guildCount}</td>
 <td className="px-4 py-3 text-white/80">{Math.floor(shard.uptime / 1000 / 3600)}h {Math.floor(((shard.uptime / 1000) % 3600) / 60)}m</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </motion.div>
 )}
 </div>
 );
}
