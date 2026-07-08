"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Server, Cpu, HardDrive, Clock, Users, Zap, Shield, Trophy, BarChart2, AlertTriangle, RefreshCw } from 'lucide-react';

interface LiveTelemetryDashboardProps {
  initialStats: any;
  initialIsOnline: boolean;
}

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function LiveTelemetryDashboard({ initialStats, initialIsOnline }: LiveTelemetryDashboardProps) {
  const [stats, setStats] = useState(initialStats);
  const [isOnline, setIsOnline] = useState(initialIsOnline);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdated(new Date());
    const abortController = new AbortController();

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/stats', { 
          cache: 'no-store',
          signal: abortController.signal
        });
        if (res.ok) {
          const json = await res.json();
          setStats(json.data);
          setIsOnline(json.success);
          setLastUpdated(new Date());
        }
      } catch (e) {}
    }, 1000);

    return () => {
      clearInterval(interval);
      abortController.abort();
    };
  }, []);

  const data = stats;
  const memPercent = Math.min(100, Math.round((data.system.memory_usage / data.system.memory_total) * 100));
  const cpuPercent = Math.min(100, Math.round(data.system.cpu_usage));

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 font-mono">
      {/* Header */}
      <div className="border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 border border-emerald-500/20 px-3 py-1 bg-emerald-500/10 mb-4 text-xs tracking-wide text-emerald-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Real-Time IPC Telemetry // Updating every 1s</span>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2 font-sans uppercase">Bot API Status & Metrics</h1>
          <p className="text-sm text-neutral-400 tracking-wide">
            Live telemetry harvested from Express REST Core (<code className="text-emerald-400">http://localhost:2000/stats</code>).
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-[#5E5CE6] animate-spin" />
            <span>Auto-Refresh: Active</span>
          </div>
          {lastUpdated && (
            <span className="text-[10px] text-neutral-500">
              Last Sync: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {!isOnline && (
        <div className="border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-400 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Port 2000 unreachable. Displaying dynamic simulated telemetry snapshot. Verify bot backend process.</span>
        </div>
      )}

      {/* Primary Hardware Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CPU Tile */}
        <div className="border border-white/10 bg-white/[0.01] p-6 space-y-6 relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-[#5E5CE6]">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider text-neutral-300 font-semibold">CPU Allocation</span>
            </div>
            <span className="text-sm font-bold text-white">{data.system.cpu_usage}%</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-none overflow-hidden">
            <div className="bg-[#5E5CE6] h-full transition-all duration-300" style={{ width: `${cpuPercent}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>Core Frequency: Normal</span>
            <span>{data.system.shard_count} Shard Active</span>
          </div>
        </div>

        {/* Memory Tile */}
        <div className="border border-white/10 bg-white/[0.01] p-6 space-y-6 relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-emerald-400">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider text-neutral-300 font-semibold">RAM Consumption</span>
            </div>
            <span className="text-sm font-bold text-white">{formatBytes(data.system.memory_usage)}</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-none overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${Math.max(5, memPercent)}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>Total: {formatBytes(data.system.memory_total)}</span>
            <span>{memPercent}% Utilized</span>
          </div>
        </div>

        {/* Latency Tile */}
        <div className="border border-white/10 bg-white/[0.01] p-6 space-y-6 relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-amber-400">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="text-xs uppercase tracking-wider text-neutral-300 font-semibold">WebSocket Ping</span>
            </div>
            <span className="text-sm font-bold text-white">{data.system.latency} ms</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-none overflow-hidden">
            <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, data.system.latency / 2)}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-widest">
            <span>Discord API Gateway</span>
            <span>Rating: Excellent</span>
          </div>
        </div>
      </div>

      {/* Global Activity & Guild Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Guilds & Users Summary */}
        <div className="space-y-6">
          <h2 className="text-xs text-neutral-400 uppercase tracking-widest font-semibold flex items-center gap-2">
            <Server className="w-4 h-4 text-[#5E5CE6]" />
            <span>Discord Hierarchy & Engagement</span>
          </h2>

          <div className="border border-white/10 bg-white/[0.01] p-8 space-y-8 backdrop-blur-md">
            <div className="grid grid-cols-2 gap-6 pb-8 border-b border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Active Guilds</p>
                <p className="text-3xl font-bold text-white font-sans">{data.guilds.total.toLocaleString()}</p>
                <p className="text-[10px] text-[#5E5CE6] mt-1">{data.guilds.large} Large Pop Shards</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Voice Active Guilds</p>
                <p className="text-3xl font-bold text-white font-sans">{data.guilds.voice_active.toLocaleString()}</p>
                <p className="text-[10px] text-emerald-400 mt-1">JTC Dynamically Allocated</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Global Members</p>
                <p className="text-3xl font-bold text-white font-sans">{data.users.total.toLocaleString()}</p>
                <p className="text-[10px] text-neutral-400 mt-1">{data.users.unique.toLocaleString()} Unique Snowflakes</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Active Today</p>
                <p className="text-3xl font-bold text-white font-sans">{data.users.active_today.toLocaleString()}</p>
                <p className="text-[10px] text-amber-400 mt-1">{data.users.online.toLocaleString()} Online Right Now</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-widest">
              <span>System Uptime</span>
              <span className="text-emerald-400 font-semibold">{formatUptime(data.uptime)}</span>
            </div>
          </div>

          {/* Module Feature Flags */}
          <h2 className="text-xs text-neutral-400 uppercase tracking-widest font-semibold flex items-center gap-2 pt-4">
            <Shield className="w-4 h-4 text-[#5E5CE6]" />
            <span>Active Module Manifest</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(data.features).map(([key, value]) => {
              if (key === 'activity') return null;
              const isEnabled = Boolean(value);

              return (
                <div key={key} className={`border p-4 flex items-center justify-between ${isEnabled ? 'border-white/10 bg-white/[0.01]' : 'border-white/5 bg-white/[0.002]'}`}>
                  <span className="text-xs uppercase tracking-wider text-neutral-300 font-semibold">{key}</span>
                  <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 'bg-red-500'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Commands & Telemetry Matrix */}
        <div className="space-y-6">
          <h2 className="text-xs text-neutral-400 uppercase tracking-widest font-semibold flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#5E5CE6]" />
            <span>Execution Frequency & Load</span>
          </h2>

          <div className="border border-white/10 bg-white/[0.01] p-8 space-y-8 backdrop-blur-md">
            <div className="grid grid-cols-3 gap-4 pb-8 border-b border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Commands Total</p>
                <p className="text-2xl font-bold text-white font-sans">{data.commands.total_executed.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Executed Today</p>
                <p className="text-2xl font-bold text-white font-sans">{data.commands.today.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Rate / Minute</p>
                <p className="text-2xl font-bold text-[#5E5CE6] font-sans">{data.commands.per_minute}</p>
              </div>
            </div>

            {/* Most Used Commands Leaderboard */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                <span>Top Command Invocations</span>
                <span>Invocations</span>
              </div>
              <div className="space-y-2.5">
                {data.commands.most_used.map((cmd: { command: string; count: number }, index: number) => {
                  const maxCount = data.commands.most_used[0]?.count || 1;
                  const widthPercent = Math.max(15, Math.round((cmd.count / maxCount) * 100));

                  return (
                    <div key={cmd.command} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-neutral-300 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-neutral-500">#{index + 1}</span>
                          <span className="font-semibold text-white">/{cmd.command}</span>
                        </div>
                        <span>{cmd.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                        <div className="bg-[#5E5CE6] h-full transition-all" style={{ width: `${widthPercent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Module Activity Breakdown */}
            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                Subsystem Activity Events
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                {Object.entries(data.features.activity).map(([modName, count]) => (
                  <div key={modName} className="border border-white/5 bg-white/[0.005] p-3 space-y-1">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">{modName}</span>
                    <span className="font-bold text-white font-sans block text-base">{Number(count).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
