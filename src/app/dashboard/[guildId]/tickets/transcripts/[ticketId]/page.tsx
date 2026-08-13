import { getTicketById, getTicketMessages } from '../../actions';
import { notFound } from 'next/navigation';
import { ArrowLeft, Ticket as TicketIcon } from 'lucide-react';
import Link from 'next/link';

export default async function TranscriptPage({
  params
}: {
  params: { guildId: string; ticketId: string }
}) {
  const ticket = await getTicketById(params.guildId, params.ticketId);
  if (!ticket) {
    notFound();
  }

  const messages = await getTicketMessages(params.guildId, params.ticketId);

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/${params.guildId}/tickets`} className="p-2 hover:bg-foreground/10 rounded-lg transition-colors text-foreground/70 hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TicketIcon className="w-6 h-6 text-primary" />
            Ticket #{ticket.ticketNumber} Transcript
          </h1>
          <p className="text-foreground/50 text-sm">
            Status: <span className="uppercase text-primary">{ticket.status}</span> | User: {ticket.userId}
          </p>
        </div>
      </div>

      <div className="bg-foreground/5 border border-border rounded-xl overflow-hidden p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-foreground/50 py-10">
            No messages recorded in this transcript.
          </div>
        ) : (
          messages.map((msg: any) => (
            <div key={msg.id} className="flex gap-4 p-4 rounded-lg bg-background/20 border border-border">
              <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 overflow-hidden">
                <span className="font-bold text-xs uppercase">{msg.authorUsername?.substring(0,2) || 'U'}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-foreground/90">{msg.authorUsername || msg.authorId}</span>
                  <span className="text-xs text-foreground/40">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-foreground/80 whitespace-pre-wrap break-words">
                  {msg.content}
                </div>
                {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                  <div className="mt-2 text-xs text-primary bg-primary/10 px-2 py-1 rounded inline-block">
                    [Contains Attachments]
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
