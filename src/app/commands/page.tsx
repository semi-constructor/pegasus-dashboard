import React from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Terminal, Shield, Wallet, Gift, Smile, Settings, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PegasusBot Commands & Documentation',
  description: 'Explore the full list of PegasusBot commands, organized by category. Learn how to use moderation, economy, and utility commands.',
  alternates: { canonical: '/commands' },
  openGraph: {
    title: 'PegasusBot Commands & Documentation',
    description: 'Explore the full list of PegasusBot commands, organized by category.',
    type: 'website',
  },
};

export default function CommandsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "PegasusBot Commands",
    "description": "Full documentation for PegasusBot commands and features."
  };

  const categories = [
    { name: 'Moderation', icon: Shield, description: 'Commands to keep your server safe (ban, kick, mute, warn).', slug: 'moderation' },
    { name: 'Economy', icon: Wallet, description: 'Global and server-specific economy commands (balance, pay, shop).', slug: 'economy' },
    { name: 'Giveaways', icon: Gift, description: 'Host interactive giveaways with ease (gstart, reroll, gend).', slug: 'giveaways' },
    { name: 'Fun & Utility', icon: Smile, description: 'Engage your community with fun commands and useful utilities.', slug: 'fun' },
    { name: 'Configuration', icon: Settings, description: 'Set up welcome messages, automod, and server settings.', slug: 'configuration' }
  ];

  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <div className="relative min-h-screen bg-background pt-48 pb-32 overflow-hidden selection:bg-foreground selection:text-background">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-foreground/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-foreground/[0.03]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">
          <Breadcrumbs items={[
            { name: 'Home', url: '/' },
            { name: 'Commands', url: '/commands' }
          ]} />

          <div className="mb-24 mt-12">
            <div className="inline-flex items-center gap-2 text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
              <Terminal className="w-3 h-3" /> COMMAND_REFERENCE
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground mb-8 uppercase leading-[0.9]">
              Bot Commands
            </h1>
            <p className="text-foreground/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed">
              Discover everything PegasusBot can do. Select a category below to view detailed command syntax, permissions, and examples.
            </p>
          </div>

          <div className="w-full h-px bg-foreground/10 mb-16" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 mb-32">
            {categories.map((category, i) => (
              <Link 
                key={category.slug} 
                href={`/docs/commands#${category.slug}`}
                className="group bg-[#050505] p-8 hover:bg-foreground/[0.02] transition-all duration-500 flex flex-col items-start"
              >
                <div className="flex items-center justify-between w-full mb-8">
                  <category.icon className="w-6 h-6 text-foreground/30 group-hover:text-foreground transition-colors duration-500" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/20">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-xl font-medium text-foreground mb-4 uppercase tracking-[0.1em]">{category.name}</h3>
                <p className="text-foreground/40 text-sm leading-relaxed font-light mb-8 flex-grow">{category.description}</p>
                <span className="flex items-center text-xs uppercase tracking-[0.3em] text-foreground/20 group-hover:text-foreground transition-colors duration-500">
                  View Commands <ChevronRight className="w-3 h-3 ml-2 group-hover:translate-x-2 transition-transform duration-500" />
                </span>
              </Link>
            ))}
          </div>
          
          <div className="border border-border bg-[#050505] p-12 text-center">
            <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-[0.2em]">Looking for a specific command?</h2>
            <p className="text-foreground/40 text-sm font-light max-w-2xl mx-auto">
              You can always use the <code className="text-foreground font-mono text-xs border border-border px-2 py-1">/help</code> command directly within Discord to see a personalized list of commands available to your role.
            </p>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
