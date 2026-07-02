'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Terminal, Cpu, Database, Users, ArrowRight } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { AnimatedNavBar } from '@/components/AnimatedNavBar';
import { BackgroundScene } from '@/components/BackgroundScene';
import { InteractiveCard, MagneticButton, CinematicText, CustomCursor } from '@/components/InteractiveElements';
import { FeatureSection } from '@/components/FeatureSection';
import { CommandsSection } from '@/components/CommandsSection';

export default function HomePage() {
  const [stats, setStats] = useState({ users: { total: 0 }, commands: { total_executed: 0 }, guilds: { total: 0 }, system: { latency: 0 } });
  const [user, setUser] = useState<{ username?: string | null; id?: string | null } | null>(null);

  useEffect(() => {
    fetch('/api/stats').then(res => res.json()).then(data => setStats(data || { users: { total: 0 }, commands: { total_executed: 0 }, guilds: { total: 0 }, system: { latency: 0 } })).catch(() => {});
    fetch('/api/auth/session').then(res => res.json()).then(data => {
      if (data?.user) setUser({ username: data.user.name, id: data.user.id });
    }).catch(() => {});
  }, []);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.5], [1, 0.9]);
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 flex flex-col selection:bg-[#5E5CE6]/30 selection:text-white relative cursor-none overflow-hidden font-sans">
      <CustomCursor />
      <BackgroundScene />
      <AnimatedNavBar user={user} />

      <main className="flex-1 flex flex-col relative z-10">
        
        {/* Hero Section */}
        <motion.section 
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="min-h-[100vh] max-w-7xl w-full mx-auto px-6 flex flex-col justify-center relative pt-20"
        >
          <div className="max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-8 flex items-center gap-4"
            >
              <div className="h-px w-8 bg-[#5E5CE6]" />
              POWERFUL DISCORD AUTOMATION
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-light tracking-tight text-white mb-10 leading-[1.1]">
              <CinematicText text="Meet Pegasus, your all-in-one Discord bot." />
            </h1>
            
            <div className="text-xl md:text-3xl text-neutral-400 mb-16 max-w-3xl font-light leading-relaxed">
              <CinematicText delay={0.1} text="Manage your server, set up economies, run giveaways, and keep things safe—all with one completely customizable bot." />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="flex flex-wrap items-center gap-6 font-mono text-sm"
            >
              {user ? (
                <MagneticButton href="/dashboard" className="flex items-center justify-center gap-3 border border-white/10 border-t-white/20 border-l-white/20 bg-white/[0.03] backdrop-blur-2xl px-10 py-5 text-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] group">
                  <span className="font-semibold tracking-wider">Enter Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </MagneticButton>
              ) : (
                <MagneticButton href="/api/auth/signin/discord" className="flex items-center justify-center gap-3 border border-[#5E5CE6]/50 border-t-[#5E5CE6]/70 border-l-[#5E5CE6]/70 bg-[#5E5CE6]/10 backdrop-blur-2xl px-10 py-5 text-[#5E5CE6] rounded-2xl shadow-[0_8px_32px_rgba(94,92,230,0.2)] group hover:bg-[#5E5CE6]/20 transition-colors">
                  <span className="font-semibold tracking-wider">Authenticate with Discord</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </MagneticButton>
              )}
              <MagneticButton href="https://discord.com/oauth2/authorize?client_id=1375140177961418774&permissions=8&scope=bot%20applications.commands" external className="flex items-center justify-center gap-3 border border-white/5 border-t-white/10 border-l-white/10 px-10 py-5 text-neutral-300 rounded-2xl bg-white/[0.01] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] group hover:border-white/20 transition-colors">
                <span className="tracking-wider">Deploy to Server</span>
              </MagneticButton>
            </motion.div>
          </div>
        </motion.section>

        {/* Live Bot Metrics */}
        <section id="metrics" className="max-w-[1400px] w-full mx-auto px-6 py-32 relative z-20">
          <StaggerContainer>
            <StaggerItem>
              <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div>
                  <div className="text-xs font-mono tracking-widest text-[#5E5CE6] uppercase mb-4">// LIVE STATS</div>
                  <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white"><CinematicText text="Bot Status" /></h2>
                </div>
                <p className="text-neutral-500 font-mono text-sm max-w-sm">Real-time statistics updated automatically from the bot.</p>
              </div>
            </StaggerItem>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StaggerItem className="h-full">
                <InteractiveCard className="p-10 flex flex-col justify-between h-full group">
                  <Users className="w-8 h-8 text-neutral-500 mb-8 group-hover:text-white transition-colors duration-500" />
                  <div className="text-5xl font-light tracking-tight text-white mb-4 drop-shadow-md">
                    <AnimatedCounter value={(stats as any).users?.total ?? 0} />
                  </div>
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Total Users</div>
                </InteractiveCard>
              </StaggerItem>
              <StaggerItem className="h-full">
                <InteractiveCard className="p-10 flex flex-col justify-between h-full group">
                  <Terminal className="w-8 h-8 text-neutral-500 mb-8 group-hover:text-white transition-colors duration-500" />
                  <div className="text-5xl font-light tracking-tight text-white mb-4 drop-shadow-md">
                    <AnimatedCounter value={(stats as any).commands?.total_executed ?? 0} />
                  </div>
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Commands Executed</div>
                </InteractiveCard>
              </StaggerItem>
              <StaggerItem className="h-full">
                <InteractiveCard className="p-10 flex flex-col justify-between h-full group">
                  <Database className="w-8 h-8 text-neutral-500 mb-8 group-hover:text-white transition-colors duration-500" />
                  <div className="text-5xl font-light tracking-tight text-white mb-4 drop-shadow-md">
                    <AnimatedCounter value={(stats as any).guilds?.total ?? 0} />
                  </div>
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Active Guilds</div>
                </InteractiveCard>
              </StaggerItem>
              <StaggerItem className="h-full">
                <InteractiveCard className="p-10 flex flex-col justify-between h-full group">
                  <Cpu className="w-8 h-8 text-neutral-500 mb-8 group-hover:text-[#5E5CE6] transition-colors duration-500" />
                  <div className="text-5xl font-light tracking-tight text-white mb-4 drop-shadow-md">
                    <AnimatedCounter value={(stats as any).system?.latency ?? 0} suffix="ms" />
                  </div>
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Heartbeat Ping</div>
                </InteractiveCard>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </section>

        {/* Feature Matrix Replaces ScrollScrubbedShowcase, FeatureShowcase, and HorizontalFeatures */}
        <FeatureSection />

        {/* Commands Explorer */}
        <CommandsSection />

      </main>

      <footer className="border-t border-white/5 py-16 mt-20 text-xs font-mono text-neutral-500 relative z-30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span>© 2026 Pegasus Bot. All rights reserved.</span>
            <span className="text-white/20">|</span>
            <a href="https://vaultscope.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Sponsored by VaultScope</a>
          </div>
          <div className="flex items-center gap-8">
            <a href="https://cptcr.uk" target="_blank" rel="noopener noreferrer" className="hover:text-[#5E5CE6] transition-colors">Developer</a>
            <a href="https://discord.gg/vaultscope" target="_blank" rel="noopener noreferrer" className="hover:text-[#5E5CE6] transition-colors">Support Server</a>
            <Link href="/source" className="hover:text-[#5E5CE6] transition-colors">Source Code</Link>
            <Link href="/privacy" className="hover:text-[#5E5CE6] transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
