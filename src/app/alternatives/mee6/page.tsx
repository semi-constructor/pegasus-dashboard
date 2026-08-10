import React from 'react';
import { getTranslations } from 'next-intl/server';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CheckCircle2, XCircle, Shield, Zap, Ticket } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'seo.mee6Alt' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pegasusbot.app';

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: '/alternatives/mee6',
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `${baseUrl}/alternatives/mee6`,
    },
  };
}

export default async function Mee6AlternativePage() {
  const t = await getTranslations('seo.mee6Alt');

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": t('metaTitle'),
    "description": t('metaDescription'),
    "author": {
      "@type": "Organization",
      "name": "PegasusBot"
    }
  };

  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: 'Alternatives', url: '/alternatives' },
          { name: 'MEE6 Alternative', url: '/alternatives/mee6' }
        ]} />

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 mt-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6 drop-shadow-sm">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/api/auth/signin" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              {t('cta1')}
            </Link>
            <Link href="/#features" className="px-8 py-4 bg-zinc-800/50 hover:bg-zinc-800 text-white rounded-xl font-medium transition-colors border border-zinc-700 backdrop-blur-sm">
              {t('cta2')}
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">{t('comparisonTitle')}</h2>
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-800/20">
                  <th className="p-6 text-zinc-400 font-medium w-1/3">Feature</th>
                  <th className="p-6 text-zinc-400 font-medium text-center w-1/3">MEE6</th>
                  <th className="p-6 text-emerald-400 font-bold text-center text-xl w-1/3 border-l border-zinc-800/50">PegasusBot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {[
                  ['Custom Rank Cards', false, true],
                  ['Advanced Automod', false, true],
                  ['Ticket System', false, true],
                  ['Custom Commands', 'Limited', 'Unlimited'],
                  ['Economy System', 'Basic', 'Advanced'],
                  ['Reaction Roles', 'Paywalled', '100% Free']
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="p-6 font-medium text-zinc-300">{row[0]}</td>
                    <td className="p-6 text-center">
                      {row[1] === false ? <XCircle className="w-6 h-6 text-red-500/70 mx-auto" /> : <span className="text-zinc-500">{row[1]}</span>}
                    </td>
                    <td className="p-6 text-center bg-emerald-500/5 border-l border-zinc-800/50 group-hover:bg-emerald-500/10 transition-colors">
                      {row[2] === true ? <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> : <span className="text-emerald-400 font-medium">{row[2]}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">{t('featuresTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 hover:border-emerald-500/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <Zap className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('feature1.title')}</h3>
              <p className="text-zinc-400 leading-relaxed">{t('feature1.desc')}</p>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 hover:border-emerald-500/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <Shield className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('feature2.title')}</h3>
              <p className="text-zinc-400 leading-relaxed">{t('feature2.desc')}</p>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 hover:border-emerald-500/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <Ticket className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('feature3.title')}</h3>
              <p className="text-zinc-400 leading-relaxed">{t('feature3.desc')}</p>
            </div>
          </div>
        </div>

        {/* Migration Guide */}
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-10 border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-3xl font-bold mb-10 relative z-10">{t('migrationTitle')}</h2>
          <div className="space-y-8 relative z-10">
            <div className="flex gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-2xl flex-shrink-0 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">{t('migrationStep1Title')}</h3>
                <p className="text-zinc-400 leading-relaxed">{t('migrationStep1Desc')}</p>
              </div>
            </div>
            <div className="flex gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-2xl flex-shrink-0 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">{t('migrationStep2Title')}</h3>
                <p className="text-zinc-400 leading-relaxed">{t('migrationStep2Desc')}</p>
              </div>
            </div>
            <div className="flex gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-2xl flex-shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.1)]">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2">{t('migrationStep3Title')}</h3>
                <p className="text-zinc-400 leading-relaxed">{t('migrationStep3Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
