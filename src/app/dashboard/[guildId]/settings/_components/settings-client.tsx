"use client";

import { useState, useTransition, useCallback } from "react";
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
import EngagementClient from "../../engagement/_components/engagement-client";

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
  engAchievements: any[];
  engQuests: any[];
  engReputation: any[];
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
  engAchievements,
  engQuests,
  engReputation,
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"general" | "welcome" | "goodbye" | "moderation" | "logs" | "quests" | "automod">("general");
  const [isPending, startTransition] = useTransition();

  const [settings, setSettings] = useState<GuildSettingsFormData>({
    welcomeEnabled: initialSettings?.welcomeEnabled ?? false,
    welcomeChannel: initialSettings?.welcomeChannel ?? null,
    welcomeMessage: initialSettings?.welcomeMessage ?? null,
    welcomeEmbedEnabled: initialSettings?.welcomeEmbedEnabled ?? false,
    welcomeEmbedColor: initialSettings?.welcomeEmbedColor ?? "#0099FF",
    welcomeEmbedTitle: initialSettings?.welcomeEmbedTitle ?? null,
    welcomeEmbedImage: initialSettings?.welcomeEmbedImage ?? null,
    welcomeEmbedThumbnail: initialSettings?.welcomeEmbedThumbnail ?? null,
    welcomeDmEnabled: initialSettings?.welcomeDmEnabled ?? false,
    welcomeDmMessage: initialSettings?.welcomeDmMessage ?? null,
    
    goodbyeEnabled: initialSettings?.goodbyeEnabled ?? false,
    goodbyeChannel: initialSettings?.goodbyeChannel ?? null,
    goodbyeMessage: initialSettings?.goodbyeMessage ?? null,
    goodbyeEmbedEnabled: initialSettings?.goodbyeEmbedEnabled ?? false,
    goodbyeEmbedColor: initialSettings?.goodbyeEmbedColor ?? "#FF0000",
    goodbyeEmbedTitle: initialSettings?.goodbyeEmbedTitle ?? null,
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
    { id: "general", label: "General", icon: Settings },
    { id: "welcome", label: "Welcome", icon: Bell },
    { id: "goodbye", label: "Goodbye", icon: LogOutIcon },
    { id: "moderation", label: "Moderation", icon: ShieldAlert },
    { id: "logs", label: "Logs", icon: Activity },
    { id: "quests", label: "Quests", icon: Target },
    { id: "automod", label: "Automod", icon: Shield },
  ];

  return (
    <div className="text-white p-6 lg:p-10 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <Settings className="w-8 h-8 text-white" />
            </div>
            Guild Settings
          </h1>
          <p className="text-white/40 mt-3 text-sm font-medium tracking-wide">Configure all server modules from a single dashboard.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col backdrop-blur-md">
        {/* Browser-style Tabs Header */}
        <div className="flex overflow-x-auto items-end bg-black/40 pt-4 px-4 border-b border-white/10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "group relative flex items-center gap-2 px-6 py-3 transition-all duration-300 font-bold text-sm tracking-wide rounded-t-xl border-t border-x -mb-[1px]",
                activeTab === tab.id
                  ? "bg-white/10 border-white/10 text-white z-10 backdrop-blur-xl"
                  : "bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white/80 hover:border-white/5 z-0"
              )}
            >
              <tab.icon className={cn("w-4 h-4 transition-colors", activeTab === tab.id ? "text-white" : "text-white/40 group-hover:text-white/60")} />
              {tab.label}
              
              {/* This solid line acts as a mask over the translucent container border-b to give the 'connected tab' illusion */}
              {activeTab === tab.id && (
                <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[#0c0c0c]" />
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="p-6 md:p-10 relative flex-1 overflow-hidden">
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
                    <h2 className="text-2xl font-bold tracking-tight">General Settings</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 p-6 bg-black/20 rounded-xl border border-white/5">
                      <label className="text-xs font-bold text-white/70 uppercase">Bot Command Prefix</label>
                      <p className="text-xs text-white/40 mb-2">The custom prefix for custom commands and legacy text commands.</p>
                      <Input value={config.prefix} onChange={(e) => setConfig({ ...config, prefix: e.target.value })} className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="!" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "welcome" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <Bell className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold tracking-tight">Welcome System</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ToggleField label="Enable Welcome" description="Send welcome messages" checked={settings.welcomeEnabled} onCheckedChange={(c) => update("welcomeEnabled", c)} />
                    <ToggleField label="DM on Join" description="Send DM to new members" checked={settings.welcomeDmEnabled} onCheckedChange={(c) => update("welcomeDmEnabled", c)} />
                  </div>
                  
                  {settings.welcomeDmEnabled && (
                    <div className="space-y-6 p-6 bg-black/20 rounded-xl border border-white/5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/70 uppercase">Direct Message (DM) Content</label>
                        <Textarea value={settings.welcomeDmMessage ?? ""} onChange={(e) => update("welcomeDmMessage", e.target.value || null)} className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm focus-visible:ring-0 text-white placeholder:text-white/30" placeholder="Thanks for joining {server}!" rows={3} />
                      </div>
                    </div>
                  )}

                  {settings.welcomeEnabled && (
                    <div className="space-y-6 p-6 bg-black/20 rounded-xl border border-white/5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/70 uppercase">Welcome Channel</label>
                        <DiscordChannelPicker channels={channels} value={settings.welcomeChannel} onChange={(v) => update("welcomeChannel", v)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/70 uppercase">Welcome Message</label>
                        <Textarea value={settings.welcomeMessage ?? ""} onChange={(e) => update("welcomeMessage", e.target.value || null)} className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm focus-visible:ring-0 text-white placeholder:text-white/30" placeholder="Welcome {user} to {server}! 🎉" rows={3} />
                      </div>
                      
                      <div className="pt-4 border-t border-white/10">
                        <ToggleField label="Use Rich Embed" description="Send the welcome message inside a styled Discord embed" checked={settings.welcomeEmbedEnabled} onCheckedChange={(c) => update("welcomeEmbedEnabled", c)} />
                      </div>
                      
                      {settings.welcomeEmbedEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-white/70 uppercase">Embed Title</label>
                            <Input value={settings.welcomeEmbedTitle ?? ""} onChange={(e) => update("welcomeEmbedTitle", e.target.value || null)} className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="Welcome to the server!" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-white/70 uppercase">Embed Color (Hex)</label>
                            <div className="flex gap-2">
                              <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 border border-white/10 bg-white/5">
                                <input 
                                  type="color" 
                                  value={settings.welcomeEmbedColor || "#0099ff"} 
                                  onChange={(e) => update("welcomeEmbedColor", e.target.value)}
                                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-0"
                                />
                                <div 
                                  className="w-full h-full pointer-events-none" 
                                  style={{ backgroundColor: settings.welcomeEmbedColor || "#0099ff" }} 
                                />
                              </div>
                              <Input value={settings.welcomeEmbedColor ?? ""} onChange={(e) => update("welcomeEmbedColor", e.target.value || null)} className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 uppercase font-mono" placeholder="#0099FF" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-white/70 uppercase">Image URL</label>
                            <Input value={settings.welcomeEmbedImage ?? ""} onChange={(e) => update("welcomeEmbedImage", e.target.value || null)} className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="https://..." />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-white/70 uppercase">Thumbnail URL</label>
                            <Input value={settings.welcomeEmbedThumbnail ?? ""} onChange={(e) => update("welcomeEmbedThumbnail", e.target.value || null)} className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="https://..." />
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
                    <h2 className="text-2xl font-bold tracking-tight">Goodbye System</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ToggleField label="Enable Goodbye" description="Send goodbye messages" checked={settings.goodbyeEnabled} onCheckedChange={(c) => update("goodbyeEnabled", c)} />
                  </div>
                  {settings.goodbyeEnabled && (
                    <div className="space-y-6 mt-4 p-6 bg-black/20 rounded-xl border border-white/5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/70 uppercase">Goodbye Channel</label>
                        <DiscordChannelPicker channels={channels} value={settings.goodbyeChannel} onChange={(v) => update("goodbyeChannel", v)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/70 uppercase">Goodbye Message</label>
                        <Textarea value={settings.goodbyeMessage ?? ""} onChange={(e) => update("goodbyeMessage", e.target.value || null)} className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm focus-visible:ring-0 text-white placeholder:text-white/30" placeholder="{user} has left the server. 👋" rows={3} />
                      </div>

                      <div className="pt-4 border-t border-white/10">
                        <ToggleField label="Use Rich Embed" description="Send the goodbye message inside a styled Discord embed" checked={settings.goodbyeEmbedEnabled} onCheckedChange={(c) => update("goodbyeEmbedEnabled", c)} />
                      </div>
                      
                      {settings.goodbyeEmbedEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-white/70 uppercase">Embed Title</label>
                            <Input value={settings.goodbyeEmbedTitle ?? ""} onChange={(e) => update("goodbyeEmbedTitle", e.target.value || null)} className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="Member Left" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-white/70 uppercase">Embed Color (Hex)</label>
                            <div className="flex gap-2">
                              <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 border border-white/10 bg-white/5">
                                <input 
                                  type="color" 
                                  value={settings.goodbyeEmbedColor || "#ff0000"} 
                                  onChange={(e) => update("goodbyeEmbedColor", e.target.value)}
                                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-0"
                                />
                                <div 
                                  className="w-full h-full pointer-events-none" 
                                  style={{ backgroundColor: settings.goodbyeEmbedColor || "#ff0000" }} 
                                />
                              </div>
                              <Input value={settings.goodbyeEmbedColor ?? ""} onChange={(e) => update("goodbyeEmbedColor", e.target.value || null)} className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 uppercase font-mono" placeholder="#FF0000" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-white/70 uppercase">Image URL</label>
                            <Input value={settings.goodbyeEmbedImage ?? ""} onChange={(e) => update("goodbyeEmbedImage", e.target.value || null)} className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="https://..." />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-white/70 uppercase">Thumbnail URL</label>
                            <Input value={settings.goodbyeEmbedThumbnail ?? ""} onChange={(e) => update("goodbyeEmbedThumbnail", e.target.value || null)} className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="https://..." />
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
                    <h2 className="text-2xl font-bold tracking-tight">Logging System</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ToggleField label="Enable Logging" description="Log core server events" checked={settings.logsEnabled} onCheckedChange={(c) => update("logsEnabled", c)} />
                  </div>
                  {settings.logsEnabled && (
                    <div className="space-y-6 mt-4 p-6 bg-black/20 rounded-xl border border-white/5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/70 uppercase">Log Channel</label>
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

              {activeTab === "quests" && (
                <div className="relative -mx-6 -mt-6">
                  <EngagementClient guildId={guildId} initialAchievements={engAchievements} initialQuests={engQuests} initialReputation={engReputation} />
                </div>
              )}

              {activeTab === "automod" && (
                <div className="relative -mx-6 -mt-6">
                  <AutoModClient guildId={guildId} initialRules={autoRules} initialInfractions={autoInfractions} initialVault={autoVault} channels={channels} roles={roles} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {(activeTab === "general" || activeTab === "welcome" || activeTab === "goodbye" || activeTab === "logs") && (
        <SaveBar hasChanges={hasChanges} isPending={isPending} onSave={handleSave} onDiscard={handleDiscard} />
      )}
    </div>
  );
}
