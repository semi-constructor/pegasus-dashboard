"use client";

import { useState, useTransition } from"react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Trophy, Award, Target, ThumbsUp, Plus, Trash2, Edit2 } from"lucide-react";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSection } from "@/components/dashboard/forms/FormSection";
import { DiscordChannelPicker, type ChannelOption } from "@/components/dashboard/pickers/DiscordChannelPicker";
import {
 createAchievement,
 updateAchievement,
 deleteAchievement,
 createQuest,
 deleteQuest,
} from"../actions";

interface EngagementClientProps {
 guildId: string;
 initialAchievements: any[];
 initialQuests: any[];
 initialReputation: any[];
 initialBirthdays: any | null;
 initialFeeds: any[];
 channels: ChannelOption[];
 roles: any[];
}

export default function EngagementClient({
 guildId,
 initialAchievements,
 initialQuests,
 initialReputation,
 initialBirthdays,
 initialFeeds,
 channels,
 roles,
}: EngagementClientProps) {
  const t = useTranslations('guildEngagement');
  const [activeTab, setActiveTab] = useState<"achievements"|"quests"|"reputation"|"birthdays"|"feeds">("achievements");
 const [isPending, startTransition] = useTransition();

 const [isAchDialogOpen, setIsAchDialogOpen] = useState(false);
 const [isQuestDialogOpen, setIsQuestDialogOpen] = useState(false);
 const [editingAchId, setEditingAchId] = useState<string | null>(null);

 // ── New Achievement State ─────────────────────────────────────
 const [newAch, setNewAch] = useState({
 achievementId:"",
 title:"",
 description:"",
 requirementType:"messages_sent",
 requirementValue: 100,
 rewardXp: 500,
 rewardCoins: 100,
 channelId: "",
 requirementChannelId: "",
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
 channelId: "",
 requirementChannelId: "",
 });

 // ── New Birthday State ───────────────────────────────────────────
 const [birthdaySettings, setBirthdaySettings] = useState({
   enabled: initialBirthdays?.enabled ?? false,
   channelId: initialBirthdays?.channelId ?? null,
   message: initialBirthdays?.message ?? "Happy Birthday <@user>! 🎉",
 });
 
 // ── New Feed State ───────────────────────────────────────────
 const [isFeedDialogOpen, setIsFeedDialogOpen] = useState(false);
 const [editingFeedId, setEditingFeedId] = useState<string | null>(null);
 const [newFeed, setNewFeed] = useState({
   feedType: "youtube",
   feedUrl: "",
   channelId: "",
   mentionRole: "",
   customMessage: "New post from {name}! {link}",
   enabled: true,
   youtubeLongformOnly: false,
 });

 const handleCreateAchievement = () => {
 if (!newAch.achievementId || !newAch.title) return;
 startTransition(async () => {
  if (editingAchId) {
   await updateAchievement(guildId, editingAchId, {
     achievementId: newAch.achievementId,
     title: newAch.title,
     description: newAch.description,
     requirementType: newAch.requirementType,
     requirementValue: Number(newAch.requirementValue),
     rewardXp: Number(newAch.rewardXp),
     rewardCoins: Number(newAch.rewardCoins),
     channelId: newAch.channelId || null,
     requirementChannelId: newAch.requirementChannelId || null,
   });
  } else {
   await createAchievement(guildId, {
   achievementId: newAch.achievementId,
   title: newAch.title,
   description: newAch.description,
   requirementType: newAch.requirementType,
   requirementValue: Number(newAch.requirementValue),
   rewardXp: Number(newAch.rewardXp),
   rewardCoins: Number(newAch.rewardCoins),
   channelId: newAch.channelId || null,
   requirementChannelId: newAch.requirementChannelId || null,
   });
  }

   setNewAch({
    achievementId: "",
    title: "",
    description: "",
    requirementType: "messages_sent",
    requirementValue: 100,
    rewardXp: 500,
    rewardCoins: 100,
    channelId: "",
    requirementChannelId: "",
   });
   setEditingAchId(null);
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
    channelId: newQuest.channelId || null,
    requirementChannelId: newQuest.requirementChannelId || null,
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
    channelId: "",
    requirementChannelId: "",
   });
   setIsQuestDialogOpen(false);
  });
 };

 const handleCreateFeed = () => {
   if (!newFeed.feedUrl || !newFeed.channelId) return;
   startTransition(async () => {
     const { createSocialFeed, updateSocialFeed } = await import("../actions");
     if (editingFeedId) {
       await updateSocialFeed(guildId, editingFeedId, {
         feedType: newFeed.feedType,
         feedUrl: newFeed.feedUrl,
         channelId: newFeed.channelId,
         mentionRole: newFeed.mentionRole || null,
         customMessage: newFeed.customMessage || null,
         enabled: newFeed.enabled,
         youtubeLongformOnly: newFeed.youtubeLongformOnly,
       });
     } else {
       await createSocialFeed(guildId, {
         feedType: newFeed.feedType,
         feedUrl: newFeed.feedUrl,
         channelId: newFeed.channelId,
         mentionRole: newFeed.mentionRole || null,
         customMessage: newFeed.customMessage || null,
         enabled: newFeed.enabled,
         youtubeLongformOnly: newFeed.youtubeLongformOnly,
       });
     }
     setNewFeed({
       feedType: "youtube",
       feedUrl: "",
       channelId: "",
       mentionRole: "",
       customMessage: "New post from {name}! {link}",
       enabled: true,
       youtubeLongformOnly: false,
     });
     setEditingFeedId(null);
     setIsFeedDialogOpen(false);
   });
 };

 const handleSaveBirthdays = () => {
   startTransition(async () => {
     const { saveBirthdaySettings } = await import("../actions");
     await saveBirthdaySettings(guildId, {
       channelId: birthdaySettings.channelId,
       message: birthdaySettings.message,
       enabled: birthdaySettings.enabled,
     });
   });
 };

  const tabs = [
    { id: "achievements", label: t("tabs.achievements"), icon: Award },
    { id: "quests", label: t("tabs.quests"), icon: Target },
    { id: "reputation", label: t("tabs.reputation"), icon: ThumbsUp },
    { id: "birthdays", label: "Birthdays", icon: Target },
    { id: "feeds", label: "Social Feeds", icon: Target },
  ];

  return (
    <div className="p-6 md:p-10 relative flex-1 overflow-hidden animate-in fade-in duration-500 max-w-[1600px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <Trophy className="w-10 h-10 text-primary" />{t("title")}
        </h1>
        <p className="text-white/60 mt-2 text-sm">
          {t("subtitle")}
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col backdrop-blur-md">
        {/* Browser-style Tabs Header */}
        <div className="flex overflow-x-auto items-end bg-black/40 pt-4 px-4 border-b border-white/10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "group relative flex items-center gap-2 px-6 py-3 transition-all duration-300 font-bold text-sm tracking-wide rounded-t-xl border-t border-x -mb-[1px]",
                activeTab === tab.id
                  ? "bg-white/10 border-white/10 text-white z-10 backdrop-blur-xl"
                  : "bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white/80 hover:border-white/5 z-0"
              )}
            >
              <tab.icon className={cn("w-4 h-4 transition-colors", activeTab === tab.id ? "text-white" : "text-white/40 group-hover:text-white/60")} />
              {tab.label}
              
              {activeTab === tab.id && (
                <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[#0c0c0c]" />
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="p-6 md:p-10 relative flex-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

  {/* Achievement Creation Dialog */}
  <Dialog open={isAchDialogOpen} onOpenChange={setIsAchDialogOpen}>
   <DialogContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl sm:max-w-[700px]">
    <DialogHeader>
     <DialogTitle className="flex items-center gap-2 text-xl font-bold">
      <Award className="w-5 h-5 text-primary" />
      {editingAchId ? "Edit Achievement" : "Create Achievement"}
     </DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Achievement ID</label>
       <Input
        placeholder="chatty-100"
        value={newAch.achievementId}
        onChange={(e) => setNewAch({ ...newAch, achievementId: e.target.value })}
        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Title</label>
       <Input
        placeholder="Chatterbox Tier 1"
        value={newAch.title}
        onChange={(e) => setNewAch({ ...newAch, title: e.target.value })}
        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="space-y-1 md:col-span-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Description (Optional)</label>
       <Textarea
        placeholder="Send 100 messages in server text channels..."
        value={newAch.description}
        onChange={(e) => setNewAch({ ...newAch, description: e.target.value })}
        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
        rows={2}
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Requirement Type</label>
       <select
        value={newAch.requirementType}
        onChange={(e) => setNewAch({ ...newAch, requirementType: e.target.value })}
        className="w-full min-h-[40px] px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm uppercase text-white [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       >
        <option value="messages_sent">Messages Sent</option>
        <option value="voice_minutes">Voice Minutes</option>
        <option value="level_reached">Level Reached</option>
        <option value="tickets_opened">Tickets Opened</option>
       </select>
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Requirement Target Value</label>
       <Input
        type="number"
        min={1}
        value={newAch.requirementValue}
        onChange={(e) => setNewAch({ ...newAch, requirementValue: Number(e.target.value) })}
        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Reward XP (Optional)</label>
       <Input
        type="number"
        min={0}
        value={newAch.rewardXp}
        onChange={(e) => setNewAch({ ...newAch, rewardXp: Number(e.target.value) })}
        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Reward Coins (Optional)</label>
       <Input
        type="number"
        min={0}
        value={newAch.rewardCoins}
        onChange={(e) => setNewAch({ ...newAch, rewardCoins: Number(e.target.value) })}
        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Requirement Channel (Optional)</label>
       <DiscordChannelPicker
        channels={channels}
        value={newAch.requirementChannelId || ""}
        onChange={(v) => setNewAch({ ...newAch, requirementChannelId: v || "" })}
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Notification Channel (Optional)</label>
       <DiscordChannelPicker
        channels={channels}
        value={newAch.channelId || ""}
        onChange={(v) => setNewAch({ ...newAch, channelId: v || "" })}
       />
      </div>
     </div>
    </div>
    <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
     <Button variant="ghost" onClick={() => { setIsAchDialogOpen(false); setEditingAchId(null); setNewAch({ achievementId: "", title: "", description: "", requirementType: "messages_sent", requirementValue: 100, rewardXp: 500, rewardCoins: 100, channelId: "", requirementChannelId: "" }); }} className="text-white/50 hover:text-white">
      Cancel
     </Button>
     <Button onClick={handleCreateAchievement} disabled={isPending} className="bg-white/10 hover:bg-white/20 text-white border-0">
      <Plus className="w-4 h-4 mr-2" />{editingAchId ? "Save Changes" : "Create Achievement"}
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
     onClick={() => {
      setEditingAchId(null);
      setNewAch({ achievementId: "", title: "", description: "", requirementType: "messages_sent", requirementValue: 100, rewardXp: 500, rewardCoins: 100, channelId: "", requirementChannelId: "" });
      setIsAchDialogOpen(true);
     }}
     className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase"
    >
     <Plus className="w-4 h-4 mr-2" />New Achievement
    </Button>
   }
  >
 <div className="space-y-3">
 {initialAchievements.length === 0 ? (
 <p className="text-white/40 text-sm uppercase p-4 border border-border">
 No achievements configured.
 </p>
 ) : (
 initialAchievements.map((a) => (
 <div
 key={a.id}
 className="p-4 rounded-xl border border-white/5 bg-black/20 text-white backdrop-blur-md hover:bg-white/5 transition-all flex justify-between items-center shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-white/80 uppercase tracking-wider">{a.title}</span>
 <span className="text-xs border px-1 border-primary font-bold">
 [{a.achievementId}]
 </span>
  {a.channelId && (
    <span className="text-xs uppercase bg-primary/20 text-primary px-2 py-0.5 rounded font-bold border border-primary/30">
      Notifies # {a.channelId}
    </span>
  )}
  {a.requirementChannelId && (
    <span className="text-xs uppercase bg-white/20 text-white px-2 py-0.5 rounded font-bold border border-white/30 ml-2">
      Requires # {a.requirementChannelId}
    </span>
  )}
 </div>
 <p className="text-xs text-white/40 mt-1">
 Req: {a.requirementType} &ge; {a.requirementValue} | Reward: {a.rewardXp} XP + {a.rewardCoins} Coins
 </p>
 </div>

  <div className="flex items-center gap-2">
  <Button
  size="sm"
  className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
  onClick={() => {
    setEditingAchId(a.id);
    setNewAch({
      achievementId: a.achievementId,
      title: a.title,
      description: a.description || "",
      requirementType: a.requirementType,
      requirementValue: a.requirementValue,
      rewardXp: a.rewardXp || 0,
      rewardCoins: a.rewardCoins || 0,
      channelId: a.channelId || "",
      requirementChannelId: a.requirementChannelId || "",
    });
    setIsAchDialogOpen(true);
  }}
  >
  <Edit2 className="w-3.5 h-3.5"/>
  </Button>
  <Button
  size="sm"
  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() => startTransition(async () => { await deleteAchievement(guildId, a.id); })}
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
      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Quest ID</label>
       <Input
        placeholder="daily-msg-20"
        value={newQuest.questId}
        onChange={(e) => setNewQuest({ ...newQuest, questId: e.target.value })}
        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Quest Title</label>
       <Input
        placeholder="Daily Conversationalist"
        value={newQuest.title}
        onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Quest Type</label>
       <select
        value={newQuest.type}
        onChange={(e) => setNewQuest({ ...newQuest, type: e.target.value })}
        className="w-full min-h-[40px] px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm uppercase text-white [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       >
        <option value="daily">Daily Quest</option>
        <option value="weekly">Weekly Quest</option>
        <option value="event">Special Event Quest</option>
       </select>
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Active Duration (Days)</label>
       <Input
        type="number"
        min={1}
        value={newQuest.durationDays}
        onChange={(e) => setNewQuest({ ...newQuest, durationDays: Number(e.target.value) })}
        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Target Value</label>
       <Input
        type="number"
        min={1}
        value={newQuest.targetValue}
        onChange={(e) => setNewQuest({ ...newQuest, targetValue: Number(e.target.value) })}
        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>
      
      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Reward XP (Optional)</label>
       <Input
        type="number"
        min={0}
        value={newQuest.rewardXp}
        onChange={(e) => setNewQuest({ ...newQuest, rewardXp: Number(e.target.value) })}
        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Requirement Channel (Optional)</label>
       <DiscordChannelPicker
        channels={channels}
        value={newQuest.requirementChannelId || ""}
        onChange={(v) => setNewQuest({ ...newQuest, requirementChannelId: v || "" })}
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Notification Channel (Optional)</label>
       <DiscordChannelPicker
        channels={channels}
        value={newQuest.channelId || ""}
        onChange={(v) => setNewQuest({ ...newQuest, channelId: v || "" })}
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

  {/* Feed Creation Dialog */}
  <Dialog open={isFeedDialogOpen} onOpenChange={setIsFeedDialogOpen}>
   <DialogContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl sm:max-w-[700px]">
    <DialogHeader>
     <DialogTitle className="flex items-center gap-2 text-xl font-bold">
      <Target className="w-5 h-5 text-primary" />
      {editingFeedId ? "Edit Social Feed" : "Create Social Feed"}
     </DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Feed Type</label>
       <select
        value={newFeed.feedType}
        onChange={(e) => setNewFeed({ ...newFeed, feedType: e.target.value })}
        className="w-full min-h-[40px] px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm uppercase text-white [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       >
        <option value="youtube">YouTube Channel</option>
        <option value="rss">RSS Feed</option>
       </select>
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">
         {newFeed.feedType === 'youtube' ? 'YouTube Channel ID' : 'Feed URL'}
       </label>
       <Input
        placeholder={newFeed.feedType === 'youtube' ? 'UC...' : 'https://...'}
        value={newFeed.feedUrl}
        onChange={(e) => setNewFeed({ ...newFeed, feedUrl: e.target.value })}
        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Target Channel</label>
       <DiscordChannelPicker
        channels={channels}
        value={newFeed.channelId}
        onChange={(v) => setNewFeed({ ...newFeed, channelId: v || "" })}
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Custom Message</label>
       <Textarea
        placeholder="New post from {name}! {link}"
        value={newFeed.customMessage || ""}
        onChange={(e) => setNewFeed({ ...newFeed, customMessage: e.target.value })}
        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
        rows={2}
       />
      </div>

      {newFeed.feedType === "youtube" && (
       <div className="flex flex-col gap-2 md:col-span-2">
        <div className="flex items-center gap-2 mt-2">
         <input 
          type="checkbox" 
          checked={newFeed.youtubeLongformOnly} 
          onChange={(e) => setNewFeed({ ...newFeed, youtubeLongformOnly: e.target.checked })} 
         />
         <label className="text-sm font-bold text-white">Longform Videos Only (No Shorts)</label>
        </div>
       </div>
      )}
     </div>
    </div>
    <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
     <Button variant="ghost" onClick={() => { setIsFeedDialogOpen(false); setEditingFeedId(null); }} className="text-white/50 hover:text-white">
      Cancel
     </Button>
     <Button onClick={handleCreateFeed} disabled={isPending} className="bg-white/10 hover:bg-white/20 text-white border-0">
      <Plus className="w-4 h-4 mr-2" />{editingFeedId ? "Save Changes" : "Create Feed"}
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
 <p className="text-white/40 text-sm uppercase p-4 border border-border">
 No active quests.
 </p>
 ) : (
 initialQuests.map((q) => (
 <div
 key={q.id}
 className="p-4 rounded-xl border border-white/5 bg-black/20 text-white backdrop-blur-md hover:bg-white/5 transition-all flex justify-between items-center shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold uppercase text-primary">{q.title}</span>
 <span className="text-xs border px-1 border-primary">
 {q.type}
 </span>
  {q.channelId && (
    <span className="text-xs uppercase bg-primary/20 text-primary px-2 py-0.5 rounded font-bold border border-primary/30 ml-2">
      Notifies # {q.channelId}
    </span>
  )}
  {q.requirementChannelId && (
    <span className="text-xs uppercase bg-white/20 text-white px-2 py-0.5 rounded font-bold border border-white/30 ml-2">
      Requires # {q.requirementChannelId}
    </span>
  )}
 </div>
 <p className="text-xs text-white/40 mt-1">
 Goal: {q.targetType} &ge; {q.targetValue} | Expires: {new Date(q.activeUntil).toLocaleDateString()}
 </p>
 </div>

 <Button
 size="sm"
 className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() => startTransition(async () => { await deleteQuest(guildId, q.id); })}
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
 <thead className="bg-primary/10 border-b border-white/10 text-xs uppercase text-white/60">
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
 <td colSpan={4} className="p-6 text-center text-white/40 uppercase">
 No reputation history recorded.
 </td>
 </tr>
 ) : (
 initialReputation.map((rep) => (
 <tr key={rep.id} className="hover:bg-primary/5">
 <td className="p-3 font-bold text-primary">{rep.userId}</td>
 <td className="p-3 font-bold">{rep.senderId}</td>
 <td className="p-3 truncate max-w-xs">{rep.reason ||"Helpful member"}</td>
 <td className="p-3 text-xs text-white/40">
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

 {/* Tab 4: Birthdays */}
 {activeTab === "birthdays" && (
  <FormSection title="Birthday Settings" icon={Target} description="Announce member birthdays automatically.">
   <div className="space-y-6">
    <div className="flex items-center gap-2">
     <input type="checkbox" checked={birthdaySettings.enabled} onChange={(e) => setBirthdaySettings({ ...birthdaySettings, enabled: e.target.checked })} />
     <label className="text-sm font-bold text-white">Enable Birthday Announcements</label>
    </div>
    {birthdaySettings.enabled && (
     <div className="space-y-4">
      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Announcement Channel</label>
       <DiscordChannelPicker
        channels={channels}
        value={birthdaySettings.channelId || ""}
        onChange={(v) => setBirthdaySettings({ ...birthdaySettings, channelId: v || null })}
       />
      </div>
      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Announcement Message</label>
       <Textarea
        value={birthdaySettings.message}
        onChange={(e) => setBirthdaySettings({ ...birthdaySettings, message: e.target.value })}
        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
        rows={2}
       />
      </div>
     </div>
    )}
    <Button onClick={handleSaveBirthdays} disabled={isPending} className="bg-white/10 hover:bg-white/20 text-white border-0">
     Save Birthday Settings
    </Button>
   </div>
  </FormSection>
 )}

 {/* Tab 5: Social Feeds */}
 {activeTab === "feeds" && (
  <FormSection 
   title="Social Feeds" 
   icon={Target} 
   description="Automatically post YouTube and RSS updates."
   headerAction={
    <Button
     onClick={() => {
       setEditingFeedId(null);
       setNewFeed({ feedType: "youtube", feedUrl: "", channelId: "", mentionRole: "", customMessage: "New post from {name}! {link}", enabled: true, youtubeLongformOnly: false });
       setIsFeedDialogOpen(true);
     }}
     className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase"
    >
     <Plus className="w-4 h-4 mr-2" />New Feed
    </Button>
   }
  >
   <div className="space-y-3">
    {initialFeeds.length === 0 ? (
     <p className="text-white/40 text-sm uppercase p-4 border border-border">
      No feeds configured.
     </p>
    ) : (
     initialFeeds.map((f) => (
      <div key={f.id} className="p-4 rounded-xl border border-white/5 bg-black/20 text-white backdrop-blur-md hover:bg-white/5 transition-all flex justify-between items-center shadow-sm">
       <div>
        <div className="flex items-center gap-2">
         <span className="font-bold uppercase text-primary">{f.feedType}</span>
         <span className="text-xs uppercase bg-white/20 text-white px-2 py-0.5 rounded font-bold border border-white/30">
          Notifies # {f.channelId}
         </span>
        </div>
        <p className="text-xs text-white/40 mt-1 truncate max-w-xs">{f.feedUrl}</p>
       </div>
       <div className="flex items-center gap-2">
        <Button size="sm" className="bg-white/5 hover:bg-white/10 text-white border border-white/10" onClick={() => {
          setEditingFeedId(f.id);
          setNewFeed({
            feedType: f.feedType,
            feedUrl: f.feedUrl,
            channelId: f.channelId,
            mentionRole: f.mentionRole || "",
            customMessage: f.customMessage || "",
            enabled: f.enabled,
            youtubeLongformOnly: f.youtubeLongformOnly || false,
          });
          setIsFeedDialogOpen(true);
        }}>
         <Edit2 className="w-3.5 h-3.5"/>
        </Button>
        <Button size="sm" className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20" onClick={() => startTransition(async () => { const { deleteSocialFeed } = await import("../actions"); await deleteSocialFeed(guildId, f.id); })}>
         <Trash2 className="w-3.5 h-3.5"/>
        </Button>
       </div>
      </div>
     ))
    )}
   </div>
  </FormSection>
 )}
        </div>
      </div>
    </div>
  );
}
