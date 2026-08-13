import GiveawaysClient from "@/app/dashboard/[guildId]/giveaways/_components/giveaways-client";
export default async function PreviewPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  return <GiveawaysClient guildId={resolvedParams.guildId || "preview_guild"} initialGiveaways={[]} channels={[]} roles={[]} />;
}