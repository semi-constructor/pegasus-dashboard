"use client";

import { useState, useTransition } from"react";
import { cn } from "@/lib/utils";
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
} from "../actions";
import { useTranslations } from "next-intl";

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
 const t = useTranslations('guildAutomod');
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
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto bg-background/40 p-1 rounded-lg w-full sm:w-fit border border-border shrink-0 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[
          { id: "rules", label: t('tabs.rules'), icon: Wand2 },
          { id: "infractions", label: t('tabs.infractions'), icon: ListFilter },
          { id: "vault", label: t('tabs.vault'), icon: Lock },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "secondary" : "ghost"}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "rounded-md font-medium text-xs transition-all shrink-0 whitespace-nowrap flex-1 sm:flex-none",
              activeTab === tab.id ? "bg-foreground/10 text-foreground shadow-sm" : "text-foreground/60 hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4 mr-2 shrink-0" />
            {tab.label}
          </Button>
        ))}
      </div>

 {/* Tab 1: Rules Builder */}
 {activeTab ==="rules"&& (
  <div className="space-y-6">
  <FormSection
  title={t('createRule.title')}
  icon={Wand2}
  description={t('createRule.description')}
  >
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="flex flex-col gap-2">
  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('createRule.name')}</label>
  <Input
 placeholder="e.g. Anti-Crypto Keywords"
 value={newRule.name}
 onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
 className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>

  <div className="flex flex-col gap-2">
  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('createRule.eventType')}</label>
  <select
  value={newRule.eventType}
  onChange={(e) => setNewRule({ ...newRule, eventType: e.target.value })}
  className="w-full p-2 bg-background/40 border border-border text-foreground placeholder:text-foreground/30 rounded-lg text-sm uppercase outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
  >
  <option value="MESSAGE_SEND">{t('createRule.events.msgSend')}</option>
  <option value="MESSAGE_EDIT">{t('createRule.events.msgEdit')}</option>
  <option value="MEMBER_JOIN">{t('createRule.events.memberJoin')}</option>
  <option value="MEMBER_UPDATE">{t('createRule.events.memberUpdate')}</option>
  </select>
  </div>

  <div className="flex flex-col gap-2">
  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('createRule.triggerType')}</label>
  <select
  value={newRule.triggerType}
  onChange={(e) => setNewRule({ ...newRule, triggerType: e.target.value })}
  className="w-full p-2 bg-background/40 border border-border text-foreground placeholder:text-foreground/30 rounded-lg text-sm uppercase outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
  >
  <option value="keyword_match">{t('createRule.triggers.keyword')}</option>
  <option value="regex_match">{t('createRule.triggers.regex')}</option>
  <option value="mention_spam">{t('createRule.triggers.mention')}</option>
  <option value="attachment_spam">{t('createRule.triggers.attachment')}</option>
  </select>
  </div>

  <div className="flex flex-col gap-2">
  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('createRule.actionType')}</label>
  <select
  value={newRule.actionType}
  onChange={(e) => setNewRule({ ...newRule, actionType: e.target.value })}
  className="w-full p-2 bg-background/40 border border-border text-foreground placeholder:text-foreground/30 rounded-lg text-sm uppercase outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
  >
  <option value="delete">{t('createRule.actions.delete')}</option>
  <option value="warn">{t('createRule.actions.warn')}</option>
  <option value="timeout">{t('createRule.actions.timeout')}</option>
  <option value="quarantine">{t('createRule.actions.quarantine')}</option>
  <option value="infraction">{t('createRule.actions.infraction')}</option>
  </select>
  </div>
 </div>

        {/* Type-Specific Sub-Form Keyed Off TriggerType */}
        <div className="p-6 rounded-xl border border-border bg-background/20 space-y-4">
          <h4 className="font-bold text-sm uppercase text-foreground/80 border-b border-border pb-2">{t('createRule.metadataConfig', { type: newRule.triggerType })}
          </h4>

  {newRule.triggerType ==="keyword_match"&& (
  <div className="flex flex-col gap-2">
  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('createRule.keywords')}</label>
  <Textarea
 placeholder="crypto, free nitro, airdrop, discord.gg/fake"
 value={newRule.keywords}
 onChange={(e) => setNewRule({ ...newRule, keywords: e.target.value })}
 className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg h-10 px-3 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 rows={2}
 />
 </div>
 )}

  {newRule.triggerType ==="regex_match"&& (
  <div className="flex flex-col gap-2">
  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('createRule.regex')}</label>
  <Input
 placeholder="(?i)(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+"
 value={newRule.regexPattern}
 onChange={(e) => setNewRule({ ...newRule, regexPattern: e.target.value })}
 className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>
 )}

  {newRule.triggerType ==="mention_spam"&& (
  <div className="flex flex-col gap-2">
  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('createRule.mentionLimit')}</label>
  <Input
 type="number"
 min={1}
 value={newRule.mentionThreshold}
 onChange={(e) => setNewRule({ ...newRule, mentionThreshold: Number(e.target.value) })}
 className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>
 )}

  {newRule.triggerType ==="attachment_spam"&& (
  <div className="flex flex-col gap-2">
  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('createRule.attachmentLimit')}</label>
  <Input
 type="number"
 min={1}
 value={newRule.attachmentThreshold}
 onChange={(e) => setNewRule({ ...newRule, attachmentThreshold: Number(e.target.value) })}
 className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>
 )}
 </div>

  {/* Exemptions Pickers */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="flex flex-col gap-2">
  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('createRule.exemptRoles')}</label>
  <DiscordRoleMultiPicker
 roles={roles}
 value={newRule.exemptRoles}
 onChange={(r) => setNewRule({ ...newRule, exemptRoles: r })}
 />
  </div>
  <div className="flex flex-col gap-2">
  <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('createRule.exemptChannels')}</label>
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
  <Plus className="w-4 h-4 mr-2"/>{t('createRule.btn')}</Button>
  </FormSection>

  {/* Active Rules List */}
  <FormSection title={t('activeRules.title')} icon={Wand2} description={t('activeRules.description')}>
  <div className="space-y-3">
  {initialRules.length === 0 ? (
  <p className="text-foreground/40 text-sm uppercase p-4 border border-border">
  {t('activeRules.empty')}
  </p>
  ) : (
 initialRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 rounded-xl border border-border bg-foreground/5 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between shadow-lg"
                >
 <div>
 <div className="flex flex-wrap items-center gap-2">
 <span className="font-bold text-foreground/80 uppercase tracking-wider">{rule.name}</span>
 <span className="text-xs border px-1 border-primary bg-primary/10 uppercase">
 {rule.eventType}
 </span>
 <span className="text-xs border px-1 border-secondary uppercase">
 {rule.triggerType}
 </span>
  {!rule.enabled && (
  <Badge variant="destructive" className="text-xs uppercase">{t('activeRules.disabled')}</Badge>
  )}
  </div>
  <p className="text-xs text-foreground/40 mt-1">
  {t('activeRules.metadata')}: {JSON.stringify(rule.triggerMetadata)} | {t('activeRules.actions')}: {JSON.stringify(rule.actions)}
  </p>
 </div>

 <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
 <Button
 size="sm"
 className="bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border"onClick={() =>
 startTransition(async () => { await toggleAutoModRule(guildId, rule.id, !rule.enabled); })
 }
  >
  {rule.enabled ? t('activeRules.disableBtn') : t('activeRules.enableBtn')}
  </Button>
 <Button
 size="sm"
 className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() =>
 startTransition(async () => { await deleteAutoModRule(guildId, rule.id); })
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

 {/* Tab 2: Infractions Log */}
 {activeTab ==="infractions"&& (
 <FormSection title={t('infractions.title')} icon={ListFilter} description={t('infractions.description')}>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-background/40 border-b border-border text-xs uppercase text-foreground/70">
              <tr>
                <th className="p-4 font-medium">{t('infractions.userId')}</th>
                <th className="p-4 font-medium">{t('infractions.points')}</th>
                <th className="p-4 font-medium">{t('infractions.action')}</th>
                <th className="p-4 font-medium">{t('infractions.reason')}</th>
                <th className="p-4 font-medium">{t('infractions.active')}</th>
                <th className="p-4 font-medium">{t('infractions.date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-background/20">
 {initialInfractions.length === 0 ? (
 <tr>
 <td colSpan={6} className="p-6 text-center text-foreground/40 uppercase">
 {t('infractions.empty')}
 </td>
 </tr>
 ) : (
 initialInfractions.map((inf) => (
 <tr key={inf.id} className="hover:bg-primary/5">
 <td className="p-3 font-bold">{inf.userId}</td>
 <td className="p-3 font-bold text-destructive">+{inf.points}</td>
 <td className="p-3 uppercase font-bold">{inf.actionTaken}</td>
 <td className="p-3 truncate max-w-xs">{inf.reason ||"AutoMod Trigger"}</td>
 <td className="p-3">{inf.active ? t('infractions.yes') : t('infractions.expired')}</td>
 <td className="p-3 text-xs text-foreground/40">
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
 <FormSection title={t('vault.title')} icon={Lock} description={t('vault.description')}>
 <div className="space-y-3">
 {initialVault.length === 0 ? (
 <p className="text-foreground/40 text-sm uppercase p-4 border border-border">
 {t('vault.empty')}
 </p>
 ) : (
 initialVault.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex items-center gap-3 justify-between backdrop-blur-md"
                  >
 <div>
 <div className="flex items-center gap-2">
 <Lock className="w-4 h-4 text-destructive"/>
 <span className="font-bold uppercase text-destructive">{t('vault.user', { id: item.userId })}</span>
 {item.released ? (
 <Badge variant="outline" className="text-xs border-primary font-bold uppercase">{t('vault.releasedBadge')}</Badge>
 ) : (
 <Badge variant="destructive" className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t('vault.jailedBadge')}</Badge>
 )}
 </div>
 <p className="text-xs text-foreground/40 mt-1">
 {t('vault.reason', { reason: item.reason || t('vault.defaultReason') })} | {t('vault.jailedAt')}: {new Date(item.createdAt).toLocaleString()}
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
 <Unlock className="w-3.5 h-3.5 mr-1"/>{t('vault.releaseBtn')}</Button>
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
