import { requireGuildAdmin } from "@/lib/auth-guard";
import { getGuildChannels } from "@/lib/discord-api";
import ScheduleClient from "./_components/schedule-client";
import { notFound } from "next/navigation";

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const resolvedParams = await params;
  const { guildId } = resolvedParams;
  if (!guildId) return notFound();

  await requireGuildAdmin(guildId);

  const channels = await getGuildChannels(guildId, "text");

  const channelOptions = channels.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    parent_id: c.parent_id,
  }));

  return (
    <ScheduleClient
      guildId={guildId}
      channels={channelOptions}
    />
  );
}
