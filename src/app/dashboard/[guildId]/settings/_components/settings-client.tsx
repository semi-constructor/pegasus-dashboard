"use client";

import { useState, useTransition, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, LogOut as LogOutIcon, Bell, Activity, Target, ShieldAlert, CheckCircle2, Shield
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/dashboard/forms/FormSection";
import { ToggleField } from "@/components/dashboard/forms/ToggleField";
import { SaveBar } from "@/components/dashboard/forms/SaveBar";
import { DiscordChannelPicker } from "@/components/dashboard/pickers/DiscordChannelPicker";
import { cn } from "@/lib/utils";
import { saveGuildSettings, saveGuildConfig, GuildSettingsFormData } from "../actions";

// Sub-clients
import ModerationClient from "../../moderation/_components/moderation-client";
import AutoModClient from "../../automod/_components/automod-client";

interface SettingsClientProps {
  guildId: string;
  initialSettings: GuildSettingsFormData | null;
  initialConfig: { prefix: string; language: string };
  channels: any[];
  roles: any[];
  // Data for sub-clients
  modCases: any[];
  modWarnings: any[];
  modAutomations: any[];
  modWordFilters: any[];
  modLogSettings: any[];
  autoRules: any[];
  autoInfractions: any[];
  autoVault: any[];
}

export default function SettingsClient({
  guildId,
  initialSettings,
  initialConfig,
  channels,
  roles,
  modCases,
  modWarnings,
  modAutomations,
  modWordFilters,
  modLogSettings,
  autoRules,
  autoInfractions,
  autoVault,
}: SettingsClientProps) {
  const t = useTranslations('guildSettings');
  const [activeTab, setActiveTab] = useState<"general" | "ai" | "welcome" | "goodbye" | "moderation" | "logs" | "automod" | "visibility" | "v3">("general");
  const [isPending, startTransition] = useTransition();

  const [settings, setSettings] = useState<GuildSettingsFormData>({
    welcomeEnabled: initialSettings?.welcomeEnabled ?? false,
    welcomeChannel: initialSettings?.welcomeChannel ?? null,
    welcomeMessage: initialSettings?.welcomeMessage ?? null,
    welcomeEmbedEnabled: initialSettings?.welcomeEmbedEnabled ?? false,
    welcomeEmbedColor: initialSettings?.welcomeEmbedColor ?? "#8B5CF6",
    welcomeEmbedTitle: initialSettings?.welcomeEmbedTitle ?? null,
    welcomeImageEnabled: initialSettings?.welcomeImageEnabled ?? false,
    welcomeEmbedImage: initialSettings?.welcomeEmbedImage ?? null,
    welcomeEmbedThumbnail: initialSettings?.welcomeEmbedThumbnail ?? null,
    welcomeDmEnabled: initialSettings?.welcomeDmEnabled ?? false,
    welcomeDmMessage: initialSettings?.welcomeDmMessage ?? null,
    
    goodbyeEnabled: initialSettings?.goodbyeEnabled ?? false,
    goodbyeChannel: initialSettings?.goodbyeChannel ?? null,
    goodbyeMessage: initialSettings?.goodbyeMessage ?? null,
    goodbyeEmbedEnabled: initialSettings?.goodbyeEmbedEnabled ?? false,
    goodbyeEmbedColor: initialSettings?.goodbyeEmbedColor ?? "#F43F5E",
    goodbyeEmbedTitle: initialSettings?.goodbyeEmbedTitle ?? null,
    goodbyeImageEnabled: initialSettings?.goodbyeImageEnabled ?? false,
    goodbyeEmbedImage: initialSettings?.goodbyeEmbedImage ?? null,
    goodbyeEmbedThumbnail: initialSettings?.goodbyeEmbedThumbnail ?? null,
    
    logsEnabled: initialSettings?.logsEnabled ?? false,
    logsChannel: initialSettings?.logsChannel ?? null,
    
    xpEnabled: initialSettings?.xpEnabled ?? true,
    xpRate: initialSettings?.xpRate ?? 1,
    xpPerMessage: initialSettings?.xpPerMessage ?? 5,
    xpPerVoiceMinute: initialSettings?.xpPerVoiceMinute ?? 10,
    xpCooldown: initialSettings?.xpCooldown ?? 60,
    xpAnnounceLevelUp: initialSettings?.xpAnnounceLevelUp ?? true,
    xpBoosterRole: initialSettings?.xpBoosterRole ?? null,
    xpBoosterMultiplier: initialSettings?.xpBoosterMultiplier ?? 200,
    levelUpMessage: initialSettings?.levelUpMessage ?? null,
    levelUpChannel: initialSettings?.levelUpChannel ?? null,
    autoroleEnabled: initialSettings?.autoroleEnabled ?? false,
    autoroleRoles: initialSettings?.autoroleRoles ?? "[]",
    securityEnabled: initialSettings?.securityEnabled ?? true,
    securityAlertRole: initialSettings?.securityAlertRole ?? null,
    antiRaidEnabled: initialSettings?.antiRaidEnabled ?? true,
    antiSpamEnabled: initialSettings?.antiSpamEnabled ?? true,
    maxMentions: initialSettings?.maxMentions ?? 5,
    maxDuplicates: initialSettings?.maxDuplicates ?? 3,
    achievementsChannel: initialSettings?.achievementsChannel ?? null,
    publicLevels: initialSettings?.publicLevels ?? false,
    publicEco: initialSettings?.publicEco ?? false,
    aiEnabled: initialSettings?.aiEnabled ?? false,
    aiChannel: initialSettings?.aiChannel ?? null,
    aiPersona: initialSettings?.aiPersona ?? 'You are a helpful Discord bot assistant.',
    honeypotChannelId: initialSettings?.honeypotChannelId ?? null,
    stickies: initialSettings?.stickies ?? "[]",
  });

  const [initialState] = useState(() => ({ ...settings }));

  const [config, setConfig] = useState({
    prefix: initialConfig?.prefix ?? "!",
    language: initialConfig?.language ?? "en",
  });
  const [initialConfigState] = useState(() => ({ ...config }));

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialState) || JSON.stringify(config) !== JSON.stringify(initialConfigState);

  const update = useCallback(<K extends keyof GuildSettingsFormData>(key: K, value: GuildSettingsFormData[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = () => {
    startTransition(async () => {
      await saveGuildSettings(guildId, settings);
      await saveGuildConfig(guildId, config);
    });
  };

  const handleDiscard = () => {
    setSettings({ ...initialState });
    setConfig({ ...initialConfigState });
  };

  const tabs = [
    { id: "general", label: t("tabs.general"), icon: Settings },
    { id: "ai", label: t("tabs.ai"), icon: Activity },
    { id: "welcome", label: t("tabs.welcome"), icon: Bell },
    { id: "goodbye", label: t("tabs.goodbye"), icon: LogOutIcon },
    { id: "moderation", label: t("tabs.moderation"), icon: ShieldAlert },
    { id: "logs", label: t("tabs.logs"), icon: Activity },
    { id: "automod", label: t("tabs.automod"), icon: Shield },
    { id: "v3", label: "V3 Features", icon: Target },
    { id: "visibility", label: "Visibility", icon: Target },
  ];

  return (
    <div className="text-white p-2 sm:p-6 lg:p-10 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 sm:pb-6 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shrink-0">
              <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            {t("title")}
          </h1>
          <p className="text-white/40 mt-2 sm:mt-3 text-xs sm:text-sm font-medium tracking-wide">{t("subtitle")}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col backdrop-blur-md">
        {/* Browser-style Tabs Header */}
        <div className="flex overflow-x-auto items-end bg-black/40 pt-3 sm:pt-4 px-2 sm:px-4 border-b border-white/10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 touch-pan-x">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "group relative flex items-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 font-bold text-xs sm:text-sm tracking-wide rounded-t-xl border-t border-x -mb-[1px] shrink-0 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-white/10 border-white/10 text-white z-10 backdrop-blur-xl"
                  : "bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white/80 hover:border-white/5 z-0"
              )}
            >
              <tab.icon className={cn("w-4 h-4 transition-colors shrink-0", activeTab === tab.id ? "text-white" : "text-white/40 group-hover:text-white/60")} />
              {tab.label}
              
              {/* This solid line acts as a mask over the translucent container border-b to give the 'connected tab' illusion */}
              {activeTab === tab.id && (
                <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[#0c0c0c]" />
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="p-3 sm:p-6 md:p-10 relative flex-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-10"
            >
              {activeTab === "general" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <Settings className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold tracking-tight">{t("general.title")}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 p-6 bg-black/20 rounded-xl border border-white/5">
                      <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("general.prefix")}</label>
                      <p className="text-xs text-white/40 mb-2">{t("general.prefixDesc")}</p>
                      <Input value={config.prefix} onChange={(e) => setConfig({ ...config, prefix: e.target.value })} className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all" placeholder="!" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "ai" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <Activity className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold tracking-tight">{t("ai.title")}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ToggleField label={t("ai.enable")} description={t("ai.enableDesc")} checked={settings.aiEnabled} onCheckedChange={(c) => update("aiEnabled", c)} />
                  </div>
                  
                  {settings.aiEnabled && (
                    <div className="space-y-6 p-6 bg-black/20 rounded-xl border border-white/5">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("ai.persona")}</label>
                        <Textarea value={settings.aiPersona ?? ""} onChange={(e) => update("aiPersona", e.target.value)} className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all " placeholder="You are a helpful Discord bot assistant." rows={4} />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("ai.channel")}</label>
                        <DiscordChannelPicker channels={channels} value={settings.aiChannel} onChange={(v) => update("aiChannel", v)} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "welcome" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <Bell className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold tracking-tight">{t("welcome.title")}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ToggleField label={t("welcome.enable")} description={t("welcome.enableDesc")} checked={settings.welcomeEnabled} onCheckedChange={(c) => update("welcomeEnabled", c)} />
                    <ToggleField label={t("welcome.dmOnJoin")} description={t("welcome.dmOnJoinDesc")} checked={settings.welcomeDmEnabled} onCheckedChange={(c) => update("welcomeDmEnabled", c)} />
                  </div>
                  
                  {settings.welcomeDmEnabled && (
                    <div className="space-y-6 p-6 bg-black/20 rounded-xl border border-white/5">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("welcome.dmContent")}</label>
                        <Textarea value={settings.welcomeDmMessage ?? ""} onChange={(e) => update("welcomeDmMessage", e.target.value || null)} className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all " placeholder={t("welcome.dmPlaceholder", { user: '{user}', server: '{server}' })} rows={3} />
                      </div>
                    </div>
                  )}

                  {settings.welcomeEnabled && (
                    <div className="space-y-6 p-6 bg-black/20 rounded-xl border border-white/5">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("welcome.channel")}</label>
                        <DiscordChannelPicker channels={channels} value={settings.welcomeChannel} onChange={(v) => update("welcomeChannel", v)} />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("welcome.message")}</label>
                        <Textarea value={settings.welcomeMessage ?? ""} onChange={(e) => update("welcomeMessage", e.target.value || null)} className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all " placeholder={t("welcome.messagePlaceholder", { user: '{user}', server: '{server}' })} rows={3} />
                      </div>
                      
                      <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                        <ToggleField label={t("welcome.useEmbed")} description={t("welcome.useEmbedDesc")} checked={settings.welcomeEmbedEnabled} onCheckedChange={(c) => update("welcomeEmbedEnabled", c)} />
                        <ToggleField label="Use Custom Welcome Image (Canvas)" description="Generates a dynamic image with the user's avatar." checked={settings.welcomeImageEnabled} onCheckedChange={(c) => update("welcomeImageEnabled", c)} />
                      </div>
                      
                      {settings.welcomeEmbedEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("welcome.embedTitle")}</label>
                            <Input value={settings.welcomeEmbedTitle ?? ""} onChange={(e) => update("welcomeEmbedTitle", e.target.value || null)} className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all" placeholder={t("welcome.embedTitlePlaceholder", { user: '{user}', server: '{server}' })} />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("welcome.embedColor")}</label>
                            <div className="flex gap-2">
                              <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 border border-white/10 bg-white/5">
                                <input 
                                  type="color" 
                                  value={settings.welcomeEmbedColor || "#8B5CF6"} 
                                  onChange={(e) => update("welcomeEmbedColor", e.target.value)}
                                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-0"
                                />
                                <div 
                                  className="w-full h-full pointer-events-none" 
                                  style={{ backgroundColor: settings.welcomeEmbedColor || "#8B5CF6" }} 
                                />
                              </div>
                              <Input value={settings.welcomeEmbedColor ?? ""} onChange={(e) => update("welcomeEmbedColor", e.target.value || null)} className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all" placeholder="#8B5CF6" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("welcome.imageUrl")}</label>
                            <Input value={settings.welcomeEmbedImage ?? ""} onChange={(e) => update("welcomeEmbedImage", e.target.value || null)} className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all" placeholder="https://..." />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("welcome.thumbnailUrl")}</label>
                            <Input value={settings.welcomeEmbedThumbnail ?? ""} onChange={(e) => update("welcomeEmbedThumbnail", e.target.value || null)} className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all" placeholder="https://..." />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "goodbye" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <LogOutIcon className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold tracking-tight">{t("goodbye.title")}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ToggleField label={t("goodbye.enable")} description={t("goodbye.enableDesc")} checked={settings.goodbyeEnabled} onCheckedChange={(c) => update("goodbyeEnabled", c)} />
                  </div>
                  {settings.goodbyeEnabled && (
                    <div className="space-y-6 mt-4 p-6 bg-black/20 rounded-xl border border-white/5">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("goodbye.channel")}</label>
                        <DiscordChannelPicker channels={channels} value={settings.goodbyeChannel} onChange={(v) => update("goodbyeChannel", v)} />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("goodbye.message")}</label>
                        <Textarea value={settings.goodbyeMessage ?? ""} onChange={(e) => update("goodbyeMessage", e.target.value || null)} className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all " placeholder={t("goodbye.messagePlaceholder", { user: '{user}', server: '{server}' })} rows={3} />
                      </div>

                      <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                        <ToggleField label={t("goodbye.useEmbed")} description={t("goodbye.useEmbedDesc")} checked={settings.goodbyeEmbedEnabled} onCheckedChange={(c) => update("goodbyeEmbedEnabled", c)} />
                        <ToggleField label="Use Custom Goodbye Image (Canvas)" description="Generates a dynamic image with the user's avatar in grayscale." checked={settings.goodbyeImageEnabled} onCheckedChange={(c) => update("goodbyeImageEnabled", c)} />
                      </div>
                      
                      {settings.goodbyeEmbedEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("goodbye.embedTitle")}</label>
                            <Input value={settings.goodbyeEmbedTitle ?? ""} onChange={(e) => update("goodbyeEmbedTitle", e.target.value || null)} className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all" placeholder={t("goodbye.embedTitlePlaceholder", { user: '{user}', server: '{server}' })} />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("goodbye.embedColor")}</label>
                            <div className="flex gap-2">
                              <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 border border-white/10 bg-white/5">
                                <input 
                                  type="color" 
                                  value={settings.goodbyeEmbedColor || "#F43F5E"} 
                                  onChange={(e) => update("goodbyeEmbedColor", e.target.value)}
                                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-0"
                                />
                                <div 
                                  className="w-full h-full pointer-events-none" 
                                  style={{ backgroundColor: settings.goodbyeEmbedColor || "#F43F5E" }} 
                                />
                              </div>
                              <Input value={settings.goodbyeEmbedColor ?? ""} onChange={(e) => update("goodbyeEmbedColor", e.target.value || null)} className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all" placeholder="#F43F5E" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("goodbye.imageUrl")}</label>
                            <Input value={settings.goodbyeEmbedImage ?? ""} onChange={(e) => update("goodbyeEmbedImage", e.target.value || null)} className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all" placeholder="https://..." />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("goodbye.thumbnailUrl")}</label>
                            <Input value={settings.goodbyeEmbedThumbnail ?? ""} onChange={(e) => update("goodbyeEmbedThumbnail", e.target.value || null)} className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all" placeholder="https://..." />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "logs" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <Activity className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold tracking-tight">{t("logs.title")}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ToggleField label={t("logs.enable")} description={t("logs.enableDesc")} checked={settings.logsEnabled} onCheckedChange={(c) => update("logsEnabled", c)} />
                  </div>
                  {settings.logsEnabled && (
                    <div className="space-y-6 mt-4 p-6 bg-black/20 rounded-xl border border-white/5">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">{t("logs.channel")}</label>
                        <DiscordChannelPicker channels={channels} value={settings.logsChannel} onChange={(v) => update("logsChannel", v)} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "moderation" && (
                <div className="relative -mx-6 -mt-6">
                  <ModerationClient guildId={guildId} initialCases={modCases} initialWarnings={modWarnings} initialAutomations={modAutomations} initialWordFilters={modWordFilters} initialLogSettings={modLogSettings} channels={channels} roles={roles} />
                </div>
              )}



              {activeTab === "automod" && (
                <div className="relative -mx-6 -mt-6">
                  <AutoModClient guildId={guildId} initialRules={autoRules} initialInfractions={autoInfractions} initialVault={autoVault} channels={channels} roles={roles} />
                </div>
              )}
              {activeTab === "v3" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <Target className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold tracking-tight">V3 New Features</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6 p-6 bg-black/20 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 mb-4">
                        <ShieldAlert className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg">Scammer Honeypot</h3>
                      </div>
                      <p className="text-sm text-white/50 leading-relaxed mb-4">
                        Select a channel to act as a honeypot. We recommend posting a message in this channel warning normal users not to send anything there. Automated scam bots that mass-message all channels will trigger it, get their message deleted, and be instantly timed out with an alert sent to moderators.
                      </p>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Honeypot Channel</label>
                        <DiscordChannelPicker channels={channels} value={settings.honeypotChannelId} onChange={(v) => update("honeypotChannelId", v)} />
                      </div>
                    </div>
                    
                    <div className="space-y-6 p-6 bg-black/20 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg">Sticky Messages</h3>
                      </div>
                      <p className="text-sm text-white/50 leading-relaxed mb-4">
                        Configure sticky messages that will always stay at the bottom of the specified channels. Provide raw JSON config for advanced use.
                      </p>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Stickies JSON Data</label>
                        <Textarea 
                          value={settings.stickies} 
                          onChange={(e) => update("stickies", e.target.value)} 
                          className="w-full font-mono text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all" 
                          placeholder='[{"channelId": "...", "content": "Welcome!"}]' 
                          rows={6} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "visibility" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <Target className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold tracking-tight">Public Visibility</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ToggleField label="Public Levels Leaderboard" description="Make your server's XP leaderboard public on /levels/GUILDID and on the global index" checked={settings.publicLevels} onCheckedChange={(c) => update("publicLevels", c)} />
                    <ToggleField label="Public Economy Leaderboard" description="Make your server's economy leaderboard public on /eco/GUILDID and on the global index" checked={settings.publicEco} onCheckedChange={(c) => update("publicEco", c)} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {(activeTab === "general" || activeTab === "welcome" || activeTab === "goodbye" || activeTab === "logs" || activeTab === "visibility" || activeTab === "v3") && (
        <SaveBar hasChanges={hasChanges} isPending={isPending} onSave={handleSave} onDiscard={handleDiscard} />
      )}
    </div>
  );
}
