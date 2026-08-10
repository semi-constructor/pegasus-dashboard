import React from 'react';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Terminal, Shield, Wallet, Gift, Smile, Settings } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PegasusBot Commands & Documentation',
  description: 'Explore the full list of PegasusBot commands, organized by category. Learn how to use moderation, economy, and utility commands.',
  alternates: {
    canonical: '/commands',
  },
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
    {
      name: 'Moderation',
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      description: 'Commands to keep your server safe (ban, kick, mute, warn).',
      slug: 'moderation'
    },
    {
      name: 'Economy',
      icon: <Wallet className="w-6 h-6 text-emerald-400" />,
      description: 'Global and server-specific economy commands (balance, pay, shop).',
      slug: 'economy'
    },
    {
      name: 'Giveaways',
      icon: <Gift className="w-6 h-6 text-emerald-400" />,
      description: 'Host interactive giveaways with ease (gstart, reroll, gend).',
      slug: 'giveaways'
    },
    {
      name: 'Fun & Utility',
      icon: <Smile className="w-6 h-6 text-emerald-400" />,
      description: 'Engage your community with fun commands and useful utilities.',
      slug: 'fun'
    },
    {
      name: 'Configuration',
      icon: <Settings className="w-6 h-6 text-emerald-400" />,
      description: 'Set up welcome messages, automod, and server settings.',
      slug: 'configuration'
    }
  ];

  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: 'Commands', url: '/commands' }
        ]} />

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 font-medium mb-8 border border-emerald-500/20">
            <Terminal className="w-4 h-4" /> Command Reference
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Bot Commands
          </h1>
          <p className="text-xl text-zinc-400">
            Discover everything PegasusBot can do. Select a category below to view detailed command syntax, permissions, and examples.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {categories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/docs/commands#${category.slug}`}
              className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] group flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 transition-colors">
                {category.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{category.name}</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">{category.description}</p>
              <span className="mt-auto text-emerald-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                View Commands &rarr;
              </span>
            </Link>
          ))}
        </div>
        
        <div className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-10 border border-zinc-800 text-center">
          <h2 className="text-2xl font-bold mb-4">Looking for a specific command?</h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            You can always use the <code>/help</code> command directly within Discord to see a personalized list of commands available to your role.
          </p>
        </div>
      </div>
    </MarketingLayout>
  );
}
