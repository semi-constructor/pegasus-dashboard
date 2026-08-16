import { getAllTickets } from "@/app/dashboard/tickets/actions";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Shield, ChevronLeft } from "lucide-react";

export default async function AdminTicketsPage() {
  const ticketsData = await getAllTickets();

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-6">
        <Link href="/dashboard/admin" className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm font-medium transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Admin Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          Admin Tickets Management
        </h1>
      </div>

      {ticketsData.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
          <h3 className="text-lg font-medium mb-2">No tickets</h3>
          <p className="text-muted-foreground">There are currently no tickets in the system.</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-4 font-medium">Ticket</th>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ticketsData.map(({ ticket, user }) => (
                <tr key={ticket.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <Link href={`/dashboard/admin/tickets/${ticket.id}`} className="font-semibold hover:underline">
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user?.username || ticket.userId}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
