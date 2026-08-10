import React from "react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Metadata } from "next";

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
      <div className="container mx-auto px-4 py-32 max-w-4xl text-foreground">
        <h1 className="text-4xl font-extrabold mb-6">Pegasus: An Open-Source Discord Bot</h1>
        <p className="text-lg mb-8 text-muted-foreground">
          Pegasus Bot is a versatile, customizable, and open-source Discord bot built to help you manage, protect, and grow your server. Whether you are running a small friend group or a massive community, Pegasus has the tools you need.
        </p>
        
        <h2 className="text-2xl font-bold mb-4">Core Features</h2>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-muted-foreground">
          <li><strong>Automated Moderation:</strong> Keep your server safe with customizable automod rules, anti-spam, and detailed logging.</li>
          <li><strong>Economy & Leveling:</strong> Reward active members with XP, levels, and virtual currency to boost engagement.</li>
          <li><strong>Open Source & Free:</strong> Run it yourself or use our hosted version. No hidden premium tiers for essential features.</li>
          <li><strong>Utility & Fun:</strong> Giveaways, tickets, reaction roles, and custom commands.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Built for Performance</h2>
        <p className="text-muted-foreground mb-4">
          Developed with modern technologies, Pegasus Bot is designed to scale effortlessly, ensuring your commands are executed instantly even during peak hours.
        </p>

        <a href="/api/auth/signin" className="inline-block bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Add Pegasus to Your Server
        </a>
      </div>
    </MarketingLayout>
  );
}
