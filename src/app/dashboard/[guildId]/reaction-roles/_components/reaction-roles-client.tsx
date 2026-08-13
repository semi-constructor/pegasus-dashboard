"use client";

import { useState, useTransition } from "react";
import { Send, LayoutTemplate, Settings, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { sendReactionRolePanel } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DiscordChannelPicker, type ChannelOption } from "@/components/dashboard/pickers/DiscordChannelPicker";
import { FormSection } from "@/components/dashboard/forms/FormSection";
import type { DiscordRole } from "@/lib/discord-api";

interface RoleButton {
  id: string;
  roleId: string;
  label: string;
  style: number; // 1 = Primary, 2 = Secondary, 3 = Success, 4 = Danger
  emoji: string;
}

export default function ReactionRolesClient({ guildId, channels, roles, initialButtons = [] }: { guildId: string, channels: ChannelOption[], roles: DiscordRole[], initialButtons?: RoleButton[] }) {
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [channelId, setChannelId] = useState("");
  const [embedData, setEmbedData] = useState({
    title: "Self-Assign Roles",
    description: "Click the buttons below to assign or remove roles.",
    color: "#8b5cf6",
  });

  const [buttons, setButtons] = useState<RoleButton[]>(initialButtons);

  const handleAddButton = () => {
    if (buttons.length >= 25) {
      setErrorMsg("You can only add up to 25 buttons per panel.");
      return;
    }
    setButtons([
      ...buttons,
      { id: Math.random().toString(), roleId: "", label: "New Role", style: 1, emoji: "" }
    ]);
  };

  const handleRemoveButton = (id: string) => {
    setButtons(buttons.filter(b => b.id !== id));
  };

  const handleUpdateButton = (id: string, field: keyof RoleButton, value: any) => {
    setButtons(buttons.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handleSend = () => {
    if (!channelId) {
      setErrorMsg("Please select a channel to send the panel to.");
      return;
    }

    if (buttons.length === 0) {
      setErrorMsg("You must add at least one role button.");
      return;
    }

    const invalidButton = buttons.find(b => !b.roleId || (!b.label && !b.emoji));
    if (invalidButton) {
      setErrorMsg("All buttons must have a selected role and either a label or an emoji.");
      return;
    }

    // Group buttons into rows (max 5 per row)
    const components = [];
    for (let i = 0; i < buttons.length; i += 5) {
      const rowButtons = buttons.slice(i, i + 5).map(b => ({
        type: 2, // Button component
        style: b.style,
        label: b.label || undefined,
        emoji: b.emoji ? { name: b.emoji } : undefined,
        custom_id: `role_toggle:${b.roleId}`,
      }));
      
      components.push({
        type: 1, // Action row component
        components: rowButtons
      });
    }

    const payload = {
      embeds: [{
        title: embedData.title || undefined,
        description: embedData.description || undefined,
        color: parseInt(embedData.color.replace("#", ""), 16) || 0x8b5cf6,
      }],
      components
    };

    setErrorMsg("");
    setSuccessMsg("");
    
    startTransition(async () => {
      const result = await sendReactionRolePanel(guildId, channelId, payload);
      if (result.success) {
        setSuccessMsg("Reaction roles panel successfully created in the selected channel!");
        setButtons([]);
      } else {
        setErrorMsg(result.error || "Failed to create panel.");
      }
    });
  };

  return (
    <div className="text-foreground p-6 lg:p-10 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-foreground/5 rounded-2xl border border-border backdrop-blur-md">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            Interactive Roles
          </h1>
          <p className="text-foreground/40 mt-3 text-sm font-medium tracking-wide">
            Create interactive panels with buttons for users to self-assign roles.
          </p>
        </div>
      </div>

      <FormSection
        title="Panel Settings"
        icon={LayoutTemplate}
        description="Configure the look and feel of the role panel message."
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Target Channel</label>
            <DiscordChannelPicker
              channels={channels}
              value={channelId}
              onChange={(v) => setChannelId(v || "")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Embed Title</label>
              <Input 
                value={embedData.title}
                onChange={(e) => setEmbedData({ ...embedData, title: e.target.value })}
                className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg px-4 py-2"
                placeholder="Self-Assign Roles"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Embed Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  value={embedData.color} 
                  onChange={(e) => setEmbedData({ ...embedData, color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <Input 
                  value={embedData.color}
                  onChange={(e) => setEmbedData({ ...embedData, color: e.target.value })}
                  className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg px-4 py-2 uppercase"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Description</label>
            <Textarea 
              value={embedData.description}
              onChange={(e) => setEmbedData({ ...embedData, description: e.target.value })}
              className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg px-4 py-3 min-h-[100px]"
              placeholder="Click the buttons below to assign yourself roles..."
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Role Buttons"
        icon={Settings}
        description="Add and configure the buttons for the roles."
        headerAction={
          <Button
            onClick={handleAddButton}
            className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-0 shadow-sm font-bold text-xs uppercase"
          >
            <Plus className="w-4 h-4 mr-2" />Add Button
          </Button>
        }
      >
        <div className="space-y-4">
          {buttons.length === 0 ? (
            <div className="border border-border bg-foreground/5 rounded-xl p-8 text-center text-foreground/50 uppercase font-bold text-sm">
              No buttons added yet. Click "Add Button" to start.
            </div>
          ) : (
            buttons.map((btn, index) => (
              <div key={btn.id} className="p-4 bg-background/40 border border-border rounded-xl relative group hover:border-primary/50 transition-colors">
                <div className="absolute -left-3 -top-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4 flex flex-col gap-2">
                    <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Role</label>
                    <select
                      value={btn.roleId}
                      onChange={(e) => handleUpdateButton(btn.id, "roleId", e.target.value)}
                      className="w-full min-h-[40px] px-3 py-2 bg-background/40 border border-border rounded-lg text-sm text-foreground [&>option]:bg-neutral-900 outline-none"
                    >
                      <option value="">Select a role...</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-3 flex flex-col gap-2">
                    <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Button Label</label>
                    <Input
                      value={btn.label}
                      onChange={(e) => handleUpdateButton(btn.id, "label", e.target.value)}
                      className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30"
                      placeholder="e.g. Announcements"
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Emoji</label>
                    <Input
                      value={btn.emoji}
                      onChange={(e) => handleUpdateButton(btn.id, "emoji", e.target.value)}
                      className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30"
                      placeholder="📢"
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Style</label>
                    <select
                      value={btn.style}
                      onChange={(e) => handleUpdateButton(btn.id, "style", parseInt(e.target.value))}
                      className="w-full min-h-[40px] px-3 py-2 bg-background/40 border border-border rounded-lg text-sm text-foreground [&>option]:bg-neutral-900 outline-none"
                    >
                      <option value={1}>Blue (Primary)</option>
                      <option value={2}>Gray (Secondary)</option>
                      <option value={3}>Green (Success)</option>
                      <option value={4}>Red (Danger)</option>
                    </select>
                  </div>

                  <div className="md:col-span-1 flex justify-end pb-1">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveButton(btn.id)}
                      className="rounded-lg shadow-sm hover:scale-105 transition-transform"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </FormSection>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 font-medium text-sm text-center">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl mb-6 font-medium text-sm text-center">
          {successMsg}
        </div>
      )}

      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleSend}
          disabled={isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 h-auto text-lg font-bold flex items-center gap-3 rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.02]"
        >
          <Send className="w-5 h-5" />
          {isPending ? "Sending Panel..." : "Send Panel to Channel"}
        </Button>
      </div>
    </div>
  );
}
