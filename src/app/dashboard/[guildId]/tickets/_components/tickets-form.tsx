"use client";

import { useState, useTransition } from"react";
import { Save, Ticket, MessageSquare, Tag, Image as ImageIcon } from"lucide-react";
import { updateTicketPanel } from"../actions";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";
import { Switch } from"@/components/ui/switch";
import { Textarea } from"@/components/ui/textarea";

export default function TicketsForm({ guildId, initialData }: { guildId: string, initialData: any }) {
 const [isPending, startTransition] = useTransition();

 const [formData, setFormData] = useState({
 isActive: initialData?.isActive ?? true,
 title: initialData?.title ??"Support Tickets",
 description: initialData?.description ??"Click the button below to open a ticket.",
 buttonLabel: initialData?.buttonLabel ??"Create Ticket",
 ticketNameFormat: initialData?.ticketNameFormat ??"ticket-{number}",
 maxTicketsPerUser: initialData?.maxTicketsPerUser ?? 1,
 welcomeMessage: initialData?.welcomeMessage ??"Welcome to your ticket! Support will be with you shortly.",
 imageUrl: initialData?.imageUrl ??"",
 footer: initialData?.footer ??"",
 });

 const handleSave = () => {
 startTransition(async () => {
 const result = await updateTicketPanel(guildId, formData);
 if (result.success) {
 console.log("Saved tickets");
 }
 });
 };

 const updateSetting = (key: keyof typeof formData, value: any) => {
 setFormData((prev) => ({ ...prev, [key]: value }));
 };

 return (
 <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tighter uppercase flex items-center gap-3">
 <Ticket className="w-10 h-10 text-primary"/>Ticket Workflows</h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Manage support queues and resolution paths.
 </p>
 </div>
 
 <div className="flex items-center gap-3 bg-background border border-border shadow-sm px-5 py-3 rounded-md">
 <span className="font-bold text-sm text-primary">Sys Status</span>
 <Switch 
 checked={formData.isActive} 
 onCheckedChange={(c) => updateSetting("isActive", c)} 
 className="border border-border data-[state=checked]:bg-primary rounded-md"
 />
 <span className={`font-black ${formData.isActive ? 'text-primary' : 'text-muted-foreground'}`}>
 {formData.isActive ? 'ONLINE' : 'OFFLINE'}
 </span>
 </div>
 </div>

 <div className={`transition-all duration-300 ${formData.isActive ? 'opacity-100' : 'opacity-50 grayscale-[50%] pointer-events-none'}`}>
 <div className="grid gap-6 md:grid-cols-2 mb-8">
 
 <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6">
 <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
 <MessageSquare className="w-6 h-6 text-primary"/>
 <h2 className="text-xl font-black text-primary uppercase">Panel Config</h2>
 </div>
 
 <div className="space-y-5">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Panel Title</label>
 <Input 
 type="text"
 value={formData.title}
 onChange={(e) => updateSetting("title", e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Panel Description</label>
 <Textarea 
 value={formData.description}
 onChange={(e) => updateSetting("description", e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0 min-h-[100px]"
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase flex items-center gap-2">
 <ImageIcon className="w-4 h-4"/>Image Url (OPTIONAL)
 </label>
 <Input 
 type="url"
 value={formData.imageUrl}
 onChange={(e) => updateSetting("imageUrl", e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Button Label</label>
 <Input 
 type="text"
 value={formData.buttonLabel}
 onChange={(e) => updateSetting("buttonLabel", e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0 uppercase"
 />
 </div>
 </div>
 </div>

 <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6">
 <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
 <Tag className="w-6 h-6 text-primary"/>
 <h2 className="text-xl font-black text-primary uppercase">Routing Rules</h2>
 </div>
 
 <div className="space-y-5">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Naming Format</label>
 <Input 
 type="text"
 value={formData.ticketNameFormat}
 onChange={(e) => updateSetting("ticketNameFormat", e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 <p className="text-xs text-muted-foreground uppercase font-bold">Use {'{number}'} or {'{username}'}</p>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Max Tickets Per User</label>
 <Input 
 type="number"
 value={formData.maxTicketsPerUser}
 onChange={(e) => updateSetting("maxTicketsPerUser", parseInt(e.target.value))}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Welcome Message</label>
 <Textarea 
 value={formData.welcomeMessage}
 onChange={(e) => updateSetting("welcomeMessage", e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0 min-h-[100px]"
 />
 <p className="text-xs text-muted-foreground uppercase font-bold">Sent immediately when a ticket is opened</p>
 </div>
 </div>
 </div>
 </div>

 <div className="flex justify-end">
 <Button 
 onClick={handleSave}
 disabled={isPending}
 className="bg-primary hover:bg-primary text-primary-foreground px-8 py-6 rounded-md font-black text-lg flex items-center gap-3 transition-all border border-border shadow-sm hover:shadow-sm"
 >
 <Save className="w-5 h-5"/>
 {isPending ?"COMMITING...":"COMMIT_CONFIG"}
 </Button>
 </div>
 </div>
 </div>
 );
}
