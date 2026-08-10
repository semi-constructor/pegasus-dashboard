import React from "react";
import { MarketingLayout } from "@/components/MarketingLayout";
import { LandingFeatures } from "@/components/LandingFeatures";
import { HeroClient } from "@/components/HeroClient";
import { db } from "@/lib/db";
import { guilds, users } from "../../schemas";
import { sql } from "drizzle-orm";

export default async function Home() {
  const apiUrl = process.env.API_URL || "http://localhost:2000";
  
  const [statsRes, statusRes] = await Promise.all([
    fetch(`${apiUrl}/stats`, {
      headers: { Authorization: `Bearer ${process.env.BOT_API_TOKEN}` },
      next: { revalidate: 60 }
    }).catch(() => null),
    fetch(`${apiUrl}/status`, {
      headers: { Authorization: `Bearer ${process.env.BOT_API_TOKEN}` },
      next: { revalidate: 60 }
    }).catch(() => null)
  ]);

  let totalGuilds = 0;
  let totalUsers = 0;
  let activeShards = 1;

  if (statsRes?.ok) {
    const stats = await statsRes.json();
    totalGuilds = stats.guilds?.total || 0;
    totalUsers = stats.users?.total || 0;
  }

  if (statusRes?.ok) {
    const statusData = await statusRes.json();
    activeShards = statusData.services?.discord?.shards?.length || 1;
  }

  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "PegasusBot",
            "url": "https://pegasusbot.app",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://pegasusbot.app/commands?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PegasusBot",
            "url": "https://pegasusbot.app",
            "logo": "https://pegasusbot.app/favicon.ico",
            "sameAs": [
              "https://discord.gg/pegasusbot",
              "https://github.com/semi-constructor/pegasus-dashboard"
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PegasusBot",
            "url": "https://pegasusbot.app",
            "description": "The ultimate multi-purpose Discord bot for moderation, economy, leveling, and custom commands.",
            "operatingSystem": "Discord",
            "applicationCategory": "UtilityApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1250"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      <HeroClient stats={{ users: totalUsers, guilds: totalGuilds, shards: activeShards }} />
      <LandingFeatures />
    </MarketingLayout>
  );
}
