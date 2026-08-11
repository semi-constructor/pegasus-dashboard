import React from 'react';
import { getTranslations } from 'next-intl/server';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ShieldCheck, Settings, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'seo.guidesSetup' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pegasusbot.app';
  return {
    title: t('metaTitle'), description: t('metaDescription'),
    alternates: { canonical: '/guides/discord-server-setup' },
    openGraph: { title: t('metaTitle'), description: t('metaDescription'), type: 'article', url: `${baseUrl}/guides/discord-server-setup` },
  };
}

export default async function DiscordServerSetupGuide() {
  const t = await getTranslations('seo.guidesSetup');

  const schema = {
    "@context": "https://schema.org", "@type": "Article",
    "headline": t('metaTitle'), "description": t('metaDescription'),
    "author": { "@type": "Organization", "name": "PegasusBot" },
    "publisher": { "@type": "Organization", "name": "PegasusBot", "logo": { "@type": "ImageObject", "url": "https://pegasusbot.app/favicon.ico" } }
  };

  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <div className="relative min-h-screen bg-black pt-48 pb-32 overflow-hidden selection:bg-white selection:text-black">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-white/[0.03]" />

        <div className="max-w-4xl mx-auto px-6 lg:px-24 relative z-10">
          <Breadcrumbs items={[
            { name: 'Home', url: '/' },
            { name: 'Guides', url: '/guides' },
            { name: 'Server Setup', url: '/guides/discord-server-setup' }
          ]} />

          <div className="mb-24 mt-12">
            <div className="inline-flex items-center text-white/30 text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 px-4 py-2">
              // DEPLOYMENT_GUIDE
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-8 uppercase leading-[0.9]">
              {t('heroTitle')}
            </h1>
            <p className="text-white/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </div>

          <div className="w-full h-px bg-white/10 mb-16" />

          {/* Table of Contents */}
          <div className="border border-white/10 bg-[#050505] p-8 mb-24">
            <h2 className="text-sm font-medium text-white uppercase tracking-[0.3em] mb-6">Table of Contents</h2>
            <div className="space-y-3">
              {[
                { id: 'step-1', label: 'Step 1: Planning Your Categories & Channels' },
                { id: 'step-2', label: 'Step 2: Setting Up Roles and Permissions' },
                { id: 'step-3', label: 'Step 3: Inviting PegasusBot for Automod' },
                { id: 'step-4', label: 'Step 4: Configuring Welcome Messages' },
              ].map((item) => (
                <a key={item.id} href={`#${item.id}`} className="flex items-center gap-3 text-white/40 hover:text-white text-sm transition-colors group">
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /> {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Step 1 */}
          <section id="step-1" className="mb-24">
            <div className="flex items-center gap-4 mb-8">
              <Settings className="w-6 h-6 text-white/30" />
              <h2 className="text-2xl font-medium text-white uppercase tracking-[0.2em]">Step 1: Categories & Channels</h2>
            </div>
            <div className="pl-10 space-y-4 text-white/40 text-sm font-light leading-relaxed">
              <p>The foundation of a good Discord server is its channel structure. Don&apos;t overwhelm new members with 50 channels. Start small.</p>
              <div className="border border-white/10 bg-[#050505] p-6 space-y-3">
                {[
                  { title: 'Information', desc: '#rules, #announcements, #faq' },
                  { title: 'Community', desc: '#general, #memes, #introductions' },
                  { title: 'Support', desc: '#create-a-ticket, #help-forum' },
                ].map((c) => (
                  <div key={c.title} className="flex items-start gap-3">
                    <div className="w-1 h-1 bg-white mt-2 flex-shrink-0" />
                    <div><strong className="text-white text-xs uppercase tracking-[0.2em]">{c.title}:</strong> <span className="text-white/40 font-mono text-xs">{c.desc}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section id="step-2" className="mb-24">
            <div className="flex items-center gap-4 mb-8">
              <Users className="w-6 h-6 text-white/30" />
              <h2 className="text-2xl font-medium text-white uppercase tracking-[0.2em]">Step 2: Roles and Permissions</h2>
            </div>
            <div className="pl-10 space-y-4 text-white/40 text-sm font-light leading-relaxed">
              <p>Discord&apos;s permission hierarchy can be confusing. The golden rule is: <strong className="text-white">never give standard members the Administrator permission</strong>.</p>
              <p>Create a hierarchical role structure: Owner → Admin → Moderator → Verified Member → @everyone. Use <Link href="/features/moderation" className="text-white underline underline-offset-4 hover:text-white/80 transition-colors">PegasusBot&apos;s Reaction Roles</Link> to allow users to self-assign cosmetic roles safely.</p>
            </div>
          </section>

          {/* Step 3 */}
          <section id="step-3" className="mb-24">
            <div className="flex items-center gap-4 mb-8">
              <ShieldCheck className="w-6 h-6 text-white/30" />
              <h2 className="text-2xl font-medium text-white uppercase tracking-[0.2em]">Step 3: Securing with PegasusBot</h2>
            </div>
            <div className="pl-10 space-y-4 text-white/40 text-sm font-light leading-relaxed">
              <p>As soon as your server goes public, it becomes a target for spam bots and raiders. You must set up Automod immediately.</p>
              <div className="border border-white/10 bg-[#050505] p-6">
                <h4 className="text-white text-xs uppercase tracking-[0.3em] mb-3">// PRO_TIP: ENABLE ANTI-RAID</h4>
                <p className="text-white/40 text-sm font-light">Log into the PegasusBot dashboard, navigate to the Automod section, and enable <strong className="text-white">Anti-Raid</strong>. This will automatically lock the server if too many accounts join simultaneously.</p>
              </div>
            </div>
          </section>

          {/* Step 4 */}
          <section id="step-4" className="mb-32">
            <h2 className="text-2xl font-medium text-white uppercase tracking-[0.2em] mb-8 pl-10">Step 4: Welcome Messages</h2>
            <div className="pl-10 text-white/40 text-sm font-light leading-relaxed">
              <p>A warm welcome increases user retention. Use PegasusBot to send a customized welcome image card when a user joins, pointing them to the rules channel.</p>
            </div>
          </section>

          <div className="w-full h-px bg-white/10 mb-24" />
          
          <div className="border border-white/10 bg-[#050505] p-12 text-center">
            <h3 className="text-2xl font-medium text-white mb-6 uppercase tracking-[0.2em]">Ready to launch your server?</h3>
            <p className="text-white/40 text-sm font-light mb-8">Add PegasusBot now to get all the tools you need in one place.</p>
            <Link href="/api/auth/signin" className="group inline-flex items-center px-8 py-4 bg-white text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-zinc-200 transition-colors">
              Invite PegasusBot
              <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
