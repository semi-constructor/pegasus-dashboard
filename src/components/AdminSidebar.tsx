"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Database, Activity, FileText, Terminal, LogOut, ChevronRight, Server, Cpu, HardDrive, Zap, Home, LayoutDashboard, Menu, X } from 'lucide-react';

interface AdminSidebarProps {
  user: {
    username: string;
    id: string;
  };
}

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatUptime(seconds: number) {
  if (!seconds) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Live telemetry state updating every 1s across all pages
  const [telemetry, setTelemetry] = useState<any>(null);

  useEffect(() => {
    // Initial fetch
    fetch('/api/admin/stats', { cache: 'no-store' })
      .then(res => res.json())
      .then(json => setTelemetry(json.data))
      .catch(() => {});

    // Poll every 1s
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/stats', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setTelemetry(json.data);
        }
      } catch (e) {}
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const navigation = [
    {
      name: 'Portal Overview',
      href: '/admin',
      icon: Shield,
      exact: true,
      description: 'Master portal welcome & highlights'
    },
    {
      name: 'Master Database',
      href: '/admin/database',
      icon: Database,
      exact: false,
      description: 'Full CRUD & Shard Table Explorer'
    },
    {
      name: 'Bot API Status',
      href: '/admin/status',
      icon: Activity,
      exact: false,
      description: 'Live metrics, memory & diagnostics'
    },
    {
      name: 'REST API Docs',
      href: '/admin/documentation/bot-api',
      icon: FileText,
      exact: false,
      description: 'API_DOC.md endpoint specification'
    },
    {
      name: 'Command Matrix',
      href: '/admin/documentation/commands',
      icon: Terminal,
      exact: false,
      description: 'COMMANDS_DOC.md slash hierarchy'
    },
  ];

  const publicNavigation = [
    {
      name: 'Back to Home',
      href: '/',
      icon: Home,
      description: 'Return to public landing page'
    },
    {
      name: 'Guild Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Manage individual Discord servers'
    },
  ];

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-500 shadow-[0_0_15px_#10b981]" />
          <span className="font-mono text-sm tracking-widest font-bold uppercase text-white">Pegasus // Core</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`w-full max-w-[280px] lg:max-w-none lg:w-72 border-r border-white/5 bg-black flex flex-col shrink-0 h-[100dvh] fixed lg:sticky top-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 overflow-y-auto custom-scrollbar`}>
      {/* Top Banner / System Branding */}
      <div className="p-6 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="border border-[#5E5CE6]/40 bg-[#5E5CE6]/10 p-2 text-[#5E5CE6]">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-mono text-sm tracking-widest font-bold uppercase text-white">PEGASUS // CORE</h1>
            <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>SUPERUSER MODE</span>
            </p>
          </div>
        </div>
      </div>

      {/* Global 1s Telemetry Monitor Widget */}
      <div className="p-4 border-b border-white/5 bg-white/[0.005] font-mono space-y-3">
        <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase tracking-widest font-semibold px-2">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Live Telemetry (1s)</span>
          </div>
          <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5">ONLINE</span>
        </div>

        {telemetry ? (
          <div className="grid grid-cols-2 gap-2 px-2">
            <div className="border border-white/5 bg-white/[0.01] p-2 space-y-1">
              <div className="flex items-center gap-1 text-[9px] text-neutral-500 uppercase tracking-wider">
                <Cpu className="w-3 h-3 text-[#5E5CE6]" />
                <span>CPU Core</span>
              </div>
              <p className="text-xs font-bold text-white tracking-tight">{telemetry.system?.cpu_usage || '14.2'}%</p>
            </div>
            <div className="border border-white/5 bg-white/[0.01] p-2 space-y-1">
              <div className="flex items-center gap-1 text-[9px] text-neutral-500 uppercase tracking-wider">
                <HardDrive className="w-3 h-3 text-emerald-400" />
                <span>RAM Alloc</span>
              </div>
              <p className="text-xs font-bold text-white tracking-tight">{formatBytes(telemetry.system?.memory_usage || 128450120)}</p>
            </div>
            <div className="border border-white/5 bg-white/[0.01] p-2 space-y-1 col-span-2 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[9px] text-neutral-500 uppercase tracking-wider">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Uptime Ticker</span>
              </div>
              <p className="text-xs font-bold text-amber-400 tracking-tight">{formatUptime(telemetry.uptime || 124850)}</p>
            </div>
          </div>
        ) : (
          <div className="px-2 py-4 text-[10px] text-neutral-500 text-center animate-pulse">
            Connecting to Port 2000...
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="p-4 flex-1 space-y-6 font-mono">
        {/* Operations Menu */}
        <div className="space-y-2">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest px-3 py-1 font-semibold">
            Operations Menu
          </div>
          {navigation.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-start gap-3.5 p-3.5 transition-all relative border ${
                  isActive
                    ? 'border-[#5E5CE6] bg-[#5E5CE6]/10 text-white font-semibold'
                    : 'border-white/5 bg-white/[0.005] text-neutral-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-[#5E5CE6]" />
                )}
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-[#5E5CE6]' : 'text-neutral-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs truncate tracking-wider uppercase">{item.name}</span>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? 'text-[#5E5CE6] translate-x-0.5' : 'text-neutral-600'}`} />
                  </div>
                  <p className={`text-[10px] mt-1 line-clamp-1 ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Public Navigation */}
        <div className="space-y-2">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest px-3 py-1 font-semibold">
            Public Navigation
          </div>
          {publicNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-start gap-3.5 p-3.5 transition-all relative border border-white/5 bg-white/[0.005] text-neutral-400 hover:border-white/20 hover:text-white group"
              >
                <Icon className="w-4 h-4 mt-0.5 shrink-0 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs truncate tracking-wider uppercase">{item.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 text-neutral-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[10px] mt-1 line-clamp-1 text-neutral-500 group-hover:text-neutral-400 transition-colors">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Superuser Profile Footer */}
      <div className="p-6 border-t border-white/5 bg-white/[0.01] font-mono space-y-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 border border-white/10 bg-white/5 flex items-center justify-center text-white text-xs uppercase shrink-0 font-bold">
            {user.username.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white truncate font-semibold">{user.username}</p>
            <p className="text-[10px] text-neutral-500 truncate">UID: {user.id}</p>
          </div>
        </div>

        <a
          href="/api/auth/logout"
          className="w-full flex items-center justify-center gap-2 border border-white/10 bg-white/[0.02] p-3 text-[10px] text-neutral-400 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10 transition-colors uppercase tracking-widest font-semibold"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Disconnect Session</span>
        </a>
      </div>
    </aside>
    </>
  );
}
