import React from "react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Metadata } from "next";

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
      <div className="container mx-auto px-4 py-32 max-w-4xl text-foreground">
        <h1 className="text-4xl font-extrabold mb-6">Advanced Discord Moderation with Pegasus Bot</h1>
        <p className="text-lg mb-8 text-muted-foreground">
          Running a large community requires robust tools. Pegasus Bot provides comprehensive moderation features to automatically handle spam, bad words, and rule-breakers, allowing your human moderators to focus on what matters.
        </p>
        
        <h2 className="text-2xl font-bold mb-4">Moderation Capabilities</h2>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-muted-foreground">
          <li><strong>Auto-Moderation:</strong> Define custom word filters, link blockers, and automated punishment escalations.</li>
          <li><strong>Comprehensive Logging:</strong> Track deleted messages, edited messages, member joins/leaves, and voice channel activity in dedicated audit channels.</li>
          <li><strong>Punishment System:</strong> Warn, mute, kick, and ban users with ease. Keep track of user infractions over time.</li>
          <li><strong>Raid Protection:</strong> Automatically detect and mitigate server raids with customizable thresholds and actions.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Easy Configuration</h2>
        <p className="text-muted-foreground mb-4">
          All moderation settings can be easily configured through our intuitive web dashboard. No need to memorize complex command syntaxes to set up your filters.
        </p>

        <a href="/api/auth/signin" className="inline-block bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Secure Your Server Today
        </a>
      </div>
    </MarketingLayout>
  );
}
