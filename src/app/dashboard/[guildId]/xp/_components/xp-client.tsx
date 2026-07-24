"use client";

import { useState, useTransition } from"react";
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
import { FormSection } from "@/components/dashboard/forms/FormSection";
import { ToggleField } from "@/components/dashboard/forms/ToggleField";
import {
 DiscordChannelMultiPicker,
 type ChannelOption,
} from "@/components/dashboard/pickers/DiscordChannelPicker";
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
 const [activeTab, setActiveTab] = useState<
"user_xp"|"rewards"|"multipliers"|"settings"
 >("user_xp");
 const [isPending, startTransition] = useTransition();

 // ── Settings State ─────────────────────────────────────────────
 const [settings, setSettings] = useState({
 levelUpRewardsEnabled: initialSettings?.levelUpRewardsEnabled ?? true,
 stackRoleRewards: initialSettings?.stackRoleRewards ?? false,
 ignoredChannels: initialSettings?.ignoredChannels ?? "[]",
 ignoredRoles: initialSettings?.ignoredRoles ?? "[]",
 });

 // ── New Reward Form State ──────────────────────────────────────
 const [newReward, setNewReward] = useState({
 level: 5,
 roleId: null as string | null,
 });

 // ── New Multiplier Form State ──────────────────────────────────
 const [newMult, setNewMult] = useState({
 targetId: "",
 targetType: "role",
 multiplier: 150,
 });

 // ── User XP Management & Admin Override State ──────────────────
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

 // ── Pagination and Search State ─────────────────────────────────
 const [xpSearch, setXpSearch] = useState("");
 const [xpPage, setXpPage] = useState(1);
 const ITEMS_PER_PAGE = 10;

 const filteredUserXp = initialUserXp.filter(u => u.userId.includes(xpSearch));
 const totalXpPages = Math.max(1, Math.ceil(filteredUserXp.length / ITEMS_PER_PAGE));
 const currentUserXp = filteredUserXp.slice((xpPage - 1) * ITEMS_PER_PAGE, xpPage * ITEMS_PER_PAGE);

 const handleSaveSettings = () => {
 startTransition(async () => {
 await saveXpSettings(guildId, settings);
 });
 };

 const handleCreateReward = () => {
 if (!newReward.roleId) return;
 startTransition(async () => {
 await createXpReward(guildId, Number(newReward.level), newReward.roleId!);
 setNewReward({ level: 5, roleId: null });
 });
 };

 const handleCreateMultiplier = () => {
 if (!newMult.targetId) return;
 startTransition(async () => {
 await createXpMultiplier(
 guildId,
 newMult.targetId,
 newMult.targetType,
 Number(newMult.multiplier)
 );
 setNewMult({ targetId: "", targetType: "role", multiplier: 150 });
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
 });
 };

 return (
 <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
 <div className="flex items-center justify-between border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tighter uppercase flex items-center gap-3">
 <Star className="w-10 h-10 text-primary"/>Xp And Member Levels</h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Manage user XP/levels, role rewards, multipliers, and leveling rules.
 </p>
 </div>
 </div>

 {/* Navigation Tabs */}
 <div className="flex flex-wrap gap-2 border-b border-border/50 pb-2">
 {[
 { id: "user_xp", label: "User XP & Level Management", icon: Users },
 { id: "rewards", label: "Level Role Rewards", icon: Award },
 { id: "multipliers", label: "XP Multipliers", icon: Zap },
 { id: "settings", label: "XP Rules & Ignored", icon: Star },
 ].map((tab) => (
 <Button
 key={tab.id}
 variant={activeTab === tab.id ? "default" : "ghost"}
 onClick={() => setActiveTab(tab.id as any)}
 className="rounded-md border border-border font-medium text-xs"
 >
 <tab.icon className="w-4 h-4 mr-2"/>
 {tab.label}
 </Button>
 ))}
 </div>

 {/* Tab 1: User XP & Level Management */}
 {activeTab === "user_xp" && (
 <div className="space-y-6">
 <FormSection
 title="Set User Xp Or Level"
 icon={Users}
 description="Directly assign XP, level, or prestige to a specific user."
 >
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Target User ID</label>
 <Input
 placeholder="Discord User ID"
 value={newUserXp.userId}
 onChange={(e) => setNewUserXp({ ...newUserXp, userId: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Total XP</label>
 <Input
 type="number"
 min={0}
 value={newUserXp.xp}
 onChange={(e) => setNewUserXp({ ...newUserXp, xp: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Level</label>
 <Input
 type="number"
 min={0}
 value={newUserXp.level}
 onChange={(e) => setNewUserXp({ ...newUserXp, level: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Prestige Level</label>
 <Input
 type="number"
 min={0}
 value={newUserXp.prestigeLevel}
 onChange={(e) => setNewUserXp({ ...newUserXp, prestigeLevel: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>
 </div>

 <Button
 onClick={handleCreateUserXpOverride}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs"
 >
 <Plus className="w-4 h-4 mr-2"/>Assign User Xp</Button>
 </FormSection>

 <FormSection
 title="Guild Xp Leaderboard And Management"
 icon={Users}
 description="View member rankings and override individual scores."
 >
 {editingUser && (
 <div className="p-4 border border-border bg-primary/10 mb-4 space-y-4">
 <h4 className="font-bold text-sm uppercase text-primary">
 EDIT_USER_PROGRESS: {editingUser.userId}
 </h4>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">XP</label>
 <Input
 type="number"
 value={editingUser.xp}
 onChange={(e) => setEditingUser({ ...editingUser, xp: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Level</label>
 <Input
 type="number"
 value={editingUser.level}
 onChange={(e) => setEditingUser({ ...editingUser, level: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Prestige Level</label>
 <Input
 type="number"
 value={editingUser.prestigeLevel}
 onChange={(e) => setEditingUser({ ...editingUser, prestigeLevel: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>
 </div>
 <div className="flex items-center gap-2">
 <Button
 size="sm"
 onClick={handleSaveUserXpOverride}
 disabled={isPending}
 className="rounded-md border border-border text-xs font-medium"
 >
 <Save className="w-3.5 h-3.5 mr-1"/>Commit Changes</Button>
 <Button
 size="sm"
 variant="outline"
 onClick={() => setEditingUser(null)}
 className="rounded-md border border-border text-xs uppercase"
 >
 Cancel
 </Button>
 </div>
 </div>
 )}

  <div className="flex items-center justify-between mb-4 gap-4">
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search by User ID..."
        value={xpSearch}
        onChange={(e) => {
          setXpSearch(e.target.value);
          setXpPage(1);
        }}
        className="pl-9"
      />
    </div>
  </div>

  <div className="overflow-x-auto rounded-lg border border-border">
 <table className="w-full text-left border-collapse text-sm">
 <thead className="bg-primary/10 border-b border-border text-xs uppercase">
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
  <td colSpan={6} className="p-6 text-center text-muted-foreground uppercase">
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
  variant="outline"
  onClick={() =>
  setEditingUser({
  userId: u.userId,
  xp: u.xp,
  level: u.level,
  prestigeLevel: u.prestigeLevel,
  })
  }
  className="text-xs"
  >
  <Edit2 className="w-3.5 h-3.5 mr-1"/>
  Manage
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
      <span className="text-sm font-medium text-muted-foreground">
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
 <FormSection
 title="Create Level Role Reward"
 icon={Award}
 description="Automatically assign roles when users hit level milestones."
 >
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Required Level</label>
 <Input
 type="number"
 min={1}
 value={newReward.level}
 onChange={(e) => setNewReward({ ...newReward, level: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Reward Role</label>
 <DiscordRolePicker
 roles={roles}
 value={newReward.roleId}
 onChange={(r) => setNewReward({ ...newReward, roleId: r })}
 />
 </div>
 </div>

 <Button
 onClick={handleCreateReward}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs"
 >
 <Plus className="w-4 h-4 mr-2"/>Add Reward Role</Button>
 </FormSection>

 <FormSection title="Active Level Rewards"icon={Award} description="Configured role milestones.">
 <div className="space-y-3">
 {initialRewards.length === 0 ? (
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
 No level rewards configured.
 </p>
 ) : (
 initialRewards.map((r) => {
 const roleObj = roles.find((rl) => rl.id === r.roleId);
 return (
 <div
 key={`${r.level}-${r.roleId}`}
 className="p-4 border border-border bg-card flex justify-between items-center shadow-sm"
 >
 <div className="flex items-center gap-3">
 <span className="font-bold text-primary text-lg">
 Level {r.level}
 </span>
 <span className="text-xs border px-2 py-1 border-primary font-bold uppercase">
 Role: {roleObj ? roleObj.name : r.roleId}
 </span>
 </div>

 <Button
 size="sm"
 variant="destructive"
 onClick={() => startTransition(async () => { await deleteXpReward(guildId, r.level, r.roleId); })}
 className="rounded-md border border-destructive text-xs uppercase"
 >
 <Trash2 className="w-3.5 h-3.5"/>
 </Button>
 </div>
 );
 })
 )}
 </div>
 </FormSection>
 </div>
 )}

 {/* Tab 3: XP Multipliers */}
 {activeTab ==="multipliers"&& (
 <div className="space-y-6">
 <FormSection
 title="Create Xp Multiplier"
 icon={Zap}
 description="Assign boosted XP gain to specific roles or channels."
 >
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Target Type</label>
 <select
 value={newMult.targetType}
 onChange={(e) => setNewMult({ ...newMult, targetType: e.target.value })}
 className="w-full p-2 bg-background border border-border rounded-md text-sm uppercase"
 >
 <option value="role">Role Multiplier</option>
 <option value="channel">Channel Multiplier</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Target ID (Role or Channel)</label>
 {newMult.targetType ==="role"? (
 <DiscordRolePicker
 roles={roles}
 value={newMult.targetId || null}
 onChange={(r) => setNewMult({ ...newMult, targetId: r ||""})}
 />
 ) : (
 <Input
 placeholder="Channel Snowflake ID"
 value={newMult.targetId}
 onChange={(e) => setNewMult({ ...newMult, targetId: e.target.value })}
 className="rounded-md border border-border"
 />
 )}
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Multiplier % (150 = 1.5x)</label>
 <Input
 type="number"
 min={50}
 max={500}
 step={10}
 value={newMult.multiplier}
 onChange={(e) => setNewMult({ ...newMult, multiplier: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>
 </div>

 <Button
 onClick={handleCreateMultiplier}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs"
 >
 <Plus className="w-4 h-4 mr-2"/>Create Multiplier</Button>
 </FormSection>

 <FormSection title="Active Xp Multipliers"icon={Zap} description="Configured boosts.">
 <div className="space-y-3">
 {initialMultipliers.length === 0 ? (
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
 No custom XP multipliers configured.
 </p>
 ) : (
 initialMultipliers.map((m) => (
 <div
 key={`${m.targetId}-${m.targetType}`}
 className="p-4 border border-border bg-card flex justify-between items-center shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold uppercase text-primary">
 {m.targetType.toUpperCase()}: {m.targetId}
 </span>
 <span className="text-xs border px-2 py-0.5 border-primary font-bold text-emerald-500">
 {m.multiplier}% ({ (m.multiplier / 100).toFixed(1) }x)
 </span>
 </div>
 </div>

 <Button
 size="sm"
 variant="destructive"
 onClick={() =>
 startTransition(async () => { await deleteXpMultiplier(guildId, m.targetId, m.targetType); })
 }
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
 className="rounded-md border border-border shadow-sm font-medium text-xs"
 >
 <Save className="w-4 h-4 mr-2"/>Save Xp Rules</Button>
 </div>
 </FormSection>
 )}
 </div>
 );
}
