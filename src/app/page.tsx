import Link from 'next/link';
import { cookies } from 'next/headers';
import { getBotStats } from '@/lib/api';
import { Terminal, Cpu, Database, Users, ArrowRight, Mic, Shield, Gavel, Coins, Sparkles, Ticket, Gift, Filter, Globe, FileText, Activity } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { ScrollHeader } from '@/components/ScrollHeader';
import { AmbientBackground } from '@/components/AmbientBackground';
import { InteractiveCard, InteractiveButton } from '@/components/InteractiveElements';
import { HorizontalFeatures } from '@/components/HorizontalFeatures';
import { ScrollScrubbedShowcase } from '@/components/ScrollScrubbedShowcase';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const stats = await getBotStats();
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('discord_user')?.value;
  let user: { username?: string; id?: string } | null = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (e) {}
  }

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 flex flex-col selection:bg-[#5E5CE6]/30 selection:text-white relative">
      <AmbientBackground />
      <ScrollHeader user={user} />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col pt-16 relative z-10">
        <section className="max-w-7xl w-full mx-auto px-6 pt-32 pb-32 flex flex-col justify-center border-b border-white/5">
          <StaggerContainer className="max-w-4xl" delay={0.1}>
            <StaggerItem>
              <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-6">
                // PEGASUS
              </div>
            </StaggerItem>
            <StaggerItem>
              <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-8 leading-[1.1]">
                Pegasus is an open-source Discord bot. Our goal is to achieve total transparency and give users the power to fully customize the bot to their exact needs.
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-lg md:text-xl text-neutral-400 mb-12 max-w-2xl font-light leading-relaxed">
                Pegasus replaces multiple generic bots with a single, high-performance, fully configurable modular architecture powered by a sleek management control plane.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-wrap items-center gap-4 font-mono text-sm">
                {user ? (
                  <InteractiveButton href="/dashboard" className="flex items-center gap-3 border border-white/10 border-l-2 border-l-[#5E5CE6] bg-white/[0.02] px-6 py-4 text-white rounded-none group">
                    <span>Enter Administration Panel</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </InteractiveButton>
                ) : (
                  <InteractiveButton href="/api/auth/login" className="flex items-center gap-3 border border-[#5E5CE6]/40 border-l-2 border-l-[#5E5CE6] bg-[#5E5CE6]/10 px-6 py-4 text-[#5E5CE6] rounded-none group">
                    <span>Authenticate with Discord</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </InteractiveButton>
                )}
                <InteractiveButton href="https://discord.com/oauth2/authorize?client_id=1375140177961418774&permissions=8&scope=bot%20applications.commands" external className="flex items-center gap-3 border border-white/10 px-6 py-4 text-neutral-300 rounded-none bg-white/[0.02]">
                  Deploy to Server
                </InteractiveButton>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* Live Bot Metrics */}
        <section id="metrics" className="max-w-7xl w-full mx-auto px-6 py-28 border-b border-white/5">
          <StaggerContainer>
            <StaggerItem>
              <div className="mb-16">
                <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-3">// TELEMETRY</div>
                <h2 className="text-3xl font-light tracking-tight text-white">System Diagnostics & Activity</h2>
              </div>
            </StaggerItem>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StaggerItem className="h-full">
                <InteractiveCard className="p-8 flex flex-col justify-between h-full">
                  <Users className="w-6 h-6 text-neutral-400 mb-6" />
                  <div className="text-4xl font-light tracking-tight text-white mb-2">
                    <AnimatedCounter value={(stats as any).users?.total ?? 0} />
                  </div>
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Total Users</div>
                </InteractiveCard>
              </StaggerItem>
              <StaggerItem className="h-full">
                <InteractiveCard className="p-8 flex flex-col justify-between h-full">
                  <Terminal className="w-6 h-6 text-neutral-400 mb-6" />
                  <div className="text-4xl font-light tracking-tight text-white mb-2">
                    <AnimatedCounter value={(stats as any).commands?.total_executed ?? 0} />
                  </div>
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Commands Executed</div>
                </InteractiveCard>
              </StaggerItem>
              <StaggerItem className="h-full">
                <InteractiveCard className="p-8 flex flex-col justify-between h-full">
                  <Database className="w-6 h-6 text-neutral-400 mb-6" />
                  <div className="text-4xl font-light tracking-tight text-white mb-2">
                    <AnimatedCounter value={(stats as any).guilds?.total ?? 0} />
                  </div>
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Guilds</div>
                </InteractiveCard>
              </StaggerItem>
              <StaggerItem className="h-full">
                <InteractiveCard className="p-8 flex flex-col justify-between h-full">
                  <Cpu className="w-6 h-6 text-neutral-400 mb-6" />
                  <div className="text-4xl font-light tracking-tight text-white mb-2">
                    <AnimatedCounter value={(stats as any).system?.latency ?? 0} suffix="ms" />
                  </div>
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Discord Heartbeat Ping</div>
                </InteractiveCard>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </section>

        {/* Scroll Scrubbed Architecture Showcase */}
        <ScrollScrubbedShowcase />

        {/* Horizontal Scroll Features */}
        <HorizontalFeatures />
      </main>

      <footer className="border-t border-white/5 py-16 text-xs font-mono text-neutral-500 bg-[#000000] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span>© 2026 Pegasus Bot. All rights reserved.</span>
            <span className="text-white/20">|</span>
            <a href="https://vaultscope.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Sponsored by VaultScope</a>
          </div>
          <div className="flex items-center gap-8">
            <a href="https://cptcr.uk" target="_blank" rel="noopener noreferrer" className="hover:text-[#5E5CE6] transition-colors">Developer</a>
            <a href="https://discord.gg/vaultscope" target="_blank" rel="noopener noreferrer" className="hover:text-[#5E5CE6] transition-colors">Support Server</a>
            <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noopener noreferrer" className="hover:text-[#5E5CE6] transition-colors">GitHub</a>
            <Link href="/privacy" className="hover:text-[#5E5CE6] transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-[#5E5CE6] transition-colors">Terms of Service</Link>
            <Link href="/tech" className="hover:text-[#5E5CE6] transition-colors">Technologies</Link>
            <Link href="/sponsors" className="hover:text-[#5E5CE6] transition-colors">Sponsors</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
