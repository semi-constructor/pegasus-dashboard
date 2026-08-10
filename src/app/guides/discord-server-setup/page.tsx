import React from 'react';
import { getTranslations } from 'next-intl/server';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BookOpen, ShieldCheck, Settings, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'seo.guidesSetup' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pegasusbot.app';

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: '/guides/discord-server-setup',
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'article',
      url: `${baseUrl}/guides/discord-server-setup`,
    },
  };
}

export default async function DiscordServerSetupGuide() {
  const t = await getTranslations('seo.guidesSetup');

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": t('metaTitle'),
    "description": t('metaDescription'),
    "author": {
      "@type": "Organization",
      "name": "PegasusBot"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PegasusBot",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pegasusbot.app/favicon.ico"
      }
    }
  };

  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
          { name: 'Server Setup', url: '/guides/discord-server-setup' }
        ]} />

        <article className="prose prose-invert prose-emerald lg:prose-lg mx-auto">
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 font-medium mb-8 border border-blue-500/20">
              <BookOpen className="w-4 h-4" /> Ultimate Guide
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-6 drop-shadow-sm leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto">
              {t('heroSubtitle')}
            </p>
          </header>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 mb-12 shadow-2xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 text-white mt-0">Table of Contents</h2>
            <ul className="space-y-3 m-0 list-none pl-0">
              <li><a href="#step-1" className="text-emerald-400 hover:text-emerald-300 no-underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Step 1: Planning Your Categories & Channels</a></li>
              <li><a href="#step-2" className="text-emerald-400 hover:text-emerald-300 no-underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Step 2: Setting Up Roles and Permissions</a></li>
              <li><a href="#step-3" className="text-emerald-400 hover:text-emerald-300 no-underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Step 3: Inviting PegasusBot for Automod</a></li>
              <li><a href="#step-4" className="text-emerald-400 hover:text-emerald-300 no-underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Step 4: Configuring Welcome Messages</a></li>
            </ul>
          </div>

          <h2 id="step-1" className="flex items-center gap-3 text-3xl font-bold mt-16 mb-6">
            <Settings className="w-8 h-8 text-emerald-500" /> Step 1: Categories & Channels
          </h2>
          <p>
            The foundation of a good Discord server is its channel structure. Don't overwhelm new members with 50 channels. Start small. 
            We recommend the following category layout:
          </p>
          <ul>
            <li><strong>Information:</strong> #rules, #announcements, #faq</li>
            <li><strong>Community:</strong> #general, #memes, #introductions</li>
            <li><strong>Support:</strong> #create-a-ticket, #help-forum</li>
          </ul>

          <h2 id="step-2" className="flex items-center gap-3 text-3xl font-bold mt-16 mb-6">
            <Users className="w-8 h-8 text-emerald-500" /> Step 2: Roles and Permissions
          </h2>
          <p>
            Discord's permission hierarchy can be confusing. The golden rule is: <strong>never give standard members the Administrator permission</strong>.
          </p>
          <p>
            Create a hierarchical role structure: Owner &rarr; Admin &rarr; Moderator &rarr; Verified Member &rarr; @everyone.
            Use <Link href="/features/moderation" className="text-emerald-400 hover:text-emerald-300 font-medium">PegasusBot's Reaction Roles</Link> to allow users to self-assign cosmetic roles safely.
          </p>

          <h2 id="step-3" className="flex items-center gap-3 text-3xl font-bold mt-16 mb-6">
            <ShieldCheck className="w-8 h-8 text-emerald-500" /> Step 3: Securing with PegasusBot
          </h2>
          <p>
            As soon as your server goes public, it becomes a target for spam bots and raiders. 
            You must set up Automod immediately.
          </p>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 my-8">
            <h4 className="text-emerald-400 font-bold m-0 mb-2">Pro Tip: Enable Anti-Raid</h4>
            <p className="text-zinc-300 m-0">
              Log into the PegasusBot dashboard, navigate to the Automod section, and enable <strong>Anti-Raid</strong>. This will automatically lock the server if too many accounts join simultaneously.
            </p>
          </div>

          <h2 id="step-4" className="flex items-center gap-3 text-3xl font-bold mt-16 mb-6">
            Step 4: Welcome Messages
          </h2>
          <p>
            A warm welcome increases user retention. Use PegasusBot to send a customized welcome image card when a user joins, pointing them to the rules channel.
          </p>

          <hr className="my-16 border-zinc-800" />
          
          <div className="text-center bg-zinc-900 rounded-3xl p-10 border border-zinc-800">
            <h3 className="text-2xl font-bold mb-4 text-white mt-0">Ready to launch your server?</h3>
            <p className="text-zinc-400 mb-8">Add PegasusBot now to get all the tools you need in one place.</p>
            <Link href="/api/auth/signin" className="inline-block px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)] no-underline">
              Invite PegasusBot
            </Link>
          </div>
        </article>
      </div>
    </MarketingLayout>
  );
}
