import { notFound } from "next/navigation";
import ReactionRolesClient from "./_components/reaction-roles-client";
import { getGuildChannels, getGuildRoles } from "@/lib/discord-api";

export default async function ReactionRolesPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  const { guildId } = resolvedParams;
  if (!guildId) return notFound();

  const channels = await getGuildChannels(guildId, "all");
  const channelOptions = channels.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    parent_id: c.parent_id,
  }));

  const roles = await getGuildRoles(guildId);

  return <ReactionRolesClient guildId={guildId} channels={channelOptions} roles={roles} />;
}
