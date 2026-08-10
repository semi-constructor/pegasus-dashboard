import { db } from "@/lib/db";
import { 
  achievements, 
  engagementQuests, 
  userReputation 
} from "schemas/engagement";
import { birthdaySettings, socialFeeds } from "../../../../../schemas";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import EngagementClient from "./_components/engagement-client";
import { requireGuildAdmin } from "@/lib/auth-guard";
import { getGuildChannels, getGuildRoles } from "@/lib/discord-api";

export default async function EngagementPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  const { guildId } = resolvedParams;
  if (!guildId) return notFound();

  // Validate admin access before fetching data
  await requireGuildAdmin(guildId);

  const [initialAchievements, initialQuests, initialReputation, channels, roles, birthdays, feeds] = await Promise.all([
    db.select().from(achievements).where(eq(achievements.guildId, guildId)).orderBy(desc(achievements.createdAt)),
    db.select().from(engagementQuests).where(eq(engagementQuests.guildId, guildId)).orderBy(desc(engagementQuests.createdAt)),
    db.select().from(userReputation).where(eq(userReputation.guildId, guildId)).orderBy(desc(userReputation.createdAt)).limit(100),
    getGuildChannels(guildId, "all"),
    getGuildRoles(guildId),
    db.select().from(birthdaySettings).where(eq(birthdaySettings.guildId, guildId)).limit(1),
    db.select().from(socialFeeds).where(eq(socialFeeds.guildId, guildId)).orderBy(desc(socialFeeds.createdAt)),
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
    <EngagementClient 
      guildId={guildId}
      initialAchievements={initialAchievements}
      initialQuests={initialQuests}
      initialReputation={initialReputation}
      initialBirthdays={birthdays[0] || null}
      initialFeeds={feeds}
      channels={channelOptions}
      roles={roleOptions}
    />
  );
}
