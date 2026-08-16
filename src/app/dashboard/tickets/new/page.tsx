"use client";

import { useState } from "react";
import { createTicket } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export default function NewTicketPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const message = formData.get("message") as string;
    
    try {
      await createTicket(title, message);
    } catch (err) {
      toast.error("Failed to create ticket");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-6">
        <Link href="/dashboard/tickets" className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm font-medium transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to tickets
        </Link>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 border-b bg-muted/40">
          <h1 className="text-2xl font-bold">Create New Ticket</h1>
          <p className="text-muted-foreground mt-1">Please describe your issue in detail below.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Subject</Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="Brief description of the issue" 
              required 
              maxLength={256}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              name="message" 
              placeholder="Provide as much detail as possible..." 
              className="min-h-[200px]"
              required 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link href="/dashboard/tickets">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
