import React from "react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Open-Source Discord Bot - Pegasus Bot",
  description: "Pegasus Bot is a 100% open-source Discord bot. Review the code, host it yourself, or contribute to its development on GitHub.",
  alternates: {
    canonical: "https://pegasusbot.app/open-source-discord-bot",
  }
};

export default function OpenSourceDiscordBotPage() {
  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-background pt-48 pb-32 overflow-hidden selection:bg-foreground selection:text-background">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-foreground/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-foreground/[0.03]" />

        <div className="max-w-4xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="inline-flex items-center text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
            // OPEN_SOURCE
          </div>

          <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground mb-8 uppercase leading-[0.9]">
            A Truly Open-Source<br/>Discord Bot
          </h1>
          <p className="text-foreground/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed mb-24">
            Transparency and trust are at the core of Pegasus Bot. Unlike many popular Discord bots that lock essential features behind premium paywalls, Pegasus is entirely open-source and free to use.
          </p>

          <div className="w-full h-px bg-foreground/10 mb-24" />

          <section className="mb-32">
            <h2 className="text-2xl tracking-[0.2em] font-medium text-foreground mb-12 uppercase border-l-2 border-border pl-6">
              Why Open Source?
            </h2>
            <div className="pl-6 md:pl-12 space-y-6">
              {[
                { title: "Transparency", desc: "Audit the code yourself. You always know exactly what data the bot collects and how it processes it." },
                { title: "Self-Hosting", desc: "Want complete control? You can fork the repository and host Pegasus Bot on your own infrastructure." },
                { title: "Community Driven", desc: "Features and bug fixes are driven by the community. Contribute directly to the project on GitHub." },
                { title: "No Paywalls", desc: "All features, including advanced moderation and custom commands, are available to everyone." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 border border-border bg-[#050505] p-6">
                  <div className="w-1 h-1 bg-foreground mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground font-medium text-sm uppercase tracking-[0.2em]">{item.title}</strong>
                    <p className="text-foreground/40 text-sm font-light mt-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-32">
            <h2 className="text-2xl tracking-[0.2em] font-medium text-foreground mb-8 uppercase border-l-2 border-border pl-6">
              Get Involved
            </h2>
            <div className="pl-6 md:pl-12">
              <p className="text-foreground/40 text-sm font-light leading-relaxed">
                Are you a developer? Check out our GitHub repository to see the architecture, submit pull requests, or report issues. We welcome contributions from developers of all skill levels.
              </p>
            </div>
          </section>

          <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center px-8 py-4 bg-foreground text-background text-xs font-bold tracking-[0.3em] uppercase hover:bg-zinc-200 transition-colors">
            View on GitHub
            <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </div>
    </MarketingLayout>
  );
}
