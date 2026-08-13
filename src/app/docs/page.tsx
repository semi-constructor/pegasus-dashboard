import { Metadata } from 'next';
import Link from 'next/link';
import { TerminalSquare, Download, LayoutDashboard, ArrowRight, Cpu, ShieldAlert, Activity, Ticket } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Documentation | Pegasus',
  description: 'Everything you need to know about using Pegasus Discord Bot.',
};

export default async function DocsIndexPage() {
  const t = await getTranslations('docs');

  return (
    <div className="max-w-5xl">
      <div className="mb-24">
        <div className="inline-flex items-center text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
          // Documentation Hub
        </div>
        
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-foreground mb-8 uppercase leading-tight">
          Documentation
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/40 font-light max-w-2xl leading-relaxed mb-12">
          Everything you need to master Pegasus. Explore command references, installation guides, and detailed dashboard walkthroughs.
        </p>
      </div>

      <div className="w-full h-px bg-foreground/10 mb-16" />

      <h2 className="text-2xl font-medium tracking-tighter text-foreground mb-8 uppercase">Getting Started</h2>
      
      <div className="grid md:grid-cols-2 gap-px bg-foreground/10 border border-border mb-24">
        <Link href="/docs/installation" className="group">
          <div className="h-full bg-background p-10 hover:bg-foreground/[0.02] transition-colors relative flex flex-col justify-between">
            <div>
              <Download className="w-6 h-6 text-foreground/30 mb-6 group-hover:text-foreground transition-colors" />
              <h3 className="text-xl font-medium tracking-tighter uppercase text-foreground mb-3">Installation Guide</h3>
              <p className="text-foreground/40 text-sm font-light leading-relaxed">Deploy Pegasus to your own server step-by-step.</p>
            </div>
          </div>
        </Link>
        <Link href="/docs/dashboard" className="group">
          <div className="h-full bg-background p-10 hover:bg-foreground/[0.02] transition-colors relative flex flex-col justify-between">
            <div>
              <LayoutDashboard className="w-6 h-6 text-foreground/30 mb-6 group-hover:text-foreground transition-colors" />
              <h3 className="text-xl font-medium tracking-tighter uppercase text-foreground mb-3">Dashboard Protocol</h3>
              <p className="text-foreground/40 text-sm font-light leading-relaxed">Master the Pegasus web interface and configuration.</p>
            </div>
          </div>
        </Link>
        <Link href="/docs/commands" className="group md:col-span-2">
          <div className="h-full bg-background p-10 hover:bg-foreground/[0.02] transition-colors relative flex flex-col justify-between">
            <div>
              <TerminalSquare className="w-6 h-6 text-foreground/30 mb-6 group-hover:text-foreground transition-colors" />
              <h3 className="text-xl font-medium tracking-tighter uppercase text-foreground mb-3">Command Reference</h3>
              <p className="text-foreground/40 text-sm font-light leading-relaxed max-w-xl">A complete interactive list of every bot command and argument available in Pegasus.</p>
            </div>
          </div>
        </Link>
      </div>

      <h2 className="text-2xl font-medium tracking-tighter text-foreground mb-8 uppercase">Core Modules</h2>
      
      <div className="grid md:grid-cols-2 gap-px bg-foreground/10 border border-border">
        <Link href="/docs/modules/economy" className="group">
          <div className="h-full bg-background p-8 hover:bg-foreground/[0.02] transition-colors flex items-start gap-6">
            <Cpu className="w-6 h-6 text-foreground/30 flex-shrink-0 group-hover:text-foreground transition-colors mt-1" />
            <div>
              <h3 className="text-lg font-medium tracking-tight uppercase text-foreground mb-2">Economy & Progression</h3>
              <p className="text-foreground/40 text-xs leading-relaxed">Architect your server's internal economy and RPG mechanics.</p>
            </div>
          </div>
        </Link>
        <Link href="/docs/modules/moderation" className="group">
          <div className="h-full bg-background p-8 hover:bg-foreground/[0.02] transition-colors flex items-start gap-6">
            <ShieldAlert className="w-6 h-6 text-foreground/30 flex-shrink-0 group-hover:text-foreground transition-colors mt-1" />
            <div>
              <h3 className="text-lg font-medium tracking-tight uppercase text-foreground mb-2">Automated Defense</h3>
              <p className="text-foreground/40 text-xs leading-relaxed">Establish an impenetrable perimeter with AutoMod.</p>
            </div>
          </div>
        </Link>
        <Link href="/docs/modules/leveling" className="group">
          <div className="h-full bg-background p-8 hover:bg-foreground/[0.02] transition-colors flex items-start gap-6">
            <Activity className="w-6 h-6 text-foreground/30 flex-shrink-0 group-hover:text-foreground transition-colors mt-1" />
            <div>
              <h3 className="text-lg font-medium tracking-tight uppercase text-foreground mb-2">Leveling & XP</h3>
              <p className="text-foreground/40 text-xs leading-relaxed">Reward active users with dynamic XP multipliers and role thresholds.</p>
            </div>
          </div>
        </Link>
        <Link href="/docs/modules/tickets" className="group">
          <div className="h-full bg-background p-8 hover:bg-foreground/[0.02] transition-colors flex items-start gap-6">
            <Ticket className="w-6 h-6 text-foreground/30 flex-shrink-0 group-hover:text-foreground transition-colors mt-1" />
            <div>
              <h3 className="text-lg font-medium tracking-tight uppercase text-foreground mb-2">Support Architecture</h3>
              <p className="text-foreground/40 text-xs leading-relaxed">Design complex support pipelines with the Tickets module.</p>
            </div>
          </div>
        </Link>
      </div>

    </div>
  );
}
