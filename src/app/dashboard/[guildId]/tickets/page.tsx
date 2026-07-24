import { requireGuildAdmin } from"@/lib/auth-guard";
import { getGuildChannels, getGuildRoles } from"@/lib/discord-api";
import {
 getTicketPanels,
 getTicketDepartments,
 getTickets,
 getTicketRatings,
} from"./actions";
import TicketsClient from"./_components/tickets-client";
import { notFound } from"next/navigation";

export default async function TicketsPage({
 params,
}: {
 params: Promise<{ guildId: string }>;
}) {
 const resolvedParams = await params;
 const { guildId } = resolvedParams;
 if (!guildId) return notFound();

 await requireGuildAdmin(guildId);

 const [panels, departments, ticketList, ratings, channels, roles] = await Promise.all([
 getTicketPanels(guildId),
 getTicketDepartments(guildId),
 getTickets(guildId),
 getTicketRatings(guildId),
 getGuildChannels(guildId,"all"),
 getGuildRoles(guildId),
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
 <TicketsClient
 guildId={guildId}
 initialPanels={panels}
 initialDepartments={departments}
 initialTickets={ticketList}
 initialRatings={ratings}
 channels={channelOptions}
 roles={roleOptions}
 />
 );
}
