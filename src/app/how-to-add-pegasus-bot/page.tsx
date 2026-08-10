import React from "react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { Metadata } from "next";

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
      <div className="container mx-auto px-4 py-32 max-w-4xl text-foreground">
        <h1 className="text-4xl font-extrabold mb-6">How to Add Pegasus Bot to Your Discord Server</h1>
        <p className="text-lg mb-8 text-muted-foreground">
          Setting up Pegasus Bot is incredibly straightforward. In just a few clicks, you can have advanced moderation, leveling, and economy features active in your community. Follow this quick guide to get started.
        </p>
        
        <h2 className="text-2xl font-bold mb-4">Step-by-Step Setup Guide</h2>
        <div className="space-y-6 mb-8 text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground text-lg">Step 1: Invite the Bot</h3>
            <p>Click the invite link on our homepage or dashboard. You will be redirected to Discord's official authorization page.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">Step 2: Select Your Server</h3>
            <p>From the dropdown menu, select the server you want to add Pegasus Bot to. You must have the "Manage Server" or "Administrator" permission in that server to invite bots.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">Step 3: Authorize Permissions</h3>
            <p>Review the requested permissions. Pegasus Bot requests only what it needs to function (like managing messages for automod, or managing roles for level rewards). Click "Authorize" and complete the CAPTCHA.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">Step 4: Configure via Dashboard</h3>
            <p>Once the bot joins your server, log in to the Pegasus web dashboard. Here you can configure welcome messages, set up moderation filters, and customize the leveling system without typing any commands.</p>
          </div>
        </div>

        <a href="/api/auth/signin" className="inline-block bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Add the Bot Now
        </a>
      </div>
    </MarketingLayout>
  );
}
