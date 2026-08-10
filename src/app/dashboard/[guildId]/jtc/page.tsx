import { requireGuildAdmin } from"@/lib/auth-guard";
import { getGuildChannels } from"@/lib/discord-api";
import { getJtcConfig, getActiveJtcChannels } from"./actions";
import JtcClient from"./_components/jtc-client";
import { notFound } from"next/navigation";

export default async function JtcPage({
 params,
}: {
 params: Promise<{ guildId: string }>;
}) {
 const resolvedParams = await params;
 const { guildId } = resolvedParams;
 if (!guildId) return notFound();

 await requireGuildAdmin(guildId);

 const [config, activeChannels, allChannels] = await Promise.all([
 getJtcConfig(guildId),
 getActiveJtcChannels(guildId),
 getGuildChannels(guildId,"all"),
 ]);

 const channelOptions = allChannels.map((c) => ({
 id: c.id,
 name: c.name,
 type: c.type,
 parent_id: c.parent_id,
 }));

 return (
 <JtcClient
 guildId={guildId}
 initialConfig={config}
 initialActiveChannels={activeChannels}
 channels={channelOptions}
 />
 );
}
