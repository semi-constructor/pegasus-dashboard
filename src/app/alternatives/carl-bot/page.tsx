import React from 'react';
import { getTranslations } from 'next-intl/server';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Check, X, MousePointerClick, ShieldCheck, Ticket, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'seo.carlAlt' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pegasusbot.app';

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/alternatives/carl-bot' },
    openGraph: { title: t('metaTitle'), description: t('metaDescription'), url: `${baseUrl}/alternatives/carl-bot` },
  };
}

export default async function CarlBotAlternativePage() {
  const t = await getTranslations('seo.carlAlt');

  const schema = {
    "@context": "https://schema.org", "@type": "Article",
    "headline": t('metaTitle'), "description": t('metaDescription'),
    "author": { "@type": "Organization", "name": "PegasusBot" }
  };

  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <div className="relative min-h-screen bg-black pt-48 pb-32 overflow-hidden selection:bg-white selection:text-black">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-white/[0.03]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">
          <Breadcrumbs items={[
            { name: 'Home', url: '/' },
            { name: 'Alternatives', url: '/alternatives' },
            { name: 'Carl-bot Alternative', url: '/alternatives/carl-bot' }
          ]} />

          <div className="max-w-4xl mb-32 mt-12">
            <div className="inline-flex items-center text-white/30 text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 px-4 py-2">
              // COMPARISON_ANALYSIS
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-8 uppercase leading-[0.9]">
              {t('heroTitle')}
            </h1>
            <p className="text-white/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed mb-12">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/api/auth/signin" className="group inline-flex items-center px-8 py-4 bg-white text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-zinc-200 transition-colors">
                {t('cta1')} <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link href="/#features" className="inline-flex items-center px-8 py-4 border border-white/10 text-white/50 text-xs font-bold tracking-[0.3em] uppercase hover:text-white hover:border-white/30 transition-all">
                {t('cta2')}
              </Link>
            </div>
          </div>

          <div className="w-full h-px bg-white/10 mb-24" />

          <div className="mb-32">
            <h2 className="text-2xl tracking-[0.2em] font-medium text-white mb-12 uppercase border-l-2 border-white pl-6">{t('comparisonTitle')}</h2>
            <div className="overflow-x-auto border border-white/10 bg-[#050505]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-6 text-white/30 text-xs font-medium uppercase tracking-[0.3em] w-1/3">Feature</th>
                    <th className="p-6 text-white/30 text-xs font-medium uppercase tracking-[0.3em] text-center w-1/3">Carl-bot</th>
                    <th className="p-6 text-white text-xs font-medium uppercase tracking-[0.3em] text-center w-1/3 border-l border-white/10">Pegasus</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Setup Difficulty', 'Hard (Commands)', 'Easy (Dashboard)'],
                    ['Reaction Roles', 'Yes', 'Yes (Visual Builder)'],
                    ['Ticket System', false, true],
                    ['Economy System', false, true],
                    ['Giveaways', false, true],
                    ['Dashboard UX', 'Outdated', 'Modern & Premium']
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-6 text-sm text-white/60 uppercase tracking-[0.1em]">{row[0]}</td>
                      <td className="p-6 text-center">
                        {row[1] === false ? <X className="w-4 h-4 text-white/20 mx-auto" /> : <span className="text-white/30 text-xs uppercase tracking-[0.2em]">{row[1]}</span>}
                      </td>
                      <td className="p-6 text-center border-l border-white/10 bg-white/[0.02]">
                        {row[2] === true ? <Check className="w-4 h-4 text-white mx-auto" /> : <span className="text-white text-xs uppercase tracking-[0.2em]">{row[2]}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-32">
            <h2 className="text-2xl tracking-[0.2em] font-medium text-white mb-12 uppercase border-l-2 border-white pl-6">{t('featuresTitle')}</h2>
            <div className="grid md:grid-cols-3 gap-px bg-white/10">
              {[
                { icon: MousePointerClick, titleKey: 'feature1.title', descKey: 'feature1.desc' },
                { icon: ShieldCheck, titleKey: 'feature2.title', descKey: 'feature2.desc' },
                { icon: Ticket, titleKey: 'feature3.title', descKey: 'feature3.desc' },
              ].map((f) => (
                <div key={f.titleKey} className="bg-[#050505] p-8 hover:bg-white/[0.02] transition-colors group">
                  <f.icon className="w-6 h-6 text-white/30 group-hover:text-white transition-colors mb-6" />
                  <h3 className="text-lg font-medium text-white mb-3 uppercase tracking-[0.1em]">{t(f.titleKey)}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-light">{t(f.descKey)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/10 bg-[#050505] p-12">
            <h2 className="text-2xl tracking-[0.2em] font-medium text-white mb-12 uppercase">{t('migrationTitle')}</h2>
            <div className="space-y-8">
              {[
                { step: '01', titleKey: 'migrationStep1Title', descKey: 'migrationStep1Desc' },
                { step: '02', titleKey: 'migrationStep2Title', descKey: 'migrationStep2Desc' },
                { step: '03', titleKey: 'migrationStep3Title', descKey: 'migrationStep3Desc' },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 items-start border-b border-white/5 pb-8 last:border-0">
                  <span className="text-3xl font-medium tracking-tighter text-white/20 font-mono flex-shrink-0">{item.step}</span>
                  <div>
                    <h3 className="text-white font-medium text-sm uppercase tracking-[0.2em] mb-3">{t(item.titleKey)}</h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed">{t(item.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
