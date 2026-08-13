"use client";

import { motion } from "framer-motion";
import { Activity, Server, Database, Clock, Zap, Cpu, MemoryStick, HardDrive, Network } from "lucide-react";
import { useEffect, useState } from "react";

type MetricsData = {
  status: string;
  uptime: number;
  guilds: { total: number };
  users: { total: number };
  commands?: { per_minute: number };
  system: { memory_usage: number; memory_total: number; cpu_usage: number; latency: number; shard_count?: number };
  shards?: Array<{ id: number; status: string | number; ping: number }>;
  health: {
    components: {
      database: { latency: number; size?: number };
      cache: { hitRate: number; size: number };
    }
  }
};

const MetricBlock = ({ label, value, subValue, highlight = false }: { label: string; value: string | number; subValue?: string; highlight?: boolean }) => (
  <div className={`p-6 border border-border flex flex-col justify-between ${highlight ? 'bg-foreground text-background' : 'bg-background text-foreground'}`}>
    <span className={`text-[10px] tracking-[0.2em] uppercase font-bold mb-8 ${highlight ? 'text-background/50' : 'text-foreground/40'}`}>
      {label}
    </span>
    <div className="flex flex-col items-start gap-1">
      <span className={`text-4xl font-mono tracking-tight ${highlight ? 'text-background' : 'text-foreground'}`}>
        {value}
      </span>
      {subValue && (
        <span className={`text-xs font-mono uppercase ${highlight ? 'text-background/60' : 'text-foreground/40'}`}>
          {subValue}
        </span>
      )}
    </div>
  </div>
);

const ProgressBar = ({ value, max = 100, label, subLabel }: { value: number; max?: number; label: string; subLabel: string }) => {
  const safeValue = isNaN(value) ? 0 : Math.min(max, Math.max(0, value));
  const percent = max > 0 ? (safeValue / max) * 100 : 0;
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end mb-1">
        <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/50">{label}</span>
        <span className="text-sm font-mono text-foreground">{subLabel}</span>
      </div>
      <div className="w-full h-1 bg-foreground/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-foreground"
        />
      </div>
    </div>
  );
};

export default function MetricsClient({ data }: { data: MetricsData }) {
  const [mounted, setMounted] = useState(false);
  const [historicalRequests, setHistoricalRequests] = useState<number[]>(Array(40).fill(0));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data?.status !== "offline") {
      const realReqs = data?.commands?.per_minute || 0;
      setHistoricalRequests(prev => [...prev.slice(1), isNaN(realReqs) ? 0 : realReqs]);
    } else {
      setHistoricalRequests(Array(40).fill(0));
    }
  }, [data]);

  const formatUptime = (ms: number) => {
    if (!ms || isNaN(ms) || ms < 0) return "0m 0s";
    const seconds = Math.floor(ms / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}D ${hours}H`;
    if (hours > 0) return `${hours}H ${minutes}M`;
    return `${minutes}M ${seconds % 60}S`;
  };

  const formatBytes = (bytes: number | undefined) => {
    if (!bytes || isNaN(bytes) || bytes <= 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const safeI = Math.min(Math.max(0, i), sizes.length - 1);
    return parseFloat((bytes / Math.pow(k, safeI)).toFixed(2)) + " " + sizes[safeI];
  };

  const memoryUsage = data?.system?.memory_usage || 0;
  const memoryTotal = data?.system?.memory_total || 34359738368;
  const cpuUsagePercent = data?.system?.cpu_usage || 0;
  const cacheHitPercent = (data?.health?.components?.cache?.hitRate || 0) * 100;
  
  const currentReqs = historicalRequests[historicalRequests.length - 1] || 0;
  const maxReqs = Math.max(...historicalRequests.filter(n => !isNaN(n)), 10);

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h2 className="text-4xl font-bold tracking-[-0.02em] text-foreground">
            TELEMETRY
          </h2>
          <p className="text-foreground/40 text-xs tracking-widest mt-2 uppercase">Real-time System Status</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-foreground animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
            {data?.status === 'online' ? 'SYSTEM.NOMINAL' : 'SYSTEM.OFFLINE'}
          </span>
        </div>
      </div>

      {/* Top Grid: Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 border border-border">
        <MetricBlock 
          label="Sys.Uptime" 
          value={formatUptime(data?.uptime).split(' ')[0]} 
          subValue={formatUptime(data?.uptime).split(' ').slice(1).join(' ')} 
          highlight={true} 
        />
        <MetricBlock 
          label="Cluster.Ping" 
          value={data?.system?.latency || 0} 
          subValue="ms" 
        />
        <MetricBlock 
          label="Active.Shards" 
          value={data?.system?.shard_count || 1} 
          subValue="nodes" 
        />
        <MetricBlock 
          label="DB.Latency" 
          value={data?.health?.components?.database?.latency || 0} 
          subValue="ms" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Resources */}
        <div className="col-span-1 border border-border p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <Cpu className="w-4 h-4 text-foreground" />
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground">Hardware.State</h3>
            </div>
            
            <div className="space-y-8">
              <ProgressBar 
                label="CPU.Load" 
                value={cpuUsagePercent} 
                subLabel={`${cpuUsagePercent.toFixed(1)}%`} 
              />
              <ProgressBar 
                label="Mem.Usage" 
                value={memoryUsage} 
                max={memoryTotal} 
                subLabel={`${formatBytes(memoryUsage)} / ${formatBytes(memoryTotal)}`} 
              />
              <ProgressBar 
                label="Cache.HitRate" 
                value={cacheHitPercent} 
                subLabel={`${cacheHitPercent.toFixed(1)}%`} 
              />
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border">
            <span className="block text-[10px] text-foreground/40 uppercase tracking-[0.2em] mb-2">DB.Storage</span>
            <span className="text-2xl font-mono text-foreground">{formatBytes(data?.health?.components?.database?.size || 0)}</span>
          </div>
        </div>

        {/* Right Column: Throughput Monitor */}
        <div className="col-span-1 lg:col-span-2 border border-border p-8 flex flex-col relative overflow-hidden bg-background">
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-3">
              <Network className="w-4 h-4 text-foreground" />
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground">Network.Throughput</h3>
            </div>
            <div className="text-right">
              <span className="block text-4xl font-mono text-foreground">{currentReqs}</span>
              <span className="text-[10px] text-foreground/40 uppercase tracking-[0.2em]">Req / Min</span>
            </div>
          </div>

          <div className="flex-1 relative w-full h-[250px] border-b border-border flex items-end gap-[2px]">
            {/* Brutalist Bar Chart for Requests */}
            {historicalRequests.map((val, i) => {
              const heightPercent = maxReqs > 0 ? (val / maxReqs) * 100 : 0;
              return (
                <div key={i} className="flex-1 h-full flex flex-col justify-end group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-full bg-foreground/20 group-hover:bg-foreground transition-colors"
                  />
                </div>
              );
            })}
            
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full h-[1px] bg-foreground/5 border-t border-dashed border-border" />
              <div className="w-full h-[1px] bg-foreground/5 border-t border-dashed border-border" />
              <div className="w-full h-[1px] bg-foreground/5 border-t border-dashed border-border" />
              <div className="w-full h-[1px] bg-foreground/5" />
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <span className="text-[9px] font-mono text-foreground/40 uppercase tracking-widest">- 40 MIN</span>
            <span className="text-[9px] font-mono text-foreground/40 uppercase tracking-widest">LIVE</span>
          </div>
        </div>
      </div>

      {/* Shard Matrix */}
      {data?.shards && data.shards.length > 0 && (
        <div className="border border-border overflow-hidden bg-background">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-foreground/5">
            <div className="flex items-center gap-3">
              <Server className="w-4 h-4 text-foreground" />
              <h3 className="text-[10px] tracking-[0.3em] font-bold uppercase text-foreground">Cluster.Matrix</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[9px] text-foreground/40 uppercase tracking-[0.3em] bg-background">
                <tr>
                  <th className="px-8 py-5 font-medium border-b border-border">ID</th>
                  <th className="px-8 py-5 font-medium border-b border-border">STATE</th>
                  <th className="px-8 py-5 font-medium border-b border-border text-right">LATENCY</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {data.shards.map((shard) => {
                  // status is 0 for ready in discord.js usually, or a string
                  const isReady = shard.status === 0 || shard.status === 'READY';
                  return (
                    <tr key={shard.id} className="border-b border-border hover:bg-foreground/5 transition-colors">
                      <td className="px-8 py-4 text-foreground">SHARD_{String(shard.id).padStart(2, '0')}</td>
                      <td className="px-8 py-4">
                        <span className={`flex items-center gap-2 text-[10px] tracking-widest uppercase ${isReady ? 'text-foreground' : 'text-foreground/50'}`}>
                          <div className={`w-1.5 h-1.5 rounded-none ${isReady ? 'bg-foreground' : 'bg-foreground/20'}`} />
                          {isReady ? 'READY' : 'OFFLINE'}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-foreground/50 text-right">{shard.ping || 0}ms</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
