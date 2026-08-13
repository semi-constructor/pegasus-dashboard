import EngagementClient from "@/app/dashboard/[guildId]/engagement/_components/engagement-client";
export default async function PreviewPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  return <EngagementClient 
    guildId={resolvedParams.guildId || "preview_guild"} 
    initialAchievements={[]} 
    initialQuests={[]} 
    initialReputation={[]} 
    initialBirthdays={null} 
    initialFeeds={[
      { id: "feed-1", guildId: "preview", type: "youtube", sourceId: "UC_x5XG1OV2P6uZZ5FSM9Ttw", channelId: "channel-1", webhookId: null, webhookToken: null, messageTemplate: "New Video: {link}", lastChecked: new Date(), createdAt: new Date() },
      { id: "feed-2", guildId: "preview", type: "twitch", sourceId: "ninja", channelId: "channel-1", webhookId: null, webhookToken: null, messageTemplate: "Ninja is live on Twitch! {link}", lastChecked: new Date(), createdAt: new Date() }
    ]} 
    channels={[{ id: "channel-1", name: "social-feed", type: 0 }]} 
    roles={[]} 
  />;
}