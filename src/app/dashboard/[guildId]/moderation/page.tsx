import { requireGuildAdmin } from"@/lib/auth-guard";
import { getGuildChannels, getGuildRoles } from"@/lib/discord-api";
import {
 getModCases,
 getWarnings,
 getWarningAutomations,
 getWordFilters,
 getModLogSettings,
} from"./actions";
import ModerationClient from"./_components/moderation-client";
import { notFound } from"next/navigation";

export default async function ModerationPage({
 params,
}: {
 params: Promise<{ guildId: string }>;
}) {
 const resolvedParams = await params;
 const { guildId } = resolvedParams;
 if (!guildId) return notFound();

 await requireGuildAdmin(guildId);

 const [
 cases,
 warnList,
 automationList,
 wordFilterList,
 logSettingList,
 channels,
 roles,
 ] = await Promise.all([
 getModCases(guildId),
 getWarnings(guildId),
 getWarningAutomations(guildId),
 getWordFilters(guildId),
 getModLogSettings(guildId),
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
 <ModerationClient
 guildId={guildId}
 initialCases={cases}
 initialWarnings={warnList}
 initialAutomations={automationList}
 initialWordFilters={wordFilterList}
 initialLogSettings={logSettingList}
 channels={channelOptions}
 roles={roleOptions}
 />
 );
}
