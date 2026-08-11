import React from "react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Add Pegasus Bot to Discord - Setup Guide",
  description: "A quick and easy guide on how to invite and set up Pegasus Bot on your Discord server. Secure your community in minutes.",
  alternates: {
    canonical: "https://pegasusbot.app/how-to-add-pegasus-bot",
  }
};

export default function HowToAddPegasusBotPage() {
  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-black pt-48 pb-32 overflow-hidden selection:bg-white selection:text-black">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-white/[0.03]" />

        <div className="max-w-4xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="inline-flex items-center text-white/30 text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 px-4 py-2">
            // SETUP_PROTOCOL
          </div>

          <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-8 uppercase leading-[0.9]">
            How to Add<br/>Pegasus Bot
          </h1>
          <p className="text-white/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed mb-24">
            Setting up Pegasus Bot is incredibly straightforward. In just a few clicks, you can have advanced moderation, leveling, and economy features active in your community.
          </p>

          <div className="w-full h-px bg-white/10 mb-24" />

          <section className="mb-32">
            <h2 className="text-2xl tracking-[0.2em] font-medium text-white mb-12 uppercase border-l-2 border-white pl-6">
              Step-by-Step Setup
            </h2>
            <div className="pl-6 md:pl-12 space-y-8">
              {[
                { step: "01", title: "Invite the Bot", desc: "Click the invite link on our homepage or dashboard. You will be redirected to Discord's official authorization page." },
                { step: "02", title: "Select Your Server", desc: "From the dropdown menu, select the server you want to add Pegasus Bot to. You must have the \"Manage Server\" or \"Administrator\" permission." },
                { step: "03", title: "Authorize Permissions", desc: "Review the requested permissions. Pegasus Bot requests only what it needs to function. Click \"Authorize\" and complete the CAPTCHA." },
                { step: "04", title: "Configure via Dashboard", desc: "Once the bot joins your server, log in to the Pegasus web dashboard. Configure welcome messages, moderation filters, and the leveling system." },
              ].map((item) => (
                <div key={item.step} className="border border-white/10 bg-[#050505] p-8 flex items-start gap-6">
                  <span className="text-3xl font-medium tracking-tighter text-white/20 font-mono flex-shrink-0">{item.step}</span>
                  <div>
                    <h3 className="text-white font-medium text-sm uppercase tracking-[0.2em] mb-3">{item.title}</h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Link href="/api/auth/signin" className="group inline-flex items-center px-8 py-4 bg-white text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-zinc-200 transition-colors">
            Add the Bot Now
            <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
