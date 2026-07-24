"use client";

import { useState, useTransition } from "react";
import {
 AlertTriangle,
 Shield,
 Sliders,
 Plus,
 Trash2,
 XCircle,
 CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSection } from "@/components/dashboard/forms/FormSection";
import {
 DiscordChannelPicker,
 type ChannelOption,
} from "@/components/dashboard/pickers/DiscordChannelPicker";
import {
 createWarning,
 toggleWarningStatus,
 deleteWarning,
 createWarningAutomation,
 deleteWarningAutomation,
} from "../../moderation/actions";

interface WarnsClientProps {
 guildId: string;
 initialWarnings: any[];
 initialAutomations: any[];
 channels: ChannelOption[];
}

export default function WarnsClient({
 guildId,
 initialWarnings,
 initialAutomations,
 channels,
}: WarnsClientProps) {
 const [activeTab, setActiveTab] = useState<"warnings" | "automations">("warnings");
 const [isPending, startTransition] = useTransition();

 const [isWarnDialogOpen, setIsWarnDialogOpen] = useState(false);
 const [isAutoDialogOpen, setIsAutoDialogOpen] = useState(false);

 // ── New Warning Form State ─────────────────────────────────────
 const [newWarn, setNewWarn] = useState({
  userId: "",
  title: "",
  description: "",
  level: 1,
  proof: "",
 });

 // ── New Automation Form State ──────────────────────────────────
 const [newAuto, setNewAuto] = useState({
  name: "",
  description: "",
  triggerType: "warn_count",
  triggerValue: 3,
  actionType: "timeout",
  actionDuration: 3600,
  notifyChannelId: null as string | null,
  notifyMessage: "User {user} has triggered automation rule {name}.",
 });

 const handleCreateWarn = () => {
  if (!newWarn.userId || !newWarn.title) return;
  startTransition(async () => {
   await createWarning(guildId, newWarn);
   setNewWarn({ userId: "", title: "", description: "", level: 1, proof: "" });
   setIsWarnDialogOpen(false);
  });
 };

 const handleCreateAuto = () => {
  if (!newAuto.name) return;
  startTransition(async () => {
   await createWarningAutomation(guildId, {
    name: newAuto.name,
    description: newAuto.description,
    triggerType: newAuto.triggerType,
    triggerValue: Number(newAuto.triggerValue),
    actions: [{ type: newAuto.actionType, duration: newAuto.actionDuration }],
    notifyChannelId: newAuto.notifyChannelId || undefined,
    notifyMessage: newAuto.notifyMessage,
   });
   setNewAuto({
    name: "",
    description: "",
    triggerType: "warn_count",
    triggerValue: 3,
    actionType: "timeout",
    actionDuration: 3600,
    notifyChannelId: null,
    notifyMessage: "User {user} has triggered automation rule {name}.",
   });
   setIsAutoDialogOpen(false);
  });
 };

 return (
  <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
   <div className="flex items-center justify-between border-b border-border pb-4">
    <div>
     <h1 className="text-4xl font-black text-primary tracking-tight uppercase flex items-center gap-3">
      <AlertTriangle className="w-10 h-10 text-primary" />
      Warns System
     </h1>
     <p className="text-muted-foreground mt-2 text-sm">
      Track user violations and create automated sanction escalations.
     </p>
    </div>
   </div>

   {/* Navigation Tabs */}
   <div className="flex flex-wrap gap-2 border-b border-border/50 pb-2">
    {[
     { id: "warnings", label: "Active Warnings", icon: Shield },
     { id: "automations", label: "Warning Automations", icon: Sliders },
    ].map((tab) => (
     <Button
      key={tab.id}
      variant={activeTab === tab.id ? "default" : "ghost"}
      onClick={() => setActiveTab(tab.id as any)}
      className="rounded-md border border-border font-medium text-xs"
     >
      <tab.icon className="w-4 h-4 mr-2" />
      {tab.label}
     </Button>
    ))}
   </div>

   {/* Create Warning Dialog */}
   <Dialog open={isWarnDialogOpen} onOpenChange={setIsWarnDialogOpen}>
    <DialogContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl sm:max-w-[700px]">
     <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-xl font-bold">
       <AlertTriangle className="w-5 h-5 text-primary" />
       Issue Manual Warning
      </DialogTitle>
     </DialogHeader>
     <div className="grid gap-4 py-4 pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-white/70">Discord User ID</label>
        <Input
         placeholder="123456789012345678"
         value={newWarn.userId}
         onChange={(e) => setNewWarn({ ...newWarn, userId: e.target.value })}
         className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white font-mono"
        />
       </div>

       <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-white/70">Warning Title / Reason</label>
        <Input
         placeholder="Spamming general chat"
         value={newWarn.title}
         onChange={(e) => setNewWarn({ ...newWarn, title: e.target.value })}
         className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
        />
       </div>

       <div className="space-y-1 md:col-span-2">
        <label className="text-xs font-bold uppercase text-white/70">Detailed Description</label>
        <Textarea
         placeholder="User ignored staff requests to stop."
         value={newWarn.description}
         onChange={(e) => setNewWarn({ ...newWarn, description: e.target.value })}
         className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
         rows={3}
        />
       </div>

       <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-white/70">Severity Level (Points)</label>
        <Input
         type="number"
         min={1}
         max={100}
         value={newWarn.level}
         onChange={(e) => setNewWarn({ ...newWarn, level: Number(e.target.value) })}
         className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
        />
       </div>

       <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-white/70">Proof / Image URL</label>
        <Input
         placeholder="https://imgur.com/..."
         value={newWarn.proof}
         onChange={(e) => setNewWarn({ ...newWarn, proof: e.target.value })}
         className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
        />
       </div>
      </div>
     </div>
     <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
      <Button variant="ghost" onClick={() => setIsWarnDialogOpen(false)} className="text-white/50 hover:text-white">Cancel</Button>
      <Button onClick={handleCreateWarn} disabled={isPending} className="bg-white/10 hover:bg-white/20 text-white border-0">
       <Plus className="w-4 h-4 mr-2" />Issue Warning
      </Button>
     </div>
    </DialogContent>
   </Dialog>

   {/* Create Automation Dialog */}
   <Dialog open={isAutoDialogOpen} onOpenChange={setIsAutoDialogOpen}>
    <DialogContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl sm:max-w-[700px]">
     <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-xl font-bold">
       <Sliders className="w-5 h-5 text-primary" />
       Create Warning Automation
      </DialogTitle>
     </DialogHeader>
     <div className="grid gap-4 py-4 pr-2 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-white/70">Automation Name</label>
        <Input
         placeholder="3 Warns = Timeout"
         value={newAuto.name}
         onChange={(e) => setNewAuto({ ...newAuto, name: e.target.value })}
         className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
        />
       </div>

       <div className="space-y-1 md:col-span-2">
        <label className="text-xs font-bold uppercase text-white/70">Description</label>
        <Textarea
         placeholder="Automatically times out a user when they reach 3 active warnings."
         value={newAuto.description}
         onChange={(e) => setNewAuto({ ...newAuto, description: e.target.value })}
         className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
         rows={2}
        />
       </div>

       <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-white/70">Trigger Metric</label>
        <select
         value={newAuto.triggerType}
         onChange={(e) => setNewAuto({ ...newAuto, triggerType: e.target.value })}
         className="w-full p-2 bg-white/5 border border-white/10 rounded-md text-sm uppercase text-white [&>option]:bg-neutral-900 focus-visible:ring-0"
        >
         <option value="warn_count">Warning Count</option>
         <option value="warn_points">Warning Points (Level sum)</option>
        </select>
       </div>

       <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-white/70">Threshold Value</label>
        <Input
         type="number"
         min={1}
         value={newAuto.triggerValue}
         onChange={(e) => setNewAuto({ ...newAuto, triggerValue: Number(e.target.value) })}
         className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
        />
       </div>

       <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-white/70">Action to Execute</label>
        <select
         value={newAuto.actionType}
         onChange={(e) => setNewAuto({ ...newAuto, actionType: e.target.value })}
         className="w-full p-2 bg-white/5 border border-white/10 rounded-md text-sm uppercase text-white [&>option]:bg-neutral-900 focus-visible:ring-0"
        >
         <option value="timeout">Timeout User</option>
         <option value="kick">Kick User</option>
         <option value="ban">Ban User</option>
        </select>
       </div>

       {newAuto.actionType === "timeout" && (
        <div className="space-y-1">
         <label className="text-xs font-bold uppercase text-white/70">Timeout Duration (Seconds)</label>
         <Input
          type="number"
          min={60}
          value={newAuto.actionDuration}
          onChange={(e) => setNewAuto({ ...newAuto, actionDuration: Number(e.target.value) })}
          className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
         />
        </div>
       )}
      </div>

      <div className="p-4 border border-white/10 bg-white/5 rounded-lg space-y-4 mt-2">
       <h4 className="font-bold text-sm uppercase text-primary border-b border-primary/20 pb-1">Notification Settings</h4>
       <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-white/70">Notify Channel (Optional)</label>
        <DiscordChannelPicker
         channels={channels}
         value={newAuto.notifyChannelId}
         onChange={(c) => setNewAuto({ ...newAuto, notifyChannelId: c })}
        />
       </div>
       <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-white/70">Notification Message</label>
        <Textarea
         value={newAuto.notifyMessage}
         onChange={(e) => setNewAuto({ ...newAuto, notifyMessage: e.target.value })}
         className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
         rows={2}
        />
       </div>
      </div>
     </div>
     <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
      <Button variant="ghost" onClick={() => setIsAutoDialogOpen(false)} className="text-white/50 hover:text-white">Cancel</Button>
      <Button onClick={handleCreateAuto} disabled={isPending} className="bg-white/10 hover:bg-white/20 text-white border-0">
       <Plus className="w-4 h-4 mr-2" />Save Rule
      </Button>
     </div>
    </DialogContent>
   </Dialog>

   {/* Tab 1: Warnings List */}
   {activeTab === "warnings" && (
    <FormSection 
     title="User Warnings Ledger" 
     icon={Shield} 
     description="View and manage active strikes against users."
     headerAction={
      <Button
       onClick={() => setIsWarnDialogOpen(true)}
       className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase"
      >
       <Plus className="w-4 h-4 mr-2" />Issue Warning
      </Button>
     }
    >
     <div className="space-y-3">
      {initialWarnings.length === 0 ? (
       <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
        No warnings on record.
       </p>
      ) : (
       initialWarnings.map((warn) => (
        <div
         key={warn.id}
         className="p-4 border border-border bg-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
        >
         <div>
          <div className="flex items-center gap-2">
           <AlertTriangle className="w-4 h-4 text-primary" />
           <span className="font-bold text-primary uppercase">User: {warn.userId}</span>
           {!warn.active && (
            <span className="text-xs border px-1 border-destructive text-destructive uppercase">Resolved</span>
           )}
          </div>
          <p className="text-sm font-bold mt-1">{warn.title}</p>
          <p className="text-xs text-muted-foreground mt-1">Level: {warn.level} | {warn.description}</p>
         </div>

         <div className="flex items-center gap-2">
          <Button
           size="sm"
           variant="outline"
           onClick={() =>
            startTransition(async () => { await toggleWarningStatus(guildId, warn.id, !warn.active); })
           }
           className="rounded-md border border-border text-xs uppercase"
          >
           {warn.active ? (
            <><CheckCircle className="w-3 h-3 mr-1" /> Resolve</>
           ) : (
            <><XCircle className="w-3 h-3 mr-1" /> Reopen</>
           )}
          </Button>
          <Button
           size="sm"
           variant="destructive"
           onClick={() =>
            startTransition(async () => { await deleteWarning(guildId, warn.id); })
           }
           className="rounded-md border border-destructive text-xs uppercase shadow-sm"
          >
           <Trash2 className="w-4 h-4" />
          </Button>
         </div>
        </div>
       ))
      )}
     </div>
    </FormSection>
   )}

   {/* Tab 2: Automations */}
   {activeTab === "automations" && (
    <FormSection 
     title="Escalation Paths" 
     icon={Sliders} 
     description="Automated punishments when warning thresholds are met."
     headerAction={
      <Button
       onClick={() => setIsAutoDialogOpen(true)}
       className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase"
      >
       <Plus className="w-4 h-4 mr-2" />Add Rule
      </Button>
     }
    >
     <div className="space-y-3">
      {initialAutomations.length === 0 ? (
       <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
        No automations configured.
       </p>
      ) : (
       initialAutomations.map((auto) => (
        <div
         key={auto.id}
         className="p-4 border border-border bg-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
        >
         <div>
          <div className="flex items-center gap-2">
           <Sliders className="w-4 h-4 text-primary" />
           <span className="font-bold text-primary uppercase">{auto.name}</span>
           <span className="text-xs border px-1 border-primary bg-primary/10 uppercase">
            If {auto.triggerType} {">="} {auto.triggerValue}
           </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
           {auto.description}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
           Actions: {JSON.stringify(auto.actions)}
          </p>
         </div>

         <Button
          size="sm"
          variant="destructive"
          onClick={() =>
           startTransition(async () => { await deleteWarningAutomation(guildId, auto.id); })
          }
          className="rounded-md border border-destructive text-xs uppercase shadow-sm"
         >
          <Trash2 className="w-4 h-4" />
         </Button>
        </div>
       ))
      )}
     </div>
    </FormSection>
   )}
  </div>
 );
}
