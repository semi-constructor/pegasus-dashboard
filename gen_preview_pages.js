const fs = require('fs');
const path = require('path');

const dirs = ['giveaways', 'jtc', 'engagement', 'custom-commands', 'reaction-roles'];

const contents = {
  'giveaways': `import GiveawaysClient from "@/app/dashboard/[guildId]/giveaways/_components/giveaways-client";
export default async function PreviewPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  return <GiveawaysClient guildId={resolvedParams.guildId || "preview_guild"} initialGiveaways={[]} channels={[]} roles={[]} />;
}`,
  'jtc': `import JTCClient from "@/app/dashboard/[guildId]/jtc/_components/jtc-client";
export default async function PreviewPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  return <JTCClient guildId={resolvedParams.guildId || "preview_guild"} initialConfigs={[]} channels={[]} roles={[]} />;
}`,
  'engagement': `import EngagementClient from "@/app/dashboard/[guildId]/engagement/_components/engagement-client";
export default async function PreviewPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  return <EngagementClient guildId={resolvedParams.guildId || "preview_guild"} initialAchievements={[]} initialQuests={[]} initialReputation={[]} initialBirthdays={null} initialFeeds={[]} channels={[]} roles={[]} />;
}`,
  'custom-commands': `import CustomCommandsClient from "@/app/dashboard/[guildId]/custom-commands/_components/custom-commands-client";
export default async function PreviewPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  return <CustomCommandsClient guildId={resolvedParams.guildId || "preview_guild"} initialCommands={[]} channels={[]} />;
}`,
  'reaction-roles': `import ReactionRolesClient from "@/app/dashboard/[guildId]/reaction-roles/_components/reaction-roles-client";
export default async function PreviewPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  return <ReactionRolesClient guildId={resolvedParams.guildId || "preview_guild"} initialConfigs={[]} channels={[]} roles={[]} />;
}`
};

dirs.forEach(dir => {
  const p = path.join('src/app/preview/[guildId]', dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  fs.writeFileSync(path.join(p, 'page.tsx'), contents[dir]);
});
console.log('Done');
