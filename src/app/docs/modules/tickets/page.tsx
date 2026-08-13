import { Ticket } from "lucide-react";

export const metadata = {
  title: "Support Architecture - Pegasus Docs",
  description: "Learn how to build advanced ticket systems with Pegasus.",
};

export default function TicketsDocPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-24">
        <div className="inline-flex items-center text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
          <Ticket className="w-4 h-4 mr-3 text-foreground/50" />
          // MODULE: TICKETS
        </div>
        
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter text-foreground mb-6 uppercase leading-tight">Support Architecture</h1>
        <p className="text-foreground/40 tracking-[0.1em] text-sm uppercase max-w-2xl leading-relaxed">Build efficient support pipelines for your community.</p>
      </div>

      <div className="w-full h-px bg-foreground/10 mb-24" />

      <div className="space-y-24 text-foreground/50 font-light leading-relaxed">
        <section>
          <h2 className="text-2xl tracking-[0.2em] font-medium text-foreground mb-8 uppercase border-l-2 border-border pl-6">
            Overview
          </h2>
          <div className="pl-6 md:pl-12">
            <p className="text-lg mb-8">
              The Tickets module enables you to provide dedicated support to your server members. Configure multiple ticket panels (e.g., General Support, Billing), assign staff roles, and automatically save encrypted HTML transcripts to a secure channel.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
