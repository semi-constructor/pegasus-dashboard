import React from 'react';
import { getTranslations } from 'next-intl/server';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Copy, FileText, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'seo.resourcesRules' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pegasusbot.app';

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: '/resources/discord-rules-template',
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'article',
      url: `${baseUrl}/resources/discord-rules-template`,
    },
  };
}

export default async function DiscordRulesTemplatePage() {
  const t = await getTranslations('seo.resourcesRules');

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

  const simpleRules = `1. Be respectful to everyone. No harassment, sexism, racism, or hate speech.
2. No spam or self-promotion (server invites, advertisements, etc) without permission.
3. No NSFW or obscene content. This includes text, images, or links featuring nudity, sex, hard violence, or other graphically disturbing content.
4. If you see something against the rules or something that makes you feel unsafe, let staff know. We want this server to be a welcoming space!
5. Follow the Discord Community Guidelines and Terms of Service.`;

  const gamingRules = `1. **Respect all members**. Trash talk in games is fine, but do not cross the line into personal attacks or hate speech.
2. **No cheating or exploiting**. We do not tolerate discussions about hacks or exploits for any games.
3. **Use the correct channels**. Keep LFG (Looking for Group) requests in the designated channels.
4. **No earrape or mic spamming**. Be considerate of others in voice channels.
5. **Listen to the moderators**. Their word is final.`;

  const securityRules = `1. **Verification Required**. All new members must complete the captcha verification in #verify.
2. **No suspicious links**. Do not click on random links sent in DMs or channels. If an account is compromised, it will be banned.
3. **No Alt Accounts**. Bypassing bans or mutes with alternate accounts will result in a permanent IP ban.
4. **Use 2FA**. We strongly recommend enabling Two-Factor Authentication on your Discord account.
5. **Report scams**. If someone DMs you offering free Nitro, report them to the staff immediately.`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I make good Discord server rules?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Good Discord server rules should be clear, concise, and easy to read. Avoid massive walls of text. Use bullet points and bold important keywords. Most importantly, state the consequences of breaking the rules clearly."
        }
      },
      {
        "@type": "Question",
        "name": "How do I enforce rules automatically on Discord?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can enforce rules automatically by using a moderation bot like PegasusBot. You can set up auto-moderation filters to automatically delete bad words, prevent spam, and issue warnings or timeouts to users who violate the rules."
        }
      },
      {
        "@type": "Question",
        "name": "How do I add an agree button to Discord rules?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To add an agree button, you can use Discord's native 'Rules Screening' feature in Server Settings, or use a bot like PegasusBot to create a Reaction Role or Button that assigns a 'Verified' role when clicked, unlocking the rest of the server."
        }
      }
    ]
  };

  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: 'Resources', url: '/resources' },
          { name: 'Discord Rules Copy and Paste', url: '/resources/discord-rules-template' }
        ]} />

        <header className="text-center mb-16 mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 font-medium mb-8 border border-purple-500/20">
            <FileText className="w-4 h-4" /> Free SEO Optimized Resource
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400 mb-6 drop-shadow-sm leading-tight">
            Discord Rules Copy and Paste Templates
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto">
            Setting up a new server? Don't write rules from scratch. Use our copy-and-paste Discord rules templates for general communities, gaming servers, and strict security policies.
          </p>
        </header>

        <div className="space-y-16">
          {/* Template 1 */}
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="bg-zinc-800/50 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> General Community Rules (Simple)
              </h2>
            </div>
            <div className="p-6">
              <pre className="text-zinc-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {simpleRules}
              </pre>
            </div>
            <div className="bg-zinc-900/50 px-6 py-4 border-t border-zinc-800 text-sm text-zinc-400">
              Ideal for small to medium-sized general chat servers.
            </div>
          </div>

          {/* Template 2 */}
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="bg-zinc-800/50 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400" /> Gaming Community Rules
              </h2>
            </div>
            <div className="p-6">
              <pre className="text-zinc-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {gamingRules}
              </pre>
            </div>
            <div className="bg-zinc-900/50 px-6 py-4 border-t border-zinc-800 text-sm text-zinc-400">
              Geared towards esports, LFG, and general gaming communities.
            </div>
          </div>

          {/* Template 3 */}
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="bg-zinc-800/50 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-red-400" /> Discord Security Policy Template
              </h2>
            </div>
            <div className="p-6">
              <pre className="text-zinc-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {securityRules}
              </pre>
            </div>
            <div className="bg-zinc-900/50 px-6 py-4 border-t border-zinc-800 text-sm text-zinc-400">
              Perfect for large servers that need strict anti-raid and anti-scam policies.
            </div>
          </div>
        </div>

        <div className="mt-20 prose prose-invert max-w-none">
          <h2>How to Enforce Rules on Discord</h2>
          <p>
            Copying and pasting rules is only the first step. To maintain a healthy community, you need to enforce them.
          </p>
          <ol>
            <li><strong>Use an Auto-Moderator:</strong> Add <a href="/">PegasusBot</a> to automatically filter out bad words, phishing links, and spam.</li>
            <li><strong>Create a Verification Gate:</strong> Don't let users see your server until they click an "I Agree" button below your rules.</li>
            <li><strong>Assign Moderators:</strong> Build a team of trusted moderators to enforce the rules manually when bots miss nuance.</li>
          </ol>

          <h2 className="mt-16">Frequently Asked Questions</h2>
          
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold">How do I make good Discord server rules?</h3>
              <p className="text-zinc-400 mt-2">Good Discord server rules should be clear, concise, and easy to read. Avoid massive walls of text. Use bullet points and bold important keywords. Most importantly, state the consequences of breaking the rules clearly.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold">How do I enforce rules automatically on Discord?</h3>
              <p className="text-zinc-400 mt-2">You can enforce rules automatically by using a moderation bot like PegasusBot. You can set up auto-moderation filters to automatically delete bad words, prevent spam, and issue warnings or timeouts to users who violate the rules.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold">How do I add an agree button to Discord rules?</h3>
              <p className="text-zinc-400 mt-2">To add an agree button, you can use Discord's native 'Rules Screening' feature in Server Settings, or use a bot like PegasusBot to create a Reaction Role or Button that assigns a 'Verified' role when clicked, unlocking the rest of the server.</p>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
