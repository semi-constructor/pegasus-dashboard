import React from 'react';
import { getTranslations } from 'next-intl/server';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ShieldAlert, Eye, Lock, Activity, Settings, UserX, CheckCircle2, ArrowRight } from 'lucide-react';
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

  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <div className="relative min-h-screen bg-background pt-48 pb-32 overflow-hidden selection:bg-foreground selection:text-background">
        {/* Architectural background lines */}
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-foreground/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-foreground/[0.03]" />
        
        <div className="max-w-6xl mx-auto px-6 lg:px-24 relative z-10">
          <Breadcrumbs items={[
            { name: 'Home', url: '/' },
            { name: 'Features', url: '/features' },
            { name: 'Moderation', url: '/features/moderation' }
          ]} />

          {/* Hero Section */}
          <div className="mb-32 mt-16 max-w-4xl">
            <div className="inline-flex items-center text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
              <ShieldAlert className="w-4 h-4 mr-3 text-red-500/50" />
              // Server Protection
            </div>
            
            <h1 className="text-6xl md:text-8xl font-medium tracking-tighter text-foreground mb-8 uppercase leading-[0.9]">
              {t('heroTitle')}
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/40 font-light max-w-2xl leading-relaxed mb-12">
              {t('heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/api/auth/signin" className="group flex items-center justify-center px-8 py-4 bg-foreground text-background text-sm font-bold tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors">
                Protect Your Server
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/docs/commands#moderation" className="group flex items-center justify-center px-8 py-4 bg-transparent border border-border text-foreground text-sm font-bold tracking-[0.2em] uppercase hover:border-border/50 transition-colors">
                View Commands
              </Link>
            </div>
          </div>

          <div className="w-full h-px bg-foreground/10 mb-24" />

          {/* Interactive Features Grid */}
          <div className="grid md:grid-cols-3 gap-px bg-foreground/10 border border-border mb-32">
            <div className="bg-background p-12 hover:bg-foreground/[0.02] transition-colors group">
              <Settings className="w-8 h-8 text-foreground/30 mb-8 group-hover:text-foreground transition-colors" />
              <h3 className="text-2xl font-medium tracking-tighter uppercase text-foreground mb-4">{t('feature1.title')}</h3>
              <p className="text-foreground/40 font-light leading-relaxed">{t('feature1.desc')}</p>
            </div>
            
            <div className="bg-background p-12 hover:bg-foreground/[0.02] transition-colors group">
              <Activity className="w-8 h-8 text-foreground/30 mb-8 group-hover:text-foreground transition-colors" />
              <h3 className="text-2xl font-medium tracking-tighter uppercase text-foreground mb-4">{t('feature2.title')}</h3>
              <p className="text-foreground/40 font-light leading-relaxed">{t('feature2.desc')}</p>
            </div>

            <div className="bg-background p-12 hover:bg-foreground/[0.02] transition-colors group">
              <Lock className="w-8 h-8 text-foreground/30 mb-8 group-hover:text-foreground transition-colors" />
              <h3 className="text-2xl font-medium tracking-tighter uppercase text-foreground mb-4">{t('feature3.title')}</h3>
              <p className="text-foreground/40 font-light leading-relaxed">{t('feature3.desc')}</p>
            </div>
          </div>

          {/* Feature Showcase / UI Mockup */}
          <div className="border border-border p-12 lg:p-24 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 pb-4 border-b border-border inline-block">
                // AUTOMATED DEFENSE
              </div>
              <h2 className="text-4xl lg:text-5xl font-medium tracking-tighter uppercase text-foreground mb-8">Stop trolls before they strike.</h2>
              <p className="text-lg text-foreground/50 font-light mb-12 leading-relaxed">
                PegasusBot's automod runs 24/7, catching spam, self-promotion, and malicious links the millisecond they are sent. Configure custom punishment paths based on user offenses.
              </p>
              
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-foreground/60 font-light tracking-wide uppercase text-sm">
                  <span className="w-6 shrink-0 text-foreground/20">/</span> Anti-Spam & Anti-Raid
                </li>
                <li className="flex items-center gap-4 text-foreground/60 font-light tracking-wide uppercase text-sm">
                  <span className="w-6 shrink-0 text-foreground/20">/</span> Word Blacklist & Link Filtering
                </li>
                <li className="flex items-center gap-4 text-foreground/60 font-light tracking-wide uppercase text-sm">
                  <span className="w-6 shrink-0 text-foreground/20">/</span> Auto-mute & Auto-ban Escalation
                </li>
              </ul>
            </div>
            
            {/* Minimalist Log Display */}
            <div className="border border-border bg-[#050505] p-8 font-mono text-sm">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <span className="text-foreground/50 tracking-[0.2em] uppercase">Audit_Log.exe</span>
                <Eye className="w-4 h-4 text-foreground/20" />
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <span className="text-red-500/50 mt-1">[-]</span>
                  <div>
                    <p className="text-foreground tracking-widest uppercase">Message_Deleted</p>
                    <p className="text-foreground/30 mt-1 text-xs">User posted a phishing link.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <span className="text-orange-500/50 mt-1">[!]</span>
                  <div>
                    <p className="text-foreground tracking-widest uppercase">User_Muted (10m)</p>
                    <p className="text-foreground/30 mt-1 text-xs">Spamming in #general.</p>
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
