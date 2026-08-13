import CustomCommandsClient from "@/app/dashboard/[guildId]/custom-commands/_components/custom-commands-client";
export default async function PreviewPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  return <CustomCommandsClient guildId={resolvedParams.guildId || "preview_guild"} initialCommands={[]} channels={[]} />;
}