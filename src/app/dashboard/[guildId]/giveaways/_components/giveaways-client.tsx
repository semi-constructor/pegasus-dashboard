"use client";

import { useState, useTransition } from"react";
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
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
 });

 const handleCreate = () => {
 if (!newGw.prize || !newGw.channelId) return;

 const endTime = new Date(Date.now() + Number(newGw.durationHours) * 3600 * 1000);

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
   });
   setIsDialogOpen(false);
  });
 };

 return (
 <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
 <div className="flex items-center justify-between border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tight uppercase flex items-center gap-3">
 <Gift className="w-10 h-10 text-primary"/>Automated Giveaways</h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Host contests with requirement filters and role bonus entries.
 </p>
 </div>
 </div>

  {/* Giveaway Creation Dialog */}
  <Dialog open={isDialogOpen} onOpenChange={(open) => {
    setIsDialogOpen(open);
    if (!open) {
      setNewGw({
        prize: "", description: "", winnerCount: 1, durationHours: 24,
        channelId: null, requiredRoles: [], minLevel: 0, bonusRoleId: null, bonusEntryCount: 2,
      });
    }
  }}>
    <DialogContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
          <Gift className="w-5 h-5 text-primary" />
          Create Giveaway
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-white/70">Prize Name</label>
            <Input
              placeholder="Discord Nitro / Steam Key"
              value={newGw.prize}
              onChange={(e) => setNewGw({ ...newGw, prize: e.target.value })}
              className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-white/70">Announcement Channel</label>
            <DiscordChannelPicker
              channels={channels}
              value={newGw.channelId}
              onChange={(c) => setNewGw({ ...newGw, channelId: c })}
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold uppercase text-white/70">Description</label>
            <Textarea
              placeholder="React to enter the giveaway!"
              value={newGw.description}
              onChange={(e) => setNewGw({ ...newGw, description: e.target.value })}
              className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
              rows={2}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-white/70">Winner Count</label>
            <Input
              type="number"
              min={1}
              value={newGw.winnerCount}
              onChange={(e) => setNewGw({ ...newGw, winnerCount: Number(e.target.value) })}
              className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-white/70">Duration (Hours)</label>
            <Input
              type="number"
              min={1}
              value={newGw.durationHours}
              onChange={(e) => setNewGw({ ...newGw, durationHours: Number(e.target.value) })}
              className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
            />
          </div>
        </div>

        {/* Structured Requirements Builder */}
        <div className="p-4 border border-white/10 bg-white/5 rounded-lg space-y-4 mt-2">
          <h4 className="font-bold text-sm uppercase text-primary border-b border-primary/20 pb-1">Entry Requirements Builder</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-white/70">Required Roles to Enter</label>
              <DiscordRoleMultiPicker
                roles={roles}
                value={newGw.requiredRoles}
                onChange={(r) => setNewGw({ ...newGw, requiredRoles: r })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-white/70">Minimum Member Level Required</label>
              <Input
                type="number"
                min={0}
                value={newGw.minLevel}
                onChange={(e) => setNewGw({ ...newGw, minLevel: Number(e.target.value) })}
                className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
              />
            </div>
          </div>
        </div>

        {/* Structured Bonus Entries Builder */}
        <div className="p-4 border border-white/10 bg-white/5 rounded-lg space-y-4 mt-2">
          <h4 className="font-bold text-sm uppercase text-primary border-b border-primary/20 pb-1">Bonus Entries Builder</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-white/70">Bonus Multiplier Role</label>
              <DiscordRolePicker
                roles={roles}
                value={newGw.bonusRoleId}
                onChange={(r) => setNewGw({ ...newGw, bonusRoleId: r })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-white/70">Extra Entries Granted</label>
              <Input
                type="number"
                min={1}
                value={newGw.bonusEntryCount}
                onChange={(e) => setNewGw({ ...newGw, bonusEntryCount: Number(e.target.value) })}
                className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/50 hover:text-white">
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          disabled={isPending}
          className="bg-white/10 hover:bg-white/20 text-white border-0"
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
        className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase"
      >
        <Plus className="w-4 h-4 mr-2" />New Giveaway
      </Button>
    }
  >
 <div className="space-y-3">
 {initialGiveaways.length === 0 ? (
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
 No giveaways hosted.
 </p>
 ) : (
 initialGiveaways.map((gw) => (
 <div
 key={gw.giveawayId}
 className="p-4 border border-border bg-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
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
 <p className="text-xs text-muted-foreground mt-1">
 Channel: {gw.channelId} | Total Entries: {gw.entries} | End Time: {new Date(gw.endTime).toLocaleString()}
 </p>
 <p className="text-xs text-muted-foreground mt-0.5">
 Reqs: {JSON.stringify(gw.requirements)} | Bonus: {JSON.stringify(gw.bonusEntries)}
 </p>
 </div>

 <div className="flex items-center gap-2">
 {gw.status ==="active"&& (
 <Button
 size="sm"
 variant="outline"
 onClick={() =>
 startTransition(async () => { await updateGiveawayStatus(guildId, gw.giveawayId, "ended"); })
 }
 className="rounded-md border border-border text-xs uppercase"
 >
 <StopCircle className="w-3.5 h-3.5 mr-1"/>
 End Now
 </Button>
 )}
 {gw.status ==="active"&& (
 <Button
 size="sm"
 variant="outline"
 onClick={() =>
 startTransition(async () => { await updateGiveawayStatus(guildId, gw.giveawayId, "cancelled"); })
 }
 className="rounded-md border border-border text-xs uppercase text-destructive"
 >
 <XCircle className="w-3.5 h-3.5 mr-1"/>
 Cancel
 </Button>
 )}
 <Button
 size="sm"
 variant="destructive"
 onClick={() => startTransition(async () => { await deleteGiveaway(guildId, gw.giveawayId); })}
 className="rounded-md border border-destructive text-xs uppercase"
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
