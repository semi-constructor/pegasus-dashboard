import { Metadata } from 'next';
import Image from 'next/image';
import { Compass, Activity, Settings, ShieldAlert, Cpu } from 'lucide-react';
import { ThemedImage } from '@/components/ThemedImage';

export const metadata: Metadata = {
  title: 'Dashboard Guide | Pegasus',
  description: 'Learn how to navigate and use the Pegasus Web Dashboard to control your server settings, modules, and economy.',
};

export default function DashboardGuidePage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-32">
        <div className="inline-flex items-center text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
          <Compass className="w-4 h-4 mr-3 text-foreground/50" />
          // DASHBOARD_OPERATIONS.EXE
        </div>
        
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-foreground mb-8 uppercase leading-tight">
          Dashboard<br/>Protocol
        </h1>
        <p className="text-foreground/40 tracking-[0.1em] text-sm uppercase max-w-2xl leading-relaxed">
          Master the Pegasus web interface. Learn how to configure your modules, monitor your server's health, and customize the bot's behavior in real-time through our state-of-the-art control panel.
        </p>
      </div>

      <div className="w-full h-px bg-foreground/10 mb-24" />

      {/* Cinematic Content Sections */}
      <div className="space-y-40">
        
        {/* Section 1: Overview Panel */}
        <section className="border-t border-border pt-16">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3">
              <div className="flex items-center gap-4 text-foreground/30 mb-8 border-b border-border pb-4">
                <Activity className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-mono">Module 01</span>
              </div>
              <h2 className="text-3xl tracking-tighter font-medium text-foreground mb-6 uppercase">
                Central Command
              </h2>
              <p className="text-foreground/50 text-sm leading-relaxed font-light mb-8">
                The Overview panel serves as your primary terminal. Instantly monitor server health, view active modules, and control core features through rapid-toggle interface components. All data is synchronized in real-time.
              </p>
              <ul className="space-y-4 text-xs uppercase tracking-widest text-foreground/40 font-mono">
                <li className="flex items-center gap-3"><div className="w-1 h-1 bg-foreground" /> Real-time metrics</li>
                <li className="flex items-center gap-3"><div className="w-1 h-1 bg-foreground" /> Quick-action toggles</li>
              </ul>
            </div>
            
            <div className="lg:w-2/3 w-full">
              <div className="p-4 bg-muted/30 border border-border">
                <div className="border border-border overflow-hidden group">
                  <ThemedImage 
                    src="/screenshots/overview/overview.png" 
                    alt="Dashboard Overview Panel" 
                    className="w-full h-auto grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Economy & XP */}
        <section className="border-t border-border pt-16">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-start">
            <div className="lg:w-1/3">
              <div className="flex items-center gap-4 text-foreground/30 mb-8 border-b border-border pb-4">
                <Cpu className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-mono">Module 02</span>
              </div>
              <h2 className="text-3xl tracking-tighter font-medium text-foreground mb-6 uppercase">
                Economy & Progression
              </h2>
              <p className="text-foreground/50 text-sm leading-relaxed font-light mb-8">
                Architect your server's internal economy and RPG mechanics. The interface allows precise manipulation of user balances, dynamic XP multipliers per channel, and automated role-reward distribution.
              </p>
              <ul className="space-y-4 text-xs uppercase tracking-widest text-foreground/40 font-mono">
                <li className="flex items-center gap-3"><div className="w-1 h-1 bg-foreground" /> Balance Manipulation</li>
                <li className="flex items-center gap-3"><div className="w-1 h-1 bg-foreground" /> Multiplier Rulesets</li>
              </ul>
            </div>
            
            <div className="lg:w-2/3 w-full">
              <div className="p-4 bg-[#050505] border border-border grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border overflow-hidden group">
                  <ThemedImage 
                    src="/screenshots/economy/transactions.png" 
                    alt="User Balances" 
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                </div>
                <div className="border border-border overflow-hidden group">
                  <ThemedImage 
                    src="/screenshots/xp-leveling/management.png" 
                    alt="XP Management" 
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Tickets */}
        <section className="border-t border-border pt-16">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3">
              <div className="flex items-center gap-4 text-foreground/30 mb-8 border-b border-border pb-4">
                <Settings className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-mono">Module 03</span>
              </div>
              <h2 className="text-3xl tracking-tighter font-medium text-foreground mb-6 uppercase">
                Support Architecture
              </h2>
              <p className="text-foreground/50 text-sm leading-relaxed font-light mb-8">
                Design complex support pipelines with the Tickets module. Construct isolated departments, route them to specific staff roles, and configure automated transcript logging.
              </p>
            </div>
            
            <div className="lg:w-2/3 w-full">
              <div className="p-4 bg-muted/30 border border-border">
                <div className="border border-border overflow-hidden group">
                  <ThemedImage 
                    src="/screenshots/tickets/ticketboard.png" 
                    alt="Ticket Board" 
                    className="w-full h-auto grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Moderation */}
        <section className="border-t border-border pt-16">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-start">
            <div className="lg:w-1/3">
              <div className="flex items-center gap-4 text-foreground/30 mb-8 border-b border-border pb-4">
                <ShieldAlert className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-mono">Module 04</span>
              </div>
              <h2 className="text-3xl tracking-tighter font-medium text-foreground mb-6 uppercase">
                Automated Defense
              </h2>
              <p className="text-foreground/50 text-sm leading-relaxed font-light mb-8">
                Establish an impenetrable perimeter. The AutoMod terminal enables the creation of complex regex filters, configurable punishment escalations, and a live review interface.
              </p>
            </div>
            
            <div className="lg:w-2/3 w-full">
              <div className="p-4 bg-muted/30 border border-border">
                <div className="border border-border overflow-hidden group">
                  <ThemedImage 
                    src="/screenshots/warns/list-warns.png" 
                    alt="Warnings Dashboard" 
                    className="w-full h-auto grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 contrast-125"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
      </div>
      
    </div>
  );
}
