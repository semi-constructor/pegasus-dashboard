import TicketsClient from "@/app/dashboard/[guildId]/tickets/_components/tickets-client";

export default async function PreviewTicketsPage({ params }: { params: Promise<{ guildId: string }> }) {
  const resolvedParams = await params;
  const guildId = resolvedParams.guildId;
  const tickets = [
    {
      id: "1",
      guildId: guildId,
      channelId: "123",
      userId: "1162064293865463871",
      panelId: "1",
      status: "open",
      createdAt: new Date(),
    },
    {
      id: "2",
      guildId: guildId,
      channelId: "124",
      userId: "987654321098765432",
      panelId: "1",
      status: "closed",
      createdAt: new Date(Date.now() - 86400000),
    }
  ];

  return (
    <TicketsClient 
      guildId={guildId || "123456789"}
      initialPanels={[]}
      initialDepartments={[]}
      initialTickets={tickets as any}
      initialRatings={[]}
      channels={[]}
      roles={[]}
    />
  );
}
