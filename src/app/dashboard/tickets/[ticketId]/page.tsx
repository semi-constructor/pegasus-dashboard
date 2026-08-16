import { getTicketDetails } from "../actions";
import { TicketView } from "../_components/ticket-view";
import { notFound } from "next/navigation";

export default async function TicketPage({ params }: { params: Promise<{ ticketId: string }> }) {
  try {
    const resolvedParams = await params;
    const { ticket, creator, messages } = await getTicketDetails(resolvedParams.ticketId);
    
    return <TicketView ticket={ticket} creator={creator} messages={messages} />;
  } catch (error) {
    notFound();
  }
}
