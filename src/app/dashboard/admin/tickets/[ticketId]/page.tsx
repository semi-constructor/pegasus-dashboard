import { getTicketDetails } from "@/app/dashboard/tickets/actions";
import { TicketView } from "@/app/dashboard/tickets/_components/ticket-view";
import { notFound } from "next/navigation";

export default async function AdminTicketPage({ params }: { params: Promise<{ ticketId: string }> }) {
  try {
    const resolvedParams = await params;
    const { ticket, creator, messages } = await getTicketDetails(resolvedParams.ticketId);
    
    return <TicketView ticket={ticket} creator={creator} messages={messages} isAdminView={true} />;
  } catch (error) {
    notFound();
  }
}
