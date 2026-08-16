"use client";

import { useState, useRef, useEffect } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addTicketMessage, closeTicket } from "../actions";
import { toast } from "sonner";
import { ChevronLeft, Lock, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Ticket = {
  id: string;
  userId: string;
  title: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type User = {
  username: string;
  avatar: string | null;
} | null;

type Message = {
  message: {
    id: string;
    ticketId: string;
    userId: string;
    content: string;
    isAdmin: boolean;
    createdAt: Date;
  };
  user: User;
};

interface TicketViewProps {
  ticket: Ticket;
  creator: User;
  messages: Message[];
  isAdminView?: boolean;
}

export function TicketView({ ticket, creator, messages, isAdminView }: TicketViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const backUrl = isAdminView ? "/dashboard/admin/tickets" : "/dashboard/tickets";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addTicketMessage(ticket.id, content, isAdminView);
      setContent("");
    } catch (err) {
      toast.error("Failed to send reply");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleClose() {
    setIsClosing(true);
    try {
      await closeTicket(ticket.id);
      toast.success("Ticket closed");
    } catch (err) {
      toast.error("Failed to close ticket");
      setIsClosing(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-8 h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <Link href={backUrl} className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm font-medium transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to tickets
        </Link>
        
        {ticket.status === 'open' && isAdminView && (
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={handleClose} disabled={isClosing}>
            <Lock className="w-4 h-4 mr-2" />
            Close Ticket
          </Button>
        )}
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border border-border/50 shadow-sm">
              <AvatarImage src={creator?.avatar || ""} alt={creator?.username || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">{creator?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-foreground tracking-tight">{ticket.title}</h1>
                <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest", ticket.status === 'open' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-muted-foreground/15 text-muted-foreground')}>
                  {ticket.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                Opened by <span className="font-semibold text-foreground">{creator?.username || "Unknown"}</span> 
                <span className="opacity-50">•</span> 
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/50">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
              No messages in this ticket yet.
            </div>
          )}
          
          {messages.map((m, index) => {
            const isAdminMessage = m.message.isAdmin;
            const isRightSide = !isAdminMessage; // Client messages on right, Admin on left
            const messageUser = m.user;
            
            // Determine if we should show the avatar for this message block
            const showAvatar = index === 0 || messages[index - 1].message.userId !== m.message.userId || messages[index - 1].message.isAdmin !== isAdminMessage;
            
            return (
              <div key={m.message.id} className={cn("flex gap-4 w-full", isRightSide ? "justify-end" : "justify-start")}>
                
                {/* Admin Avatar (Left Side) */}
                {!isRightSide && (
                  <div className="w-10 shrink-0 flex flex-col items-center">
                    {showAvatar && (
                      <Avatar className="w-10 h-10 border-2 border-purple-500/20 shadow-sm">
                        <AvatarImage src={messageUser?.avatar || ""} alt={messageUser?.username || "Admin"} />
                        <AvatarFallback className="bg-purple-600 text-white font-bold">
                          {messageUser?.username?.charAt(0).toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )}
                
                <div className={cn("flex flex-col max-w-[85%] sm:max-w-[75%]", isRightSide ? "items-end" : "items-start")}>
                  {showAvatar && (
                    <div className={cn("flex items-center gap-2 mb-1.5 px-1", isRightSide ? "flex-row-reverse" : "flex-row")}>
                      <span className={cn("text-sm font-bold", isAdminMessage ? "text-purple-600 dark:text-purple-400 flex items-center gap-1" : "text-foreground")}>
                        {isAdminMessage && <ShieldCheck className="w-3.5 h-3.5" />}
                        {messageUser?.username || "Unknown"}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        {formatDistanceToNow(new Date(m.message.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                  
                  <div className={cn(
                    "px-5 py-3.5 text-[15px] leading-relaxed shadow-sm",
                    isAdminMessage 
                      ? "bg-purple-600/10 border border-purple-500/20 text-foreground rounded-2xl rounded-tl-sm"
                      : "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                  )}>
                    <div className="whitespace-pre-wrap">{m.message.content}</div>
                  </div>
                </div>

                {/* Client Avatar (Right Side) */}
                {isRightSide && (
                  <div className="w-10 shrink-0 flex flex-col items-center">
                    {showAvatar && (
                      <Avatar className="w-10 h-10 border border-border shadow-sm">
                        <AvatarImage src={messageUser?.avatar || ""} alt={messageUser?.username || "User"} />
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">
                          {messageUser?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 border-t border-border bg-card shrink-0">
          {ticket.status === 'open' ? (
            <form onSubmit={handleReply} className="flex gap-4 items-end">
              <div className="flex-1 relative">
                <Textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your message here..." 
                  className="min-h-[52px] max-h-[160px] py-3.5 pl-4 pr-12 resize-none bg-background border-border/50 shadow-sm text-[15px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (content.trim()) handleReply(e);
                    }
                  }}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting || !content.trim()} 
                className="shrink-0 h-[52px] px-6 shadow-sm font-semibold tracking-wide"
              >
                {isSubmitting ? "Sending..." : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">This ticket is closed</p>
              <p className="text-xs text-muted-foreground mt-1">You can no longer send messages to this conversation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
