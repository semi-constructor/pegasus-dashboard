import WarnsClient from "@/app/dashboard/[guildId]/warns/_components/warns-client";

export default async function PreviewWarnsPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  const guildId = resolvedParams.guildId;
  const initialWarnings = [
    {
      id: "1",
      userId: "1162064293865463871",
      reason: "test",
      points: 1,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 100000000),
      status: "resolved",
      guildId: guildId
    },
    {
      id: "2",
      userId: "1162064293865463871",
      reason: "test",
      points: 1,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 100000000),
      status: "resolved",
      guildId: guildId
    },
    {
      id: "3",
      userId: "1162064293865463871",
      reason: "test",
      points: 1,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 100000000),
      status: "resolved",
      guildId: guildId
    },
    {
      id: "4",
      userId: "1162064293865463871",
      reason: "test",
      points: 1,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 100000000),
      status: "resolved",
      guildId: guildId
    },
    {
      id: "5",
      userId: "1162064293865463871",
      reason: "test2",
      points: 1,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 100000000),
      status: "resolved",
      guildId: guildId
    },
    {
      id: "6",
      userId: "1162064293865463871",
      reason: "test",
      points: 1,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 100000000),
      status: "resolved",
      guildId: guildId
    }
  ];

  return (
    <WarnsClient 
      guildId={guildId || "123456789"}
      initialWarnings={initialWarnings as any}
      initialAutomations={[]}
      channels={[]}
    />
  );
}
