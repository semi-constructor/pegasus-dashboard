import { db } from "@/lib/db";
import { guilds, guildSettings } from "@/../schemas/guilds";
import { eq } from "drizzle-orm";
import SettingsClient from "./_components/settings-client";
import { notFound } from "next/navigation";
import { requireGuildAdmin } from "@/lib/auth-guard";
import { getGuildChannels, getGuildRoles } from "@/lib/discord-api";

// Fetch actions from consolidated routes
import { getModCases, getWarnings, getWarningAutomations, getWordFilters, getModLogSettings } from "../moderation/actions";
import { getAutoModRules, getAutoModInfractions, getQuarantineVault } from "../automod/actions";
import { getAchievements, getQuests, getUserReputation } from "../engagement/actions";

export default async function SettingsPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  const { guildId } = resolvedParams;
  if (!guildId) return notFound();

  await requireGuildAdmin(guildId);

  // Fetch all required data for consolidated Settings
  const [
    gSettingsRes, 
    guildsRes,
    channels, 
    roles,
    modCases,
    modWarnings,
    modAutomations,
    modWordFilters,
    modLogSettings,
    autoRules,
    autoInfractions,
    autoVault,
    engAchievements,
    engQuests,
    engReputation
  ] = await Promise.all([
    db.select().from(guildSettings).where(eq(guildSettings.guildId, guildId)).limit(1),
    db.select().from(guilds).where(eq(guilds.id, guildId)).limit(1),
    getGuildChannels(guildId, "all"),
    getGuildRoles(guildId),
    getModCases(guildId),
    getWarnings(guildId),
    getWarningAutomations(guildId),
    getWordFilters(guildId),
    getModLogSettings(guildId),
    getAutoModRules(guildId),
    getAutoModInfractions(guildId),
    getQuarantineVault(guildId),
    getAchievements(guildId),
    getQuests(guildId),
    getUserReputation(guildId),
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
    <SettingsClient
      guildId={guildId}
      initialSettings={gSettingsRes[0] ?? null}
      initialConfig={guildsRes[0] ?? { prefix: "!", language: "en" }}
      channels={channelOptions}
      roles={roleOptions}
      modCases={modCases}
      modWarnings={modWarnings}
      modAutomations={modAutomations}
      modWordFilters={modWordFilters}
      modLogSettings={modLogSettings}
      autoRules={autoRules}
      autoInfractions={autoInfractions}
      autoVault={autoVault}
      engAchievements={engAchievements}
      engQuests={engQuests}
      engReputation={engReputation}
    />
  );
}
