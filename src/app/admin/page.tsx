import React from 'react';
import Link from 'next/link';
import { Shield, Database, Activity, FileText, Terminal, ArrowRight, Server, Zap, CheckCircle2, Cpu, HardDrive } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';

export default function AdminWelcomePage() {
  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
      <StaggerContainer>
      {/* Header */}
      <StaggerItem>
      <div className="border-b border-white/5 pb-8 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 border border-white/5 px-3 py-1 bg-white/[0.01] mb-4 text-xs font-mono tracking-wide text-neutral-400">
            <Shield className="w-3.5 h-3.5 text-[#5E5CE6]" />
            <span>Superuser Portal</span>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">Core Systems Administration</h1>
          <p className="text-sm text-neutral-400 font-mono tracking-wide">
            Master control plane • Direct access to all database entities, diagnostics, and API definitions
          </p>
        </div>
        <Link
          href="/admin/database"
          className="border border-[#5E5CE6] bg-[#5E5CE6]/10 px-6 py-3 text-xs font-mono text-white hover:bg-[#5E5CE6] hover:text-black transition-all rounded-none self-start md:self-center"
        >
          Launch Database Console
        </Link>
      </div>
      </StaggerItem>

      {/* Infrastructure Overview */}
      <StaggerItem>
      <div className="mb-16">
        <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3">// Infrastructure Specs</div>
        <h2 className="text-2xl font-light tracking-tight text-white mb-6">System Architecture Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Spec 1 */}
          <div className="border border-white/5 p-8 bg-white/[0.01] flex flex-col justify-between rounded-none">
            <Database className="w-6 h-6 text-neutral-400 mb-6" />
            <div className="text-4xl font-light tracking-tight text-white mb-2">43</div>
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">PostgreSQL Tables</div>
            <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
              Drizzle ORM mapped relational entities covering moderation, economy, JTC, tickets, and XP.
            </p>
          </div>
          {/* Spec 2 */}
          <div className="border border-white/5 p-8 bg-white/[0.01] flex flex-col justify-between rounded-none">
            <Activity className="w-6 h-6 text-neutral-400 mb-6" />
            <div className="text-4xl font-light tracking-tight text-white mb-2">REST</div>
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">API Core (Port 2000)</div>
            <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
              IPC and Express REST server with real-time memory usage, cache managers, and rate limit tracking.
            </p>
          </div>
          {/* Spec 3 */}
          <div className="border border-white/5 p-8 bg-white/[0.01] flex flex-col justify-between rounded-none">
            <Terminal className="w-6 h-6 text-neutral-400 mb-6" />
            <div className="text-4xl font-light tracking-tight text-white mb-2">Multi</div>
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">System Log Tiers</div>
            <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
              Command definitions, warning triggers, AutoMod V2 quarantine inspection, and audit ledgers.
            </p>
          </div>
        </div>
      </div>
      </StaggerItem>

      {/* Quick Action Portals */}
      <StaggerItem>
      <div className="mb-16">
        <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3">// Operations</div>
        <h2 className="text-2xl font-light tracking-tight text-white mb-6">Sub-Portal Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/database" className="border border-white/5 p-6 bg-white/[0.01] flex items-center justify-between rounded-none hover:border-[#5E5CE6] transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 border border-[#5E5CE6]/40 bg-[#5E5CE6]/10 text-[#5E5CE6]">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-normal text-white mb-1">Master Database Console</h3>
                <p className="text-xs font-mono text-neutral-500">
                  CRUD mutations across all 43 PostgreSQL tables
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-[#5E5CE6] group-hover:translate-x-1 transition-all" />
          </Link>

          <Link href="/admin/status" className="border border-white/5 p-6 bg-white/[0.01] flex items-center justify-between rounded-none hover:border-emerald-500 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-normal text-white mb-1">Bot API Status & Metrics</h3>
                <p className="text-xs font-mono text-neutral-500">
                  Live RAM, cache, commands, and guild diagnostics
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link href="/admin/documentation/bot-api" className="border border-white/5 p-6 bg-white/[0.01] flex items-center justify-between rounded-none hover:border-amber-500 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 border border-amber-500/40 bg-amber-500/10 text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-normal text-white mb-1">REST API Architecture</h3>
                <p className="text-xs font-mono text-neutral-500">
                  Request schemas, cache TTL, and authorization docs
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link href="/admin/documentation/commands" className="border border-white/5 p-6 bg-white/[0.01] flex items-center justify-between rounded-none hover:border-cyan-500 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 border border-cyan-500/40 bg-cyan-500/10 text-cyan-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-normal text-white mb-1">System Command Matrix</h3>
                <p className="text-xs font-mono text-neutral-500">
                  Slash commands, parameters, and permission hierarchy
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
      </StaggerItem>

      {/* System Status Indicator */}
      <StaggerItem>
      <div>
        <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3">// Shard Status</div>
        <h2 className="text-2xl font-light tracking-tight text-white mb-6">Infrastructure Health</h2>
        <div className="border border-white/5 bg-white/[0.01] rounded-none overflow-hidden">
          <div className="p-12 text-center text-xs font-mono text-neutral-500 flex flex-col items-center gap-3">
            <Zap className="w-6 h-6 text-emerald-400 animate-pulse" />
            <span className="text-lg font-light text-white">All Systems Operational</span>
            <span>View live telemetry data on the Status & Metrics page for detailed shard diagnostics.</span>
          </div>
        </div>
      </div>
      </StaggerItem>
      </StaggerContainer>
    </main>
  );
}
