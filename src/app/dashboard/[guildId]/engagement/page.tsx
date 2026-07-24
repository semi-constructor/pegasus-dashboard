import { requireGuildAdmin } from"@/lib/auth-guard";
import {
 getAchievements,
 getQuests,
 getUserReputation,
} from"./actions";
import EngagementClient from"./_components/engagement-client";
import { notFound } from"next/navigation";

export default async function EngagementPage({
 params,
}: {
 params: Promise<{ guildId: string }>;
}) {
 const resolvedParams = await params;
 const { guildId } = resolvedParams;
 if (!guildId) return notFound();

 await requireGuildAdmin(guildId);

 const [achievementList, questList, reputationList] = await Promise.all([
 getAchievements(guildId),
 getQuests(guildId),
 getUserReputation(guildId),
 ]);

 return (
 <EngagementClient
 guildId={guildId}
 initialAchievements={achievementList}
 initialQuests={questList}
 initialReputation={reputationList}
 />
 );
}
