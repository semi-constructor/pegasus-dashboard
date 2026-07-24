import { db } from"@/lib/db";
import { guilds, guildSettings } from"../../../../../schemas/guilds";
import { eq } from"drizzle-orm";
import SettingsForm from"./_components/settings-form";
import { notFound } from"next/navigation";
import { requireGuildAdmin } from"@/lib/auth-guard";
import { getGuildChannels, getGuildRoles } from"@/lib/discord-api";

export default async function SettingsPage({ params }: { params: Promise<{ guildId: string }> }) {
 const resolvedParams = await params;
 const { guildId } = resolvedParams;
 if (!guildId) return notFound();

 // Permission check
 await requireGuildAdmin(guildId);

 // Fetch data in parallel
 const [gSettingsRes, guildRes, channels, roles] = await Promise.all([
 db.select().from(guildSettings).where(eq(guildSettings.guildId, guildId)).limit(1),
 db.select().from(guilds).where(eq(guilds.id, guildId)).limit(1),
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
 <SettingsForm
 guildId={guildId}
 initialGuild={guildRes[0] ? { prefix: guildRes[0].prefix ??"!", language: guildRes[0].language ??"en"} : null}
 initialSettings={gSettingsRes[0] ?? null}
 channels={channelOptions}
 roles={roleOptions}
 />
 );
}
