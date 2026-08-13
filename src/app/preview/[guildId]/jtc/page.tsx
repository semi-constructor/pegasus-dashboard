import JTCClient from "@/app/dashboard/[guildId]/jtc/_components/jtc-client";
export default async function PreviewPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  return <JTCClient guildId={resolvedParams.guildId || "preview_guild"} initialConfig={{}} initialActiveChannels={[]} channels={[]} />;
}