import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { tickets, ticketMessages } from "../../../../schemas";
import { eq, asc } from "drizzle-orm";
import { Shield, Paperclip, Clock, MessageSquare, Download } from "lucide-react";
import Image from "next/image";

interface Props {
  params: { id: string };
}

export default async function TicketTranscriptPage({ params }: Props) {
  const { id } = params;

  const ticketRes = await db.select().from(tickets).where(eq(tickets.id, id)).limit(1);
  if (!ticketRes || ticketRes.length === 0) {
    return notFound();
  }
  const ticket = ticketRes[0];

  const messages = await db
    .select()
    .from(ticketMessages)
    .where(eq(ticketMessages.ticketId, ticket.id))
    .orderBy(asc(ticketMessages.createdAt));

  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center py-32 px-4 sm:px-6 selection:bg-foreground selection:text-background">
      <div className="w-full max-w-4xl">
        
        {/* Header */}
        <header className="border-b border-border pb-8 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium text-foreground uppercase tracking-tighter flex items-center gap-3">
              <MessageSquare className="text-foreground/30 w-6 h-6" />
              Ticket Transcript
            </h1>
            <div className="text-foreground/30 mt-3 flex items-center gap-3 text-xs uppercase tracking-[0.3em]">
              <span className="border border-border px-2 py-0.5 text-[10px] font-mono">
                #{ticket.ticketNumber}
              </span>
              <span>·</span>
              <Clock className="w-3 h-3" />
              {new Date(ticket.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="border border-border px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] hover:bg-foreground/5 transition-colors flex items-center gap-2">
              <Download className="w-3 h-3" />
              Export HTML
            </button>
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] border ${
              ticket.status === 'closed' ? 'border-border text-foreground/40' : 'border-border text-foreground/60'
            }`}>
              {ticket.status}
            </span>
          </div>
        </header>

        {/* Message Log */}
        <div className="space-y-0 divide-y divide-white/5">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <Shield className="w-8 h-8 mx-auto mb-4 text-foreground/20" />
              <p className="text-foreground/30 text-xs uppercase tracking-[0.3em]">No messages recorded for this ticket.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSystem = msg.userId === "SYSTEM";
              
              return (
                <div key={msg.id} className={`flex gap-4 p-6 ${isSystem ? 'bg-foreground/[0.02]' : 'hover:bg-foreground/[0.01] transition-colors'}`}>
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {isSystem ? (
                      <div className="w-8 h-8 bg-foreground/10 flex items-center justify-center border border-border">
                        <Shield className="w-4 h-4 text-foreground/40" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 border border-border overflow-hidden">
                        <Image 
                          src={`https://cdn.discordapp.com/avatars/${msg.userId}/avatar.png?size=128`} 
                          alt="User" 
                          width={32} 
                          height={32} 
                          className="w-full h-full object-cover grayscale"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/favicon.ico' }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs uppercase tracking-[0.2em] ${isSystem ? 'text-foreground/60' : 'text-foreground'}`}>
                        {isSystem ? 'System' : `User ${msg.userId}`}
                      </span>
                      {isSystem && (
                        <span className="text-[8px] bg-foreground text-background px-1.5 py-0.5 font-bold uppercase tracking-[0.2em]">
                          BOT
                        </span>
                      )}
                      <span className="text-[10px] text-foreground/20 uppercase tracking-[0.2em] ml-2">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="text-foreground/60 text-sm whitespace-pre-wrap break-words leading-relaxed font-light">
                      {msg.content}
                    </div>

                    {/* Attachments */}
                    {msg.attachments && (msg.attachments as any[]).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(msg.attachments as any[]).map((att: any, idx: number) => (
                          <a 
                            key={idx}
                            href={att.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-2 text-xs border border-border px-3 py-2 hover:bg-foreground/5 transition-colors text-foreground/40 uppercase tracking-[0.2em]"
                          >
                            <Paperclip className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">{att.name || 'Attachment'}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
      </div>
    </div>
  );
}
