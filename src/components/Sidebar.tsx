'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { LayoutDashboard, Settings, Coins, ShieldAlert, Ticket, Award, ExternalLink, LogOut, ChevronDown, Server, Gift, Headphones, ChevronRight, Menu, X, Terminal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const navigation = [
  { name: 'System Overview', href: '', icon: LayoutDashboard, description: 'Guild dashboard & analytics' },
  { name: 'Guild Settings', href: '/settings', icon: Settings, description: 'Welcome & autorole config' },
  { name: 'Economy Engine', href: '/economy', icon: Coins, description: 'Balances, jobs & store' },
  { name: 'Moderation & Logs', href: '/moderation', icon: ShieldAlert, description: 'Security rules & audit trail' },
  { name: 'Support Tickets', href: '/tickets', icon: Ticket, description: 'Panels & support routing' },
  { name: 'XP Matrix', href: '/xp-matrix', icon: Award, description: 'Activity tracking & rewards' },
  { name: 'Giveaways Engine', href: '/giveaways', icon: Gift, description: 'Rerolls & req verification' },
  { name: 'Join to Create (J2C)', href: '/jtc', icon: Headphones, description: 'Dynamic voice channel gen' },
];

export function Sidebar({ guilds = [], isSystemAdmin = false }: { guilds?: any[], isSystemAdmin?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const parts = pathname.split('/');
  const pathGuildId = (parts.length > 2 && parts[2] !== 'settings' && parts[2] !== 'economy' && parts[2] !== 'moderation' && parts[2] !== 'tickets' && parts[2] !== 'xp-matrix' && parts[2] !== 'giveaways' && parts[2] !== 'jtc') ? parts[2] : null;
  const currentGuildId = pathGuildId || searchParams.get('guildId') || '12345678901234567';
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeGuild = guilds.find(g => g.id === currentGuildId) || {
    id: currentGuildId,
    name: currentGuildId === '12345678901234567' ? 'Pegasus Headquarters' : currentGuildId === '98765432101234567' ? 'Vanguard Community' : currentGuildId === '45678912301234567' ? 'Apex Developers' : `Guild (${currentGuildId})`,
  };

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#5E5CE6] shadow-[0_0_15px_#5E5CE6]" />
          <span className="font-mono text-sm tracking-widest font-bold uppercase text-white">Pegasus</span>
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

      <aside className={`w-full max-w-[280px] lg:max-w-none lg:w-72 border-r border-white/5 bg-black flex flex-col justify-between select-none h-[100dvh] lg:h-[calc(100dvh-4rem)] fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
      {/* Header and Nav Container */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="h-16 border-b border-white/5 flex items-center px-6 gap-3">
          <div className="w-2.5 h-2.5 bg-[#5E5CE6] shadow-[0_0_15px_#5E5CE6]" />
          <span className="font-mono text-sm tracking-widest font-bold uppercase text-white">Pegasus // Admin</span>
        </div>

        {/* Server Context Indicator / Selector */}
        <div className="relative border-b border-white/5 bg-white/[0.01]" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-6 py-4 flex flex-col text-left hover:bg-white/[0.02] transition-all group"
          >
            <div className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-1 flex items-center justify-between w-full">
              <span>// Active Guild</span>
              <ChevronDown className={`w-3 h-3 text-neutral-400 group-hover:text-[#5E5CE6] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            <div className="text-sm font-mono text-white tracking-wide flex items-center justify-between">
              <span className="truncate pr-2 font-semibold">{activeGuild.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </div>
            <div className="text-[11px] font-mono text-neutral-500 mt-1">ID: {activeGuild.id}</div>
          </button>

          {/* Guild Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full bg-[#0a0a0c] border-b border-white/10 shadow-xl py-2 z-50 max-h-60 overflow-y-auto backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-6 py-1 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">// Navigation</div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/dashboard');
                }}
                className="w-full px-6 py-2.5 flex flex-col text-left transition-colors hover:bg-white/5 border-b border-white/5"
              >
                <div className="text-xs font-mono font-medium text-[#5E5CE6] flex items-center gap-2">
                  <LayoutDashboard className="w-3 h-3 text-[#5E5CE6]" />
                  <span>View All Servers (Grid)</span>
                </div>
              </button>
              <div className="px-6 py-1 text-[10px] font-mono text-neutral-500 uppercase tracking-wider mt-1">// Select Guild</div>
              {guilds.map((guild) => (
                <button
                  key={guild.id}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/dashboard/${guild.id}`);
                  }}
                  className={`w-full px-6 py-2.5 flex flex-col text-left transition-colors ${
                    guild.id === currentGuildId ? 'bg-[#5E5CE6]/10 border-l-2 border-[#5E5CE6]' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="text-xs font-mono font-medium text-white flex items-center gap-2">
                    <Server className="w-3 h-3 text-[#5E5CE6]" />
                    <span className="truncate">{guild.name}</span>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 mt-0.5">ID: {guild.id}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 flex-1 space-y-2 font-mono overflow-y-auto custom-scrollbar">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest px-3 py-1 font-semibold">
            // Modules
          </div>
          {navigation.map((item) => {
            const targetHref = `/dashboard/${currentGuildId}${item.href}`;
            const isActive = pathname === targetHref;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={targetHref}
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
        </nav>
      </div>

      {/* Footer System Info */}
      <div className="p-6 border-t border-white/5 bg-white/[0.01]">
        {isSystemAdmin && (
          <Link href="/admin" className="flex items-center gap-3 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors mb-4 group">
            <Terminal className="w-4 h-4 text-emerald-500 group-hover:text-emerald-300 transition-colors" />
            <span>Admin Panel</span>
          </Link>
        )}
        <Link href="/" className="flex items-center gap-3 text-xs font-mono text-neutral-400 hover:text-[#5E5CE6] transition-colors mb-4 group">
          <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-[#5E5CE6] transition-colors" />
          <span>Exit to Main Website</span>
        </Link>
        <div className="text-[10px] font-mono text-neutral-600 flex items-center justify-between">
          <span>VER // 1.0.0-PROD</span>
          <span className="text-[#5E5CE6] animate-pulse">ONLINE</span>
        </div>
      </div>
    </aside>
    </>
  );
}
