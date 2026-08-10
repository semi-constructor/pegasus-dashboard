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
import { DiscordUserPicker } from "@/components/dashboard/pickers/DiscordUserPicker";
import {
 createWarning,
 toggleWarningStatus,
 deleteWarning,
 createWarningAutomation,
 deleteWarningAutomation,
} from "../../moderation/actions";

import { useTranslations } from "next-intl";

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
 const t = useTranslations('guildWarns');
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
    <div className="text-white p-6 lg:p-10 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            {t('title')}
          </h1>
          <p className="text-white/40 mt-3 text-sm font-medium tracking-wide">
            {t('description')}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-black/20 p-1.5 rounded-xl border border-white/5 w-fit">
        {[
          { id: "warnings", label: t('tabs.warnings'), icon: Shield },
          { id: "automations", label: t('tabs.automations'), icon: Sliders },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

   {/* Create Warning Dialog */}
   <Dialog open={isWarnDialogOpen} onOpenChange={setIsWarnDialogOpen}>
    <DialogContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl sm:max-w-[700px]">
     <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-xl font-bold">
       <AlertTriangle className="w-5 h-5 text-primary" />
       {t('dialog.issueTitle')}
      </DialogTitle>
     </DialogHeader>
     <div className="grid gap-4 py-4 pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="flex flex-col gap-2">
        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.userId')}</label>
        <DiscordUserPicker
         guildId={guildId}
         value={newWarn.userId || null}
         onChange={(v) => setNewWarn({ ...newWarn, userId: v || "" })}
        />
       </div>

       <div className="flex flex-col gap-2">
        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.warnTitle')}</label>
        <Input
         placeholder="Spamming general chat"
         value={newWarn.title}
         onChange={(e) => setNewWarn({ ...newWarn, title: e.target.value })}
         className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
        />
       </div>

       <div className="space-y-1 md:col-span-2">
        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.description')}</label>
        <Textarea
         placeholder="User ignored staff requests to stop."
         value={newWarn.description}
         onChange={(e) => setNewWarn({ ...newWarn, description: e.target.value })}
         className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
         rows={3}
        />
       </div>

       <div className="flex flex-col gap-2">
        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.level')}</label>
        <Input
         type="number"
         min={1}
         max={100}
         value={newWarn.level}
         onChange={(e) => setNewWarn({ ...newWarn, level: Number(e.target.value) })}
         className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
        />
       </div>

       <div className="flex flex-col gap-2">
        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.proof')}</label>
        <Input
         placeholder="https://imgur.com/..."
         value={newWarn.proof}
         onChange={(e) => setNewWarn({ ...newWarn, proof: e.target.value })}
         className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
        />
       </div>
      </div>
     </div>
     <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
      <Button variant="ghost" onClick={() => setIsWarnDialogOpen(false)} className="text-white/50 hover:text-white">{t('dialog.cancel')}</Button>
      <Button onClick={handleCreateWarn} disabled={isPending} className="bg-white/10 hover:bg-white/20 text-white border-0">
       <Plus className="w-4 h-4 mr-2" />{t('dialog.issueWarn')}
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
       {t('dialog.createAutoTitle')}
      </DialogTitle>
     </DialogHeader>
     <div className="grid gap-4 py-4 pr-2 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="flex flex-col gap-2">
        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.autoName')}</label>
        <Input
         placeholder="3 Warns = Timeout"
         value={newAuto.name}
         onChange={(e) => setNewAuto({ ...newAuto, name: e.target.value })}
         className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
        />
       </div>

       <div className="space-y-1 md:col-span-2">
        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.description')}</label>
        <Textarea
         placeholder="Automatically times out a user when they reach 3 active warnings."
         value={newAuto.description}
         onChange={(e) => setNewAuto({ ...newAuto, description: e.target.value })}
         className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
         rows={2}
        />
       </div>

       <div className="flex flex-col gap-2">
        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.triggerMetric')}</label>
        <select
         value={newAuto.triggerType}
         onChange={(e) => setNewAuto({ ...newAuto, triggerType: e.target.value })}
         className="w-full min-h-[40px] px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm uppercase text-white [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
        >
         <option value="warn_count">{t('dialog.warnCount')}</option>
         <option value="warn_points">{t('dialog.warnPoints')}</option>
        </select>
       </div>

       <div className="flex flex-col gap-2">
        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.threshold')}</label>
        <Input
         type="number"
         min={1}
         value={newAuto.triggerValue}
         onChange={(e) => setNewAuto({ ...newAuto, triggerValue: Number(e.target.value) })}
         className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
        />
       </div>

       <div className="flex flex-col gap-2">
        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.actionToExecute')}</label>
        <select
         value={newAuto.actionType}
         onChange={(e) => setNewAuto({ ...newAuto, actionType: e.target.value })}
         className="w-full min-h-[40px] px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm uppercase text-white [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
        >
         <option value="timeout">{t('dialog.timeout')}</option>
         <option value="kick">{t('dialog.kick')}</option>
         <option value="ban">{t('dialog.ban')}</option>
        </select>
       </div>

       {newAuto.actionType === "timeout" && (
        <div className="flex flex-col gap-2">
         <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.timeoutDuration')}</label>
         <Input
          type="number"
          min={60}
          value={newAuto.actionDuration}
          onChange={(e) => setNewAuto({ ...newAuto, actionDuration: Number(e.target.value) })}
          className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
         />
        </div>
       )}
      </div>

      <div className="p-4 border border-white/10 bg-white/5 rounded-lg space-y-4 mt-2">
       <h4 className="font-bold text-sm uppercase text-primary border-b border-primary/20 pb-1">{t('dialog.notificationSettings')}</h4>
       <div className="flex flex-col gap-2">
        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.notifyChannel')}</label>
        <DiscordChannelPicker
         channels={channels}
         value={newAuto.notifyChannelId}
         onChange={(c) => setNewAuto({ ...newAuto, notifyChannelId: c })}
        />
       </div>
       <div className="flex flex-col gap-2">
        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('dialog.notifyMessage')}</label>
        <Textarea
         value={newAuto.notifyMessage}
         onChange={(e) => setNewAuto({ ...newAuto, notifyMessage: e.target.value })}
         className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
         rows={2}
        />
       </div>
      </div>
     </div>
     <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
      <Button variant="ghost" onClick={() => setIsAutoDialogOpen(false)} className="text-white/50 hover:text-white">{t('dialog.cancel')}</Button>
      <Button onClick={handleCreateAuto} disabled={isPending} className="bg-white/10 hover:bg-white/20 text-white border-0">
       <Plus className="w-4 h-4 mr-2" />{t('dialog.saveRule')}
      </Button>
     </div>
    </DialogContent>
   </Dialog>

   {/* Tab 1: Warnings List */}
   {activeTab === "warnings" && (
    <FormSection 
     title={t('warningsList.title')} 
     icon={Shield} 
     description={t('warningsList.description')}
     headerAction={
      <Button
       onClick={() => setIsWarnDialogOpen(true)}
       className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase"
      >
       <Plus className="w-4 h-4 mr-2" />{t('warningsList.issueWarn')}
      </Button>
     }
    >
     <div className="space-y-3">
      {initialWarnings.length === 0 ? (
       <p className="text-white/40 text-sm uppercase p-4 border border-border">
        {t('warningsList.noWarnings')}
       </p>
      ) : (
       initialWarnings.map((warn) => (
        <div
         key={warn.id}
         className="p-4 rounded-xl border border-white/5 bg-black/20 text-white backdrop-blur-md hover:bg-white/5 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
        >
         <div>
          <div className="flex items-center gap-2">
           <AlertTriangle className="w-4 h-4 text-primary" />
           <span className="font-bold text-white/80 uppercase tracking-wider">{t('warningsList.user', { id: warn.userId })}</span>
           {!warn.active && (
            <span className="text-xs border px-1 border-red-500/30 text-red-400 uppercase">{t('warningsList.resolved')}</span>
           )}
          </div>
          <p className="text-sm font-bold mt-1">{warn.title}</p>
          <p className="text-xs text-white/40 mt-1">{t('warningsList.level', { level: warn.level })} | {warn.description}</p>
         </div>

         <div className="flex items-center gap-2">
          <Button
           size="sm"
           className="bg-white/5 hover:bg-white/10 text-white border border-white/10"onClick={() =>
            startTransition(async () => { await toggleWarningStatus(guildId, warn.id, !warn.active); })
           }
          >
           {warn.active ? (
            <><CheckCircle className="w-3 h-3 mr-1" /> {t('warningsList.resolveBtn')}</>
           ) : (
            <><XCircle className="w-3 h-3 mr-1" /> {t('warningsList.reopenBtn')}</>
           )}
          </Button>
          <Button
           size="sm"
           className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() =>
            startTransition(async () => { await deleteWarning(guildId, warn.id); })
           }
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
     title={t('automationsList.title')} 
     icon={Sliders} 
     description={t('automationsList.description')}
     headerAction={
      <Button
       onClick={() => setIsAutoDialogOpen(true)}
       className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase"
      >
       <Plus className="w-4 h-4 mr-2" />{t('automationsList.addRule')}
      </Button>
     }
    >
     <div className="space-y-3">
      {initialAutomations.length === 0 ? (
       <p className="text-white/40 text-sm uppercase p-4 border border-border">
        {t('automationsList.noAutomations')}
       </p>
      ) : (
       initialAutomations.map((auto) => (
        <div
         key={auto.id}
         className="p-4 rounded-xl border border-white/5 bg-black/20 text-white backdrop-blur-md hover:bg-white/5 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
        >
         <div>
          <div className="flex items-center gap-2">
           <Sliders className="w-4 h-4 text-primary" />
           <span className="font-bold text-white/80 uppercase tracking-wider">{auto.name}</span>
           <span className="text-xs border px-1 border-primary bg-primary/10 uppercase">
            {t('automationsList.triggerDesc', { type: auto.triggerType, value: auto.triggerValue })}
           </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
           {auto.description}
          </p>
          <p className="text-xs text-white/40 mt-1">
           {t('automationsList.actions')}: {JSON.stringify(auto.actions)}
          </p>
         </div>

         <Button
          size="sm"
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() =>
           startTransition(async () => { await deleteWarningAutomation(guildId, auto.id); })
          }
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
