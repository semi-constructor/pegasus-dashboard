"use client";

import { useState, useTransition } from"react";
import { Shield, Lock, Slash, Activity, AlertTriangle, Key, Plus } from"lucide-react";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";
import { FormSection } from"@/components/dashboard/forms/FormSection";
import { addToBlacklist, toggleBlacklistStatus, updateIncidentStatus } from"../actions";
import { useTranslations } from "next-intl";

interface SecurityClientProps {
 initialData: {
 secLogs: any[];
 blacklists: any[];
 audits: any[];
 rateLimits: any[];
 incidents: any[];
 keys: any[];
 };
}

export default function SecurityClient({ initialData }: SecurityClientProps) {
 const t = useTranslations('adminPages');
 const [activeTab, setActiveTab] = useState<
"logs"|"blacklist"|"incidents"|"audits"|"ratelimits"|"apikeys"
 >("logs");
 const [isPending, startTransition] = useTransition();

 const [newBlacklist, setNewBlacklist] = useState({
 entityType:"user",
 entityId:"",
 reason:"",
 });

 const handleAddBlacklist = () => {
 if (!newBlacklist.entityId || !newBlacklist.reason) return;
 startTransition(async () => {
 await addToBlacklist(
 newBlacklist.entityType,
 newBlacklist.entityId,
 newBlacklist.reason
 );
 setNewBlacklist({ entityType:"user", entityId:"", reason:""});
 });
 };

 return (
 <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
 <div className="flex items-center justify-between border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tight uppercase flex items-center gap-3">
 <Shield className="w-10 h-10 text-primary"/>{t('security.title')}</h1>
 <p className="text-white/40 mt-2 text-sm">
 {t('security.description')}
 </p>
 </div>
 </div>

 {/* Tabs */}
 <div className="flex flex-wrap gap-2 border-b border-border/50 pb-2">
 {[
 { id:"logs", label:"Security Logs", icon: Shield },
 { id:"blacklist", label:"Global Blacklist", icon: Slash },
 { id:"incidents", label:"Security Incidents", icon: AlertTriangle },
 { id:"audits", label:"Audit Logs", icon: Activity },
 { id:"ratelimits", label:"Rate Limits", icon: Lock },
 { id:"apikeys", label:"API Keys", icon: Key },
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

 {/* Tab 1: Security Logs */}
 {activeTab ==="logs"&& (
 <FormSection title={t('security.title')} icon={Shield} description={t('security.description')}>
 <div className="overflow-x-auto border border-border">
 <table className="w-full text-left border-collapse text-sm">
 <thead className="bg-primary/10 border-b border-white/10 text-xs uppercase text-white/60">
 <tr>
 <th className="p-3">{t('security.action')}</th>
 <th className="p-3">{t('security.severity')}</th>
 <th className="p-3">Guild / User</th>
 <th className="p-3">{t('security.descriptionHeader')}</th>
 <th className="p-3">{t('security.date')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-primary/20">
 {initialData.secLogs.length === 0 ? (
 <tr>
 <td colSpan={5} className="p-6 text-center text-white/40 uppercase">
 {t('security.noEvents')}
 </td>
 </tr>
 ) : (
 initialData.secLogs.map((l) => (
 <tr key={l.id} className="hover:bg-primary/5">
 <td className="p-3 font-bold">{l.action}</td>
 <td className="p-3">
 <span className="px-2 py-0.5 border border-destructive bg-destructive/20 text-destructive font-bold uppercase text-xs">
 {l.severity}
 </span>
 </td>
 <td className="p-3">
 G: {l.guildId} | U: {l.userId ||"N/A"}
 </td>
 <td className="p-3 truncate max-w-xs">{l.description}</td>
 <td className="p-3 text-xs text-white/40">
 {new Date(l.createdAt).toLocaleString()}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </FormSection>
 )}

 {/* Tab 2: Global Blacklist */}
 {activeTab ==="blacklist"&& (
 <div className="space-y-6">
 <FormSection title={t('security.addToBlacklist')} icon={Slash} description="Ban entities globally across all Pegasus instances.">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('security.entityType')}</label>
 <select
 value={newBlacklist.entityType}
 onChange={(e) => setNewBlacklist({ ...newBlacklist, entityType: e.target.value })}
 className="w-full min-h-[40px] px-3 py-2 bg-black/40 border border-white/10 text-white placeholder:text-white/30 rounded-lg text-sm uppercase outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 >
 <option value="user">{t('security.user')}</option>
 <option value="guild">{t('security.guild')}</option>
 <option value="role">{t('security.role')}</option>
 </select>
 </div>

 <div className="flex flex-col gap-2">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('security.snowflakeId')}</label>
 <Input
 placeholder="ID string..."
 value={newBlacklist.entityId}
 onChange={(e) => setNewBlacklist({ ...newBlacklist, entityId: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>

 <div className="space-y-1 md:col-span-3">
 <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t('security.reason')}</label>
 <Input
 placeholder="Malicious exploit attempt / Terms violation"
 value={newBlacklist.reason}
 onChange={(e) => setNewBlacklist({ ...newBlacklist, reason: e.target.value })}
 className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
 />
 </div>
 </div>

 <Button
 onClick={handleAddBlacklist}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs mt-4"
 >
 <Plus className="w-4 h-4 mr-2"/>{t('security.addToBlacklist')}</Button>
 </FormSection>

 <FormSection title={t('security.activeBlacklist')} icon={Slash} description="Blacklisted entities.">
 <div className="space-y-3">
 {initialData.blacklists.length === 0 ? (
 <p className="text-white/40 text-sm uppercase p-4 border border-border">
 Blacklist is empty.
 </p>
 ) : (
 initialData.blacklists.map((b) => (
 <div
 key={b.id}
 className="p-4 border border-destructive bg-destructive/10 flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-destructive uppercase">
 [{b.entityType}] {b.entityId}
 </span>
 {!b.active && (
 <span className="text-xs border px-1 border-primary text-primary font-bold">Inactive</span>
 )}
 </div>
 <p className="text-xs text-white/40 mt-1">
 Reason: {b.reason} | Added By: {b.addedBy}
 </p>
 </div>

 <Button
 size="sm"
 className="bg-white/5 hover:bg-white/10 text-white border border-white/10"onClick={() =>
 startTransition(async () => { await toggleBlacklistStatus(b.id, !b.active); })
 }
 >
 {b.active ? t('security.deactivate') : t('security.activate')}
 </Button>
 </div>
 ))
 )}
 </div>
 </FormSection>
 </div>
 )}

 {/* Tab 3: Incidents */}
 {activeTab ==="incidents"&& (
 <FormSection title="Security Incidents"icon={AlertTriangle} description="Critical security incident triage.">
 <div className="space-y-3">
 {initialData.incidents.length === 0 ? (
 <p className="text-white/40 text-sm uppercase p-4 border border-border">
 No active security incidents reported.
 </p>
 ) : (
 initialData.incidents.map((inc) => (
 <div
 key={inc.id}
 className="p-4 rounded-xl border border-white/5 bg-black/20 text-white backdrop-blur-md hover:bg-white/5 transition-all flex justify-between items-center shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-primary">[{inc.type}]</span>
 <span className="font-bold uppercase">{inc.description}</span>
 <span className="text-xs border px-2 py-0.5 border-primary font-bold uppercase">
 STATUS: {inc.status}
 </span>
 </div>
 <p className="text-xs text-white/40 mt-1">
 Guild: {inc.guildId} | Severity: {inc.severity} | Date: {new Date(inc.createdAt).toLocaleString()}
 </p>
 </div>

 {inc.status !=="resolved"&& (
 <Button
 size="sm"
 onClick={() =>
 startTransition(async () => { await updateIncidentStatus(inc.id,"resolved"); })
 }
 className="rounded-md border border-border text-xs font-medium"
 >
 Mark Resolved
 </Button>
 )}
 </div>
 ))
 )}
 </div>
 </FormSection>
 )}

 {/* Tab 4: Audit Logs */}
 {activeTab ==="audits"&& (
 <FormSection title="System Audit Logs"icon={Activity} description="System-wide administration audit trails.">
 <div className="overflow-x-auto border border-border">
 <table className="w-full text-left border-collapse text-sm">
 <thead className="bg-primary/10 border-b border-white/10 text-xs uppercase text-white/60">
 <tr>
 <th className="p-3">Action</th>
 <th className="p-3">User ID</th>
 <th className="p-3">Guild ID</th>
 <th className="p-3">Target</th>
 <th className="p-3">Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-primary/20">
 {initialData.audits.length === 0 ? (
 <tr>
 <td colSpan={5} className="p-6 text-center text-white/40 uppercase">
 No audit records available.
 </td>
 </tr>
 ) : (
 initialData.audits.map((a) => (
 <tr key={a.id} className="hover:bg-primary/5">
 <td className="p-3 font-bold">{a.action}</td>
 <td className="p-3">{a.userId}</td>
 <td className="p-3">{a.guildId}</td>
 <td className="p-3">
 {a.targetType}: {a.targetId}
 </td>
 <td className="p-3 text-xs text-white/40">
 {new Date(a.createdAt).toLocaleString()}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </FormSection>
 )}

 {/* Tab 5: Rate Limits */}
 {activeTab ==="ratelimits"&& (
 <FormSection title="Rate Limit Violations"icon={Lock} description="Endpoint rate limit exceedances.">
 <div className="overflow-x-auto border border-border">
 <table className="w-full text-left border-collapse text-sm">
 <thead className="bg-primary/10 border-b border-white/10 text-xs uppercase text-white/60">
 <tr>
 <th className="p-3">User ID</th>
 <th className="p-3">Endpoint</th>
 <th className="p-3">Violations</th>
 <th className="p-3">Blocked</th>
 <th className="p-3">Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-primary/20">
 {initialData.rateLimits.length === 0 ? (
 <tr>
 <td colSpan={5} className="p-6 text-center text-white/40 uppercase">
 No rate limit violations logged.
 </td>
 </tr>
 ) : (
 initialData.rateLimits.map((r) => (
 <tr key={r.id} className="hover:bg-primary/5">
 <td className="p-3 font-bold">{r.userId}</td>
 <td className="p-3 font-bold text-primary">{r.endpoint}</td>
 <td className="p-3 font-bold text-destructive">{r.violations}</td>
 <td className="p-3">{r.blocked ?"YES":"NO"}</td>
 <td className="p-3 text-xs text-white/40">
 {new Date(r.createdAt).toLocaleString()}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </FormSection>
 )}

 {/* Tab 6: API Keys */}
 {activeTab ==="apikeys"&& (
 <FormSection title="Registered Api Keys"icon={Key} description="Bot API access keys.">
 <div className="space-y-3">
 {initialData.keys.length === 0 ? (
 <p className="text-white/40 text-sm uppercase p-4 border border-border">
 No active API keys issued.
 </p>
 ) : (
 initialData.keys.map((k) => (
 <div
 key={k.id}
 className="p-4 rounded-xl border border-white/5 bg-black/20 text-white backdrop-blur-md hover:bg-white/5 transition-all flex justify-between items-center shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold uppercase text-primary">{k.name}</span>
 <span className="text-xs border px-1 border-primary font-bold">
 User: {k.userId}
 </span>
 </div>
 <p className="text-xs text-white/40 mt-1">
 Rate Limit: {k.rateLimit} req/hr | Status: {k.active ?"Active":"Revoked"}
 </p>
 </div>
 </div>
 ))
 )}
 </div>
 </FormSection>
 )}
 </div>
 );
}

