import { requireGuildAdmin } from"@/lib/auth-guard";
import { getGuildChannels, getGuildRoles } from"@/lib/discord-api";
import { getGiveaways } from"./actions";
import GiveawaysClient from"./_components/giveaways-client";
import { notFound } from"next/navigation";

export default async function GiveawaysPage({
 params,
}: {
 params: Promise<{ guildId: string }>;
}) {
 const resolvedParams = await params;
 const { guildId } = resolvedParams;
 if (!guildId) return notFound();

 await requireGuildAdmin(guildId);

 const [giveawayList, channels, roles] = await Promise.all([
 getGiveaways(guildId),
 getGuildChannels(guildId,"text"),
 getGuildRoles(guildId),
 ]);

 const channelOptions = channels.map((c) => ({
 id: c.id,
 name: c.name,
 type: c.type,
 parent_id: c.parent_id,
 }));

 const roleOptions = roles.map((r) => ({
 id: r.id,
 name: r.name,
 color: r.color,
 position: r.position,
 }));

 return (
 <GiveawaysClient
 guildId={guildId}
 initialGiveaways={giveawayList}
 channels={channelOptions}
 roles={roleOptions}
 />
 );
}
