"use client";

import { useState, useTransition } from"react";
import { Shield, Lock, Slash, Activity, AlertTriangle, Key, Plus } from"lucide-react";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";
import { FormSection } from"@/components/dashboard/forms/FormSection";
import { addToBlacklist, toggleBlacklistStatus, updateIncidentStatus } from"../actions";

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
 <h1 className="text-4xl font-black text-primary tracking-tighter uppercase flex items-center gap-3">
 <Shield className="w-10 h-10 text-primary"/>Bot Owner Security Panel</h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Restricted staff area: system security logs, global blacklists, audit logs, rate limits & API keys.
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
 <FormSection title="System Security Logs"icon={Shield} description="Global bot security telemetry.">
 <div className="overflow-x-auto border border-border">
 <table className="w-full text-left border-collapse text-sm">
 <thead className="bg-primary/10 border-b border-border text-xs uppercase">
 <tr>
 <th className="p-3">Action</th>
 <th className="p-3">Severity</th>
 <th className="p-3">Guild / User</th>
 <th className="p-3">Description</th>
 <th className="p-3">Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-primary/20">
 {initialData.secLogs.length === 0 ? (
 <tr>
 <td colSpan={5} className="p-6 text-center text-muted-foreground uppercase">
 No security events recorded.
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
 <td className="p-3 text-xs text-muted-foreground">
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
 <FormSection title="Add To Global Blacklist"icon={Slash} description="Ban entities globally across all Pegasus instances.">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Entity Type</label>
 <select
 value={newBlacklist.entityType}
 onChange={(e) => setNewBlacklist({ ...newBlacklist, entityType: e.target.value })}
 className="w-full p-2 bg-background border border-border rounded-md text-sm uppercase"
 >
 <option value="user">User</option>
 <option value="guild">Guild / Server</option>
 <option value="role">Role</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold uppercase">Entity Snowflake ID</label>
 <Input
 placeholder="ID string..."
 value={newBlacklist.entityId}
 onChange={(e) => setNewBlacklist({ ...newBlacklist, entityId: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>

 <div className="space-y-1 md:col-span-3">
 <label className="text-xs font-bold uppercase">Reason for Blacklist</label>
 <Input
 placeholder="Malicious exploit attempt / Terms violation"
 value={newBlacklist.reason}
 onChange={(e) => setNewBlacklist({ ...newBlacklist, reason: e.target.value })}
 className="rounded-md border border-border"
 />
 </div>
 </div>

 <Button
 onClick={handleAddBlacklist}
 disabled={isPending}
 className="rounded-md border border-border shadow-sm font-medium text-xs mt-4"
 >
 <Plus className="w-4 h-4 mr-2"/>Add To Blacklist</Button>
 </FormSection>

 <FormSection title="Active Blacklist"icon={Slash} description="Blacklisted entities.">
 <div className="space-y-3">
 {initialData.blacklists.length === 0 ? (
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
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
 <p className="text-xs text-muted-foreground mt-1">
 Reason: {b.reason} | Added By: {b.addedBy}
 </p>
 </div>

 <Button
 size="sm"
 variant="outline"
 onClick={() =>
 startTransition(async () => { await toggleBlacklistStatus(b.id, !b.active); })
 }
 className="rounded-md border border-border text-xs uppercase"
 >
 {b.active ?"Deactivate":"Activate"}
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
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
 No active security incidents reported.
 </p>
 ) : (
 initialData.incidents.map((inc) => (
 <div
 key={inc.id}
 className="p-4 border border-border bg-card flex justify-between items-center shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold text-primary">[{inc.type}]</span>
 <span className="font-bold uppercase">{inc.description}</span>
 <span className="text-xs border px-2 py-0.5 border-primary font-bold uppercase">
 STATUS: {inc.status}
 </span>
 </div>
 <p className="text-xs text-muted-foreground mt-1">
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
 <thead className="bg-primary/10 border-b border-border text-xs uppercase">
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
 <td colSpan={5} className="p-6 text-center text-muted-foreground uppercase">
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
 <td className="p-3 text-xs text-muted-foreground">
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
 <thead className="bg-primary/10 border-b border-border text-xs uppercase">
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
 <td colSpan={5} className="p-6 text-center text-muted-foreground uppercase">
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
 <td className="p-3 text-xs text-muted-foreground">
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
 <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
 No active API keys issued.
 </p>
 ) : (
 initialData.keys.map((k) => (
 <div
 key={k.id}
 className="p-4 border border-border bg-card flex justify-between items-center shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <span className="font-bold uppercase text-primary">{k.name}</span>
 <span className="text-xs border px-1 border-primary font-bold">
 User: {k.userId}
 </span>
 </div>
 <p className="text-xs text-muted-foreground mt-1">
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

