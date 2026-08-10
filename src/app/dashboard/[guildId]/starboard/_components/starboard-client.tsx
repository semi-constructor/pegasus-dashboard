"use client";

import { useState, useTransition } from "react";
import { Save, Star, Settings } from "lucide-react";
import { updateStarboardConfig } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DiscordChannelPicker, type ChannelOption } from "@/components/dashboard/pickers/DiscordChannelPicker";
import { FormSection } from "@/components/dashboard/forms/FormSection";
import { ToggleField } from "@/components/dashboard/forms/ToggleField";

export default function StarboardClient({ guildId, initialSettings, channels }: { guildId: string, initialSettings: any, channels: ChannelOption[] }) {
  const [isPending, startTransition] = useTransition();

  const [settings, setSettings] = useState({
    enabled: initialSettings.enabled || false,
    channelId: initialSettings.channelId || "",
    threshold: initialSettings.threshold || 3,
    emoji: initialSettings.emoji || "⭐",
  });

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateStarboardConfig(guildId, settings);
      if (result.success) {
        console.log("Starboard settings saved.");
      }
    });
  };

  return (
    <div className="text-white p-6 lg:p-10 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <Star className="w-8 h-8 text-[#FFAC33]" />
            </div>
            Starboard
          </h1>
          <p className="text-white/40 mt-3 text-sm font-medium tracking-wide">
            Configure the starboard to highlight the best messages in your server.
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isPending}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-6 font-bold flex items-center gap-2 rounded-xl transition-all"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <FormSection
        title="General Settings"
        icon={Settings}
        description="Enable or disable the starboard and configure the core settings."
      >
        <div className="flex flex-col gap-6">
          <ToggleField
            label="Enable Starboard"
            description="Turn the starboard system on or off."
            checked={settings.enabled}
            onCheckedChange={(v) => setSettings({ ...settings, enabled: v })}
          />

          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Starboard Channel</label>
            <DiscordChannelPicker
              channels={channels}
              value={settings.channelId}
              onChange={(v) => setSettings({ ...settings, channelId: v || "" })}
            />
            <p className="text-xs text-white/40 mt-1">The channel where starred messages will be posted.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Reaction Threshold</label>
              <Input
                type="number"
                min={1}
                value={settings.threshold}
                onChange={(e) => setSettings({ ...settings, threshold: parseInt(e.target.value) || 1 })}
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
              />
              <p className="text-xs text-white/40 mt-1">Number of reactions required to be posted.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 ml-1">Star Emoji</label>
              <Input
                type="text"
                value={settings.emoji}
                onChange={(e) => setSettings({ ...settings, emoji: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
              />
              <p className="text-xs text-white/40 mt-1">The emoji to use for the starboard (e.g., ⭐).</p>
            </div>
          </div>
        </div>
      </FormSection>
    </div>
  );
}
