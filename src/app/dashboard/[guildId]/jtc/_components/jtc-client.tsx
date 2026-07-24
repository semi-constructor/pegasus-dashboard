"use client";

import { useState, useTransition } from"react";
import { Mic, Save, Trash2, Volume2, Lock, Unlock } from"lucide-react";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";
import { FormSection } from"@/components/dashboard/forms/FormSection";
import {
 DiscordChannelPicker,
 type ChannelOption,
} from"@/components/dashboard/pickers/DiscordChannelPicker";
import { saveJtcConfig, deleteActiveJtcChannel } from"../actions";

interface JtcClientProps {
 guildId: string;
 initialConfig: any;
 initialActiveChannels: any[];
 channels: ChannelOption[];
}

export default function JtcClient({
 guildId,
 initialConfig,
 initialActiveChannels,
 channels,
}: JtcClientProps) {
 const [isPending, startTransition] = useTransition();

 const [config, setConfig] = useState({
 baseVoiceChannelId: initialConfig?.baseVoiceChannelId ??"",
 categoryId: initialConfig?.categoryId ??"",
 panelChannelId: initialConfig?.panelChannelId ??"",
 channelNameFormat: initialConfig?.channelNameFormat ??"{user}'s Channel",
 });

 const handleSave = () => {
 if (!config.baseVoiceChannelId || !config.categoryId || !config.panelChannelId) return;
 startTransition(async () => {
 await saveJtcConfig(guildId, config);
 });
 };

  return (
    <div className="text-white p-6 lg:p-10 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <Mic className="w-8 h-8 text-white" />
            </div>
            Join To Create
          </h1>
          <p className="text-white/40 mt-3 text-sm font-medium tracking-wide">
            Dynamic temporary voice channel generator configuration.
          </p>
        </div>
      </div>
      <div className="space-y-8">

 {/* Configuration Form */}
 <FormSection title="Jtc System Config"icon={Mic} description="Set up master trigger channel and destination category.">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-1">
 <label className="text-xs font-bold text-white/70 uppercase">Base Voice Channel (Trigger)</label>
 <DiscordChannelPicker
 channels={channels.filter((c) => c.type === 2)}
 value={config.baseVoiceChannelId || null}
 onChange={(c) => setConfig({ ...config, baseVoiceChannelId: c ||""})}
 placeholder="Select Base Voice Channel..."
 />
 <p className="text-xs text-white/50">Joining this channel spawns a new room.</p>
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold text-white/70 uppercase">Destination Category</label>
 <DiscordChannelPicker
 channels={channels.filter((c) => c.type === 4)}
 value={config.categoryId || null}
 onChange={(c) => setConfig({ ...config, categoryId: c ||""})}
 placeholder="Select Category..."
 />
 <p className="text-xs text-white/50">Where temp channels are created.</p>
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold text-white/70 uppercase">Panel Interface Text Channel</label>
 <DiscordChannelPicker
 channels={channels.filter((c) => c.type === 0 || c.type === 5)}
 value={config.panelChannelId || null}
 onChange={(c) => setConfig({ ...config, panelChannelId: c ||""})}
 placeholder="Select Text Channel..."
 />
 <p className="text-xs text-white/50">Where owner control panel is posted.</p>
 </div>

 <div className="space-y-1">
 <label className="text-xs font-bold text-white/70 uppercase">Channel Naming Template</label>
 <Input
 value={config.channelNameFormat}
 onChange={(e) => setConfig({ ...config, channelNameFormat: e.target.value })}
 className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm focus-visible:ring-0 text-white placeholder:text-white/30"
 />
 <p className="text-xs text-white/50 uppercase">Variable: {"{user}"}</p>
 </div>
 </div>

 <Button
 onClick={handleSave}
 disabled={isPending}
 className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase mt-4"
 >
 <Save className="w-4 h-4 mr-2"/>Save Jtc Config</Button>
 </FormSection>

 {/* Active Channels Monitor */}
 <FormSection title="Active Temporary Channels"icon={Volume2} description="Live spawned user voice channels.">
 <div className="space-y-3">
 {initialActiveChannels.length === 0 ? (
 <p className="text-white/40 text-sm uppercase p-4 border border-white/10 bg-white/5 rounded-xl">
 No active temporary JTC channels online.
 </p>
 ) : (
 initialActiveChannels.map((ch) => (
 <div
 key={ch.id}
 className="p-4 rounded-xl bg-black/20 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
 >
 <div>
 <div className="flex items-center gap-2">
 <Volume2 className="w-4 h-4 text-primary"/>
 <span className="font-bold uppercase text-primary">Channel ID: {ch.channelId}</span>
 {ch.isLocked ? (
 <span className="text-xs border px-1 border-destructive text-destructive font-bold flex items-center gap-1 uppercase">
 <Lock className="w-3 h-3"/> Locked
 </span>
 ) : (
 <span className="text-xs border px-1 border-primary text-primary font-bold flex items-center gap-1 uppercase">
 <Unlock className="w-3 h-3"/> Open
 </span>
 )}
 </div>
 <p className="text-xs text-muted-foreground mt-1">
 Owner: {ch.ownerId} | User Limit: {ch.userLimit === 0 ?"Unlimited": ch.userLimit} | Created: {new Date(ch.createdAt).toLocaleTimeString()}
 </p>
 </div>

 <Button
 size="sm"
 variant="destructive"
 onClick={() => startTransition(async () => { await deleteActiveJtcChannel(guildId, ch.channelId); })}
 className="rounded-md border border-destructive text-xs uppercase"
 >
 <Trash2 className="w-3.5 h-3.5 mr-1"/>
 Terminate Room
 </Button>
 </div>
  ))
  )}
  </div>
  </FormSection>
      </div>
    </div>
  );
}
