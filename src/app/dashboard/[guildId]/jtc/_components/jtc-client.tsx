"use client";

import { useState, useTransition } from"react";
import { useTranslations } from "next-intl";
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
 const t = useTranslations('guildJtc');
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
            {t("title")}
          </h1>
          <p className="text-white/40 mt-3 text-sm font-medium tracking-wide">
            {t("subtitle")}
          </p>
        </div>
      </div>
      <div className="space-y-8">

  {/* Configuration Form */}
  <FormSection title={t("config.title")} icon={Mic} description={t("config.description")}>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="flex flex-col gap-2">
  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("config.baseChannel")}</label>
  <DiscordChannelPicker
  channels={channels.filter((c) => c.type === 2)}
  value={config.baseVoiceChannelId || null}
  onChange={(c) => setConfig({ ...config, baseVoiceChannelId: c ||""})}
  placeholder="Select Base Voice Channel..."
  />
  <p className="text-xs text-white/50">{t("config.baseChannelDesc")}</p>
  </div>

  <div className="flex flex-col gap-2">
  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("config.category")}</label>
  <DiscordChannelPicker
  channels={channels.filter((c) => c.type === 4)}
  value={config.categoryId || null}
  onChange={(c) => setConfig({ ...config, categoryId: c ||""})}
  placeholder="Select Category..."
  />
  <p className="text-xs text-white/50">{t("config.categoryDesc")}</p>
  </div>

  <div className="flex flex-col gap-2">
  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("config.panelChannel")}</label>
  <DiscordChannelPicker
  channels={channels.filter((c) => c.type === 0 || c.type === 5)}
  value={config.panelChannelId || null}
  onChange={(c) => setConfig({ ...config, panelChannelId: c ||""})}
  placeholder="Select Text Channel..."
  />
  <p className="text-xs text-white/50">{t("config.panelChannelDesc")}</p>
  </div>

  <div className="flex flex-col gap-2">
  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("config.nameFormat")}</label>
  <Input
  value={config.channelNameFormat}
  onChange={(e) => setConfig({ ...config, channelNameFormat: e.target.value })}
  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
  />
  <p className="text-xs text-white/50 uppercase">{t("config.nameFormatDesc")}</p>
  </div>
  </div>

  <Button
  onClick={handleSave}
  disabled={isPending}
  className="bg-white/10 hover:bg-white/20 text-white border-0 shadow-sm font-bold text-xs uppercase mt-4"
  >
  <Save className="w-4 h-4 mr-2"/>{t("config.save")}</Button>
  </FormSection>

  {/* Active Channels Monitor */}
  <FormSection title={t("active.title")} icon={Volume2} description={t("active.description")}>
  <div className="space-y-3">
  {initialActiveChannels.length === 0 ? (
  <p className="text-white/40 text-sm uppercase p-4 border border-white/10 bg-white/5 rounded-xl">
  {t("active.noData")}
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
  <span className="font-bold uppercase text-primary">{t("active.channelId", { id: ch.channelId })}</span>
  {ch.isLocked ? (
  <span className="text-xs border px-1 border-red-500/30 text-red-400 font-bold flex items-center gap-1 uppercase">
  <Lock className="w-3 h-3"/> {t("active.locked")}
  </span>
  ) : (
  <span className="text-xs border px-1 border-primary text-primary font-bold flex items-center gap-1 uppercase">
  <Unlock className="w-3 h-3"/> {t("active.open")}
  </span>
  )}
  </div>
  <p className="text-xs text-white/40 mt-1">
  {t("active.details", {
    owner: ch.ownerId,
    limit: ch.userLimit === 0 ? t("active.unlimited") : ch.userLimit,
    time: new Date(ch.createdAt).toLocaleTimeString()
  })}
  </p>
  </div>

  <Button
  size="sm"
  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() => startTransition(async () => { await deleteActiveJtcChannel(guildId, ch.channelId); })}
  >
  <Trash2 className="w-3.5 h-3.5 mr-1"/>
  {t("active.terminate")}
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
