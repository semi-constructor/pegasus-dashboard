"use client";

import { useState, useTransition } from"react";
import { Save, Mic, Settings, Volume2 } from"lucide-react";
import { updateJtcConfig } from"../../actions";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";

export default function JtcForm({ guildId, initialData, channels }: { guildId: string, initialData: any, channels: any[] }) {
 const [isPending, startTransition] = useTransition();

 const [formData, setFormData] = useState({
 baseVoiceChannelId: initialData?.baseVoiceChannelId ??"",
 categoryId: initialData?.categoryId ??"",
 panelChannelId: initialData?.panelChannelId ??"",
 channelNameFormat: initialData?.channelNameFormat ??"{user}'s Channel",
 });

 const handleSave = () => {
 startTransition(async () => {
 const result = await updateJtcConfig(guildId, formData);
 if (result.success) {
 console.log("Saved JTC config");
 }
 });
 };

 const updateSetting = (key: keyof typeof formData, value: string) => {
 setFormData((prev) => ({ ...prev, [key]: value }));
 };

 const voiceChannels = channels.filter(c => c.type === 2);
 const textChannels = channels.filter(c => c.type === 0);
 const categories = channels.filter(c => c.type === 4);

 return (
 <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tighter uppercase flex items-center gap-3">
 <Mic className="w-10 h-10 text-primary"/>Voice Provisioning</h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Dynamic Voice Channel Allocation (Join-to-Create)
 </p>
 </div>
 </div>

 <div className="grid gap-6 md:grid-cols-2 mb-8">
 
 <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6">
 <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
 <Volume2 className="w-6 h-6 text-primary"/>
 <h2 className="text-xl font-black text-primary uppercase">Routing Config</h2>
 </div>
 
 <div className="space-y-5">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Base Voice Channel</label>
 <select 
 value={formData.baseVoiceChannelId}
 onChange={(e) => updateSetting("baseVoiceChannelId", e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-0 uppercase h-10"
 >
 <option value=""disabled>Select Channel</option>
 {voiceChannels.map(c => (
 <option key={c.id} value={c.id}>{c.name}</option>
 ))}
 </select>
 <p className="text-xs text-muted-foreground uppercase font-bold">The trigger channel users join.</p>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Target Category</label>
 <select 
 value={formData.categoryId}
 onChange={(e) => updateSetting("categoryId", e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-0 uppercase h-10"
 >
 <option value=""disabled>Select Category</option>
 {categories.map(c => (
 <option key={c.id} value={c.id}>{c.name}</option>
 ))}
 </select>
 <p className="text-xs text-muted-foreground uppercase font-bold">Where new channels will be spawned.</p>
 </div>
 </div>
 </div>

 <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6">
 <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
 <Settings className="w-6 h-6 text-primary"/>
 <h2 className="text-xl font-black text-primary uppercase">Spawn Parameters</h2>
 </div>
 
 <div className="space-y-5">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Panel Text Channel</label>
 <select 
 value={formData.panelChannelId}
 onChange={(e) => updateSetting("panelChannelId", e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-0 uppercase h-10"
 >
 <option value=""disabled>Select Text Channel</option>
 {textChannels.map(c => (
 <option key={c.id} value={c.id}>{c.name}</option>
 ))}
 </select>
 <p className="text-xs text-muted-foreground uppercase font-bold">Channel to host the management UI.</p>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Name Format</label>
 <Input 
 type="text"
 value={formData.channelNameFormat}
 onChange={(e) => updateSetting("channelNameFormat", e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 <p className="text-xs text-muted-foreground uppercase font-bold">Use {'{user}'} to inject username.</p>
 </div>
 </div>
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
 );
}
