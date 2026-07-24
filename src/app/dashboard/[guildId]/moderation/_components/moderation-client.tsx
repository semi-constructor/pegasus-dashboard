"use client";

import { useState, useTransition } from"react";
import {
 Shield,
 AlertTriangle,
 FileText,
 Filter,
 Plus,
 Trash2,
 CheckCircle,
 XCircle,
 Sliders,
} from"lucide-react";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { Button } from"@/components/ui/button";
import { FormSection } from"@/components/dashboard/forms/FormSection";
import { ToggleField } from"@/components/dashboard/forms/ToggleField";
import {
 DiscordChannelPicker,
 type ChannelOption,
} from"@/components/dashboard/pickers/DiscordChannelPicker";
import {
 DiscordRolePicker,
 type RoleOption,
} from"@/components/dashboard/pickers/DiscordRolePicker";
import {
 createWarning,
 toggleWarningStatus,
 deleteWarning,
 createWarningAutomation,
 deleteWarningAutomation,
 createWordFilterRule,
 deleteWordFilterRule,
 saveModLogSetting,
} from"../actions";

interface ModerationClientProps {
 guildId: string;
 initialCases: any[];
 initialWarnings: any[];
 initialAutomations: any[];
 initialWordFilters: any[];
 initialLogSettings: any[];
 channels: ChannelOption[];
 roles: RoleOption[];
}

export default function ModerationClient({
 guildId,
 initialCases,
 initialWarnings,
 initialAutomations,
 initialWordFilters,
 initialLogSettings,
 channels,
 roles,
}: ModerationClientProps) {
 const [activeTab, setActiveTab] = useState<
"cases"|"warnings"|"automations"|"filters"|"logging"
 >("cases");
 const [isPending, startTransition] = useTransition();

 // ── New Warning Form State ─────────────────────────────────────
 const [newWarn, setNewWarn] = useState({
 userId:"",
 title:"",
 description:"",
 level: 1,
 proof:"",
 });

 // ── New Automation Form State ──────────────────────────────────
 const [newAuto, setNewAuto] = useState({
 name:"",
 description:"",
 triggerType:"warn_count",
 triggerValue: 3,
 actionType:"timeout",
 actionDuration: 3600,
 notifyChannelId: null as string | null,
 notifyMessage:"User {user} has triggered automation rule {name}.",
 });

 // ── New Word Filter Form State ─────────────────────────────────
 const [newFilter, setNewFilter] = useState({
 pattern:"",
 matchType:"literal",
 caseSensitive: false,
 wholeWord: true,
 severity:"medium",
 autoDelete: true,
 notifyChannelId: null as string | null,
 actionType:"warn",
 });

 // ── Mod Log Settings State ─────────────────────────────────────
 const categories = [
"moderation",
"messages",
"joins",
"leaves",
"voice",
"roles",
"channels",
"automod",
"tickets",
 ];
 const [logSettings, setLogSettings] = useState<Record<string, { channelId: string; enabled: boolean }>>(() => {
 const map: Record<string, { channelId: string; enabled: boolean }> = {};
 for (const cat of categories) {
 const match = initialLogSettings.find((s) => s.category === cat);
 map[cat] = {
 channelId: match?.channelId ||"",
 enabled: match?.enabled ?? true,
 };
 }
 return map;
 });

 // Actions handlers
 const handleCreateWarn = () => {
 if (!newWarn.userId || !newWarn.title) return;
 startTransition(async () => {
 await createWarning(guildId, newWarn);
 setNewWarn({ userId:"", title:"", description:"", level: 1, proof:""});
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
 name:"",
 description:"",
 triggerType:"warn_count",
 triggerValue: 3,
 actionType:"timeout",
 actionDuration: 3600,
 notifyChannelId: null,
 notifyMessage:"User {user} has triggered automation rule {name}.",
 });
 });
 };

 const handleCreateFilter = () => {
 if (!newFilter.pattern) return;
 startTransition(async () => {
 await createWordFilterRule(guildId, {
 pattern: newFilter.pattern,
 matchType: newFilter.matchType,
 caseSensitive: newFilter.caseSensitive,
 wholeWord: newFilter.wholeWord,
 severity: newFilter.severity,
 autoDelete: newFilter.autoDelete,
 notifyChannelId: newFilter.notifyChannelId || undefined,
 actions: [{ type: newFilter.actionType }],
 });
 setNewFilter({
 pattern:"",
 matchType:"literal",
 caseSensitive: false,
 wholeWord: true,
 severity:"medium",
 autoDelete: true,
 notifyChannelId: null,
 actionType:"warn",
 });
 });
 };

 const handleSaveLogSetting = (category: string) => {
 const setting = logSettings[category];
 if (!setting.channelId) return;
 startTransition(async () => {
 await saveModLogSetting(guildId, {
 category,
 channelId: setting.channelId,
 enabled: setting.enabled,
 });
 });
 };

 return (
 <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
 <div className="flex items-center justify-between border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tighter uppercase flex items-center gap-3">
 <Shield className="w-10 h-10 text-primary"/>Moderation Suite</h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Case history, warnings, penalty automations, and word filters.
 </p>
 </div>
 </div>

 {/* Tabs Header */}
 <div className="flex flex-wrap gap-2 border-b border-border/50 pb-2">
 {[
 { id:"cases", label:"Mod Cases Log", icon: FileText },
 { id:"warnings", label:"Warnings CRUD", icon: AlertTriangle },
 { id:"automations", label:"Penalty Automations", icon: Sliders },
 { id:"filters", label:"Word Filters", icon: Filter },
 { id:"logging", label:"Mod Log Routing", icon: Shield },
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

 {/* Tab Content: Cases */}
 {activeTab ==="cases"&& (
 <FormSection title="Moderation Cases"icon={FileText} description="Read-only history of staff actions.">
 <div className="overflow-x-auto border border-border">
 <table className="w-full text-left border-collapse text-sm">
 <thead className="bg-primary/10 border-b border-border text-xs uppercase">
 <tr>
 <th className="p-3">Case #</th>
 <th className="p-3">Action</th>
 <th className="p-3">Target User ID</th>
 <th className="p-3">Moderator ID</th>
 <th className="p-3">Reason</th>
 <th className="p-3">Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-primary/20">
 {initialCases.length === 0 ? (
 <tr>
 <td colSpan={6} className="p-6 text-center text-muted-foreground uppercase">
 No moderation cases recorded yet.
 </td>
 </tr>
 ) : (
 initialCases.map((c) => (
 <tr key={c.id} className="hover:bg-primary/5">
 <td className="p-3 font-bold">#{c.caseNumber || c.id}</td>
 <td className="p-3 uppercase">
 <span className="px-2 py-0.5 border border-primary bg-primary/20 font-bold">
 {c.type}
 </span>
 </td>
 <td className="p-3">{c.userId}</td>
 <td className="p-3">{c.moderatorId}</td>
 <td className="p-3 truncate max-w-xs">{c.reason ||"No reason"}</td>
 <td className="p-3 text-xs text-muted-foreground">
 {new Date(c.createdAt).toLocaleDateString()}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </FormSection>
 )}

 {/* Tab Content: Warnings */}
 {activeTab ==="warnings"&& (
 <div className="space-y-6">
 <FormSection title="Issue New Warning"icon={AlertTriangle} description="Assign a warning to a guild user.">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Target User ID</label>
 <Input
 placeholder="Discord User Snowflake ID"
 value={newWarn.userId}
 onChange={(e) => setNewWarn({ ...newWarn, userId: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Warning Title</label>
 <Input
 placeholder="e.g. Spamming in #general"
 value={newWarn.title}
 onChange={(e) => setNewWarn({ ...newWarn, title: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>
 <div className="space-y-1 md:col-span-2">
 <label className="text-xs font-bold uppercase">Description / Details</label>
 <Textarea
 placeholder="Detailed context of infraction..."
 value={newWarn.description}
 onChange={(e) => setNewWarn({ ...newWarn, description: e.target.value })}
 className="rounded-md border border-border"
 rows={2}
 />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Severity Level (1-5)</label>
 <Input
 type="number"
 min={1}
 max={5}
 value={newWarn.level}
 onChange={(e) => setNewWarn({ ...newWarn, level: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Proof Attachment URL</label>
 <Input
 placeholder="https://cdn.discordapp.com/..."
 value={newWarn.proof}
 onChange={(e) => setNewWarn({ ...newWarn, proof: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>
 </div>
 <Button
 onClick={handleCreateWarn}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs"
 >
 <Plus className="w-4 h-4 mr-2"/>Issue Warning</Button>
 </FormSection>

 <FormSection title="Active Warnings"icon={Shield} description="Manage guild warnings.">
 <div className="space-y-3">
 {initialWarnings.length === 0 ? (
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
 No warnings registered in database.
 </p>
 ) : (
 initialWarnings.map((w) => (
 <div
 key={w.id}
 className="p-4 border border-border bg-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-primary">[{w.warnId}]</span>
 <span className="font-bold uppercase">{w.title}</span>
 <span className="text-xs border px-1 border-primary bg-primary/10">
 Level {w.level}
 </span>
 {!w.active && (
 <span className="text-xs border px-1 border-destructive text-destructive bg-destructive/10">Inactive</span>
 )}
 </div>
 <p className="text-xs text-muted-foreground mt-1">
 User: {w.userId} | Mod: {w.moderatorId} | {new Date(w.createdAt).toLocaleDateString()}
 </p>
 {w.description && <p className="text-sm mt-2">{w.description}</p>}
 </div>

 <div className="flex items-center gap-2">
 <Button
 size="sm"
 variant="outline"
 onClick={() =>
 startTransition(async () => { await toggleWarningStatus(guildId, w.id, !w.active); })
 }
 className="rounded-md border border-border text-xs uppercase"
 >
 {w.active ? <XCircle className="w-3.5 h-3.5 mr-1"/> : <CheckCircle className="w-3.5 h-3.5 mr-1"/>}
 {w.active ?"Deactivate":"Activate"}
 </Button>
 <Button
 size="sm"
 variant="destructive"
 onClick={() =>
 startTransition(async () => { await deleteWarning(guildId, w.id); })
 }
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
 )}

 {/* Tab Content: Automations */}
 {activeTab ==="automations"&& (
 <div className="space-y-6">
 <FormSection title="Create Warning Automation"icon={Sliders} description="Configure automated escalations upon reaching warning thresholds.">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Rule Name</label>
 <Input
 placeholder="3 Warn Timeout Rule"
 value={newAuto.name}
 onChange={(e) => setNewAuto({ ...newAuto, name: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Trigger Type</label>
 <select
 value={newAuto.triggerType}
 onChange={(e) => setNewAuto({ ...newAuto, triggerType: e.target.value })}
 className="w-full p-2 bg-background border border-border rounded-md text-sm uppercase"
 >
 <option value="warn_count">Total Warning Count</option>
 <option value="warn_level">Cumulative Warn Level</option>
 </select>
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Trigger Threshold Value</label>
 <Input
 type="number"
 min={1}
 value={newAuto.triggerValue}
 onChange={(e) => setNewAuto({ ...newAuto, triggerValue: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Escalation Action</label>
 <select
 value={newAuto.actionType}
 onChange={(e) => setNewAuto({ ...newAuto, actionType: e.target.value })}
 className="w-full p-2 bg-background border border-border rounded-md text-sm uppercase"
 >
 <option value="timeout">Timeout / Mute</option>
 <option value="kick">Kick User</option>
 <option value="ban">Ban User</option>
 </select>
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Notification Channel</label>
 <DiscordChannelPicker
 channels={channels}
 value={newAuto.notifyChannelId}
 onChange={(v) => setNewAuto({ ...newAuto, notifyChannelId: v })}
 />
 </div>
 </div>
 <Button
 onClick={handleCreateAuto}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs"
 >
 <Plus className="w-4 h-4 mr-2"/>Create Automation</Button>
 </FormSection>

 <FormSection title="Active Automations"icon={Sliders} description="Configured penalty escalations.">
 <div className="space-y-3">
 {initialAutomations.length === 0 ? (
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
 No automated warning escalations active.
 </p>
 ) : (
 initialAutomations.map((a) => (
 <div
 key={a.id}
 className="p-4 border border-border bg-card flex justify-between items-center shadow-sm"
 >
 <div>
 <h4 className="font-bold uppercase text-primary">{a.name}</h4>
 <p className="text-xs text-muted-foreground mt-1">
 Trigger: {a.triggerType} &ge; {a.triggerValue} | Action: {JSON.stringify(a.actions)}
 </p>
 </div>
 <Button
 size="sm"
 variant="destructive"
 onClick={() =>
 startTransition(async () => { await deleteWarningAutomation(guildId, a.id); })
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

 {/* Tab Content: Filters */}
 {activeTab ==="filters"&& (
 <div className="space-y-6">
 <FormSection title="Create Word Filter"icon={Filter} description="Blacklist explicit words or patterns.">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Pattern / Keyword</label>
 <Input
 placeholder="badword / regex pattern"
 value={newFilter.pattern}
 onChange={(e) => setNewFilter({ ...newFilter, pattern: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Match Type</label>
 <select
 value={newFilter.matchType}
 onChange={(e) => setNewFilter({ ...newFilter, matchType: e.target.value })}
 className="w-full p-2 bg-background border border-border rounded-md text-sm uppercase"
 >
 <option value="literal">Literal Substring</option>
 <option value="regex">Regular Expression</option>
 </select>
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Severity</label>
 <select
 value={newFilter.severity}
 onChange={(e) => setNewFilter({ ...newFilter, severity: e.target.value })}
 className="w-full p-2 bg-background border border-border rounded-md text-sm uppercase"
 >
 <option value="low">Low</option>
 <option value="medium">Medium</option>
 <option value="high">High</option>
 <option value="critical">Critical</option>
 </select>
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Alert Channel</label>
 <DiscordChannelPicker
 channels={channels}
 value={newFilter.notifyChannelId}
 onChange={(v) => setNewFilter({ ...newFilter, notifyChannelId: v })}
 />
 </div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
 <ToggleField
 label="Auto Delete"
 checked={newFilter.autoDelete}
 onCheckedChange={(c) => setNewFilter({ ...newFilter, autoDelete: c })}
 />
 <ToggleField
 label="Case Sensitive"
 checked={newFilter.caseSensitive}
 onCheckedChange={(c) => setNewFilter({ ...newFilter, caseSensitive: c })}
 />
 <ToggleField
 label="Whole Word"
 checked={newFilter.wholeWord}
 onCheckedChange={(c) => setNewFilter({ ...newFilter, wholeWord: c })}
 />
 </div>
 <Button
 onClick={handleCreateFilter}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs"
 >
 <Plus className="w-4 h-4 mr-2"/>Add Filter Rule</Button>
 </FormSection>

 <FormSection title="Active Word Filters"icon={Filter} description="Monitored words and expressions.">
 <div className="space-y-3">
 {initialWordFilters.length === 0 ? (
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
 No word filter rules defined.
 </p>
 ) : (
 initialWordFilters.map((f) => (
 <div
 key={f.id}
 className="p-4 border border-border bg-card flex justify-between items-center shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-primary">{f.pattern}</span>
 <span className="text-xs border px-1 border-primary bg-primary/10 uppercase">
 {f.matchType}
 </span>
 <span className="text-xs border px-1 border-destructive text-destructive bg-destructive/10 uppercase">
 {f.severity}
 </span>
 </div>
 <p className="text-xs text-muted-foreground mt-1">
 Auto Delete: {f.autoDelete ?"YES":"NO"} | Whole Word: {f.wholeWord ?"YES":"NO"}
 </p>
 </div>
 <Button
 size="sm"
 variant="destructive"
 onClick={() =>
 startTransition(async () => { await deleteWordFilterRule(guildId, f.id); })
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

 {/* Tab Content: Log Routing */}
 {activeTab ==="logging"&& (
 <FormSection title="Moderation Log Routing"icon={Shield} description="Route specific event categories to targeted channels.">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {categories.map((cat) => {
 const current = logSettings[cat];
 return (
 <div key={cat} className="p-4 border border-border bg-card space-y-3 shadow-sm">
 <div className="flex items-center justify-between">
 <span className="font-bold text-primary uppercase text-sm">{cat}_LOGS</span>
 <ToggleField
 label=""
 checked={current.enabled}
 onCheckedChange={(c) =>
 setLogSettings({ ...logSettings, [cat]: { ...current, enabled: c } })
 }
 />
 </div>
 <DiscordChannelPicker
 channels={channels}
 value={current.channelId || null}
 onChange={(v) =>
 setLogSettings({ ...logSettings, [cat]: { ...current, channelId: v ||""} })
 }
 />
 <Button
 size="sm"
 onClick={() => handleSaveLogSetting(cat)}
 disabled={isPending || !current.channelId}
 className="w-full rounded-md border border-border font-bold text-xs uppercase"
 >Save Routing</Button>
 </div>
 );
 })}
 </div>
 </FormSection>
 )}
 </div>
 );
}
