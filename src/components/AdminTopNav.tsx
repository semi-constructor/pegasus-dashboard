'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Database, Activity, FileText, Terminal, Key, Home, LayoutDashboard, LogOut, Cpu, HardDrive, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Overview', href: '/admin', icon: Shield, exact: true },
  { name: 'Database', href: '/admin/database', icon: Database, exact: false },
  { name: 'Status', href: '/admin/status', icon: Activity, exact: false },
  { name: 'API Docs', href: '/admin/documentation/bot-api', icon: FileText, exact: false },
  { name: 'Commands', href: '/admin/documentation/commands', icon: Terminal, exact: false },
  { name: 'Security', href: '/admin/security-settings', icon: Key, exact: false },
];

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function AdminTopNav({ user }: { user: { username: string; id: string } }) {
  const pathname = usePathname();

  // Live telemetry state for the status indicator
  const [telemetry, setTelemetry] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats', { cache: 'no-store' })
      .then(res => res.json())
      .then(json => setTelemetry(json.data))
      .catch(() => {});

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/stats', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setTelemetry(json.data);
        }
      } catch (e) {}
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black/80 backdrop-blur-md sticky top-16 z-30 border-b border-white/5">
      {/* Top Bar: Admin Identity + Telemetry + Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Admin identity badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 px-4 py-2 rounded-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-mono text-white tracking-wide">PEGASUS // CORE</span>
          </div>

          {/* Compact telemetry indicators */}
          {telemetry && (
            <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono text-neutral-400">
              <div className="flex items-center gap-1.5 border border-white/5 bg-white/[0.02] px-2.5 py-1 rounded-sm">
                <Cpu className="w-3 h-3 text-[#5E5CE6]" />
                <span>{telemetry.system?.cpu_usage || '—'}%</span>
              </div>
              <div className="flex items-center gap-1.5 border border-white/5 bg-white/[0.02] px-2.5 py-1 rounded-sm">
                <HardDrive className="w-3 h-3 text-emerald-400" />
                <span>{formatBytes(telemetry.system?.memory_usage || 0)}</span>
              </div>
              <div className="flex items-center gap-1.5 border border-white/5 bg-white/[0.02] px-2.5 py-1 rounded-sm">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-emerald-400">ONLINE</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Quick links + User */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-xs font-mono bg-white/[0.02] text-neutral-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-sm transition-colors">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/" className="hidden sm:flex items-center gap-2 text-xs font-mono bg-white/[0.02] text-neutral-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-sm transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <div className="flex items-center gap-2 border-l border-white/10 pl-3 ml-1">
            <div className="w-7 h-7 border border-white/10 bg-white/5 flex items-center justify-center text-white text-[10px] uppercase font-bold font-mono rounded-sm">
              {user.username.slice(0, 2)}
            </div>
            <span className="hidden md:inline text-xs font-mono text-neutral-400 max-w-[100px] truncate">{user.username}</span>
            <a
              href="/api/auth/signout"
              className="text-neutral-500 hover:text-red-400 transition-colors ml-1"
              title="Disconnect Session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Tab Navigation (matching GuildTopNav pattern) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 border-t border-white/5">
        <nav className="flex space-x-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-0">
          {navigation.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-6 py-3 text-xs font-mono tracking-wider uppercase transition-colors border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-[#5E5CE6] text-white bg-[#5E5CE6]/10'
                    : 'border-transparent text-neutral-500 hover:text-white hover:bg-white/5 hover:border-white/20'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#5E5CE6]' : ''}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
