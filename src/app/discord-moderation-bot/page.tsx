import React from "react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Discord Moderation Bot - Protect Your Server with Pegasus",
  description: "Keep your Discord community safe with Pegasus Bot's advanced moderation tools, automod, logging, and anti-spam features.",
  alternates: {
    canonical: "https://pegasusbot.app/discord-moderation-bot",
  }
};

export default function DiscordModerationBotPage() {
  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-black pt-48 pb-32 overflow-hidden selection:bg-white selection:text-black">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-white/[0.03]" />

        <div className="max-w-4xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="inline-flex items-center text-white/30 text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 px-4 py-2">
            // DEFENSE_PROTOCOL
          </div>

          <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-8 uppercase leading-[0.9]">
            Advanced Discord<br/>Moderation
          </h1>
          <p className="text-white/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed mb-24">
            Running a large community requires robust tools. Pegasus Bot provides comprehensive moderation features to automatically handle spam, bad words, and rule-breakers, allowing your human moderators to focus on what matters.
          </p>

          <div className="w-full h-px bg-white/10 mb-24" />

          <section className="mb-32">
            <h2 className="text-2xl tracking-[0.2em] font-medium text-white mb-12 uppercase border-l-2 border-white pl-6">
              Moderation Capabilities
            </h2>
            <div className="pl-6 md:pl-12 space-y-6">
              {[
                { title: "Auto-Moderation", desc: "Define custom word filters, link blockers, and automated punishment escalations." },
                { title: "Comprehensive Logging", desc: "Track deleted messages, edited messages, member joins/leaves, and voice channel activity in dedicated audit channels." },
                { title: "Punishment System", desc: "Warn, mute, kick, and ban users with ease. Keep track of user infractions over time." },
                { title: "Raid Protection", desc: "Automatically detect and mitigate server raids with customizable thresholds and actions." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 border border-white/10 bg-[#050505] p-6">
                  <div className="w-1 h-1 bg-white mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white font-medium text-sm uppercase tracking-[0.2em]">{item.title}</strong>
                    <p className="text-white/40 text-sm font-light mt-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-32">
            <h2 className="text-2xl tracking-[0.2em] font-medium text-white mb-8 uppercase border-l-2 border-white pl-6">
              Easy Configuration
            </h2>
            <div className="pl-6 md:pl-12">
              <p className="text-white/40 text-sm font-light leading-relaxed">
                All moderation settings can be easily configured through our intuitive web dashboard. No need to memorize complex command syntaxes to set up your filters.
              </p>
            </div>
          </section>

          <Link href="/api/auth/signin" className="group inline-flex items-center px-8 py-4 bg-white text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-zinc-200 transition-colors">
            Secure Your Server Today
            <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
