"use client";

import { useState, useTransition } from"react";
import {
 Wand2,
 Plus,
 Trash2,
 Lock,
 Unlock,
 AlertOctagon,
 ShieldAlert,
 ListFilter,
 CheckCircle,
} from"lucide-react";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { Button } from"@/components/ui/button";
import { Badge } from"@/components/ui/badge";
import { FormSection } from"@/components/dashboard/forms/FormSection";
import { ToggleField } from"@/components/dashboard/forms/ToggleField";
import {
 DiscordChannelMultiPicker,
 type ChannelOption,
} from"@/components/dashboard/pickers/DiscordChannelPicker";
import {
 DiscordRoleMultiPicker,
 type RoleOption,
} from"@/components/dashboard/pickers/DiscordRolePicker";
import {
 createAutoModRule,
 toggleAutoModRule,
 deleteAutoModRule,
 releaseFromQuarantine,
} from"../actions";

interface AutoModClientProps {
 guildId: string;
 initialRules: any[];
 initialInfractions: any[];
 initialVault: any[];
 channels: ChannelOption[];
 roles: RoleOption[];
}

export default function AutoModClient({
 guildId,
 initialRules,
 initialInfractions,
 initialVault,
 channels,
 roles,
}: AutoModClientProps) {
 const [activeTab, setActiveTab] = useState<"rules"|"infractions"|"vault">("rules");
 const [isPending, startTransition] = useTransition();

 // ── New Rule Form State ────────────────────────────────────────
 const [newRule, setNewRule] = useState({
 name:"",
 description:"",
 eventType:"MESSAGE_SEND",
 triggerType:"keyword_match",
 // Sub-forms state
 keywords:"",
 regexPattern:"",
 mentionThreshold: 5,
 attachmentThreshold: 3,
 // Conditions
 minAccountAgeDays: 0,
 minGuildAgeDays: 0,
 // Exemptions
 exemptRoles: [] as string[],
 exemptChannels: [] as string[],
 // Action
 actionType:"delete",
 timeoutDuration: 3600,
 infractionPoints: 1,
 enabled: true,
 });

 const handleCreateRule = () => {
 if (!newRule.name) return;

 // Construct triggerMetadata based on triggerType
 let triggerMetadata: any = {};
 if (newRule.triggerType ==="keyword_match") {
 triggerMetadata = {
 keywords: newRule.keywords
 .split(",")
 .map((k) => k.trim())
 .filter(Boolean),
 };
 } else if (newRule.triggerType ==="regex_match") {
 triggerMetadata = { pattern: newRule.regexPattern };
 } else if (newRule.triggerType ==="mention_spam") {
 triggerMetadata = { threshold: Number(newRule.mentionThreshold) };
 } else if (newRule.triggerType ==="attachment_spam") {
 triggerMetadata = { threshold: Number(newRule.attachmentThreshold) };
 }

 // Construct conditions
 const conditions: any = {};
 if (newRule.minAccountAgeDays > 0) conditions.minAccountAgeDays = Number(newRule.minAccountAgeDays);
 if (newRule.minGuildAgeDays > 0) conditions.minGuildAgeDays = Number(newRule.minGuildAgeDays);

 // Construct actions array
 const actions = [
 {
 type: newRule.actionType,
 duration: newRule.timeoutDuration,
 points: newRule.infractionPoints,
 },
 ];

 startTransition(async () => {
 await createAutoModRule(guildId, {
 name: newRule.name,
 description: newRule.description,
 eventType: newRule.eventType,
 triggerType: newRule.triggerType,
 triggerMetadata,
 conditions,
 exemptRoles: newRule.exemptRoles,
 exemptChannels: newRule.exemptChannels,
 actions,
 enabled: newRule.enabled,
 });

 setNewRule({
 name:"",
 description:"",
 eventType:"MESSAGE_SEND",
 triggerType:"keyword_match",
 keywords:"",
 regexPattern:"",
 mentionThreshold: 5,
 attachmentThreshold: 3,
 minAccountAgeDays: 0,
 minGuildAgeDays: 0,
 exemptRoles: [],
 exemptChannels: [],
 actionType:"delete",
 timeoutDuration: 3600,
 infractionPoints: 1,
 enabled: true,
 });
 });
 };

 return (
 <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
 <div className="flex items-center justify-between border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tight uppercase flex items-center gap-3">
 <Wand2 className="w-10 h-10 text-primary"/>
 AUTOMOD_V2
 </h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Rules engine, infraction tracking, and quarantine vault isolation.
 </p>
 </div>
 </div>

 {/* Navigation Tabs */}
 <div className="flex flex-wrap gap-2 border-b border-border/50 pb-2">
 {[
 { id:"rules", label:"AutoMod Rules Builder", icon: Wand2 },
 { id:"infractions", label:"Infractions Log", icon: ListFilter },
 { id:"vault", label:"Quarantine Vault", icon: Lock },
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

 {/* Tab 1: Rules Builder */}
 {activeTab ==="rules"&& (
 <div className="space-y-6">
 <FormSection
 title="Create Automod Rule"
 icon={Wand2}
 description="Build event-driven automated moderation rules with specialized trigger sub-forms."
 >
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Rule Name</label>
 <Input
 placeholder="e.g. Anti-Crypto Keywords"
 value={newRule.name}
 onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Event Type</label>
 <select
 value={newRule.eventType}
 onChange={(e) => setNewRule({ ...newRule, eventType: e.target.value })}
 className="w-full p-2 bg-background border border-border rounded-md text-sm uppercase"
 >
 <option value="MESSAGE_SEND">Message Send</option>
 <option value="MESSAGE_EDIT">Message Edit</option>
 <option value="MEMBER_JOIN">Member Join</option>
 <option value="MEMBER_UPDATE">Member Profile Update</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Trigger Type</label>
 <select
 value={newRule.triggerType}
 onChange={(e) => setNewRule({ ...newRule, triggerType: e.target.value })}
 className="w-full p-2 bg-background border border-border rounded-md text-sm uppercase"
 >
 <option value="keyword_match">Keyword Substring Match</option>
 <option value="regex_match">Regex Pattern Match</option>
 <option value="mention_spam">Mention Spam Threshold</option>
 <option value="attachment_spam">Attachment / Link Spam</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Action to Take</label>
 <select
 value={newRule.actionType}
 onChange={(e) => setNewRule({ ...newRule, actionType: e.target.value })}
 className="w-full p-2 bg-background border border-border rounded-md text-sm uppercase"
 >
 <option value="delete">Delete Message</option>
 <option value="warn">Warn User</option>
 <option value="timeout">Timeout User</option>
 <option value="quarantine">Send to Quarantine Vault</option>
 <option value="infraction">Add Infraction Points</option>
 </select>
 </div>
 </div>

 {/* Type-Specific Sub-Form Keyed Off TriggerType */}
 <div className="p-4 border border-border bg-primary/5 space-y-4">
 <h4 className="font-bold text-sm uppercase text-primary border-b border-primary/20 pb-1">Trigger Metadata Config ({newRule.triggerType})
 </h4>

 {newRule.triggerType ==="keyword_match"&& (
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Keywords (Comma separated)</label>
 <Textarea
 placeholder="crypto, free nitro, airdrop, discord.gg/fake"
 value={newRule.keywords}
 onChange={(e) => setNewRule({ ...newRule, keywords: e.target.value })}
 className="rounded-md border border-border"
 rows={2}
 />
 </div>
 )}

 {newRule.triggerType ==="regex_match"&& (
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Regex Pattern</label>
 <Input
 placeholder="(?i)(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+"
 value={newRule.regexPattern}
 onChange={(e) => setNewRule({ ...newRule, regexPattern: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>
 )}

 {newRule.triggerType ==="mention_spam"&& (
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Max Mentions Limit</label>
 <Input
 type="number"
 min={1}
 value={newRule.mentionThreshold}
 onChange={(e) => setNewRule({ ...newRule, mentionThreshold: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>
 )}

 {newRule.triggerType ==="attachment_spam"&& (
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Max Attachments Limit</label>
 <Input
 type="number"
 min={1}
 value={newRule.attachmentThreshold}
 onChange={(e) => setNewRule({ ...newRule, attachmentThreshold: Number(e.target.value) })}
 className="rounded-md border border-border"
 />
 </div>
 )}
 </div>

 {/* Exemptions Pickers */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Exempt Roles</label>
 <DiscordRoleMultiPicker
 roles={roles}
 value={newRule.exemptRoles}
 onChange={(r) => setNewRule({ ...newRule, exemptRoles: r })}
 />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Exempt Channels</label>
 <DiscordChannelMultiPicker
 channels={channels}
 value={newRule.exemptChannels}
 onChange={(c) => setNewRule({ ...newRule, exemptChannels: c })}
 />
 </div>
 </div>

 <Button
 onClick={handleCreateRule}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs"
 >
 <Plus className="w-4 h-4 mr-2"/>Create Automod Rule</Button>
 </FormSection>

 {/* Active Rules List */}
 <FormSection title="Active Rules"icon={Wand2} description="Configured AutoMod V2 inspection rules.">
 <div className="space-y-3">
 {initialRules.length === 0 ? (
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
 No AutoMod V2 rules configured.
 </p>
 ) : (
 initialRules.map((rule) => (
 <div
 key={rule.id}
 className="p-4 border border-border bg-card flex items-center gap-3 justify-between shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-primary uppercase">{rule.name}</span>
 <span className="text-xs border px-1 border-primary bg-primary/10 uppercase">
 {rule.eventType}
 </span>
 <span className="text-xs border px-1 border-secondary uppercase">
 {rule.triggerType}
 </span>
 {!rule.enabled && (
 <Badge variant="destructive" className="text-xs uppercase">Disabled</Badge>
 )}
 </div>
 <p className="text-xs text-muted-foreground mt-1">
 Metadata: {JSON.stringify(rule.triggerMetadata)} | Actions: {JSON.stringify(rule.actions)}
 </p>
 </div>

 <div className="flex items-center gap-2">
 <Button
 size="sm"
 variant="outline"
 onClick={() =>
 startTransition(async () => { await toggleAutoModRule(guildId, rule.id, !rule.enabled); })
 }
 className="rounded-md border border-border text-xs uppercase"
 >
 {rule.enabled ?"Disable":"Enable"}
 </Button>
 <Button
 size="sm"
 variant="destructive"
 onClick={() =>
 startTransition(async () => { await deleteAutoModRule(guildId, rule.id); })
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

 {/* Tab 2: Infractions Log */}
 {activeTab ==="infractions"&& (
 <FormSection title="Automod Infractions Log"icon={ListFilter} description="Automated infraction history.">
 <div className="overflow-x-auto border border-border">
 <table className="w-full text-left border-collapse text-sm">
 <thead className="bg-primary/10 border-b border-border text-xs uppercase">
 <tr>
 <th className="p-3">User ID</th>
 <th className="p-3">Points</th>
 <th className="p-3">Action Taken</th>
 <th className="p-3">Reason</th>
 <th className="p-3">Active</th>
 <th className="p-3">Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-primary/20">
 {initialInfractions.length === 0 ? (
 <tr>
 <td colSpan={6} className="p-6 text-center text-muted-foreground uppercase">
 No infractions recorded.
 </td>
 </tr>
 ) : (
 initialInfractions.map((inf) => (
 <tr key={inf.id} className="hover:bg-primary/5">
 <td className="p-3 font-bold">{inf.userId}</td>
 <td className="p-3 font-bold text-destructive">+{inf.points}</td>
 <td className="p-3 uppercase font-bold">{inf.actionTaken}</td>
 <td className="p-3 truncate max-w-xs">{inf.reason ||"AutoMod Trigger"}</td>
 <td className="p-3">{inf.active ?"YES":"EXPIRED"}</td>
 <td className="p-3 text-xs text-muted-foreground">
 {new Date(inf.createdAt).toLocaleDateString()}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </FormSection>
 )}

 {/* Tab 3: Quarantine Vault */}
 {activeTab ==="vault"&& (
 <FormSection title="Quarantine Vault"icon={Lock} description="Isolated accounts with stripped roles pending staff review.">
 <div className="space-y-3">
 {initialVault.length === 0 ? (
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
 Quarantine vault is empty. No accounts isolated.
 </p>
 ) : (
 initialVault.map((item) => (
 <div
 key={item.id}
 className="p-4 border border-destructive bg-destructive/10 flex items-center gap-3 justify-between shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]"
 >
 <div>
 <div className="flex items-center gap-2">
 <Lock className="w-4 h-4 text-destructive"/>
 <span className="font-bold uppercase text-destructive">User: {item.userId}</span>
 {item.released ? (
 <Badge variant="outline" className="text-xs border-primary font-bold uppercase">Released</Badge>
 ) : (
 <Badge variant="destructive" className="text-xs font-bold uppercase">Jailed</Badge>
 )}
 </div>
 <p className="text-xs text-muted-foreground mt-1">
 Reason: {item.reason ||"AutoMod Security Quarantine"} | Jailed At: {new Date(item.createdAt).toLocaleString()}
 </p>
 </div>

 {!item.released && (
 <Button
 size="sm"
 onClick={() =>
 startTransition(async () => { await releaseFromQuarantine(guildId, item.id); })
 }
 disabled={isPending}
 className="rounded-md border border-border font-medium text-xs"
 >
 <Unlock className="w-3.5 h-3.5 mr-1"/>Release User</Button>
 )}
 </div>
 ))
 )}
 </div>
 </FormSection>
 )}
 </div>
 );
}
