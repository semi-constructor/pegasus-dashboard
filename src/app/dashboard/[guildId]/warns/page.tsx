import { requireGuildAdmin } from "@/lib/auth-guard";
import { getGuildChannels } from "@/lib/discord-api";
import {
 getWarnings,
 getWarningAutomations,
} from "../moderation/actions";
import WarnsClient from "./_components/warns-client";
import { notFound } from "next/navigation";

export default async function WarnsPage({
 params,
}: {
 params: Promise<{ guildId: string }>;
}) {
 const resolvedParams = await params;
 const { guildId } = resolvedParams;
 if (!guildId) return notFound();

 await requireGuildAdmin(guildId);

 const [
  warnList,
  automationList,
  channels,
 ] = await Promise.all([
  getWarnings(guildId),
  getWarningAutomations(guildId),
  getGuildChannels(guildId, "text"),
 ]);

 const channelOptions = channels.map((c) => ({
  id: c.id,
  name: c.name,
  type: c.type,
  parent_id: c.parent_id,
 }));

 return (
  <WarnsClient
   guildId={guildId}
   initialWarnings={warnList}
   initialAutomations={automationList}
   channels={channelOptions}
  />
 );
}
