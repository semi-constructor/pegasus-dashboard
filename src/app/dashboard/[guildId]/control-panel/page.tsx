import { notFound } from "next/navigation";
import ControlPanelClient from "./_components/control-panel-client";
import { getGuildChannels } from "@/lib/discord-api";

export default async function ControlPanelPage({ params }: { params: Promise<{ guildId: string }> }) {
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

  return <ControlPanelClient guildId={guildId} channels={channelOptions} />;
}
