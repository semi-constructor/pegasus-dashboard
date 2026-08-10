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

  // Fetch ticket details
  const ticketRes = await db.select().from(tickets).where(eq(tickets.id, id)).limit(1);
  if (!ticketRes || ticketRes.length === 0) {
    return notFound();
  }
  const ticket = ticketRes[0];

  // Fetch all messages for this ticket
  const messages = await db
    .select()
    .from(ticketMessages)
    .where(eq(ticketMessages.ticketId, ticket.id))
    .orderBy(asc(ticketMessages.createdAt));

  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-4xl space-y-8 glass-panel p-8">
        
        {/* Header */}
        <header className="border-b border-white/10 pb-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-glow flex items-center gap-3">
              <MessageSquare className="text-primary w-8 h-8" />
              Ticket Transcript
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-sm font-semibold">
                #{ticket.ticketNumber}
              </span>
              <span>•</span>
              <Clock className="w-4 h-4" />
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="glass-panel px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors flex items-center gap-2 rounded-xl">
              <Download className="w-4 h-4" />
              Export HTML
            </button>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              ticket.status === 'closed' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {ticket.status}
            </span>
          </div>
        </header>

        {/* Message Log */}
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No messages recorded for this ticket.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSystem = msg.userId === "SYSTEM";
              
              return (
                <div key={msg.id} className={`flex gap-4 p-4 rounded-xl ${isSystem ? 'bg-primary/5 border border-primary/10' : 'hover:bg-white/5 transition-colors'}`}>
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {isSystem ? (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <Shield className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                        <Image 
                          src={`https://cdn.discordapp.com/avatars/${msg.userId}/avatar.png?size=128`} 
                          alt="User" 
                          width={40} 
                          height={40} 
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/favicon.ico' }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold ${isSystem ? 'text-primary' : 'text-foreground'}`}>
                        {isSystem ? 'System' : `User ${msg.userId}`}
                      </span>
                      {isSystem && (
                        <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-bold">
                          BOT
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="text-foreground/90 whitespace-pre-wrap break-words leading-relaxed">
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
                            className="flex items-center gap-2 text-sm bg-background border border-white/10 rounded-lg px-3 py-2 hover:bg-white/5 transition-colors"
                          >
                            <Paperclip className="w-4 h-4 text-primary" />
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
