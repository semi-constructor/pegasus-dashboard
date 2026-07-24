"use client";

import { useState, useTransition } from"react";
import { Trophy, Award, Target, ThumbsUp, Plus, Trash2 } from"lucide-react";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { Button } from"@/components/ui/button";
import { FormSection } from"@/components/dashboard/forms/FormSection";
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
 achievementId:"",
 title:"",
 description:"",
 requirementType:"messages_sent",
 requirementValue: 100,
 rewardXp: 500,
 rewardCoins: 100,
 });
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
 });
 };

 return (
 <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
 <div className="flex items-center justify-between border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tighter uppercase flex items-center gap-3">
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

 {/* Tab 1: Achievements */}
 {activeTab ==="achievements"&& (
 <div className="space-y-6">
 <FormSection title="Create Achievement"icon={Award} description="Configure unlockable server achievements.">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Achievement ID</label>
 <Input
 placeholder="chatty-100"
 value={newAch.achievementId}
 onChange={(e) => setNewAch({ ...newAch, achievementId: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Title</label>
 <Input
 placeholder="Chatterbox Tier 1"
 value={newAch.title}
 onChange={(e) => setNewAch({ ...newAch, title: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1 md:col-span-2">
 <label className="text-xs font-bold uppercase">Description</label>
 <Textarea
 placeholder="Send 100 messages in server text channels..."
 value={newAch.description}
 onChange={(e) => setNewAch({ ...newAch, description: e.target.value })}
 className="rounded-md border border-border"
 rows={2}
 />
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Requirement Type</label>
 <select
 value={newAch.requirementType}
 onChange={(e) => setNewAch({ ...newAch, requirementType: e.target.value })}
 className="w-full p-2 bg-background border border-border rounded-md text-sm uppercase"
 >
 <option value="messages_sent">Messages Sent</option>
 <option value="voice_minutes">Voice Minutes</option>
 <option value="level_reached">Level Reached</option>
 <option value="tickets_opened">Tickets Opened</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Requirement Target Value</label>
 <Input
 type="number"
 min={1}
 value={newAch.requirementValue}
 onChange={(e) => setNewAch({ ...newAch, requirementValue: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Reward XP</label>
 <Input
 type="number"
 min={0}
 value={newAch.rewardXp}
 onChange={(e) => setNewAch({ ...newAch, rewardXp: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Reward Coins</label>
 <Input
 type="number"
 min={0}
 value={newAch.rewardCoins}
 onChange={(e) => setNewAch({ ...newAch, rewardCoins: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>
 </div>

 <Button
 onClick={handleCreateAchievement}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs"
 >
 <Plus className="w-4 h-4 mr-2"/>Create Achievement</Button>
 </FormSection>

 <FormSection title="Active Achievements"icon={Award} description="Unlockable achievements.">
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

 {/* Tab 2: Quests */}
 {activeTab ==="quests"&& (
 <div className="space-y-6">
 <FormSection title="Create Quest"icon={Target} description="Create timed quests for server members.">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Quest ID</label>
 <Input
 placeholder="daily-msg-20"
 value={newQuest.questId}
 onChange={(e) => setNewQuest({ ...newQuest, questId: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Quest Title</label>
 <Input
 placeholder="Daily Conversationalist"
 value={newQuest.title}
 onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Quest Type</label>
 <select
 value={newQuest.type}
 onChange={(e) => setNewQuest({ ...newQuest, type: e.target.value })}
 className="w-full p-2 bg-background border border-border rounded-md text-sm uppercase"
 >
 <option value="daily">Daily Quest</option>
 <option value="weekly">Weekly Quest</option>
 <option value="event">Special Event Quest</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Active Duration (Days)</label>
 <Input
 type="number"
 min={1}
 value={newQuest.durationDays}
 onChange={(e) => setNewQuest({ ...newQuest, durationDays: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>
 </div>

 <Button
 onClick={handleCreateQuest}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs"
 >
 <Plus className="w-4 h-4 mr-2"/>Create Quest</Button>
 </FormSection>

 <FormSection title="Active Quests"icon={Target} description="Currently active quests.">
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
