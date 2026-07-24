import { db } from"@/lib/db";
import { guildSettings } from"../../../../../schemas/guilds";
import { eq } from"drizzle-orm";
import { notFound } from"next/navigation";
import CustomCommandsClient from"./_components/custom-commands-client";

export default async function CustomCommandsPage({ params }: { params: Promise<{ guildId: string }> }) {
 const resolvedParams = await params;
 const { guildId } = resolvedParams;
 if (!guildId) return notFound();

 const settings = await db
 .select()
 .from(guildSettings)
 .where(eq(guildSettings.guildId, guildId))
 .limit(1);

 const rawCommands = settings[0]?.customCommands;
 let parsedCommands = [];
 try {
 if (rawCommands) parsedCommands = JSON.parse(rawCommands);
 } catch (e) {
 parsedCommands = [];
 }

 return <CustomCommandsClient guildId={guildId} initialCommands={parsedCommands} />;
}
