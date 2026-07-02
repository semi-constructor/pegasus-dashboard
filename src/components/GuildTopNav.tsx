'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Settings, Coins, ShieldAlert, Ticket, Award, Gift, Headphones, Terminal, Server, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const navigation = [
  { name: 'Overview', href: '', icon: LayoutDashboard },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Commands', href: '/custom-commands', icon: Terminal },
  { name: 'Economy', href: '/economy', icon: Coins },
  { name: 'Moderation', href: '/moderation', icon: ShieldAlert },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'XP', href: '/xp-matrix', icon: Award },
  { name: 'Giveaways', href: '/giveaways', icon: Gift },
  { name: 'J2C', href: '/jtc', icon: Headphones },
];

export function GuildTopNav({ guildId, guilds = [], isSystemAdmin = false }: { guildId: string, guilds?: any[], isSystemAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const activeGuild = guilds.find(g => g.id === guildId) || {
    id: guildId,
    name: guildId === '12345678901234567' ? 'Pegasus Headquarters' : guildId === '98765432101234567' ? 'Vanguard Community' : guildId === '45678912301234567' ? 'Apex Developers' : `Guild (${guildId})`,
  };

  return (
    <div className="w-full bg-black/80 backdrop-blur-md sticky top-16 z-30 border-b border-white/5">
      {/* Top Bar: Server Selector and Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 bg-white/[0.02] border border-white/10 hover:border-white/20 px-4 py-2 rounded-sm transition-all group"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-mono text-white tracking-wide truncate max-w-[150px] sm:max-w-xs">{activeGuild.name}</span>
            <ChevronDown className={`w-4 h-4 text-neutral-400 group-hover:text-[#5E5CE6] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-[#0a0a0c] border border-white/10 shadow-xl z-50 max-h-80 overflow-y-auto rounded-sm backdrop-blur-xl">
              <div className="px-4 py-2 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">// Navigation</div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/dashboard');
                }}
                className="w-full px-4 py-3 flex flex-col text-left transition-colors hover:bg-white/5 border-b border-white/5"
              >
                <div className="text-xs font-mono font-medium text-[#5E5CE6] flex items-center gap-2">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>View All Servers</span>
                </div>
              </button>
              <div className="px-4 py-2 text-[10px] font-mono text-neutral-500 uppercase tracking-wider mt-1">// Your Servers</div>
              {guilds.map((guild) => (
                <button
                  key={guild.id}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/dashboard/${guild.id}`);
                  }}
                  className={`w-full px-4 py-3 flex flex-col text-left transition-colors ${
                    guild.id === guildId ? 'bg-[#5E5CE6]/10 border-l-2 border-[#5E5CE6]' : 'hover:bg-white/5 border-l-2 border-transparent'
                  }`}
                >
                  <div className="text-xs font-mono font-medium text-white flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-[#5E5CE6]" />
                    <span className="truncate">{guild.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {isSystemAdmin && (
          <Link href="/admin" className="flex items-center gap-2 text-xs font-mono bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-1.5 rounded-sm transition-colors group">
            <Terminal className="w-3.5 h-3.5 group-hover:text-emerald-300" />
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="sm:hidden">Admin</span>
          </Link>
        )}
      </div>

      {/* Bottom Bar: Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 border-t border-white/5">
        <nav className="flex space-x-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-0">
          {navigation.map((item) => {
            const path = `/dashboard/${guildId}${item.href}`;
            const isActive = pathname === path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={path}
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
