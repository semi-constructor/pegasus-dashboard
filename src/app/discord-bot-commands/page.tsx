import React from "react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Discord Bot Commands - Pegasus Bot Reference",
  description: "A comprehensive list of Pegasus Bot commands. From moderation and leveling to utility and fun, explore what Pegasus can do for your Discord server.",
  alternates: {
    canonical: "https://pegasusbot.app/discord-bot-commands",
  }
};

export default function DiscordBotCommandsPage() {
  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-black pt-48 pb-32 overflow-hidden selection:bg-white selection:text-black">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-white/[0.03]" />

        <div className="max-w-4xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="inline-flex items-center text-white/30 text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 px-4 py-2">
            // COMMAND_INDEX
          </div>

          <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-8 uppercase leading-[0.9]">
            Discord Bot<br/>Commands
          </h1>
          <p className="text-white/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed mb-24">
            Pegasus Bot utilizes modern slash commands (/) for a seamless user experience. Below is an overview of the command categories available to server administrators and members.
          </p>

          <div className="w-full h-px bg-white/10 mb-24" />

          <section className="mb-32">
            <h2 className="text-2xl tracking-[0.2em] font-medium text-white mb-12 uppercase border-l-2 border-white pl-6">
              Moderation Commands
            </h2>
            <div className="pl-6 md:pl-12 space-y-px bg-white/10">
              {[
                { cmd: "/ban", desc: "Permanently ban a user from the server." },
                { cmd: "/kick", desc: "Kick a user from the server." },
                { cmd: "/mute", desc: "Temporarily restrict a user from sending messages." },
                { cmd: "/warn", desc: "Issue a formal warning to a user (logged in their history)." },
                { cmd: "/purge", desc: "Bulk delete messages in a channel." },
              ].map((item) => (
                <div key={item.cmd} className="flex items-center gap-6 bg-[#050505] p-4">
                  <code className="text-white font-mono text-xs uppercase tracking-[0.3em] min-w-[120px]">{item.cmd}</code>
                  <span className="text-white/40 text-sm font-light">{item.desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-32">
            <h2 className="text-2xl tracking-[0.2em] font-medium text-white mb-12 uppercase border-l-2 border-white pl-6">
              Leveling & Economy
            </h2>
            <div className="pl-6 md:pl-12 space-y-px bg-white/10">
              {[
                { cmd: "/rank", desc: "View your current level and XP." },
                { cmd: "/leaderboard", desc: "Display the top active members in the server." },
                { cmd: "/balance", desc: "Check your current virtual currency balance." },
                { cmd: "/daily", desc: "Claim your daily currency reward." },
              ].map((item) => (
                <div key={item.cmd} className="flex items-center gap-6 bg-[#050505] p-4">
                  <code className="text-white font-mono text-xs uppercase tracking-[0.3em] min-w-[120px]">{item.cmd}</code>
                  <span className="text-white/40 text-sm font-light">{item.desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-32">
            <h2 className="text-2xl tracking-[0.2em] font-medium text-white mb-8 uppercase border-l-2 border-white pl-6">
              Custom Commands
            </h2>
            <div className="pl-6 md:pl-12">
              <p className="text-white/40 text-sm font-light leading-relaxed">
                Through the web dashboard, server administrators can create entirely custom commands with tailored responses, embedded messages, and specific role restrictions.
              </p>
            </div>
          </section>

          <Link href="/docs/commands" className="group inline-flex items-center px-8 py-4 bg-white text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-zinc-200 transition-colors">
            View Full Command Documentation
            <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
