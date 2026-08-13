import React from 'react';
import { getTranslations } from 'next-intl/server';
import { MarketingLayout } from '@/components/MarketingLayout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FileText } from 'lucide-react';
import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'seo.resourcesRules' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pegasusbot.app';
  return {
    title: t('metaTitle'), description: t('metaDescription'),
    alternates: { canonical: '/resources/discord-rules-template' },
    openGraph: { title: t('metaTitle'), description: t('metaDescription'), type: 'article', url: `${baseUrl}/resources/discord-rules-template` },
  };
}

export default async function DiscordRulesTemplatePage() {
  const t = await getTranslations('seo.resourcesRules');

  const schema = {
    "@context": "https://schema.org", "@type": "Article",
    "headline": t('metaTitle'), "description": t('metaDescription'),
    "author": { "@type": "Organization", "name": "PegasusBot" }
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
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How do I make good Discord server rules?", "acceptedAnswer": { "@type": "Answer", "text": "Good Discord server rules should be clear, concise, and easy to read. Avoid massive walls of text. Use bullet points and bold important keywords. Most importantly, state the consequences of breaking the rules clearly." } },
      { "@type": "Question", "name": "How do I enforce rules automatically on Discord?", "acceptedAnswer": { "@type": "Answer", "text": "You can enforce rules automatically by using a moderation bot like PegasusBot. You can set up auto-moderation filters to automatically delete bad words, prevent spam, and issue warnings or timeouts to users who violate the rules." } },
      { "@type": "Question", "name": "How do I add an agree button to Discord rules?", "acceptedAnswer": { "@type": "Answer", "text": "To add an agree button, you can use Discord's native 'Rules Screening' feature in Server Settings, or use a bot like PegasusBot to create a Reaction Role or Button that assigns a 'Verified' role when clicked, unlocking the rest of the server." } }
    ]
  };

  const templates = [
    { label: 'TEMPLATE_01', title: 'General Community Rules (Simple)', content: simpleRules, note: 'Ideal for small to medium-sized general chat servers.' },
    { label: 'TEMPLATE_02', title: 'Gaming Community Rules', content: gamingRules, note: 'Geared towards esports, LFG, and general gaming communities.' },
    { label: 'TEMPLATE_03', title: 'Discord Security Policy Template', content: securityRules, note: 'Perfect for large servers that need strict anti-raid and anti-scam policies.' },
  ];

  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <div className="relative min-h-screen bg-background pt-48 pb-32 overflow-hidden selection:bg-foreground selection:text-background">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-foreground/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-foreground/[0.03]" />

        <div className="max-w-4xl mx-auto px-6 lg:px-24 relative z-10">
          <Breadcrumbs items={[
            { name: 'Home', url: '/' },
            { name: 'Resources', url: '/resources' },
            { name: 'Discord Rules Copy and Paste', url: '/resources/discord-rules-template' }
          ]} />

          <div className="mb-24 mt-12">
            <div className="inline-flex items-center gap-2 text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
              <FileText className="w-3 h-3" /> RESOURCE_ARCHIVE
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground mb-8 uppercase leading-[0.9]">
              Discord Rules<br/>Templates
            </h1>
            <p className="text-foreground/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed">
              Setting up a new server? Don&apos;t write rules from scratch. Use our copy-and-paste Discord rules templates for general communities, gaming servers, and strict security policies.
            </p>
          </div>

          <div className="w-full h-px bg-foreground/10 mb-16" />

          <div className="space-y-12 mb-32">
            {templates.map((tmpl) => (
              <div key={tmpl.label} className="border border-border bg-[#050505] overflow-hidden">
                <div className="px-8 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-sm font-medium text-foreground uppercase tracking-[0.2em]">{tmpl.title}</h2>
                  <span className="text-[10px] font-mono text-foreground/20 uppercase tracking-[0.3em]">{tmpl.label}</span>
                </div>
                <div className="p-8">
                  <pre className="text-foreground/50 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                    {tmpl.content}
                  </pre>
                </div>
                <div className="px-8 py-4 border-t border-border text-[10px] text-foreground/20 uppercase tracking-[0.3em]">
                  {tmpl.note}
                </div>
              </div>
            ))}
          </div>

          {/* Enforcement section */}
          <section className="mb-32">
            <h2 className="text-2xl font-medium text-foreground uppercase tracking-[0.2em] mb-8 border-l-2 border-border pl-6">How to Enforce Rules on Discord</h2>
            <div className="pl-6 md:pl-12 space-y-4 text-foreground/40 text-sm font-light leading-relaxed">
              <p>Copying and pasting rules is only the first step. To maintain a healthy community, you need to enforce them.</p>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Use an Auto-Moderator', desc: 'Add PegasusBot to automatically filter out bad words, phishing links, and spam.' },
                  { step: '02', title: 'Create a Verification Gate', desc: "Don't let users see your server until they click an \"I Agree\" button below your rules." },
                  { step: '03', title: 'Assign Moderators', desc: 'Build a team of trusted moderators to enforce the rules manually when bots miss nuance.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-6 items-start border border-border bg-[#050505] p-6">
                    <span className="text-2xl font-mono font-medium tracking-tighter text-foreground/20 flex-shrink-0">{item.step}</span>
                    <div>
                      <strong className="text-foreground text-xs uppercase tracking-[0.2em]">{item.title}</strong>
                      <p className="text-foreground/40 text-sm font-light mt-2">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-medium text-foreground uppercase tracking-[0.2em] mb-12 border-l-2 border-border pl-6">Frequently Asked Questions</h2>
            <div className="space-y-8 pl-6 md:pl-12">
              {[
                { q: 'How do I make good Discord server rules?', a: 'Good Discord server rules should be clear, concise, and easy to read. Avoid massive walls of text. Use bullet points and bold important keywords. Most importantly, state the consequences of breaking the rules clearly.' },
                { q: 'How do I enforce rules automatically on Discord?', a: 'You can enforce rules automatically by using a moderation bot like PegasusBot. You can set up auto-moderation filters to automatically delete bad words, prevent spam, and issue warnings or timeouts to users who violate the rules.' },
                { q: 'How do I add an agree button to Discord rules?', a: "To add an agree button, you can use Discord's native 'Rules Screening' feature in Server Settings, or use a bot like PegasusBot to create a Reaction Role or Button that assigns a 'Verified' role when clicked, unlocking the rest of the server." },
              ].map((faq) => (
                <div key={faq.q} className="border-b border-border pb-8 last:border-0">
                  <h3 className="text-foreground font-medium text-sm uppercase tracking-[0.1em] mb-3">{faq.q}</h3>
                  <p className="text-foreground/40 text-sm font-light leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MarketingLayout>
  );
}
