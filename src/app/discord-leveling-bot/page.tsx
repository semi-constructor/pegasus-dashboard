import React from "react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Discord Leveling & Economy Bot - Pegasus Bot",
  description: "Boost your server's engagement with Pegasus Bot's customizable leveling and economy systems. Reward active members with XP and virtual currency.",
  alternates: {
    canonical: "https://pegasusbot.app/discord-leveling-bot",
  }
};

export default function DiscordLevelingBotPage() {
  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-black pt-48 pb-32 overflow-hidden selection:bg-white selection:text-black">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-white/[0.03]" />

        <div className="max-w-4xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="inline-flex items-center text-white/30 text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 px-4 py-2">
            // XP_ECONOMY_SYSTEM
          </div>

          <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-8 uppercase leading-[0.9]">
            Leveling &<br/>Economy System
          </h1>
          <p className="text-white/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed mb-24">
            Turn your Discord server into an active, thriving community. Pegasus Bot provides a deeply customizable leveling and economy system that rewards your most active members and keeps them coming back.
          </p>

          <div className="w-full h-px bg-white/10 mb-24" />

          <section className="mb-32">
            <h2 className="text-2xl tracking-[0.2em] font-medium text-white mb-12 uppercase border-l-2 border-white pl-6">
              Leveling & XP Features
            </h2>
            <div className="pl-6 md:pl-12 space-y-6">
              {[
                { title: "Custom XP Rates", desc: "Configure how much XP users gain per message and set cooldowns to prevent spamming." },
                { title: "Role Rewards", desc: "Automatically grant specific roles when users reach certain levels." },
                { title: "Level Up Alerts", desc: "Send customized messages in the channel or via DM when a user levels up." },
                { title: "Leaderboards", desc: "Let users compete for the top spot on your server's global leaderboard." },
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
              Virtual Economy
            </h2>
            <div className="pl-6 md:pl-12">
              <p className="text-white/40 text-sm font-light leading-relaxed">
                Create a virtual currency for your server. Members can earn coins by chatting, participating in minigames, or claiming daily rewards. Set up custom shops where they can spend their currency on roles, items, or special perks.
              </p>
            </div>
          </section>

          <Link href="/api/auth/signin" className="group inline-flex items-center px-8 py-4 bg-white text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-zinc-200 transition-colors">
            Start Rewarding Your Members
            <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
