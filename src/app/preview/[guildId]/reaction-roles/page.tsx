import ReactionRolesClient from "@/app/dashboard/[guildId]/reaction-roles/_components/reaction-roles-client";
export default async function PreviewPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  return <ReactionRolesClient 
    guildId={resolvedParams.guildId || "preview_guild"} 
    channels={[{ id: "channel-1", name: "announcements", type: 0 }]} 
    roles={[
      { id: "role-1", name: "Updates", color: 3447003, position: 1 },
      { id: "role-2", name: "Giveaways", color: 15158332, position: 2 },
      { id: "role-3", name: "Events", color: 1752220, position: 3 }
    ]} 
    initialButtons={[
      { id: "1", roleId: "role-1", label: "Get Updates", style: 1, emoji: "📢" },
      { id: "2", roleId: "role-2", label: "Giveaway Pings", style: 3, emoji: "🎁" },
      { id: "3", roleId: "role-3", label: "Event Notifications", style: 2, emoji: "🎉" }
    ]} 
  />;
}