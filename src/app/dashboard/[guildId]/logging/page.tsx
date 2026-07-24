import { db } from"@/lib/db";
import { guildSettings } from"../../../../../schemas/guilds";
import { eq } from"drizzle-orm";
import LoggingForm from"./_components/logging-form";
import { notFound } from"next/navigation";
import { getDiscordChannels } from"../actions";

export default async function LoggingPage({ params }: { params: Promise<{ guildId: string }> }) {
 const resolvedParams = await params;
 const { guildId } = resolvedParams;
 if (!guildId) return notFound();

 const settings = await db
 .select()
 .from(guildSettings)
 .where(eq(guildSettings.guildId, guildId))
 .limit(1);

 const channels = await getDiscordChannels(guildId);

 return <LoggingForm guildId={guildId} initialData={settings[0] || null} channels={channels} />;
}
