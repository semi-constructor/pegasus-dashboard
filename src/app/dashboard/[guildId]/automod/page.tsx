import { requireGuildAdmin } from"@/lib/auth-guard";
import { getGuildChannels, getGuildRoles } from"@/lib/discord-api";
import {
 getAutoModRules,
 getAutoModInfractions,
 getQuarantineVault,
} from"./actions";
import AutoModClient from"./_components/automod-client";
import { notFound } from"next/navigation";

export default async function AutoModPage({
 params,
}: {
 params: Promise<{ guildId: string }>;
}) {
 const resolvedParams = await params;
 const { guildId } = resolvedParams;
 if (!guildId) return notFound();

 await requireGuildAdmin(guildId);

 const [rules, infractions, vault, channels, roles] = await Promise.all([
 getAutoModRules(guildId),
 getAutoModInfractions(guildId),
 getQuarantineVault(guildId),
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
 <AutoModClient
 guildId={guildId}
 initialRules={rules}
 initialInfractions={infractions}
 initialVault={vault}
 channels={channelOptions}
 roles={roleOptions}
 />
 );
}
