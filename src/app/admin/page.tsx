import React from 'react';
import Link from 'next/link';
import { Shield, Database, Activity, FileText, Terminal, ArrowRight, Server, Cpu, CpuIcon, CheckCircle2, Zap } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';

export default function AdminWelcomePage() {
  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 font-mono">
      <StaggerContainer>
      {/* Welcome Banner */}
      <StaggerItem>
      <div className="border border-white/10 bg-white/[0.01] p-10 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#5E5CE6]" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 border border-[#5E5CE6]/30 bg-[#5E5CE6]/10 px-3 py-1 text-xs text-[#5E5CE6]">
              <Shield className="w-3.5 h-3.5" />
              <span>SUPERUSER PORTAL ACTIVE</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white font-sans uppercase">
              Core Systems Administration
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Welcome to the master control plane. From this terminal, you hold direct, uninhibited access to all Drizzle database entities, live system memory diagnostics, REST API definitions, and global command tables.
            </p>
          </div>
          <div className="border border-white/5 bg-white/[0.02] p-6 shrink-0 flex flex-col items-center justify-center min-w-[200px]">
            <Zap className="w-8 h-8 text-emerald-400 mb-2 animate-pulse" />
            <span className="text-xs text-neutral-400 uppercase tracking-widest">Shard Status</span>
            <span className="text-lg font-bold text-white mt-1">100% HEALTHY</span>
          </div>
        </div>
      </div>
      </StaggerItem>

      {/* Quick Specs / Highlight Grid */}
      <StaggerItem>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-white/5 bg-white/[0.005] p-6 space-y-3 relative group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-[#5E5CE6]">
            <Database className="w-5 h-5" />
            <span className="text-[10px] bg-[#5E5CE6]/10 border border-[#5E5CE6]/20 px-2 py-0.5">PostgreSQL</span>
          </div>
          <h3 className="text-2xl font-bold text-white font-sans">43 Tables</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Drizzle ORM mapped high-speed relational entities covering moderation, economy, JTC, tickets, and XP matrix.
          </p>
        </div>

        <div className="border border-white/5 bg-white/[0.005] p-6 space-y-3 relative group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-emerald-400">
            <Activity className="w-5 h-5" />
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">Live Port 2000</span>
          </div>
          <h3 className="text-2xl font-bold text-white font-sans">REST Core</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Direct IPC and Express REST server integration with real-time memory usage, cache managers, and rate limit tracking.
          </p>
        </div>

        <div className="border border-white/5 bg-white/[0.005] p-6 space-y-3 relative group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-amber-400">
            <Terminal className="w-5 h-5" />
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 px-2 py-0.5">Multi-Tier</span>
          </div>
          <h3 className="text-2xl font-bold text-white font-sans">System Logs</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Global command definitions, automated warning triggers, AutoMod V2 quarantine inspection, and audit ledgers.
          </p>
        </div>
      </div>
      </StaggerItem>

      {/* Quick Action Portals */}
      <StaggerItem>
      <div className="space-y-6">
        <h2 className="text-xs text-neutral-400 uppercase tracking-widest font-semibold flex items-center gap-2">
          <Server className="w-4 h-4 text-[#5E5CE6]" />
          <span>Select Operations Sub-Portal</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/database" className="border border-white/10 bg-white/[0.01] p-8 flex flex-col justify-between hover:border-[#5E5CE6] hover:bg-[#5E5CE6]/[0.02] transition-all group rounded-none">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 border border-[#5E5CE6]/40 bg-[#5E5CE6]/10 text-[#5E5CE6]">
                  <Database className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-[#5E5CE6] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-semibold text-white font-sans tracking-tight">Master Database Console</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Execute CRUD mutations across all 43 PostgreSQL tables. Features multi-column fuzzy searching, dynamic Drizzle form generation, and pagination limits.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-[#5E5CE6] uppercase tracking-wider font-semibold">
              <span>Launch Database Core</span>
              <span>[ VIEW_ENTITIES ]</span>
            </div>
          </Link>

          <Link href="/admin/status" className="border border-white/10 bg-white/[0.01] p-8 flex flex-col justify-between hover:border-emerald-500 hover:bg-emerald-500/[0.02] transition-all group rounded-none">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                  <Activity className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-semibold text-white font-sans tracking-tight">Bot API Status & Metrics</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Connects directly to the bot backend API (<code className="text-emerald-400">http://localhost:2000/stats</code>) to monitor RAM allocation, cache hit rates, command execution frequencies, and active guilds.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
              <span>Inspect API Health</span>
              <span>[ VIEW_METRICS ]</span>
            </div>
          </Link>

          <Link href="/admin/documentation/bot-api" className="border border-white/10 bg-white/[0.01] p-8 flex flex-col justify-between hover:border-amber-500 hover:bg-amber-500/[0.02] transition-all group rounded-none">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 border border-amber-500/40 bg-amber-500/10 text-amber-400">
                  <FileText className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-semibold text-white font-sans tracking-tight">REST API Architecture</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Deep architectural documentation generated directly from <code className="text-amber-400">API_DOC.md</code>. Details request schemas, cache TTL policies, error payloads, and Bearer authorization tokens.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-amber-400 uppercase tracking-wider font-semibold">
              <span>Read REST Docs</span>
              <span>[ VIEW_API_DOC ]</span>
            </div>
          </Link>

          <Link href="/admin/documentation/commands" className="border border-white/10 bg-white/[0.01] p-8 flex flex-col justify-between hover:border-cyan-500 hover:bg-cyan-500/[0.02] transition-all group rounded-none">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 border border-cyan-500/40 bg-cyan-500/10 text-cyan-400">
                  <Terminal className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-semibold text-white font-sans tracking-tight">System Command Matrix</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Comprehensive slash command reference loaded from <code className="text-cyan-400">COMMANDS_DOC.md</code>. Lists required vs optional parameters, subcommand groups, and permission hierarchies.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
              <span>Explore Commands</span>
              <span>[ VIEW_COMMANDS ]</span>
            </div>
          </Link>
        </div>
      </div>
      </StaggerItem>
      </StaggerContainer>
    </main>
  );
}
