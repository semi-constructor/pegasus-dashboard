import { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, Compass, TerminalSquare, Activity, Settings, ShieldAlert, Cpu } from 'lucide-react';
import Link from 'next/link';
import { MarketingLayout } from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Dashboard Guide | Pegasus',
  description: 'Learn how to navigate and use the Pegasus Web Dashboard to control your server settings, modules, and economy.',
};

export default function DashboardGuidePage() {
  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black pb-32">
        {/* Background Grids & Lines */}
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-24 pt-48 relative z-10">
          <div className="mb-32">
            <Link href="/docs" className="group inline-flex items-center text-xs tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors mb-16">
              <ArrowRight className="w-4 h-4 mr-4 rotate-180 opacity-50 group-hover:-translate-x-2 transition-transform" />
              Back to Documentation Index
            </Link>

            <div className="inline-flex items-center text-white/30 text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 px-4 py-2">
              <Compass className="w-4 h-4 mr-3 text-white/50" />
              // DASHBOARD_OPERATIONS.EXE
            </div>
            
            <h1 className="text-6xl md:text-8xl font-medium tracking-tighter text-white mb-8 uppercase leading-[0.85]">
              Dashboard<br/>Protocol
            </h1>
            <p className="text-white/40 tracking-[0.1em] text-sm uppercase max-w-2xl leading-relaxed">
              Master the Pegasus web interface. Learn how to configure your modules, monitor your server's health, and customize the bot's behavior in real-time through our state-of-the-art control panel.
            </p>
          </div>
        </div>

        {/* Cinematic Content Sections */}
        <div className="space-y-40 relative z-10">
          
          {/* Section 1: Overview Panel */}
          <section className="border-y border-white/10 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-6 lg:px-24 py-24">
              <div className="flex flex-col lg:flex-row gap-16 items-center">
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-4 text-white/30 mb-8 border-b border-white/10 pb-4">
                    <Activity className="w-5 h-5" />
                    <span className="text-xs uppercase tracking-widest font-mono">Module 01</span>
                  </div>
                  <h2 className="text-4xl tracking-tighter font-medium text-white mb-8 uppercase">
                    Central<br/>Command
                  </h2>
                  <p className="text-white/50 text-base leading-relaxed font-light mb-8">
                    The Overview panel serves as your primary terminal. Instantly monitor server health, view active modules, and control core features through rapid-toggle interface components. All data is synchronized in real-time with the Pegasus network.
                  </p>
                  <ul className="space-y-4 text-sm uppercase tracking-widest text-white/40 font-mono">
                    <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white" /> Real-time metrics</li>
                    <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white" /> Quick-action toggles</li>
                    <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white" /> Global state management</li>
                  </ul>
                </div>
                
                <div className="lg:w-2/3 w-full">
                  <div className="p-4 bg-black border border-white/10 relative">
                    {/* Crosshairs */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-white/30" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-t border-r border-white/30" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b border-l border-white/30" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-white/30" />
                    
                    <div className="border border-white/5 overflow-hidden group">
                      <Image 
                        src="/screenshots/overview/overview.png" 
                        alt="Dashboard Overview Panel" 
                        width={1920} 
                        height={1080}
                        className="w-full h-auto grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Economy & XP */}
          <section className="border-y border-white/10 bg-[#020202]">
            <div className="max-w-7xl mx-auto px-6 lg:px-24 py-24">
              <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-4 text-white/30 mb-8 border-b border-white/10 pb-4">
                    <Cpu className="w-5 h-5" />
                    <span className="text-xs uppercase tracking-widest font-mono">Module 02</span>
                  </div>
                  <h2 className="text-4xl tracking-tighter font-medium text-white mb-8 uppercase">
                    Economy &<br/>Progression
                  </h2>
                  <p className="text-white/50 text-base leading-relaxed font-light mb-8">
                    Architect your server's internal economy and RPG mechanics. The interface allows precise manipulation of user balances, dynamic XP multipliers per channel, and automated role-reward distribution based on level thresholds.
                  </p>
                  <ul className="space-y-4 text-sm uppercase tracking-widest text-white/40 font-mono">
                    <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white" /> Balance Manipulation</li>
                    <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white" /> Multiplier Rulesets</li>
                    <li className="flex items-center gap-3"><div className="w-1 h-1 bg-white" /> Automated Role Issuance</li>
                  </ul>
                </div>
                
                <div className="lg:w-2/3 w-full">
                  <div className="p-4 bg-black border border-white/10 relative grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-white/5 overflow-hidden group">
                      <Image 
                        src="/screenshots/economy/user-balances.png" 
                        alt="User Balances" 
                        width={1920} 
                        height={1080}
                        className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      />
                    </div>
                    <div className="border border-white/5 overflow-hidden group">
                      <Image 
                        src="/screenshots/xp-leveling/management.png" 
                        alt="XP Management" 
                        width={1920} 
                        height={1080}
                        className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Tickets */}
          <section className="border-y border-white/10 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-6 lg:px-24 py-24">
              <div className="flex flex-col lg:flex-row gap-16 items-center">
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-4 text-white/30 mb-8 border-b border-white/10 pb-4">
                    <Settings className="w-5 h-5" />
                    <span className="text-xs uppercase tracking-widest font-mono">Module 03</span>
                  </div>
                  <h2 className="text-4xl tracking-tighter font-medium text-white mb-8 uppercase">
                    Support<br/>Architecture
                  </h2>
                  <p className="text-white/50 text-base leading-relaxed font-light mb-8">
                    Design complex support pipelines with the Tickets module. Construct isolated departments (e.g. Billing, Support, Applications), route them to specific staff roles, and configure automated transcript logging to secured channels.
                  </p>
                </div>
                
                <div className="lg:w-2/3 w-full">
                  <div className="p-4 bg-black border border-white/10 relative">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                    <div className="border border-white/5 overflow-hidden group relative z-10">
                      <Image 
                        src="/screenshots/tickets/ticketboard.png" 
                        alt="Ticket Board" 
                        width={1920} 
                        height={1080}
                        className="w-full h-auto grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Moderation */}
          <section className="border-y border-white/10 bg-[#020202]">
            <div className="max-w-7xl mx-auto px-6 lg:px-24 py-24">
              <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-4 text-white/30 mb-8 border-b border-white/10 pb-4">
                    <ShieldAlert className="w-5 h-5" />
                    <span className="text-xs uppercase tracking-widest font-mono">Module 04</span>
                  </div>
                  <h2 className="text-4xl tracking-tighter font-medium text-white mb-8 uppercase">
                    Automated<br/>Defense
                  </h2>
                  <p className="text-white/50 text-base leading-relaxed font-light mb-8">
                    Establish an impenetrable perimeter. The AutoMod terminal enables the creation of complex regex filters, configurable punishment escalations, and a live review interface for recent automated infractions.
                  </p>
                </div>
                
                <div className="lg:w-2/3 w-full">
                  <div className="p-4 bg-black border border-white/10 relative">
                    <div className="border border-white/5 overflow-hidden group relative z-10">
                      <Image 
                        src="/screenshots/warns/list-warns.png" 
                        alt="Warnings Dashboard" 
                        width={1920} 
                        height={1080}
                        className="w-full h-auto grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 contrast-125"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
        </div>
        
        <div className="mt-40 max-w-7xl mx-auto px-6 lg:px-24">
          <div className="border border-white/10 bg-[#050505] p-12 md:p-24 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/[0.02] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
            <TerminalSquare className="w-12 h-12 text-white/30 mb-8 relative z-10" />
            <h3 className="text-4xl font-medium tracking-tighter text-white mb-12 uppercase relative z-10">Initialize Dashboard</h3>
            <Link href="/dashboard" className="relative z-10 group/btn flex items-center justify-center px-12 py-6 bg-white text-black text-sm font-bold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors">
              Execute Login
              <ArrowRight className="w-4 h-4 ml-4 group-hover/btn:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
        
      </div>
    </MarketingLayout>
  );
}
