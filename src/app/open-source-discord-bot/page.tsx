import React from "react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Metadata } from "next";

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
      <div className="container mx-auto px-4 py-32 max-w-4xl text-foreground">
        <h1 className="text-4xl font-extrabold mb-6">A Truly Open-Source Discord Bot</h1>
        <p className="text-lg mb-8 text-muted-foreground">
          Transparency and trust are at the core of Pegasus Bot. Unlike many popular Discord bots that lock essential features behind premium paywalls, Pegasus is entirely open-source and free to use.
        </p>
        
        <h2 className="text-2xl font-bold mb-4">Why Open Source?</h2>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-muted-foreground">
          <li><strong>Transparency:</strong> Audit the code yourself. You always know exactly what data the bot collects and how it processes it.</li>
          <li><strong>Self-Hosting:</strong> Want complete control? You can fork the repository and host Pegasus Bot on your own infrastructure.</li>
          <li><strong>Community Driven:</strong> Features and bug fixes are driven by the community. Contribute directly to the project on GitHub.</li>
          <li><strong>No Paywalls:</strong> All features, including advanced moderation and custom commands, are available to everyone.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Get Involved</h2>
        <p className="text-muted-foreground mb-4">
          Are you a developer? Check out our GitHub repository to see the architecture, submit pull requests, or report issues. We welcome contributions from developers of all skill levels.
        </p>

        <a href="https://github.com/semi-constructor/pegasus" target="_blank" rel="noopener noreferrer" className="inline-block bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
          View on GitHub
        </a>
      </div>
    </MarketingLayout>
  );
}
