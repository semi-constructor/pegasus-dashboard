import React from 'react';
import { getTranslations } from 'next-intl/server';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ShieldAlert, Eye, Lock, Activity, Settings, UserX, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'seo.moderationFeature' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pegasusbot.app';

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: '/features/moderation',
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `${baseUrl}/features/moderation`,
    },
  };
}

export default async function ModerationFeaturePage() {
  const t = await getTranslations('seo.moderationFeature');

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PegasusBot Moderation",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Discord",
    "description": t('metaDescription'),
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is the automod completely free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, PegasusBot offers full automod capabilities including anti-spam, anti-link, and anti-caps completely free."
        }
      },
      {
        "@type": "Question",
        "name": "Can I view deleted messages?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the logging module keeps a detailed audit log of deleted and edited messages, role changes, and joins/leaves."
        }
      }
    ]
  };

  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: 'Features', url: '/features' },
          { name: 'Moderation', url: '/features/moderation' }
        ]} />

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20 mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 font-medium mb-8 border border-emerald-500/20">
            <ShieldAlert className="w-4 h-4" /> Server Protection
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6 drop-shadow-sm leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/api/auth/signin" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Protect Your Server
            </Link>
            <Link href="/docs/commands#moderation" className="px-8 py-4 bg-zinc-800/50 hover:bg-zinc-800 text-white rounded-xl font-medium transition-colors border border-zinc-700 backdrop-blur-sm">
              View Commands
            </Link>
          </div>
        </div>

        {/* Interactive Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 hover:border-emerald-500/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
              <Settings className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('feature1.title')}</h3>
            <p className="text-zinc-400 leading-relaxed">{t('feature1.desc')}</p>
          </div>
          
          <div className="p-8 rounded-3xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 hover:border-emerald-500/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
              <Activity className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('feature2.title')}</h3>
            <p className="text-zinc-400 leading-relaxed">{t('feature2.desc')}</p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 hover:border-emerald-500/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
              <Lock className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('feature3.title')}</h3>
            <p className="text-zinc-400 leading-relaxed">{t('feature3.desc')}</p>
          </div>
        </div>

        {/* Feature Showcase / UI Mockup */}
        <div className="mb-24 rounded-3xl bg-black border border-zinc-800 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
          <div className="p-10 lg:p-16 grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Stop trolls before they strike.</h2>
              <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                PegasusBot's automod runs 24/7, catching spam, self-promotion, and malicious links the millisecond they are sent. Configure custom punishment paths based on user offenses.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="text-emerald-400 w-5 h-5" /> Anti-Spam & Anti-Raid
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="text-emerald-400 w-5 h-5" /> Word Blacklist & Link Filtering
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="text-emerald-400 w-5 h-5" /> Auto-mute & Auto-ban Escalation
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
              <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                  <Eye className="w-5 h-5 text-zinc-400" />
                  <span className="font-semibold">Live Audit Log</span>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <UserX className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-400">Message Deleted</p>
                      <p className="text-sm text-zinc-400">User posted a phishing link.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-3 rounded-lg bg-zinc-800/50">
                    <ShieldAlert className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-400">User Muted (10m)</p>
                      <p className="text-sm text-zinc-400">Spamming in #general.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </MarketingLayout>
  );
}
