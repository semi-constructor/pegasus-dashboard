import { getUserTickets } from "./actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default async function UserTicketsPage() {
  const tickets = await getUserTickets();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Support Tickets</h1>
        <Link href="/dashboard/tickets/new">
          <Button>Create New Ticket</Button>
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
          <h3 className="text-lg font-medium mb-2">No tickets yet</h3>
          <p className="text-muted-foreground mb-4">If you need help, you can open a support ticket.</p>
          <Link href="/dashboard/tickets/new">
            <Button variant="outline">Create Ticket</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Link key={ticket.id} href={`/dashboard/tickets/${ticket.id}`} className="block">
              <div className="p-4 bg-card rounded-lg border hover:border-primary/50 transition-colors flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{ticket.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
