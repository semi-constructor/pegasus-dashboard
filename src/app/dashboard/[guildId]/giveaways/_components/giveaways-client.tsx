"use client";

import { useState, useTransition, useEffect } from"react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Gift, Plus, Trash2, StopCircle, XCircle } from"lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSection } from "@/components/dashboard/forms/FormSection";
import {
 DiscordChannelPicker,
 type ChannelOption,
} from"@/components/dashboard/pickers/DiscordChannelPicker";
import {
 DiscordRolePicker,
 DiscordRoleMultiPicker,
 type RoleOption,
} from"@/components/dashboard/pickers/DiscordRolePicker";
import {
 createGiveaway,
 updateGiveawayStatus,
 deleteGiveaway,
} from"../actions";

interface GiveawaysClientProps {
 guildId: string;
 initialGiveaways: any[];
 channels: ChannelOption[];
 roles: RoleOption[];
}

export default function GiveawaysClient({
 guildId,
 initialGiveaways,
 channels,
 roles,
}: GiveawaysClientProps) {
  const t = useTranslations('guildGiveaways');
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setIsDialogOpen(true);
    }
  }, [searchParams]);

  // ── Form State ────────────────────────────────────────────────
  const [newGw, setNewGw] = useState({
 prize:"",
 description:"",
 winnerCount: 1,
 durationHours: 24,
 channelId: null as string | null,

 // Structured Requirements Builder (Non-negotiable requirement 3)
 requiredRoles: [] as string[],
 minLevel: 0,

 // Structured Bonus Entries Builder
 bonusRoleId: null as string | null,
 bonusEntryCount: 2,

 scheduledStartTime: null as string | null,
 });

 const handleCreate = () => {
 if (!newGw.prize || !newGw.channelId) return;

 const startTime = newGw.scheduledStartTime ? new Date(newGw.scheduledStartTime) : undefined;
 const endTime = startTime 
   ? new Date(startTime.getTime() + Number(newGw.durationHours) * 3600 * 1000)
   : new Date(Date.now() + Number(newGw.durationHours) * 3600 * 1000);

 const requirements = {
 requiredRoles: newGw.requiredRoles,
 minLevel: Number(newGw.minLevel),
 };

 const bonusEntries = newGw.bonusRoleId
 ? { roleId: newGw.bonusRoleId, extraEntries: Number(newGw.bonusEntryCount) }
 : {};

 startTransition(async () => {
 await createGiveaway(guildId, {
 channelId: newGw.channelId!,
 prize: newGw.prize,
 description: newGw.description,
 winnerCount: Number(newGw.winnerCount),
 startTime,
 endTime,
 requirements,
 bonusEntries,
 });

   setNewGw({
    prize: "",
    description: "",
    winnerCount: 1,
    durationHours: 24,
    channelId: null,
    requiredRoles: [],
    minLevel: 0,
    bonusRoleId: null,
    bonusEntryCount: 2,
    scheduledStartTime: null,
   });
   setIsDialogOpen(false);
  });
 };

  return (
    <div className="text-foreground p-6 lg:p-10 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-foreground/5 rounded-2xl border border-border backdrop-blur-md">
              <Gift className="w-8 h-8 text-foreground" />
            </div>
            {t("title")}
          </h1>
          <p className="text-foreground/40 mt-3 text-sm font-medium tracking-wide">
            {t("subtitle")}
          </p>
        </div>
      </div>

  {/* Giveaway Creation Dialog */}
  <Dialog open={isDialogOpen} onOpenChange={(open) => {
    setIsDialogOpen(open);
    if (!open) {
      setNewGw({
        prize: "", description: "", winnerCount: 1, durationHours: 24,
        channelId: null, requiredRoles: [], minLevel: 0, bonusRoleId: null, bonusEntryCount: 2, scheduledStartTime: null,
      });
    }
  }}>
    <DialogContent className="bg-background/90 border border-border text-foreground backdrop-blur-xl sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
          <Gift className="w-5 h-5 text-primary" />
          Create Giveaway
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Prize Name</label>
            <Input
              placeholder="Discord Nitro / Steam Key"
              value={newGw.prize}
              onChange={(e) => setNewGw({ ...newGw, prize: e.target.value })}
              className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Announcement Channel</label>
            <DiscordChannelPicker
              channels={channels}
              value={newGw.channelId}
              onChange={(c) => setNewGw({ ...newGw, channelId: c })}
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Description (Optional)</label>
            <Textarea
              placeholder="React to enter the giveaway!"
              value={newGw.description}
              onChange={(e) => setNewGw({ ...newGw, description: e.target.value })}
              className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Winner Count</label>
            <Input
              type="number"
              min={1}
              value={newGw.winnerCount}
              onChange={(e) => setNewGw({ ...newGw, winnerCount: Number(e.target.value) })}
              className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Duration (Hours)</label>
            <Input
              type="number"
              min={1}
              value={newGw.durationHours}
              onChange={(e) => setNewGw({ ...newGw, durationHours: Number(e.target.value) })}
              className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Schedule Start Time (Local Time)</label>
            <Input
              type="datetime-local"
              value={newGw.scheduledStartTime || ""}
              onChange={(e) => setNewGw({ ...newGw, scheduledStartTime: e.target.value || null })}
              className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Structured Requirements Builder */}
        <div className="p-4 border border-border bg-foreground/5 rounded-lg space-y-4 mt-2">
          <h4 className="font-bold text-sm uppercase text-primary border-b border-primary/20 pb-1">Entry Requirements Builder</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Required Roles to Enter</label>
              <DiscordRoleMultiPicker
                roles={roles}
                value={newGw.requiredRoles}
                onChange={(r) => setNewGw({ ...newGw, requiredRoles: r })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Minimum Member Level Required</label>
              <Input
                type="number"
                min={0}
                value={newGw.minLevel}
                onChange={(e) => setNewGw({ ...newGw, minLevel: Number(e.target.value) })}
                className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Structured Bonus Entries Builder */}
        <div className="p-4 border border-border bg-foreground/5 rounded-lg space-y-4 mt-2">
          <h4 className="font-bold text-sm uppercase text-primary border-b border-primary/20 pb-1">Bonus Entries Builder</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Bonus Multiplier Role</label>
              <DiscordRolePicker
                roles={roles}
                value={newGw.bonusRoleId}
                onChange={(r) => setNewGw({ ...newGw, bonusRoleId: r })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Extra Entries Granted</label>
              <Input
                type="number"
                min={1}
                value={newGw.bonusEntryCount}
                onChange={(e) => setNewGw({ ...newGw, bonusEntryCount: Number(e.target.value) })}
                className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-foreground/50 hover:text-foreground">
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          disabled={isPending}
          className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Start Giveaway
        </Button>
      </div>
    </DialogContent>
  </Dialog>

  {/* Giveaways List */}
  <FormSection 
    title="Guild Giveaways" 
    icon={Gift} 
    description="Active and past giveaways."
    headerAction={
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-0 shadow-sm font-bold text-xs uppercase"
      >
        <Plus className="w-4 h-4 mr-2" />New Giveaway
      </Button>
    }
  >
 <div className="space-y-3">
 {initialGiveaways.length === 0 ? (
 <p className="text-foreground/40 text-sm uppercase p-4 border border-border">
 No giveaways hosted.
 </p>
 ) : (
 initialGiveaways.map((gw) => (
 <div
 key={gw.giveawayId}
 className="p-4 rounded-xl border border-border bg-background/20 text-foreground backdrop-blur-md hover:bg-foreground/5 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-primary text-lg">[{gw.prize}]</span>
 <span className="text-xs border px-2 py-0.5 border-primary font-bold uppercase">
 STATUS: {gw.status}
 </span>
 <span className="text-xs border px-1 border-secondary">
 {gw.winnerCount} Winner(s)
 </span>
 </div>
 <p className="text-xs text-foreground/40 mt-1">
 Channel: {gw.channelId} | Total Entries: {gw.entries} | End Time: {new Date(gw.endTime).toLocaleString()}
 </p>
 <p className="text-xs text-foreground/40 mt-0.5">
 Reqs: {JSON.stringify(gw.requirements)} | Bonus: {JSON.stringify(gw.bonusEntries)}
 </p>
 </div>

 <div className="flex items-center gap-2">
 {gw.status ==="active"&& (
 <Button
 size="sm"
 className="bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border"onClick={() =>
 startTransition(async () => { await updateGiveawayStatus(guildId, gw.giveawayId, "ended"); })
 }
 >
 <StopCircle className="w-3.5 h-3.5 mr-1"/>
 End Now
 </Button>
 )}
 {gw.status ==="active"&& (
 <Button
 size="sm"
 className="bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border"onClick={() =>
 startTransition(async () => { await updateGiveawayStatus(guildId, gw.giveawayId, "cancelled"); })
 }
 >
 <XCircle className="w-3.5 h-3.5 mr-1"/>
 Cancel
 </Button>
 )}
 <Button
 size="sm"
 className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() => startTransition(async () => { await deleteGiveaway(guildId, gw.giveawayId); })}
 >
 <Trash2 className="w-3.5 h-3.5"/>
 </Button>
 </div>
 </div>
 ))
 )}
 </div>
 </FormSection>
 </div>
 );
}
