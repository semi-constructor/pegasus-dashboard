import React from "react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Pegasus Bot - The Best Discord Bot for Communities",
  description: "Learn about Pegasus Bot, an open-source Discord bot designed for moderation, leveling, economy, and community engagement. Get started for free.",
  alternates: {
    canonical: "https://pegasusbot.app/discord-bot",
  }
};

export default function DiscordBotPage() {
  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-black pt-48 pb-32 overflow-hidden selection:bg-white selection:text-black">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-white/[0.03]" />

        <div className="max-w-4xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="inline-flex items-center text-white/30 text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 px-4 py-2">
            // PRODUCT_OVERVIEW
          </div>

          <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-8 uppercase leading-[0.9]">
            An Open-Source<br/>Discord Bot
          </h1>
          <p className="text-white/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed mb-24">
            Pegasus Bot is a versatile, customizable, and open-source Discord bot built to help you manage, protect, and grow your server. Whether you are running a small friend group or a massive community, Pegasus has the tools you need.
          </p>

          <div className="w-full h-px bg-white/10 mb-24" />

          <section className="mb-32">
            <h2 className="text-2xl tracking-[0.2em] font-medium text-white mb-12 uppercase border-l-2 border-white pl-6">
              Core Features
            </h2>
            <div className="pl-6 md:pl-12 space-y-6">
              {[
                { title: "Automated Moderation", desc: "Keep your server safe with customizable automod rules, anti-spam, and detailed logging." },
                { title: "Economy & Leveling", desc: "Reward active members with XP, levels, and virtual currency to boost engagement." },
                { title: "Open Source & Free", desc: "Run it yourself or use our hosted version. No hidden premium tiers for essential features." },
                { title: "Utility & Fun", desc: "Giveaways, tickets, reaction roles, and custom commands." },
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
              Built for Performance
            </h2>
            <div className="pl-6 md:pl-12">
              <p className="text-white/40 text-sm font-light leading-relaxed">
                Developed with modern technologies, Pegasus Bot is designed to scale effortlessly, ensuring your commands are executed instantly even during peak hours.
              </p>
            </div>
          </section>

          <Link href="/api/auth/signin" className="group inline-flex items-center px-8 py-4 bg-white text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-zinc-200 transition-colors">
            Add Pegasus to Your Server
            <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
