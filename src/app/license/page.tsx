import React from 'react';
import { getTranslations, getLocale } from 'next-intl/server';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  Check,
  X,
  GitFork,
  Code2,
  Users,
  Building2,
  Scale,
  ShieldCheck,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { Metadata } from 'next';
import { readFile } from 'fs/promises';
import path from 'path';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({
    locale,
    namespace: 'seo.license',
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://pegasusbot.app';

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: '/license',
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `${baseUrl}/license`,
    },
  };
}

type Permission = {
  title: string;
  description: string;
  allowed: boolean;
  icon: React.ElementType;
};

export default async function LicensePage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'seo.license' });

  /*
   * Keep the official PolyForm license text unmodified.
   *
   * Place the official text at:
   *
   * public/licenses/polyform-noncommercial-1.0.0.txt
   *
   * Source:
   * https://polyformproject.org/licenses/noncommercial/1.0.0
   */
  const licensePath = path.join(
    process.cwd(),
    'public',
    'licenses',
    'polyform-noncommercial-1.0.0.txt'
  );

  let licenseText = '';

  try {
    licenseText = await readFile(licensePath, 'utf8');
  } catch {
    licenseText = t('licenseLoadError');
  }

  const permissions: Permission[] = [
    {
      title: t('permissions.clone.title'),
      description: t('permissions.clone.description'),
      allowed: true,
      icon: GitFork,
    },
    {
      title: t('permissions.modify.title'),
      description: t('permissions.modify.description'),
      allowed: true,
      icon: Code2,
    },
    {
      title: t('permissions.selfHost.title'),
      description: t('permissions.selfHost.description'),
      allowed: true,
      icon: ShieldCheck,
    },
    {
      title: t('permissions.redistribute.title'),
      description: t('permissions.redistribute.description'),
      allowed: true,
      icon: Users,
    },
    {
      title: t('permissions.commercialUse.title'),
      description: t('permissions.commercialUse.description'),
      allowed: false,
      icon: Building2,
    },
    {
      title: t('permissions.commercialRedistribution.title'),
      description: t('permissions.commercialRedistribution.description'),
      allowed: false,
      icon: X,
    },
    {
      title: t('permissions.paidHosting.title'),
      description: t('permissions.paidHosting.description'),
      allowed: false,
      icon: Building2,
    },
    {
      title: t('permissions.brandUsage.title'),
      description: t('permissions.brandUsage.description'),
      allowed: false,
      icon: Scale,
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: t('schemaName'),
    description: t('metaDescription'),
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pegasusbot.app'}/license`,
    encodingFormat: 'text/plain',
    license: 'https://polyformproject.org/licenses/noncommercial/1.0.0/',
    copyrightHolder: {
      '@type': 'Person',
      name: 'semiconstructor',
    },
  };

  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <div className="relative min-h-screen bg-background pt-48 pb-32 overflow-hidden selection:bg-foreground selection:text-background">
        {/* Architectural background */}
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-foreground/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-foreground/[0.03]" />

        <div className="max-w-6xl mx-auto px-6 lg:px-24 relative z-10">
          <Breadcrumbs
            items={[
              { name: t('breadcrumbs.home'), url: '/' },
              { name: t('breadcrumbs.license'), url: '/license' },
            ]}
          />

          {/* Hero */}
          <div className="mt-16 mb-24 max-w-4xl">
            <div className="inline-flex items-center text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
              <FileText className="w-4 h-4 mr-3 text-foreground/40" />
              {t('hero.eyebrow')}
            </div>

            <h1 className="text-6xl md:text-8xl font-medium tracking-tighter text-foreground mb-8 uppercase leading-[0.9]">
              {t('hero.title')}
            </h1>

            <p className="text-xl md:text-2xl text-foreground/40 font-light max-w-3xl leading-relaxed">
              {t('hero.description')}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="https://polyformproject.org/licenses/noncommercial/1.0.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center px-7 py-4 bg-foreground text-background text-sm font-bold tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
              >
                {t('hero.primaryCta')}
                <ExternalLink className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#full-license"
                className="inline-flex items-center justify-center px-7 py-4 bg-transparent border border-border text-foreground text-sm font-bold tracking-[0.2em] uppercase hover:border-border/50 transition-colors"
              >
                {t('hero.secondaryCta')}
              </a>
            </div>
          </div>

          <div className="w-full h-px bg-foreground/10 mb-24" />

          {/* Quick Overview */}
          <section className="mb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div>
                <div className="text-foreground/30 text-xs tracking-[0.3em] uppercase mb-5">
                  {t('overview.eyebrow')}
                </div>

                <h2 className="text-4xl lg:text-5xl font-medium tracking-tighter uppercase text-foreground">
                  {t('overview.title')}
                </h2>
              </div>

              <p className="text-foreground/30 text-sm font-mono uppercase tracking-wider max-w-md leading-relaxed">
                {t('overview.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 border border-border">
              {permissions.map((permission) => {
                const Icon = permission.icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;

                return (
                  <div
                    key={permission.title}
                    className="bg-background p-8 lg:p-10 hover:bg-foreground/[0.02] transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-10">
                      <Icon
                        className={`w-7 h-7 transition-colors ${
                          permission.allowed
                            ? 'text-foreground/30 group-hover:text-foreground/60'
                            : 'text-red-500/40 group-hover:text-red-500/70'
                        }`}
                      />

                      <div
                        className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase ${
                          permission.allowed
                            ? 'text-foreground/30'
                            : 'text-red-500/50'
                        }`}
                      >
                        {permission.allowed ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            {t('permissions.allowed')}
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            {t('permissions.prohibited')}
                          </>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-medium tracking-tight uppercase text-foreground mb-4">
                      {permission.title}
                    </h3>

                    <p className="text-sm text-foreground/35 font-light leading-relaxed">
                      {permission.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Commercial licensing */}
          <section className="border border-border mb-32">
            <div className="p-10 lg:p-16 grid lg:grid-cols-[1fr_auto] gap-12 items-center">
              <div>
                <div className="text-foreground/30 text-xs tracking-[0.3em] uppercase mb-6">
                  {t('commercial.eyebrow')}
                </div>

                <h2 className="text-3xl lg:text-4xl font-medium tracking-tighter uppercase text-foreground mb-6">
                  {t('commercial.title')}
                </h2>

                <p className="text-foreground/40 font-light leading-relaxed max-w-2xl">
                  {t('commercial.description')}
                </p>
              </div>

              <div className="border border-border bg-[#050505] px-8 py-7 min-w-[240px]">
                <div className="text-foreground/20 text-[10px] tracking-[0.25em] uppercase mb-3">
                  {t('commercial.copyrightHolder')}
                </div>

                <div className="text-foreground font-mono text-sm tracking-wider">
                  semiconstructor
                </div>

                <div className="mt-5 h-px bg-foreground/10" />

                <div className="mt-5 text-foreground/30 text-[10px] tracking-[0.2em] uppercase">
                  2026 · Pegasus
                </div>
              </div>
            </div>
          </section>

          {/* License metadata */}
          <section className="mb-16">
            <div className="grid md:grid-cols-3 gap-px bg-foreground/10 border border-border">
              <div className="bg-background p-8">
                <div className="text-foreground/20 text-[10px] tracking-[0.25em] uppercase mb-4">
                  {t('metadata.licenseLabel')}
                </div>

                <div className="text-foreground text-lg font-medium uppercase tracking-tight">
                  PolyForm
                </div>

                <div className="text-foreground/30 text-sm mt-2">
                  Noncommercial 1.0.0
                </div>
              </div>

              <div className="bg-background p-8">
                <div className="text-foreground/20 text-[10px] tracking-[0.25em] uppercase mb-4">
                  {t('metadata.modelLabel')}
                </div>

                <div className="text-foreground text-lg font-medium uppercase tracking-tight">
                  {t('metadata.sourceAvailable')}
                </div>

                <div className="text-foreground/30 text-sm mt-2">
                  {t('metadata.notOpenSource')}
                </div>
              </div>

              <div className="bg-background p-8">
                <div className="text-foreground/20 text-[10px] tracking-[0.25em] uppercase mb-4">
                  {t('metadata.copyrightLabel')}
                </div>

                <div className="text-foreground text-lg font-medium uppercase tracking-tight">
                  semiconstructor
                </div>

                <div className="text-foreground/30 text-sm mt-2">
                  {t('metadata.contributors')}
                </div>
              </div>
            </div>
          </section>

          {/* Full License */}
          <section id="full-license" className="scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
              <div>
                <div className="text-foreground/30 text-xs tracking-[0.3em] uppercase mb-5">
                  {t('fullLicense.eyebrow')}
                </div>

                <h2 className="text-4xl lg:text-5xl font-medium tracking-tighter uppercase text-foreground">
                  {t('fullLicense.title')}
                </h2>
              </div>

              <a
                href="https://polyformproject.org/licenses/noncommercial/1.0.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-foreground/40 hover:text-foreground text-xs font-mono uppercase tracking-wider transition-colors"
              >
                {t('fullLicense.officialSource')}
                <ExternalLink className="w-3.5 h-3.5 ml-2" />
              </a>
            </div>

            <div className="border border-border bg-[#050505]">
              {/* Document header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 lg:px-10 py-5 border-b border-border">
                <div className="flex items-center gap-4">
                  <span className="w-2 h-2 bg-foreground/40" />

                  <span className="text-foreground/50 text-[10px] font-mono tracking-[0.25em] uppercase">
                    LICENSE.txt
                  </span>
                </div>

                <span className="text-foreground/20 text-[10px] font-mono tracking-wider uppercase">
                  PolyForm Noncommercial 1.0.0
                </span>
              </div>

              {/* License content */}
              <div className="p-6 lg:p-12 overflow-x-auto">
                <pre className="whitespace-pre-wrap break-words text-foreground/55 text-sm leading-8 font-mono">
                  {licenseText}
                </pre>
              </div>
            </div>
          </section>

          {/* Footer legal note */}
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row gap-6 justify-between">
            <p className="text-foreground/20 text-xs font-mono uppercase tracking-wider leading-relaxed max-w-2xl">
              {t('footer.note')}
            </p>

            <a
              href="https://polyformproject.org/licenses/noncommercial/1.0.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-foreground/30 hover:text-foreground text-xs font-mono uppercase tracking-wider transition-colors"
            >
              {t('footer.officialLink')} ↗
            </a>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
