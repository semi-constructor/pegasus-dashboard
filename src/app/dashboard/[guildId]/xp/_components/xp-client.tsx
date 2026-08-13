"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Star,
  Award,
  Zap,
  Users,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormSection } from "@/components/dashboard/forms/FormSection";
import { ToggleField } from "@/components/dashboard/forms/ToggleField";
import {
  DiscordChannelPicker,
  DiscordChannelMultiPicker,
  type ChannelOption,
} from "@/components/dashboard/pickers/DiscordChannelPicker";
import { DiscordUserPicker } from "@/components/dashboard/pickers/DiscordUserPicker";
import {
  DiscordRolePicker,
  DiscordRoleMultiPicker,
  type RoleOption,
} from "@/components/dashboard/pickers/DiscordRolePicker";
import {
  saveXpSettings,
  createXpReward,
  deleteXpReward,
  createXpMultiplier,
  deleteXpMultiplier,
  updateUserXpOverride,
} from "../actions";
import { formatNumber } from "@/lib/utils";

interface XpClientProps {
  guildId: string;
  initialSettings: any;
  initialRewards: any[];
  initialMultipliers: any[];
  initialUserXp: any[];
  channels: ChannelOption[];
  roles: RoleOption[];
}

export default function XpClient({
  guildId,
  initialSettings,
  initialRewards,
  initialMultipliers,
  initialUserXp,
  channels,
  roles,
}: XpClientProps) {
  const t = useTranslations('guildXp');
  const [activeTab, setActiveTab] = useState<"user_xp" | "rewards" | "multipliers" | "settings">("user_xp");
  const [isPending, startTransition] = useTransition();

  const [editingRewardLevel, setEditingRewardLevel] = useState<number | null>(null);
  const [editingMultId, setEditingMultId] = useState<{ id: string; type: string } | null>(null);
  
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);
  const [isMultDialogOpen, setIsMultDialogOpen] = useState(false);

  const [settings, setSettings] = useState({
    levelUpRewardsEnabled: initialSettings?.levelUpRewardsEnabled ?? true,
    stackRoleRewards: initialSettings?.stackRoleRewards ?? false,
    ignoredChannels: initialSettings?.ignoredChannels ?? "[]",
    ignoredRoles: initialSettings?.ignoredRoles ?? "[]",
  });

  const [newReward, setNewReward] = useState({
    level: 5,
    roleId: null as string | null,
  });

  const [newMult, setNewMult] = useState({
    targetId: "",
    targetType: "role",
    multiplier: 150,
  });

  const [editingUser, setEditingUser] = useState<{
    userId: string;
    xp: number;
    level: number;
    prestigeLevel: number;
  } | null>(null);

  const [newUserXp, setNewUserXp] = useState({
    userId: "",
    xp: 100,
    level: 1,
    prestigeLevel: 0,
  });

  const [xpSearch, setXpSearch] = useState("");
  const [xpPage, setXpPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredUserXp = initialUserXp.filter((u) => u.userId.includes(xpSearch));
  const totalXpPages = Math.max(1, Math.ceil(filteredUserXp.length / ITEMS_PER_PAGE));
  const currentUserXp = filteredUserXp.slice((xpPage - 1) * ITEMS_PER_PAGE, xpPage * ITEMS_PER_PAGE);

  const handleSaveSettings = () => {
    startTransition(async () => {
      await saveXpSettings(guildId, settings);
    });
  };

  const handleSaveReward = () => {
    if (!newReward.roleId) return;
    startTransition(async () => {
      if (editingRewardLevel !== null && editingRewardLevel !== newReward.level) {
        await deleteXpReward(guildId, editingRewardLevel, newReward.roleId!);
      }
      await createXpReward(guildId, Number(newReward.level), newReward.roleId!);
      setEditingRewardLevel(null);
      setNewReward({ level: 5, roleId: null });
      setIsRewardDialogOpen(false);
    });
  };

  const handleSaveMultiplier = () => {
    if (!newMult.targetId) return;
    startTransition(async () => {
      if (editingMultId) {
        if (editingMultId.id !== newMult.targetId || editingMultId.type !== newMult.targetType) {
          await deleteXpMultiplier(guildId, editingMultId.id, editingMultId.type);
        }
      }
      await createXpMultiplier(guildId, newMult.targetId, newMult.targetType, Number(newMult.multiplier));
      setEditingMultId(null);
      setNewMult({ targetId: "", targetType: "role", multiplier: 150 });
      setIsMultDialogOpen(false);
    });
  };

  const handleSaveUserXpOverride = () => {
    if (!editingUser) return;
    startTransition(async () => {
      await updateUserXpOverride(
        guildId,
        editingUser.userId,
        Number(editingUser.xp),
        Number(editingUser.level),
        Number(editingUser.prestigeLevel)
      );
      setEditingUser(null);
      setIsUserDialogOpen(false);
    });
  };

  const handleCreateUserXpOverride = () => {
    if (!newUserXp.userId) return;
    startTransition(async () => {
      await updateUserXpOverride(
        guildId,
        newUserXp.userId,
        Number(newUserXp.xp),
        Number(newUserXp.level),
        Number(newUserXp.prestigeLevel)
      );
      setNewUserXp({ userId: "", xp: 100, level: 1, prestigeLevel: 0 });
      setIsUserDialogOpen(false);
    });
  };

  const tabs = [
    { id: "user_xp", label: t("tabs.userXp"), icon: Users },
    { id: "rewards", label: t("tabs.rewards"), icon: Award },
    { id: "multipliers", label: t("tabs.multipliers"), icon: Zap },
    { id: "settings", label: t("tabs.settings"), icon: Star },
  ];

  return (
    <div className="text-foreground p-2 sm:p-6 lg:p-10 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-border pb-4 sm:pb-6 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60 tracking-tight flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-foreground/5 rounded-2xl border border-border backdrop-blur-md shrink-0">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-foreground" />
            </div>
            {t("title")}
          </h1>
          <p className="text-foreground/40 mt-2 sm:mt-3 text-xs sm:text-sm font-medium tracking-wide">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="bg-foreground/5 border border-border rounded-2xl shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col backdrop-blur-md">
        {/* Browser-style Tabs Header */}
        <div className="flex overflow-x-auto items-end bg-background/40 pt-3 sm:pt-4 px-2 sm:px-4 border-b border-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 touch-pan-x">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "group relative flex items-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 font-bold text-xs sm:text-sm tracking-wide rounded-t-xl border-t border-x -mb-[1px] shrink-0 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-foreground/10 border-border text-foreground z-10 backdrop-blur-xl"
                  : "bg-transparent border-transparent text-foreground/40 hover:bg-foreground/5 hover:text-foreground/80 hover:border-border z-0"
              )}
            >
              <tab.icon className={cn("w-4 h-4 transition-colors shrink-0", activeTab === tab.id ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/60")} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[#0c0c0c]" />
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="p-3 sm:p-6 md:p-10 relative flex-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-foreground/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-10"
            >

 {/* Tab 1: User XP & Level Management */}
 {activeTab === "user_xp" && (
 <div className="space-y-6">
 <Dialog open={isUserDialogOpen} onOpenChange={(open) => {
   setIsUserDialogOpen(open);
   if (!open) {
     setEditingUser(null);
     setNewUserXp({ userId: "", xp: 100, level: 1, prestigeLevel: 0 });
   }
 }}>
   <DialogContent className="bg-background/90 border border-border text-foreground backdrop-blur-xl sm:max-w-[500px]">
     <DialogHeader>
       <DialogTitle className="flex items-center gap-2 text-xl font-bold">
         <Users className="w-5 h-5 text-primary" />
         {editingUser ? "Edit User Progress" : "Assign User XP"}
       </DialogTitle>
     </DialogHeader>
     
     <div className="grid gap-4 py-4">
       <div className="flex flex-col gap-2">
         <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Target User ID</label>
         <DiscordUserPicker
           guildId={guildId}
           value={editingUser ? editingUser.userId : newUserXp.userId}
           onChange={(v) => 
             editingUser 
               ? setEditingUser({ ...editingUser, userId: v || "" }) 
               : setNewUserXp({ ...newUserXp, userId: v || "" })
           }
           disabled={!!editingUser}
         />
       </div>
       <div className="flex flex-col gap-2">
         <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Total XP</label>
         <Input
           type="number"
           min={0}
           value={editingUser ? editingUser.xp : newUserXp.xp}
           onChange={(e) => 
             editingUser
               ? setEditingUser({ ...editingUser, xp: Number(e.target.value) })
               : setNewUserXp({ ...newUserXp, xp: Number(e.target.value) })
           }
           className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
         />
       </div>
       <div className="grid grid-cols-2 gap-4">
         <div className="flex flex-col gap-2">
           <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Level</label>
           <Input
             type="number"
             min={0}
             value={editingUser ? editingUser.level : newUserXp.level}
             onChange={(e) => 
               editingUser
                 ? setEditingUser({ ...editingUser, level: Number(e.target.value) })
                 : setNewUserXp({ ...newUserXp, level: Number(e.target.value) })
             }
             className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
           />
         </div>
         <div className="flex flex-col gap-2">
           <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Prestige</label>
           <Input
             type="number"
             min={0}
             value={editingUser ? editingUser.prestigeLevel : newUserXp.prestigeLevel}
             onChange={(e) => 
               editingUser
                 ? setEditingUser({ ...editingUser, prestigeLevel: Number(e.target.value) })
                 : setNewUserXp({ ...newUserXp, prestigeLevel: Number(e.target.value) })
             }
             className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
           />
         </div>
       </div>
     </div>

     <div className="flex justify-end gap-2">
       <Button variant="ghost" onClick={() => setIsUserDialogOpen(false)} className="text-foreground/50 hover:text-foreground">
         Cancel
       </Button>
       <Button
         onClick={editingUser ? handleSaveUserXpOverride : handleCreateUserXpOverride}
         disabled={isPending}
         className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-0"
       >
         <Save className="w-4 h-4 mr-2" />
         {editingUser ? "Save Changes" : "Assign XP"}
       </Button>
     </div>
   </DialogContent>
 </Dialog>

 <FormSection
 title="Guild Xp Leaderboard And Management"
 icon={Users}
 description="View member rankings and override individual scores."
 headerAction={
   <Button
     onClick={() => {
       setEditingUser(null);
       setNewUserXp({ userId: "", xp: 100, level: 1, prestigeLevel: 0 });
       setIsUserDialogOpen(true);
     }}
     className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-0 shadow-sm font-bold text-xs uppercase"
   >
     <Plus className="w-4 h-4 mr-2" />Assign XP
   </Button>
 }
 >

  <div className="flex items-center justify-between mb-4 gap-4">
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
      <Input
        placeholder="Search by User ID..."
        value={xpSearch}
        onChange={(e) => {
          setXpSearch(e.target.value);
          setXpPage(1);
        }}
        className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] pl-10 pr-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
      />
    </div>
  </div>

  <div className="overflow-x-auto rounded-lg border border-border">
 <table className="w-full text-left border-collapse text-sm">
 <thead className="bg-primary/10 border-b border-border text-xs uppercase text-foreground/60">
 <tr>
 <th className="p-3">Rank</th>
 <th className="p-3">User ID</th>
 <th className="p-3">Total XP</th>
 <th className="p-3">Level</th>
 <th className="p-3">Prestige</th>
 <th className="p-3">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-primary/20">
  {currentUserXp.length === 0 ? (
  <tr>
  <td colSpan={6} className="p-6 text-center text-foreground/40 uppercase">
  No member XP data found.
  </td>
  </tr>
  ) : (
  currentUserXp.map((u, idx) => (
  <tr key={u.userId} className="hover:bg-primary/5 transition-colors">
  <td className="p-3 font-medium">#{((xpPage - 1) * ITEMS_PER_PAGE) + idx + 1}</td>
  <td className="p-3 font-medium">{u.userId}</td>
  <td className="p-3 font-medium text-primary">{formatNumber(u.xp)} XP</td>
  <td className="p-3 font-medium">
  <span className="px-2 py-0.5 rounded-md border border-primary/20 bg-primary/10 text-xs">
  Lvl {u.level}
  </span>
  </td>
  <td className="p-3 text-yellow-500 font-medium">P{u.prestigeLevel}</td>
  <td className="p-3">
   <Button
    size="sm"
    className="bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border"onClick={() => {
      setEditingUser(u);
      setIsUserDialogOpen(true);
    }}
  >
    <Edit2 className="w-3.5 h-3.5 mr-1"/>
    Edit
  </Button>
  </td>
  </tr>
  ))
  )}
  </tbody>
  </table>
  </div>

  {totalXpPages > 1 && (
    <div className="flex items-center justify-end gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setXpPage(p => Math.max(1, p - 1))}
        disabled={xpPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-sm font-medium text-foreground/40">
        Page {xpPage} of {totalXpPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setXpPage(p => Math.min(totalXpPages, p + 1))}
        disabled={xpPage === totalXpPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )}
 </FormSection>
 </div>
 )}

 {/* Tab 2: Level Rewards */}
 {activeTab ==="rewards"&& (
 <div className="space-y-6">
    <Dialog open={isRewardDialogOpen} onOpenChange={(open) => {
      setIsRewardDialogOpen(open);
      if (!open) {
        setEditingRewardLevel(null);
        setNewReward({ level: 5, roleId: null });
      }
    }}>
      <DialogContent className="bg-background/90 border border-border text-foreground backdrop-blur-xl sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Award className="w-5 h-5 text-primary" />
            {editingRewardLevel !== null ? "Edit Level Reward" : "Create Level Reward"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Required Level</label>
            <Input
              type="number"
              min={1}
              value={newReward.level}
              onChange={(e) => setNewReward({ ...newReward, level: Number(e.target.value) })}
              className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Reward Role</label>
            <DiscordRolePicker
              roles={roles}
              value={newReward.roleId}
              onChange={(r) => setNewReward({ ...newReward, roleId: r })}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsRewardDialogOpen(false)} className="text-foreground/50 hover:text-foreground">
            Cancel
          </Button>
          <Button
            onClick={handleSaveReward}
            disabled={isPending}
            className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-0"
          >
            <Save className="w-4 h-4 mr-2" />
            {editingRewardLevel !== null ? "Save Changes" : "Add Reward Role"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <FormSection
      title="Active Level Rewards"
      icon={Award}
      description="Configured role milestones."
      headerAction={
        <Button
          onClick={() => {
            setEditingRewardLevel(null);
            setNewReward({ level: 5, roleId: null });
            setIsRewardDialogOpen(true);
          }}
          className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-0 shadow-sm font-bold text-xs uppercase"
        >
          <Plus className="w-4 h-4 mr-2" />Add Reward
        </Button>
      }
    >
 <div className="space-y-3">
 {initialRewards.length === 0 ? (
 <p className="text-foreground/40 text-sm uppercase p-4 border border-border bg-foreground/5 rounded-xl">
 No level rewards configured.
 </p>
 ) : (
 initialRewards.map((r) => {
 const roleObj = roles.find((rl) => rl.id === r.roleId);
 return (
 <div
 key={`${r.level}-${r.roleId}`}
 className="p-4 rounded-xl bg-background/20 border border-border flex items-center gap-3 justify-between shadow-sm"
 >
 <div className="flex items-center gap-3">
 <span className="font-bold text-primary text-lg">
 Level {r.level}
 </span>
 <Badge variant="outline" className="text-xs border-primary font-bold uppercase">
 Role: {roleObj ? roleObj.name : r.roleId}
 </Badge>
 </div>
 <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border"onClick={() => {
                            setEditingRewardLevel(r.level);
                            setNewReward({ level: r.level, roleId: r.roleId });
                            setIsRewardDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() => startTransition(async () => { await deleteXpReward(guildId, r.level, r.roleId); })}
                        >
                          <Trash2 className="w-3.5 h-3.5"/>
                        </Button>
 </div>
 </div>
 );
 })
 )}
 </div>
 </FormSection>
 </div>
 )}

  {/* Tab 3: XP Multipliers */}
  {activeTab === "multipliers" && (
  <div className="space-y-6">
    <Dialog open={isMultDialogOpen} onOpenChange={(open) => {
      setIsMultDialogOpen(open);
      if (!open) {
        setEditingMultId(null);
        setNewMult({ targetId: "", targetType: "role", multiplier: 150 });
      }
    }}>
      <DialogContent className="bg-background/90 border border-border text-foreground backdrop-blur-xl sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Zap className="w-5 h-5 text-primary" />
            {editingMultId ? "Edit XP Multiplier" : "Create XP Multiplier"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Target Type</label>
            <select
              value={newMult.targetType}
              onChange={(e) => setNewMult({ ...newMult, targetType: e.target.value })}
              className="w-full min-h-[40px] px-3 py-2 bg-background/40 border border-border rounded-lg text-sm uppercase text-foreground [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
            >
              <option value="role">Role Multiplier</option>
              <option value="channel">Channel Multiplier</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Target ID (Role or Channel)</label>
            {newMult.targetType === "role" ? (
              <DiscordRolePicker
                roles={roles}
                value={newMult.targetId || null}
                onChange={(r) => setNewMult({ ...newMult, targetId: r || "" })}
              />
            ) : (
              <DiscordChannelPicker
                channels={channels}
                value={newMult.targetId || null}
                onChange={(c) => setNewMult({ ...newMult, targetId: c || "" })}
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Multiplier % (150 = 1.5x)</label>
            <Input
              type="number"
              min={50}
              max={500}
              step={10}
              value={newMult.multiplier}
              onChange={(e) => setNewMult({ ...newMult, multiplier: Number(e.target.value) })}
              className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsMultDialogOpen(false)} className="text-foreground/50 hover:text-foreground">
            Cancel
          </Button>
          <Button
            onClick={handleSaveMultiplier}
            disabled={isPending}
            className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-0"
          >
            <Save className="w-4 h-4 mr-2" />
            {editingMultId ? "Save Changes" : "Create Multiplier"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <FormSection 
      title="Active Xp Multipliers" 
      icon={Zap} 
      description="Configured boosts."
      headerAction={
        <Button
          onClick={() => {
            setEditingMultId(null);
            setNewMult({ targetId: "", targetType: "role", multiplier: 150 });
            setIsMultDialogOpen(true);
          }}
          className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-0 shadow-sm font-bold text-xs uppercase"
        >
          <Plus className="w-4 h-4 mr-2" />Add Multiplier
        </Button>
      }
    >
 <div className="space-y-3">
 {initialMultipliers.length === 0 ? (
 <p className="text-foreground/40 text-sm uppercase p-4 border border-border bg-foreground/5 rounded-xl">
 No custom XP multipliers configured.
 </p>
 ) : (
 initialMultipliers.map((m) => (
 <div
 key={`${m.targetId}-${m.targetType}`}
 className="p-4 rounded-xl bg-background/20 border border-border flex items-center gap-3 justify-between shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <Badge variant="outline" className="font-bold uppercase border-primary text-primary">
 {m.targetType}: {m.targetId}
 </Badge>
 <span className="text-xs border px-2 py-0.5 border-primary font-bold text-emerald-500">
 {m.multiplier}% ({ (m.multiplier / 100).toFixed(1) }x)
 </span>
 </div>
 </div>
 <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border"onClick={() => {
                            setEditingMultId({ id: m.targetId, type: m.targetType });
                            setNewMult({ targetId: m.targetId, targetType: m.targetType, multiplier: m.multiplier });
                            setIsMultDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() =>
                            startTransition(async () => { await deleteXpMultiplier(guildId, m.targetId, m.targetType); })
                          }
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

 {/* Tab 4: XP Rules & Ignored */}
 {activeTab ==="settings"&& (
 <FormSection title="Xp Progression Rules"icon={Star} description="Global leveling policies and reward behavior.">
 <div className="space-y-4">
 <ToggleField
 label="Level Up Role Rewards"
 description="Automatically grant roles when members level up"
 checked={settings.levelUpRewardsEnabled}
 onCheckedChange={(c) => setSettings({ ...settings, levelUpRewardsEnabled: c })}
 />
 <ToggleField
 label="Stack Role Rewards"
 description="Keep previous level roles when unlocking higher tier roles"
 checked={settings.stackRoleRewards}
 onCheckedChange={(c) => setSettings({ ...settings, stackRoleRewards: c })}
 />

 <Button
 onClick={handleSaveSettings}
 disabled={isPending}
 className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-0 shadow-sm font-bold text-xs uppercase"
 >
 <Save className="w-4 h-4 mr-2"/>Save Xp Rules</Button>
 </div>
 </FormSection>
 )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
