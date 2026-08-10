import { requireGuildAdmin } from"@/lib/auth-guard";
import { getGuildChannels, getGuildRoles } from"@/lib/discord-api";
import {
 getXpSettings,
 getXpRewards,
 getXpMultipliers,
 getUserXpList,
} from"./actions";
import XpClient from"./_components/xp-client";
import { notFound } from"next/navigation";

export default async function XpPage({
 params,
}: {
 params: Promise<{ guildId: string }>;
}) {
 const resolvedParams = await params;
 const { guildId } = resolvedParams;
 if (!guildId) return notFound();

 await requireGuildAdmin(guildId);

 const [settings, rewards, multipliers, userXps, channels, roles] = await Promise.all([
 getXpSettings(guildId),
 getXpRewards(guildId),
 getXpMultipliers(guildId),
 getUserXpList(guildId),
 getGuildChannels(guildId,"all"),
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
 <XpClient
 guildId={guildId}
 initialSettings={settings}
 initialRewards={rewards}
 initialMultipliers={multipliers}
 initialUserXp={userXps}
 channels={channelOptions}
 roles={roleOptions}
 />
 );
}
