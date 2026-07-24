"use client";

import { useState, useTransition } from"react";
import { Trophy, Award, Target, ThumbsUp, Plus, Trash2 } from"lucide-react";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSection } from "@/components/dashboard/forms/FormSection";
import {
 createAchievement,
 deleteAchievement,
 createQuest,
 deleteQuest,
} from"../actions";

interface EngagementClientProps {
 guildId: string;
 initialAchievements: any[];
 initialQuests: any[];
 initialReputation: any[];
}

export default function EngagementClient({
 guildId,
 initialAchievements,
 initialQuests,
 initialReputation,
}: EngagementClientProps) {
 const [activeTab, setActiveTab] = useState<"achievements"|"quests"|"reputation">("achievements");
 const [isPending, startTransition] = useTransition();

 const [isAchDialogOpen, setIsAchDialogOpen] = useState(false);
 const [isQuestDialogOpen, setIsQuestDialogOpen] = useState(false);

 // ── New Achievement State ─────────────────────────────────────
 const [newAch, setNewAch] = useState({
 achievementId:"",
 title:"",
 description:"",
 requirementType:"messages_sent",
 requirementValue: 100,
 rewardXp: 500,
 rewardCoins: 100,
 });

 // ── New Quest State ───────────────────────────────────────────
 const [newQuest, setNewQuest] = useState({
 questId:"",
 title:"",
 description:"",
 type:"daily",
 targetType:"messages_sent",
 targetValue: 20,
 rewardXp: 200,
 rewardCoins: 50,
 durationDays: 1,
 });

 const handleCreateAchievement = () => {
 if (!newAch.achievementId || !newAch.title) return;
 startTransition(async () => {
 await createAchievement(guildId, {
 achievementId: newAch.achievementId,
 title: newAch.title,
 description: newAch.description,
 requirementType: newAch.requirementType,
 requirementValue: Number(newAch.requirementValue),
 rewardXp: Number(newAch.rewardXp),
 rewardCoins: Number(newAch.rewardCoins),
 });

   setNewAch({
    achievementId: "",
    title: "",
    description: "",
    requirementType: "messages_sent",
    requirementValue: 100,
    rewardXp: 500,
    rewardCoins: 100,
   });
   setIsAchDialogOpen(false);
  });
 };

 const handleCreateQuest = () => {
  if (!newQuest.questId || !newQuest.title) return;
  const activeUntil = new Date(Date.now() + Number(newQuest.durationDays) * 86400 * 1000);

  startTransition(async () => {
   await createQuest(guildId, {
    questId: newQuest.questId,
    title: newQuest.title,
    description: newQuest.description,
    type: newQuest.type,
    targetType: newQuest.targetType,
    targetValue: Number(newQuest.targetValue),
    rewardXp: Number(newQuest.rewardXp),
    rewardCoins: Number(newQuest.rewardCoins),
    activeUntil,
   });

   setNewQuest({
    questId: "",
    title: "",
    description: "",
    type: "daily",
    targetType: "messages_sent",
    targetValue: 20,
    rewardXp: 200,
    rewardCoins: 50,
    durationDays: 1,
   });
   setIsQuestDialogOpen(false);
  });
 };

 return (
 <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
 <div className="flex items-center justify-between border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tight uppercase flex items-center gap-3">
 <Trophy className="w-10 h-10 text-primary"/>Engagement Hub</h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Achievements CRUD, daily quests, and member peer reputation history.
 </p>
 </div>
 </div>

 {/* Tabs */}
 <div className="flex flex-wrap gap-2 border-b border-border/50 pb-2">
 {[
 { id:"achievements", label:"Achievements CRUD", icon: Award },
 { id:"quests", label:"Daily / Weekly Quests", icon: Target },
 { id:"reputation", label:"Peer Reputation Log", icon: ThumbsUp },
 ].map((tab) => (
 <Button
 key={tab.id}
 variant={activeTab === tab.id ?"default":"ghost"}
 onClick={() => setActiveTab(tab.id as any)}
 className="rounded-md border border-border font-medium text-xs"
 >
 <tab.icon className="w-4 h-4 mr-2"/>
 {tab.label}
 </Button>
 ))}
 </div>

  {/* Achievement Creation Dialog */}
  <Dialog open={isAchDialogOpen} onOpenChange={setIsAchDialogOpen}>
   <DialogContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl sm:max-w-[700px]">
    <DialogHeader>
     <DialogTitle className="flex items-center gap-2 text-xl font-bold">
      <Award className="w-5 h-5 text-primary" />
      Create Achievement
     </DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
       <label className="text-xs font-bold uppercase text-white/70">Achievement ID</label>
       <Input
        placeholder="chatty-100"
        value={newAch.achievementId}
        onChange={(e) => setNewAch({ ...newAch, achievementId: e.target.value })}
        className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white font-mono"
       />
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase text-white/70">Title</label>
       <Input
        placeholder="Chatterbox Tier 1"
        value={newAch.title}
        onChange={(e) => setNewAch({ ...newAch, title: e.target.value })}
        className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
       />
      </div>

      <div className="space-y-1 md:col-span-2">
       <label className="text-xs font-bold uppercase text-white/70">Description</label>
       <Textarea
        placeholder="Send 100 messages in server text channels..."
        value={newAch.description}
        onChange={(e) => setNewAch({ ...newAch, description: e.target.value })}
        className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
        rows={2}
       />
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase text-white/70">Requirement Type</label>
       <select
        value={newAch.requirementType}
        onChange={(e) => setNewAch({ ...newAch, requirementType: e.target.value })}
        className="w-full p-2 bg-white/5 border border-white/10 rounded-md text-sm uppercase text-white [&>option]:bg-neutral-900 focus-visible:ring-0"
       >
        <option value="messages_sent">Messages Sent</option>
        <option value="voice_minutes">Voice Minutes</option>
        <option value="level_reached">Level Reached</option>
        <option value="tickets_opened">Tickets Opened</option>
       </select>
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase text-white/70">Requirement Target Value</label>
       <Input
        type="number"
        min={1}
        value={newAch.requirementValue}
        onChange={(e) => setNewAch({ ...newAch, requirementValue: Number(e.target.value) })}
        className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
       />
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase text-white/70">Reward XP</label>
       <Input
        type="number"
        min={0}
        value={newAch.rewardXp}
        onChange={(e) => setNewAch({ ...newAch, rewardXp: Number(e.target.value) })}
        className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
       />
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase text-white/70">Reward Coins</label>
       <Input
        type="number"
        min={0}
        value={newAch.rewardCoins}
        onChange={(e) => setNewAch({ ...newAch, rewardCoins: Number(e.target.value) })}
        className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
       />
      </div>
     </div>
    </div>
    <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
     <Button variant="ghost" onClick={() => setIsAchDialogOpen(false)} className="text-white/50 hover:text-white">
      Cancel
     </Button>
     <Button onClick={handleCreateAchievement} disabled={isPending} className="bg-white/10 hover:bg-white/20 text-white border-0">
      <Plus className="w-4 h-4 mr-2" />Create Achievement
     </Button>
    </div>
   </DialogContent>
  </Dialog>

  {/* Tab 1: Achievements */}
  {activeTab ==="achievements"&& (
   <div className="space-y-6">
    <FormSection 
     title="Active Achievements" 
   icon={Award} 
   description="Unlockable achievements."
   headerAction={
    <Button
     onClick={() => setIsAchDialogOpen(true)}
     className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase"
    >
     <Plus className="w-4 h-4 mr-2" />New Achievement
    </Button>
   }
  >
 <div className="space-y-3">
 {initialAchievements.length === 0 ? (
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
 No achievements configured.
 </p>
 ) : (
 initialAchievements.map((a) => (
 <div
 key={a.id}
 className="p-4 border border-border bg-card flex justify-between items-center shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-primary uppercase">{a.title}</span>
 <span className="text-xs border px-1 border-primary font-bold">
 [{a.achievementId}]
 </span>
 </div>
 <p className="text-xs text-muted-foreground mt-1">
 Req: {a.requirementType} &ge; {a.requirementValue} | Reward: {a.rewardXp} XP + {a.rewardCoins} Coins
 </p>
 </div>

 <Button
 size="sm"
 variant="destructive"
 onClick={() => startTransition(async () => { await deleteAchievement(guildId, a.id); })}
 className="rounded-md border border-destructive text-xs uppercase"
 >
 <Trash2 className="w-3.5 h-3.5"/>
 </Button>
 </div>
 ))
 )}
 </div>
 </FormSection>
 </div>
 )}

  {/* Quest Creation Dialog */}
  <Dialog open={isQuestDialogOpen} onOpenChange={setIsQuestDialogOpen}>
   <DialogContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl sm:max-w-[700px]">
    <DialogHeader>
     <DialogTitle className="flex items-center gap-2 text-xl font-bold">
      <Target className="w-5 h-5 text-primary" />
      Create Quest
     </DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
       <label className="text-xs font-bold uppercase text-white/70">Quest ID</label>
       <Input
        placeholder="daily-msg-20"
        value={newQuest.questId}
        onChange={(e) => setNewQuest({ ...newQuest, questId: e.target.value })}
        className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white font-mono"
       />
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase text-white/70">Quest Title</label>
       <Input
        placeholder="Daily Conversationalist"
        value={newQuest.title}
        onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
        className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
       />
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase text-white/70">Quest Type</label>
       <select
        value={newQuest.type}
        onChange={(e) => setNewQuest({ ...newQuest, type: e.target.value })}
        className="w-full p-2 bg-white/5 border border-white/10 rounded-md text-sm uppercase text-white [&>option]:bg-neutral-900 focus-visible:ring-0"
       >
        <option value="daily">Daily Quest</option>
        <option value="weekly">Weekly Quest</option>
        <option value="event">Special Event Quest</option>
       </select>
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase text-white/70">Active Duration (Days)</label>
       <Input
        type="number"
        min={1}
        value={newQuest.durationDays}
        onChange={(e) => setNewQuest({ ...newQuest, durationDays: Number(e.target.value) })}
        className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
       />
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase text-white/70">Target Value</label>
       <Input
        type="number"
        min={1}
        value={newQuest.targetValue}
        onChange={(e) => setNewQuest({ ...newQuest, targetValue: Number(e.target.value) })}
        className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
       />
      </div>
      
      <div className="space-y-1">
       <label className="text-xs font-bold uppercase text-white/70">Reward XP</label>
       <Input
        type="number"
        min={0}
        value={newQuest.rewardXp}
        onChange={(e) => setNewQuest({ ...newQuest, rewardXp: Number(e.target.value) })}
        className="rounded-md border border-white/10 bg-white/5 focus-visible:ring-0 text-white"
       />
      </div>
     </div>
    </div>
    <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
     <Button variant="ghost" onClick={() => setIsQuestDialogOpen(false)} className="text-white/50 hover:text-white">
      Cancel
     </Button>
     <Button onClick={handleCreateQuest} disabled={isPending} className="bg-white/10 hover:bg-white/20 text-white border-0">
      <Plus className="w-4 h-4 mr-2" />Create Quest
     </Button>
    </div>
   </DialogContent>
  </Dialog>

  {/* Tab 2: Quests */}
  {activeTab ==="quests"&& (
   <div className="space-y-6">
    <FormSection 
     title="Active Quests" 
   icon={Target} 
   description="Currently active quests."
   headerAction={
    <Button
     onClick={() => setIsQuestDialogOpen(true)}
     className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase"
    >
     <Plus className="w-4 h-4 mr-2" />New Quest
    </Button>
   }
  >
 <div className="space-y-3">
 {initialQuests.length === 0 ? (
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
 No active quests.
 </p>
 ) : (
 initialQuests.map((q) => (
 <div
 key={q.id}
 className="p-4 border border-border bg-card flex justify-between items-center shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold uppercase text-primary">{q.title}</span>
 <span className="text-xs border px-1 border-primary">
 {q.type}
 </span>
 </div>
 <p className="text-xs text-muted-foreground mt-1">
 Goal: {q.targetType} &ge; {q.targetValue} | Expires: {new Date(q.activeUntil).toLocaleDateString()}
 </p>
 </div>

 <Button
 size="sm"
 variant="destructive"
 onClick={() => startTransition(async () => { await deleteQuest(guildId, q.id); })}
 className="rounded-md border border-destructive text-xs uppercase"
 >
 <Trash2 className="w-3.5 h-3.5"/>
 </Button>
 </div>
 ))
 )}
 </div>
 </FormSection>
 </div>
 )}

 {/* Tab 3: Peer Reputation */}
 {activeTab ==="reputation"&& (
 <FormSection title="Peer Reputation Log"icon={ThumbsUp} description="Member reputation history and thanks notes.">
 <div className="overflow-x-auto border border-border">
 <table className="w-full text-left border-collapse text-sm">
 <thead className="bg-primary/10 border-b border-border text-xs uppercase">
 <tr>
 <th className="p-3">Recipient User ID</th>
 <th className="p-3">Sender User ID</th>
 <th className="p-3">Reason Note</th>
 <th className="p-3">Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-primary/20">
 {initialReputation.length === 0 ? (
 <tr>
 <td colSpan={4} className="p-6 text-center text-muted-foreground uppercase">
 No reputation history recorded.
 </td>
 </tr>
 ) : (
 initialReputation.map((rep) => (
 <tr key={rep.id} className="hover:bg-primary/5">
 <td className="p-3 font-bold text-primary">{rep.userId}</td>
 <td className="p-3 font-bold">{rep.senderId}</td>
 <td className="p-3 truncate max-w-xs">{rep.reason ||"Helpful member"}</td>
 <td className="p-3 text-xs text-muted-foreground">
 {new Date(rep.createdAt).toLocaleDateString()}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </FormSection>
 )}
 </div>
 );
}
