import React from "react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Metadata } from "next";

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
      <div className="container mx-auto px-4 py-32 max-w-4xl text-foreground">
        <h1 className="text-4xl font-extrabold mb-6">Pegasus Discord Bot Commands</h1>
        <p className="text-lg mb-8 text-muted-foreground">
          Pegasus Bot utilizes modern slash commands (/) for a seamless user experience. Below is an overview of the command categories available to server administrators and members.
        </p>
        
        <h2 className="text-2xl font-bold mb-4">Moderation Commands</h2>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-muted-foreground">
          <li><code>/ban</code> - Permanently ban a user from the server.</li>
          <li><code>/kick</code> - Kick a user from the server.</li>
          <li><code>/mute</code> - Temporarily restrict a user from sending messages.</li>
          <li><code>/warn</code> - Issue a formal warning to a user (logged in their history).</li>
          <li><code>/purge</code> - Bulk delete messages in a channel.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Leveling & Economy</h2>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-muted-foreground">
          <li><code>/rank</code> - View your current level and XP.</li>
          <li><code>/leaderboard</code> - Display the top active members in the server.</li>
          <li><code>/balance</code> - Check your current virtual currency balance.</li>
          <li><code>/daily</code> - Claim your daily currency reward.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Custom Commands</h2>
        <p className="text-muted-foreground mb-4">
          Through the web dashboard, server administrators can create entirely custom commands with tailored responses, embedded messages, and specific role restrictions.
        </p>

        <a href="/docs/commands" className="inline-block bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
          View Full Command Documentation
        </a>
      </div>
    </MarketingLayout>
  );
}
