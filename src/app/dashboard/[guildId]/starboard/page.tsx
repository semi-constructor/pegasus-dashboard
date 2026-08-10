import { db } from "@/lib/db";
import { starboardSettings } from "../../../../../schemas/starboard";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import StarboardClient from "./_components/starboard-client";
import { getGuildChannels } from "@/lib/discord-api";

export default async function StarboardPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  const { guildId } = resolvedParams;
  if (!guildId) return notFound();

  const settings = await db
    .select()
    .from(starboardSettings)
    .where(eq(starboardSettings.guildId, guildId))
    .limit(1);

  const initialSettings = settings[0] || {
    guildId,
    enabled: false,
    channelId: "",
    threshold: 3,
    emoji: "⭐",
  };

  const channels = await getGuildChannels(guildId, "all");
  const channelOptions = channels.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    parent_id: c.parent_id,
  }));

  return <StarboardClient guildId={guildId} initialSettings={initialSettings} channels={channelOptions} />;
}
