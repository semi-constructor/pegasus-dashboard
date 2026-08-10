import React from "react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Metadata } from "next";

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
      <div className="container mx-auto px-4 py-32 max-w-4xl text-foreground">
        <h1 className="text-4xl font-extrabold mb-6">Discord Leveling and Economy System</h1>
        <p className="text-lg mb-8 text-muted-foreground">
          Turn your Discord server into an active, thriving community. Pegasus Bot provides a deeply customizable leveling and economy system that rewards your most active members and keeps them coming back.
        </p>
        
        <h2 className="text-2xl font-bold mb-4">Leveling & XP Features</h2>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-muted-foreground">
          <li><strong>Custom XP Rates:</strong> Configure how much XP users gain per message and set cooldowns to prevent spamming.</li>
          <li><strong>Role Rewards:</strong> Automatically grant specific roles when users reach certain levels.</li>
          <li><strong>Level Up Alerts:</strong> Send customized messages in the channel or via DM when a user levels up.</li>
          <li><strong>Leaderboards:</strong> Let users compete for the top spot on your server's global leaderboard.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Virtual Economy</h2>
        <p className="text-muted-foreground mb-4">
          Create a virtual currency for your server. Members can earn coins by chatting, participating in minigames, or claiming daily rewards. Set up custom shops where they can spend their currency on roles, items, or special perks.
        </p>

        <a href="/api/auth/signin" className="inline-block bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Start Rewarding Your Members
        </a>
      </div>
    </MarketingLayout>
  );
}
