"use client";

import { useState, useTransition } from "react";
import { Database, Save, Settings2, Activity, FileText } from "lucide-react";
import { FormSection } from "@/components/dashboard/forms/FormSection";
import { ToggleField } from "@/components/dashboard/forms/ToggleField";
import { Button } from "@/components/ui/button";
import { updateLoggingSettings } from "../../actions";

export default function LoggingForm({ guildId, initialData, channels }: { guildId: string, initialData: any, channels: any[] }) {
 const [isPending, startTransition] = useTransition();

 const [enabled, setEnabled] = useState(initialData?.logsEnabled ?? false);
 const [logChannel, setLogChannel] = useState(initialData?.logsChannel ?? "");

 const handleSave = () => {
  startTransition(async () => {
   const result = await updateLoggingSettings(guildId, {
    logsEnabled: enabled,
    logsChannel: logChannel,
   });
   if (result.success) {
    console.log("Saved");
   } else {
    console.error(result.error);
   }
  });
 };

 return (
  <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
   <div className="flex items-center justify-between border-b border-border pb-4">
    <div>
     <h1 className="text-4xl font-black text-primary tracking-tighter uppercase flex items-center gap-3">
      <Database className="w-10 h-10 text-primary" />
      Audit Logging
     </h1>
     <p className="text-muted-foreground mt-2 text-sm">
      Keep track of everything happening in your server.
     </p>
    </div>
    <div className="flex items-center gap-4">
     <Button
      onClick={handleSave}
      disabled={isPending}
      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 rounded-xl"
     >
      <Save className="w-4 h-4 mr-2" />
      {isPending ? "Saving..." : "Save Settings"}
     </Button>
    </div>
   </div>

   <FormSection title="Logging Status" icon={Settings2} description="Enable or disable the master audit logging system.">
    <div className="grid grid-cols-1 gap-4">
     <ToggleField
      label="Enable Audit Logging"
      description="Turn on to start recording server events to your selected channel."
      checked={enabled}
      onCheckedChange={setEnabled}
     />
    </div>
   </FormSection>

   <div className={`transition-all duration-300 space-y-8 ${enabled ? 'opacity-100' : 'opacity-50 grayscale-[50%] pointer-events-none'}`}>
    <FormSection title="General Config" icon={FileText} description="Configure where the logs should be sent.">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
       <label className="text-xs font-bold uppercase">Master Log Channel</label>
       <select
        value={logChannel}
        onChange={(e) => setLogChannel(e.target.value)}
        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
       >
        <option value="">Select a channel...</option>
        {channels.map((c: any) => (
         <option key={c.id} value={c.id}>#{c.name}</option>
        ))}
       </select>
       <p className="text-xs text-muted-foreground mt-1">Default channel for all enabled log events.</p>
      </div>
     </div>
    </FormSection>

    <FormSection title="Events To Log" icon={Activity} description="Select which events should trigger a log message.">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
       { name: "Message Deleted", desc: "When a user deletes a message" },
       { name: "Message Edited", desc: "When a user edits a message" },
       { name: "Member Joined/Left", desc: "Server join and leave events" },
       { name: "Role Updates", desc: "When roles are created, deleted, or assigned" }
      ].map((event, i) => (
       <label key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-colors cursor-pointer group">
        <div className="mt-1">
         <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border/50 bg-background/50 text-primary focus:ring-primary/50" />
        </div>
        <div>
         <div className="font-bold text-sm group-hover:text-primary transition-colors">{event.name}</div>
         <div className="text-xs text-muted-foreground mt-1">{event.desc}</div>
        </div>
       </label>
      ))}
     </div>
    </FormSection>
   </div>
  </div>
 );
}
