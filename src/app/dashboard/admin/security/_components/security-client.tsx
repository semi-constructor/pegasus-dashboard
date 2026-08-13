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
  <div className="space-y-12 pb-32">
  <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-border pb-8">
  <div className="flex flex-col gap-4">
  <h1 className="text-lg font-medium tracking-[0.3em] uppercase flex items-center gap-4 text-foreground">
  <Shield className="w-5 h-5 text-foreground"/>{t('security.title')}</h1>
  <p className="text-foreground/50 text-sm tracking-wide">
  {t('security.description')}
  </p>
  </div>
  </div>

  {/* Tabs */}
  <div className="flex flex-wrap gap-px bg-foreground/10 border border-border p-px">
  {[
  { id:"logs", label:"Security Logs", icon: Shield },
  { id:"blacklist", label:"Global Blacklist", icon: Slash },
  { id:"incidents", label:"Security Incidents", icon: AlertTriangle },
  { id:"audits", label:"Audit Logs", icon: Activity },
  { id:"ratelimits", label:"Rate Limits", icon: Lock },
  { id:"apikeys", label:"API Keys", icon: Key },
  ].map((tab) => (
  <button
  key={tab.id}
  onClick={() => setActiveTab(tab.id as any)}
  className={`flex-1 min-w-[150px] px-4 py-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest transition-colors ${
    activeTab === tab.id ? "bg-foreground text-background font-medium" : "bg-background text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
  }`}
  >
  <tab.icon className="w-3 h-3"/>
  {tab.label}
  </button>
  ))}
  </div>

  <div className="space-y-12">
  {/* Tab 1: Security Logs */}
  {activeTab ==="logs"&& (
  <div className="space-y-8">
  <div className="border-b border-border pb-4">
  <h3 className="text-sm tracking-[0.2em] uppercase text-foreground flex items-center gap-2">
  <Shield className="w-4 h-4" />
  {t('security.title')}
  </h3>
  <p className="text-[10px] text-foreground/50 tracking-widest uppercase mt-2">{t('security.description')}</p>
  </div>
  
  <div className="overflow-x-auto">
  <table className="w-full text-left text-sm">
  <thead className="text-[10px] uppercase tracking-[0.3em] bg-foreground/5 border-y border-border text-foreground/50">
  <tr>
  <th className="px-8 py-4 font-normal">{t('security.action')}</th>
  <th className="px-8 py-4 font-normal">{t('security.severity')}</th>
  <th className="px-8 py-4 font-normal">Guild / User</th>
  <th className="px-8 py-4 font-normal">{t('security.descriptionHeader')}</th>
  <th className="px-8 py-4 font-normal">{t('security.date')}</th>
  </tr>
  </thead>
  <tbody>
  {initialData.secLogs.length === 0 ? (
  <tr>
  <td colSpan={5} className="p-12 text-center text-[10px] text-foreground/30 uppercase tracking-[0.2em]">
  {t('security.noEvents')}
  </td>
  </tr>
  ) : (
  initialData.secLogs.map((l) => (
  <tr key={l.id} className="border-b border-border hover:bg-foreground/5 transition-colors">
  <td className="px-8 py-4 font-medium text-foreground/80 font-mono text-xs uppercase">{l.action}</td>
  <td className="px-8 py-4">
  <span className="px-2 py-1 border border-rose-500/30 text-rose-500/70 text-[10px] uppercase tracking-widest">
  {l.severity}
  </span>
  </td>
  <td className="px-8 py-4 text-foreground/50 font-mono text-xs">
  G: {l.guildId} | U: {l.userId ||"N/A"}
  </td>
  <td className="px-8 py-4 text-foreground/70 font-mono text-xs max-w-xs truncate">{l.description}</td>
  <td className="px-8 py-4 text-[10px] text-foreground/30 uppercase tracking-widest font-mono">
  {new Date(l.createdAt).toLocaleString()}
  </td>
  </tr>
  ))
  )}
  </tbody>
  </table>
  </div>
  </div>
  )}

  {/* Tab 2: Global Blacklist */}
  {activeTab ==="blacklist"&& (
  <div className="space-y-12">
  <div className="space-y-8">
  <div className="border-b border-border pb-4">
  <h3 className="text-sm tracking-[0.2em] uppercase text-foreground flex items-center gap-2">
  <Slash className="w-4 h-4" />
  {t('security.addToBlacklist')}
  </h3>
  <p className="text-[10px] text-foreground/50 tracking-widest uppercase mt-2">Ban entities globally across all Pegasus instances.</p>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <div className="flex flex-col gap-4">
  <label className="block text-[10px] text-foreground/50 uppercase tracking-[0.2em]">{t('security.entityType')}</label>
  <select
  value={newBlacklist.entityType}
  onChange={(e) => setNewBlacklist({ ...newBlacklist, entityType: e.target.value })}
  className="w-full h-12 px-4 bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-none text-[10px] uppercase tracking-widest outline-none focus-visible:border-border transition-all appearance-none"
  >
  <option value="user" className="bg-background">{t('security.user')}</option>
  <option value="guild" className="bg-background">{t('security.guild')}</option>
  <option value="role" className="bg-background">{t('security.role')}</option>
  </select>
  </div>

  <div className="flex flex-col gap-4">
  <label className="block text-[10px] text-foreground/50 uppercase tracking-[0.2em]">{t('security.snowflakeId')}</label>
  <Input
  placeholder="ID string..."
  value={newBlacklist.entityId}
  onChange={(e) => setNewBlacklist({ ...newBlacklist, entityId: e.target.value })}
  className="w-full h-12 bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-none px-4 text-[10px] uppercase tracking-widest font-mono focus-visible:border-border transition-all focus-visible:ring-0"
  />
  </div>

  <div className="flex flex-col gap-4 md:col-span-3">
  <label className="block text-[10px] text-foreground/50 uppercase tracking-[0.2em]">{t('security.reason')}</label>
  <Input
  placeholder="Malicious exploit attempt / Terms violation"
  value={newBlacklist.reason}
  onChange={(e) => setNewBlacklist({ ...newBlacklist, reason: e.target.value })}
  className="w-full h-12 bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-none px-4 text-xs font-mono focus-visible:border-border transition-all focus-visible:ring-0"
  />
  </div>
  </div>

  <button
  onClick={handleAddBlacklist}
  disabled={isPending}
  className="px-6 py-3 border border-border text-foreground hover:bg-foreground hover:text-background transition-colors text-[10px] uppercase tracking-widest flex items-center gap-2"
  >
  <Plus className="w-3 h-3"/>{t('security.addToBlacklist')}</button>
  </div>

  <div className="space-y-8 pt-8 border-t border-border">
  <div className="border-b border-border pb-4">
  <h3 className="text-sm tracking-[0.2em] uppercase text-foreground flex items-center gap-2">
  <Slash className="w-4 h-4" />
  {t('security.activeBlacklist')}
  </h3>
  <p className="text-[10px] text-foreground/50 tracking-widest uppercase mt-2">Blacklisted entities.</p>
  </div>
  
  <div className="space-y-px bg-foreground/10 border border-border">
  {initialData.blacklists.length === 0 ? (
  <div className="bg-background p-12 text-center">
  <p className="text-foreground/50 text-[10px] tracking-widest uppercase">
  Blacklist is empty.
  </p>
  </div>
  ) : (
  initialData.blacklists.map((b) => (
  <div
  key={b.id}
  className={`p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group ${b.active ? 'bg-background border-l-4 border-rose-500' : 'bg-background/50 border-l-4 border-border opacity-70'}`}
  >
  <div className="space-y-4">
  <div className="flex items-center gap-4 flex-wrap">
  <span className={`font-medium text-sm tracking-widest uppercase font-mono ${b.active ? 'text-rose-500/90' : 'text-foreground/50'}`}>
  [{b.entityType}] {b.entityId}
  </span>
  {!b.active && (
  <span className="text-[10px] border border-border/30 text-foreground/50 px-2 py-1 uppercase tracking-widest">Inactive</span>
  )}
  </div>
  <p className="text-[10px] text-foreground/50 font-mono tracking-widest uppercase">
  Reason: {b.reason} | Added By: {b.addedBy}
  </p>
  </div>

  <button
  onClick={() => startTransition(async () => { await toggleBlacklistStatus(b.id, !b.active); })}
  className={`px-6 py-3 border transition-colors text-[10px] uppercase tracking-widest shrink-0 ${b.active ? 'border-border/30 text-foreground/70 hover:border-border hover:text-foreground' : 'border-rose-500/30 text-rose-500/70 hover:border-rose-500 hover:text-rose-500'}`}
  >
  {b.active ? t('security.deactivate') : t('security.activate')}
  </button>
  </div>
  ))
  )}
  </div>
  </div>
  </div>
  )}

  {/* Tab 3: Incidents */}
  {activeTab ==="incidents"&& (
  <div className="space-y-8">
  <div className="border-b border-border pb-4">
  <h3 className="text-sm tracking-[0.2em] uppercase text-foreground flex items-center gap-2">
  <AlertTriangle className="w-4 h-4" />
  Security Incidents
  </h3>
  <p className="text-[10px] text-foreground/50 tracking-widest uppercase mt-2">Critical security incident triage.</p>
  </div>
  
  <div className="space-y-px bg-foreground/10 border border-border">
  {initialData.incidents.length === 0 ? (
  <div className="bg-background p-12 text-center">
  <p className="text-foreground/50 text-[10px] tracking-widest uppercase">
  No active security incidents reported.
  </p>
  </div>
  ) : (
  initialData.incidents.map((inc) => (
  <div
  key={inc.id}
  className="p-8 bg-background hover:bg-foreground/5 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group"
  >
  <div className="space-y-4">
  <div className="flex items-center gap-4 flex-wrap">
  <span className="font-medium text-xs tracking-widest uppercase text-foreground/50 border border-border px-2 py-1">[{inc.type}]</span>
  <span className="font-medium text-sm tracking-wide uppercase text-foreground">{inc.description}</span>
  <span className="text-[10px] border border-border/30 px-2 py-1 uppercase tracking-widest text-foreground/70">
  STATUS: {inc.status}
  </span>
  </div>
  <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-mono">
  Guild: {inc.guildId} | Severity: {inc.severity} | Date: {new Date(inc.createdAt).toLocaleString()}
  </p>
  </div>

  {inc.status !=="resolved"&& (
  <button
  onClick={() => startTransition(async () => { await updateIncidentStatus(inc.id,"resolved"); })}
  className="px-6 py-3 border border-emerald-500/30 text-emerald-500/70 hover:border-emerald-500 hover:text-emerald-500 transition-colors text-[10px] uppercase tracking-widest shrink-0"
  >
  Mark Resolved
  </button>
  )}
  </div>
  ))
  )}
  </div>
  </div>
  )}

  {/* Tab 4: Audit Logs */}
  {activeTab ==="audits"&& (
  <div className="space-y-8">
  <div className="border-b border-border pb-4">
  <h3 className="text-sm tracking-[0.2em] uppercase text-foreground flex items-center gap-2">
  <Activity className="w-4 h-4" />
  System Audit Logs
  </h3>
  <p className="text-[10px] text-foreground/50 tracking-widest uppercase mt-2">System-wide administration audit trails.</p>
  </div>
  
  <div className="overflow-x-auto">
  <table className="w-full text-left text-sm">
  <thead className="text-[10px] uppercase tracking-[0.3em] bg-foreground/5 border-y border-border text-foreground/50">
  <tr>
  <th className="px-8 py-4 font-normal">Action</th>
  <th className="px-8 py-4 font-normal">User ID</th>
  <th className="px-8 py-4 font-normal">Guild ID</th>
  <th className="px-8 py-4 font-normal">Target</th>
  <th className="px-8 py-4 font-normal">Date</th>
  </tr>
  </thead>
  <tbody>
  {initialData.audits.length === 0 ? (
  <tr>
  <td colSpan={5} className="p-12 text-center text-[10px] text-foreground/30 uppercase tracking-[0.2em]">
  No audit records available.
  </td>
  </tr>
  ) : (
  initialData.audits.map((a) => (
  <tr key={a.id} className="border-b border-border hover:bg-foreground/5 transition-colors">
  <td className="px-8 py-4 font-medium text-foreground/80 font-mono text-xs uppercase">{a.action}</td>
  <td className="px-8 py-4 text-foreground/50 font-mono text-xs">{a.userId}</td>
  <td className="px-8 py-4 text-foreground/50 font-mono text-xs">{a.guildId}</td>
  <td className="px-8 py-4 text-foreground/70 font-mono text-xs">
  {a.targetType}: {a.targetId}
  </td>
  <td className="px-8 py-4 text-[10px] text-foreground/30 uppercase tracking-widest font-mono">
  {new Date(a.createdAt).toLocaleString()}
  </td>
  </tr>
  ))
  )}
  </tbody>
  </table>
  </div>
  </div>
  )}

  {/* Tab 5: Rate Limits */}
  {activeTab ==="ratelimits"&& (
  <div className="space-y-8">
  <div className="border-b border-border pb-4">
  <h3 className="text-sm tracking-[0.2em] uppercase text-foreground flex items-center gap-2">
  <Lock className="w-4 h-4" />
  Rate Limit Violations
  </h3>
  <p className="text-[10px] text-foreground/50 tracking-widest uppercase mt-2">Endpoint rate limit exceedances.</p>
  </div>
  
  <div className="overflow-x-auto">
  <table className="w-full text-left text-sm">
  <thead className="text-[10px] uppercase tracking-[0.3em] bg-foreground/5 border-y border-border text-foreground/50">
  <tr>
  <th className="px-8 py-4 font-normal">User ID</th>
  <th className="px-8 py-4 font-normal">Endpoint</th>
  <th className="px-8 py-4 font-normal">Violations</th>
  <th className="px-8 py-4 font-normal">Blocked</th>
  <th className="px-8 py-4 font-normal">Date</th>
  </tr>
  </thead>
  <tbody>
  {initialData.rateLimits.length === 0 ? (
  <tr>
  <td colSpan={5} className="p-12 text-center text-[10px] text-foreground/30 uppercase tracking-[0.2em]">
  No rate limit violations logged.
  </td>
  </tr>
  ) : (
  initialData.rateLimits.map((r) => (
  <tr key={r.id} className="border-b border-border hover:bg-foreground/5 transition-colors">
  <td className="px-8 py-4 font-medium text-foreground/80 font-mono text-xs">{r.userId}</td>
  <td className="px-8 py-4 text-foreground font-mono text-xs">{r.endpoint}</td>
  <td className="px-8 py-4 text-rose-500/90 font-mono text-xs font-bold">{r.violations}</td>
  <td className="px-8 py-4">
  <span className={`px-2 py-1 text-[10px] uppercase tracking-widest border ${r.blocked ? 'border-rose-500/30 text-rose-500/70' : 'border-border/30 text-foreground/50'}`}>
  {r.blocked ?"YES":"NO"}
  </span>
  </td>
  <td className="px-8 py-4 text-[10px] text-foreground/30 uppercase tracking-widest font-mono">
  {new Date(r.createdAt).toLocaleString()}
  </td>
  </tr>
  ))
  )}
  </tbody>
  </table>
  </div>
  </div>
  )}

  {/* Tab 6: API Keys */}
  {activeTab ==="apikeys"&& (
  <div className="space-y-8">
  <div className="border-b border-border pb-4">
  <h3 className="text-sm tracking-[0.2em] uppercase text-foreground flex items-center gap-2">
  <Key className="w-4 h-4" />
  Registered Api Keys
  </h3>
  <p className="text-[10px] text-foreground/50 tracking-widest uppercase mt-2">Bot API access keys.</p>
  </div>
  
  <div className="space-y-px bg-foreground/10 border border-border">
  {initialData.keys.length === 0 ? (
  <div className="bg-background p-12 text-center">
  <p className="text-foreground/50 text-[10px] tracking-widest uppercase">
  No active API keys issued.
  </p>
  </div>
  ) : (
  initialData.keys.map((k) => (
  <div
  key={k.id}
  className="p-8 bg-background hover:bg-foreground/5 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group"
  >
  <div className="space-y-4">
  <div className="flex items-center gap-4 flex-wrap">
  <span className="font-medium text-sm tracking-wide uppercase text-foreground">{k.name}</span>
  <span className="text-[10px] border border-border/30 px-2 py-1 uppercase tracking-widest text-foreground/70">
  User: {k.userId}
  </span>
  </div>
  <p className="text-[10px] text-foreground/50 uppercase tracking-widest font-mono">
  Rate Limit: {k.rateLimit} req/hr | Status: {k.active ?"Active":"Revoked"}
  </p>
  </div>
  </div>
  ))
  )}
  </div>
  </div>
  )}
  </div>
  </div>
  );
}

