"use client";

import { useState, useTransition } from"react";
import { Shield, Save, Settings2, ShieldCheck, AlertTriangle, Hammer, Plus, Trash2 } from"lucide-react";
import { updateModerationSettings, createWordFilter, deleteWordFilter } from"../../actions";
import { Switch } from"@/components/ui/switch";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";

export default function ModerationForm({ guildId, initialData, channels, initialWordFilters = [] }: { guildId: string, initialData: any, channels: any[], initialWordFilters: any[] }) {
 const [isPending, startTransition] = useTransition();

 const [enabled, setEnabled] = useState(initialData?.securityEnabled ?? true);
 const [antiSpam, setAntiSpam] = useState(initialData?.antiSpamEnabled ?? true);
 const [antiRaid, setAntiRaid] = useState(initialData?.antiRaidEnabled ?? true);
 const [muteRole, setMuteRole] = useState("muted");

 const [wordFilters, setWordFilters] = useState(initialWordFilters);
 const [newPattern, setNewPattern] = useState("");
 const [newSeverity, setNewSeverity] = useState("medium");
 
 const handleSave = () => {
 startTransition(async () => {
 const result = await updateModerationSettings(guildId, {
 securityEnabled: enabled,
 antiSpamEnabled: antiSpam,
 antiRaidEnabled: antiRaid,
 });
 if (result.success) {
 console.log("Saved moderation settings");
 } else {
 console.error(result.error);
 }
 });
 };

 const handleAddFilter = () => {
 if (!newPattern) return;
 startTransition(async () => {
 const data = {
 pattern: newPattern,
 severity: newSeverity,
 autoDelete: true
 };
 
 const tempId = Math.random();
 setWordFilters([{ ...data, id: tempId }, ...wordFilters]);

 const res = await createWordFilter(guildId, data);
 if (!res.success) {
 setWordFilters(wordFilters); // Revert
 } else {
 setNewPattern("");
 window.location.reload();
 }
 });
 };

 const handleDeleteFilter = (id: number) => {
 startTransition(async () => {
 setWordFilters(wordFilters.filter(f => f.id !== id));
 await deleteWordFilter(guildId, id);
 });
 };

 return (
 <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tighter uppercase flex items-center gap-3">
 <Shield className="w-10 h-10 text-primary"/>Mod Sys Ctrl</h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Automated enforcement protocols & threat mitigation.
 </p>
 </div>
 
 <div className="flex items-center gap-3 bg-background border border-border shadow-sm px-5 py-3 rounded-md">
 <span className="font-bold text-sm text-primary">Sys Status</span>
 <Switch 
 checked={enabled} 
 onCheckedChange={setEnabled} 
 className="border border-border data-[state=checked]:bg-primary rounded-md"
 />
 <span className={`font-black ${enabled ? 'text-primary' : 'text-muted-foreground'}`}>
 {enabled ? 'ONLINE' : 'OFFLINE'}
 </span>
 </div>
 </div>

 <div className={`transition-all duration-300 ${enabled ? 'opacity-100' : 'opacity-50 grayscale-[50%] pointer-events-none'}`}>
 <div className="grid gap-6 md:grid-cols-2 mb-8">
 
 <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6">
 <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
 <Settings2 className="w-6 h-6 text-primary"/>
 <h2 className="text-xl font-black text-primary uppercase">Base Config</h2>
 </div>
 
 <div className="space-y-5">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase flex items-center gap-2">
 <Hammer className="w-4 h-4 text-muted-foreground"/>Isolation Role</label>
 <Input 
 type="text"
 value={muteRole}
 onChange={(e) => setMuteRole(e.target.value)}
 placeholder="e.g. role-id or Muted"
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 <p className="text-xs text-muted-foreground uppercase font-bold">Role assigned to flagged entities.</p>
 </div>
 </div>
 </div>

 <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6">
 <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
 <ShieldCheck className="w-6 h-6 text-primary"/>
 <h2 className="text-xl font-black text-primary uppercase">Heuristic Filters</h2>
 </div>
 
 <div className="space-y-4">
 <div 
 className="flex items-center justify-between p-4 bg-background border border-border shadow-sm cursor-pointer hover:shadow-sm transition-all"
 onClick={() => setAntiSpam(!antiSpam)}
 >
 <div className="flex items-center gap-3">
 <AlertTriangle className={`w-5 h-5 ${antiSpam ? 'text-primary' : 'text-muted-foreground'}`} />
 <div>
 <div className="font-black text-sm uppercase">Rate Limiter (ANTI-SPAM)</div>
 <div className="text-xs text-muted-foreground font-bold uppercase">Blocks rapid transmission</div>
 </div>
 </div>
 <div className={`text-xs font-black px-2 py-1 border-2 ${antiSpam ? 'text-primary border-primary bg-primary/10' : 'text-muted-foreground border-muted-foreground bg-muted/50'}`}>
 {antiSpam ? 'ACTIVE' : 'IDLE'}
 </div>
 </div>
 
 <div 
 className="flex items-center justify-between p-4 bg-background border border-border shadow-sm cursor-pointer hover:shadow-sm transition-all"
 onClick={() => setAntiRaid(!antiRaid)}
 >
 <div className="flex items-center gap-3">
 <Shield className={`w-5 h-5 ${antiRaid ? 'text-primary' : 'text-muted-foreground'}`} />
 <div>
 <div className="font-black text-sm uppercase">Swarm Defense (ANTI-RAID)</div>
 <div className="text-xs text-muted-foreground font-bold uppercase">Prevents mass infiltration</div>
 </div>
 </div>
 <div className={`text-xs font-black px-2 py-1 border-2 ${antiRaid ? 'text-primary border-primary bg-primary/10' : 'text-muted-foreground border-muted-foreground bg-muted/50'}`}>
 {antiRaid ? 'ACTIVE' : 'IDLE'}
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6 mb-8">
 <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-4">
 <h2 className="text-xl font-black text-primary uppercase">Word Filters</h2>
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="space-y-2 md:col-span-2">
 <label className="text-sm font-bold text-primary uppercase">Pattern / REGEX</label>
 <Input 
 type="text"
 value={newPattern}
 onChange={(e) => setNewPattern(e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 placeholder="badword"
 />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Severity</label>
 <select 
 value={newSeverity}
 onChange={(e) => setNewSeverity(e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus:outline-none focus:ring-0 appearance-none h-10 uppercase font-bold"
 >
 <option value="low">Low</option>
 <option value="medium">Medium</option>
 <option value="high">High</option>
 </select>
 </div>
 </div>
 
 <Button 
 onClick={handleAddFilter} 
 disabled={isPending}
 className="rounded-md border border-border shadow-sm hover:shadow-sm transition-all font-bold mt-4"
 >
 <Plus className="w-4 h-4 mr-2"/>
 {isPending ?"ADDING...":"APPEND_FILTER"}
 </Button>

 <div className="mt-6 space-y-4">
 {wordFilters.length === 0 ? (
 <div className="border-2 border-dashed border-primary/50 p-6 text-center text-muted-foreground uppercase font-bold">No Filters Defined</div>
 ) : (
 wordFilters.map((f) => (
 <div key={f.id} className="flex items-center justify-between p-4 bg-background border border-border shadow-sm">
 <div className="flex items-center gap-4">
 <span className="font-bold text-primary bg-primary/10 px-2 py-1 border border-primary/20">{f.pattern}</span>
 <span className="text-xs font-bold uppercase text-muted-foreground">LVL: {f.severity}</span>
 </div>
 <Button
 variant="destructive"
 size="sm"
 onClick={() => handleDeleteFilter(f.id)}
 disabled={isPending}
 className="rounded-md border border-destructive uppercase font-bold shadow-sm transition-all h-8"
 >
 <Trash2 className="w-4 h-4"/>
 </Button>
 </div>
 ))
 )}
 </div>
 </div>

 <div className="flex justify-end">
 <Button 
 onClick={handleSave}
 disabled={isPending}
 className="bg-primary hover:bg-primary text-primary-foreground px-8 py-6 rounded-md font-black text-lg flex items-center gap-3 transition-all border border-border shadow-sm hover:shadow-sm"
 >
 <Save className="w-5 h-5"/>
 {isPending ?"COMMITING...":"COMMIT_CONFIG"}
 </Button>
 </div>
 </div>
 </div>
 );
}
