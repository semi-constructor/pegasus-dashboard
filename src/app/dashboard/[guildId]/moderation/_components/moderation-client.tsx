"use client";

import { useState, useTransition } from"react";
import { cn } from "@/lib/utils";
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
import { DiscordUserPicker } from "@/components/dashboard/pickers/DiscordUserPicker";
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

import { useTranslations } from "next-intl";

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
 const t = useTranslations('guildModeration');
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
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Navigation Tabs */}
      <div className="flex flex-wrap bg-black/40 p-1 rounded-lg w-fit border border-white/10 gap-1">
        {[
          { id: "cases", label: t('tabs.cases'), icon: Shield },
          { id: "warnings", label: t('tabs.warnings'), icon: AlertTriangle },
          { id: "automations", label: t('tabs.automations'), icon: Sliders },
          { id: "filters", label: t('tabs.filters'), icon: Filter },
          { id: "logging", label: t('tabs.logging'), icon: FileText },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "secondary" : "ghost"}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "rounded-md font-medium text-xs transition-all",
              activeTab === tab.id ? "bg-white/10 text-white shadow-sm" : "text-white/60 hover:text-white"
            )}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

 {/* Tab Content: Cases */}
 {activeTab ==="cases"&& (
 <FormSection title={t('cases.title')} icon={FileText} description={t('cases.description')}>
 <div className="overflow-x-auto border border-border">
 <table className="w-full text-left border-collapse text-sm">
 <thead className="bg-primary/10 border-b border-white/10 text-xs uppercase text-white/60">
 <tr>
 <th className="p-3">{t('cases.number')}</th>
 <th className="p-3">{t('cases.action')}</th>
 <th className="p-3">{t('cases.target')}</th>
 <th className="p-3">{t('cases.mod')}</th>
 <th className="p-3">{t('cases.reason')}</th>
 <th className="p-3">{t('cases.date')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-primary/20">
 {initialCases.length === 0 ? (
 <tr>
 <td colSpan={6} className="p-6 text-center text-white/40 uppercase">
 {t('cases.empty')}
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
 <td className="p-3 truncate max-w-xs">{c.reason || t('cases.noReason')}</td>
 <td className="p-3 text-xs text-white/40">
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
 <FormSection title={t('issueWarning.title')} icon={AlertTriangle} description={t('issueWarning.description')}>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('issueWarning.userId')}</label>
 <DiscordUserPicker
  guildId={guildId}
  value={newWarn.userId || null}
  onChange={(v) => setNewWarn({ ...newWarn, userId: v || "" })}
 />
 </div>
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('issueWarning.warnTitle')}</label>
 <Input
 placeholder="e.g. Spamming in #general"
 value={newWarn.title}
 onChange={(e) => setNewWarn({ ...newWarn, title: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>
 <div className="space-y-1 md:col-span-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('issueWarning.desc')}</label>
 <Textarea
 placeholder="Detailed context of infraction..."
 value={newWarn.description}
 onChange={(e) => setNewWarn({ ...newWarn, description: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg h-10 px-3 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 rows={2}
 />
 </div>
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('issueWarning.level')}</label>
 <Input
 type="number"
 min={1}
 max={5}
 value={newWarn.level}
 onChange={(e) => setNewWarn({ ...newWarn, level: Number(e.target.value) })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('issueWarning.proof')}</label>
 <Input
 placeholder="https://cdn.discordapp.com/..."
 value={newWarn.proof}
 onChange={(e) => setNewWarn({ ...newWarn, proof: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>
 </div>
 <Button
 onClick={handleCreateWarn}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs"
 >
 <Plus className="w-4 h-4 mr-2"/>{t('issueWarning.btn')}</Button>
 </FormSection>

 <FormSection title={t('activeWarnings.title')} icon={Shield} description={t('activeWarnings.description')}>
 <div className="space-y-3">
 {initialWarnings.length === 0 ? (
 <p className="text-white/40 text-sm uppercase p-4 border border-border">
 {t('activeWarnings.empty')}
 </p>
 ) : (
 initialWarnings.map((w) => (
                  <div
                    key={w.id}
                    className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-3 shadow-lg"
                  >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-primary">[{w.warnId}]</span>
 <span className="font-bold uppercase">{w.title}</span>
 <span className="text-xs border px-1 border-primary bg-primary/10">
 {t('activeWarnings.level', { level: w.level })}
 </span>
 {!w.active && (
 <span className="text-xs border px-1 border-red-500/30 text-red-400 bg-destructive/10">{t('activeWarnings.inactive')}</span>
 )}
 </div>
 <p className="text-xs text-white/40 mt-1">
 {t('activeWarnings.info', { user: w.userId, mod: w.moderatorId, date: new Date(w.createdAt).toLocaleDateString() })}
 </p>
 {w.description && <p className="text-sm mt-2">{w.description}</p>}
 </div>

 <div className="flex items-center gap-2">
 <Button
 size="sm"
 className="bg-white/5 hover:bg-white/10 text-white border border-white/10"onClick={() =>
 startTransition(async () => { await toggleWarningStatus(guildId, w.id, !w.active); })
 }
 >
 {w.active ? <><XCircle className="w-3.5 h-3.5 mr-1"/> {t('activeWarnings.deactivate')}</> : <><CheckCircle className="w-3.5 h-3.5 mr-1"/> {t('activeWarnings.activate')}</>}
 </Button>
 <Button
 size="sm"
 className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() =>
 startTransition(async () => { await deleteWarning(guildId, w.id); })
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

 {/* Tab Content: Automations */}
 {activeTab ==="automations"&& (
 <div className="space-y-6">
 <FormSection title={t('createAuto.title')} icon={Sliders} description={t('createAuto.description')}>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('createAuto.name')}</label>
 <Input
 placeholder="3 Warn Timeout Rule"
 value={newAuto.name}
 onChange={(e) => setNewAuto({ ...newAuto, name: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('createAuto.triggerType')}</label>
 <select
 value={newAuto.triggerType}
 onChange={(e) => setNewAuto({ ...newAuto, triggerType: e.target.value })}
 className="w-full p-2 bg-black/40 border border-white/10 text-white placeholder:text-white/30 rounded-lg text-sm uppercase outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 >
 <option value="warn_count">{t('createAuto.warnCount')}</option>
 <option value="warn_level">{t('createAuto.warnLevel')}</option>
 </select>
 </div>
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('createAuto.triggerValue')}</label>
 <Input
 type="number"
 min={1}
 value={newAuto.triggerValue}
 onChange={(e) => setNewAuto({ ...newAuto, triggerValue: Number(e.target.value) })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('createAuto.action')}</label>
 <select
 value={newAuto.actionType}
 onChange={(e) => setNewAuto({ ...newAuto, actionType: e.target.value })}
 className="w-full p-2 bg-black/40 border border-white/10 text-white placeholder:text-white/30 rounded-lg text-sm uppercase outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 >
 <option value="timeout">{t('createAuto.timeout')}</option>
 <option value="kick">{t('createAuto.kick')}</option>
 <option value="ban">{t('createAuto.ban')}</option>
 </select>
 </div>
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('createAuto.notify')}</label>
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
 <Plus className="w-4 h-4 mr-2"/>{t('createAuto.btn')}</Button>
 </FormSection>

 <FormSection title={t('activeAutos.title')} icon={Sliders} description={t('activeAutos.description')}>
 <div className="space-y-3">
 {initialAutomations.length === 0 ? (
 <p className="text-white/40 text-sm uppercase p-4 border border-border">
 {t('activeAutos.empty')}
 </p>
 ) : (
 initialAutomations.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4 shadow-lg"
                >
 <div>
 <h4 className="font-bold uppercase text-primary">{a.name}</h4>
 <p className="text-xs text-white/40 mt-1">
 {t('activeAutos.info', { type: a.triggerType, value: a.triggerValue, actions: JSON.stringify(a.actions) })}
 </p>
 </div>
 <Button
 size="sm"
 className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() =>
 startTransition(async () => { await deleteWarningAutomation(guildId, a.id); })
 }
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
 <FormSection title={t('createFilter.title')} icon={Filter} description={t('createFilter.description')}>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('createFilter.pattern')}</label>
 <Input
 placeholder="badword / regex pattern"
 value={newFilter.pattern}
 onChange={(e) => setNewFilter({ ...newFilter, pattern: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('createFilter.matchType')}</label>
 <select
 value={newFilter.matchType}
 onChange={(e) => setNewFilter({ ...newFilter, matchType: e.target.value })}
 className="w-full p-2 bg-black/40 border border-white/10 text-white placeholder:text-white/30 rounded-lg text-sm uppercase outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 >
 <option value="literal">{t('createFilter.literal')}</option>
 <option value="regex">{t('createFilter.regex')}</option>
 </select>
 </div>
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('createFilter.severity')}</label>
 <select
 value={newFilter.severity}
 onChange={(e) => setNewFilter({ ...newFilter, severity: e.target.value })}
 className="w-full p-2 bg-black/40 border border-white/10 text-white placeholder:text-white/30 rounded-lg text-sm uppercase outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 >
 <option value="low">{t('createFilter.sevLow')}</option>
 <option value="medium">{t('createFilter.sevMed')}</option>
 <option value="high">{t('createFilter.sevHigh')}</option>
 <option value="critical">{t('createFilter.sevCrit')}</option>
 </select>
 </div>
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('createFilter.notify')}</label>
 <DiscordChannelPicker
 channels={channels}
 value={newFilter.notifyChannelId}
 onChange={(v) => setNewFilter({ ...newFilter, notifyChannelId: v })}
 />
 </div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
 <ToggleField
 label={t('createFilter.autoDelete')}
 checked={newFilter.autoDelete}
 onCheckedChange={(c) => setNewFilter({ ...newFilter, autoDelete: c })}
 />
 <ToggleField
 label={t('createFilter.caseSensitive')}
 checked={newFilter.caseSensitive}
 onCheckedChange={(c) => setNewFilter({ ...newFilter, caseSensitive: c })}
 />
 <ToggleField
 label={t('createFilter.wholeWord')}
 checked={newFilter.wholeWord}
 onCheckedChange={(c) => setNewFilter({ ...newFilter, wholeWord: c })}
 />
 </div>
 <Button
 onClick={handleCreateFilter}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs"
 >
 <Plus className="w-4 h-4 mr-2"/>{t('createFilter.btn')}</Button>
 </FormSection>

 <FormSection title={t('activeFilters.title')} icon={Filter} description={t('activeFilters.description')}>
 <div className="space-y-3">
 {initialWordFilters.length === 0 ? (
 <p className="text-white/40 text-sm uppercase p-4 border border-border">
 {t('activeFilters.empty')}
 </p>
 ) : (
 initialWordFilters.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-xl border border-white/10 bg-white/5 flex justify-between items-center shadow-lg"
                >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-primary">{f.pattern}</span>
 <span className="text-xs border px-1 border-primary bg-primary/10 uppercase">
 {f.matchType}
 </span>
 <span className="text-xs border px-1 border-red-500/30 text-red-400 bg-destructive/10 uppercase">
 {f.severity}
 </span>
 </div>
 <p className="text-xs text-white/40 mt-1">
 {t('activeFilters.info', { del: f.autoDelete ? t('activeFilters.yes') : t('activeFilters.no'), word: f.wholeWord ? t('activeFilters.yes') : t('activeFilters.no') })}
 </p>
 </div>
 <Button
 size="sm"
 className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() =>
 startTransition(async () => { await deleteWordFilterRule(guildId, f.id); })
 }
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
 <FormSection title={t('logs.title')} icon={Shield} description={t('logs.description')}>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {categories.map((cat) => {
 const current = logSettings[cat];
 return (
 <div key={cat} className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-3 shadow-lg">
 <div className="flex items-center justify-between">
 <span className="font-bold text-white/80 uppercase tracking-wider text-sm">{cat}_LOGS</span>
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
 >{t('logs.saveBtn')}</Button>
 </div>
 );
 })}
 </div>
 </FormSection>
 )}
 </div>
 );
}
