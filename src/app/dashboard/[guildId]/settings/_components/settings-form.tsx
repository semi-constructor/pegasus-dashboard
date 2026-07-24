"use client";

import { useState, useTransition, useCallback } from"react";
import {
 Settings,
 Trash2,
 ShieldAlert,
 LogOut as LogOutIcon,
 Activity,
 Star,
 Shield,
 Bell,
 Users,
} from"lucide-react";
import { Input } from"@/components/ui/input";
import { Textarea } from"@/components/ui/textarea";
import { Button } from"@/components/ui/button";
import { FormSection } from"@/components/dashboard/forms/FormSection";
import { ToggleField } from"@/components/dashboard/forms/ToggleField";
import { SaveBar } from"@/components/dashboard/forms/SaveBar";
import {
 DiscordChannelPicker,
 DiscordChannelMultiPicker,
 type ChannelOption,
} from"@/components/dashboard/pickers/DiscordChannelPicker";
import {
 DiscordRolePicker,
 DiscordRoleMultiPicker,
 type RoleOption,
} from"@/components/dashboard/pickers/DiscordRolePicker";
import {
 saveGuildConfig,
 saveGuildSettings,
 resetGuildSettingsAction,
 type GuildSettingsFormData,
} from"../actions";

interface SettingsFormProps {
 guildId: string;
 initialGuild: {
 prefix: string;
 language: string;
 } | null;
 initialSettings: GuildSettingsFormData | null;
 channels: ChannelOption[];
 roles: RoleOption[];
}

function parseJsonSafe<T>(val: string | null | undefined, fallback: T): T {
 if (!val) return fallback;
 try {
 return JSON.parse(val);
 } catch {
 return fallback;
 }
}

export default function SettingsForm({
 guildId,
 initialGuild,
 initialSettings,
 channels,
 roles,
}: SettingsFormProps) {
 const [isPending, startTransition] = useTransition();

 // ── Guild Config State ────────────────────────────────────
 const [prefix, setPrefix] = useState(initialGuild?.prefix ??"!");
 const [language, setLanguage] = useState(initialGuild?.language ??"en");

 // ── Guild Settings State ──────────────────────────────────
 const [settings, setSettings] = useState<GuildSettingsFormData>({
 // Welcome
 welcomeEnabled: initialSettings?.welcomeEnabled ?? false,
 welcomeChannel: initialSettings?.welcomeChannel ?? null,
 welcomeMessage: initialSettings?.welcomeMessage ?? null,
 welcomeEmbedEnabled: initialSettings?.welcomeEmbedEnabled ?? false,
 welcomeEmbedColor: initialSettings?.welcomeEmbedColor ??"#0099FF",
 welcomeEmbedTitle: initialSettings?.welcomeEmbedTitle ?? null,
 welcomeEmbedImage: initialSettings?.welcomeEmbedImage ?? null,
 welcomeEmbedThumbnail: initialSettings?.welcomeEmbedThumbnail ?? null,
 welcomeDmEnabled: initialSettings?.welcomeDmEnabled ?? false,
 welcomeDmMessage: initialSettings?.welcomeDmMessage ?? null,
 // Goodbye
 goodbyeEnabled: initialSettings?.goodbyeEnabled ?? false,
 goodbyeChannel: initialSettings?.goodbyeChannel ?? null,
 goodbyeMessage: initialSettings?.goodbyeMessage ?? null,
 goodbyeEmbedEnabled: initialSettings?.goodbyeEmbedEnabled ?? false,
 goodbyeEmbedColor: initialSettings?.goodbyeEmbedColor ??"#FF0000",
 goodbyeEmbedTitle: initialSettings?.goodbyeEmbedTitle ?? null,
 goodbyeEmbedImage: initialSettings?.goodbyeEmbedImage ?? null,
 goodbyeEmbedThumbnail: initialSettings?.goodbyeEmbedThumbnail ?? null,
 // Logging
 logsEnabled: initialSettings?.logsEnabled ?? false,
 logsChannel: initialSettings?.logsChannel ?? null,
 // XP
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
 // Autorole
 autoroleEnabled: initialSettings?.autoroleEnabled ?? false,
 autoroleRoles: initialSettings?.autoroleRoles ??"[]",
 // Security
 securityEnabled: initialSettings?.securityEnabled ?? true,
 securityAlertRole: initialSettings?.securityAlertRole ?? null,
 antiRaidEnabled: initialSettings?.antiRaidEnabled ?? true,
 antiSpamEnabled: initialSettings?.antiSpamEnabled ?? true,
 maxMentions: initialSettings?.maxMentions ?? 5,
 maxDuplicates: initialSettings?.maxDuplicates ?? 3,
 });

 // Track initial state for dirty detection
 const [initialState] = useState(() => ({
 prefix: initialGuild?.prefix ??"!",
 language: initialGuild?.language ??"en",
 settings: { ...settings },
 }));

 const hasChanges =
 prefix !== initialState.prefix ||
 language !== initialState.language ||
 JSON.stringify(settings) !== JSON.stringify(initialState.settings);

 const update = useCallback(
 <K extends keyof GuildSettingsFormData>(key: K, value: GuildSettingsFormData[K]) => {
 setSettings((prev) => ({ ...prev, [key]: value }));
 },
 []
 );

 // Autorole roles stored as JSON string
 const autoroleRoleIds = parseJsonSafe<string[]>(settings.autoroleRoles, []);
 const setAutoroleRoles = (ids: string[]) => {
 update("autoroleRoles", JSON.stringify(ids));
 };

 const handleSave = () => {
 startTransition(async () => {
 const [configRes, settingsRes] = await Promise.all([
 saveGuildConfig(guildId, { prefix, language }),
 saveGuildSettings(guildId, settings),
 ]);
 if (!configRes.success || !settingsRes.success) {
 console.error("Save failed", configRes, settingsRes);
 }
 });
 };

 const handleDiscard = () => {
 setPrefix(initialState.prefix);
 setLanguage(initialState.language);
 setSettings({ ...initialState.settings });
 };

 const handleReset = () => {
 if (
 window.confirm(
"Are you absolutely sure you want to reset all server settings? This cannot be undone."
 )
 ) {
 startTransition(async () => {
 const res = await resetGuildSettingsAction(guildId);
 if (res.success) {
 window.location.reload();
 }
 });
 }
 };

 return (
 <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
 {/* Header */}
 <div className="flex items-center justify-between border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tight uppercase flex items-center gap-3">
 <Settings className="w-10 h-10 text-primary"/>Server Config</h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Manage all guild modules and configuration.
 </p>
 </div>
 </div>

 {/* ═══ GENERAL ═══ */}
 <FormSection title="General Sys"icon={Settings} description="Core bot configuration.">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Command Prefix</label>
 <Input
 value={prefix}
 onChange={(e) => setPrefix(e.target.value)}
 maxLength={10}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
 placeholder="!"
 />
 <p className="text-xs text-muted-foreground uppercase">
 Fallback trigger if slash commands offline.
 </p>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Sys Language</label>
 <select
 value={language}
 onChange={(e) => setLanguage(e.target.value)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus:outline-none focus:ring-0 appearance-none text-foreground"
 >
 <option value="en">English (US)</option>
 <option value="de">German (DE)</option>
 <option value="fr">French (FR)</option>
 <option value="es">Spanish (ES)</option>
 </select>
 <p className="text-xs text-muted-foreground uppercase">Output language telemetry.</p>
 </div>
 </div>
 </FormSection>

 {/* ═══ WELCOME ═══ */}
 <FormSection title="Welcome Sys"icon={Bell} description="Greet new members on join.">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <ToggleField
 label="Enable Welcome"
 description="Send welcome messages"
 checked={settings.welcomeEnabled}
 onCheckedChange={(c) => update("welcomeEnabled", c)}
 />
 <ToggleField
 label="DM on Join"
 description="Send DM to new members"
 checked={settings.welcomeDmEnabled}
 onCheckedChange={(c) => update("welcomeDmEnabled", c)}
 />
 </div>

 {settings.welcomeEnabled && (
 <div className="space-y-6 mt-4">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Welcome Channel</label>
 <DiscordChannelPicker
 channels={channels}
 value={settings.welcomeChannel}
 onChange={(v) => update("welcomeChannel", v)}
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Welcome Message</label>
 <Textarea
 value={settings.welcomeMessage ??""}
 onChange={(e) => update("welcomeMessage", e.target.value || null)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 placeholder="Welcome {user} to {server}! 🎉"
 rows={3}
 />
 <p className="text-xs text-muted-foreground uppercase">
 Variables: {"{user}"}, {"{server}"}, {"{memberCount}"}
 </p>
 </div>

 {/* Embed Config */}
 <ToggleField
 label="Rich Embed"
 description="Send as embed instead of plain text"
 checked={settings.welcomeEmbedEnabled}
 onCheckedChange={(c) => update("welcomeEmbedEnabled", c)}
 />

 {settings.welcomeEmbedEnabled && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 border-l-2 border-primary/30">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Embed Color</label>
 <div className="flex gap-2 items-center">
 <input
 type="color"
 value={settings.welcomeEmbedColor ??"#0099FF"}
 onChange={(e) => update("welcomeEmbedColor", e.target.value)}
 className="w-10 h-10 border border-border cursor-pointer bg-transparent"
 />
 <Input
 value={settings.welcomeEmbedColor ??"#0099FF"}
 onChange={(e) => update("welcomeEmbedColor", e.target.value)}
 className="flex-1 bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 placeholder="#0099FF"
 maxLength={7}
 />
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Embed Title</label>
 <Input
 value={settings.welcomeEmbedTitle ??""}
 onChange={(e) => update("welcomeEmbedTitle", e.target.value || null)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 placeholder="Welcome!"
 maxLength={255}
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Embed Image</label>
 <Input
 value={settings.welcomeEmbedImage ??""}
 onChange={(e) => update("welcomeEmbedImage", e.target.value || null)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 placeholder="https://..."
 maxLength={500}
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Embed Thumbnail</label>
 <Input
 value={settings.welcomeEmbedThumbnail ??""}
 onChange={(e) => update("welcomeEmbedThumbnail", e.target.value || null)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 placeholder="https://..."
 maxLength={500}
 />
 </div>
 </div>
 )}

 {settings.welcomeDmEnabled && (
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Dm Message</label>
 <Textarea
 value={settings.welcomeDmMessage ??""}
 onChange={(e) => update("welcomeDmMessage", e.target.value || null)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 placeholder="Welcome to {server}! Here are some tips..."
 rows={3}
 />
 </div>
 )}
 </div>
 )}
 </FormSection>

 {/* ═══ GOODBYE ═══ */}
 <FormSection title="Goodbye Sys"icon={LogOutIcon} description="Farewell departing members.">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <ToggleField
 label="Enable Goodbye"
 description="Send goodbye messages"
 checked={settings.goodbyeEnabled}
 onCheckedChange={(c) => update("goodbyeEnabled", c)}
 />
 </div>

 {settings.goodbyeEnabled && (
 <div className="space-y-6 mt-4">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Goodbye Channel</label>
 <DiscordChannelPicker
 channels={channels}
 value={settings.goodbyeChannel}
 onChange={(v) => update("goodbyeChannel", v)}
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Goodbye Message</label>
 <Textarea
 value={settings.goodbyeMessage ??""}
 onChange={(e) => update("goodbyeMessage", e.target.value || null)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 placeholder="{user} has left the server. 👋"
 rows={3}
 />
 </div>

 <ToggleField
 label="Rich Embed"
 description="Send as embed"
 checked={settings.goodbyeEmbedEnabled}
 onCheckedChange={(c) => update("goodbyeEmbedEnabled", c)}
 />

 {settings.goodbyeEmbedEnabled && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 border-l-2 border-primary/30">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Embed Color</label>
 <div className="flex gap-2 items-center">
 <input
 type="color"
 value={settings.goodbyeEmbedColor ??"#FF0000"}
 onChange={(e) => update("goodbyeEmbedColor", e.target.value)}
 className="w-10 h-10 border border-border cursor-pointer bg-transparent"
 />
 <Input
 value={settings.goodbyeEmbedColor ??"#FF0000"}
 onChange={(e) => update("goodbyeEmbedColor", e.target.value)}
 className="flex-1 bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 maxLength={7}
 />
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Embed Title</label>
 <Input
 value={settings.goodbyeEmbedTitle ??""}
 onChange={(e) => update("goodbyeEmbedTitle", e.target.value || null)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 placeholder="Goodbye!"
 maxLength={255}
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Embed Image</label>
 <Input
 value={settings.goodbyeEmbedImage ??""}
 onChange={(e) => update("goodbyeEmbedImage", e.target.value || null)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 placeholder="https://..."
 maxLength={500}
 />
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Embed Thumbnail</label>
 <Input
 value={settings.goodbyeEmbedThumbnail ??""}
 onChange={(e) => update("goodbyeEmbedThumbnail", e.target.value || null)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 placeholder="https://..."
 maxLength={500}
 />
 </div>
 </div>
 )}
 </div>
 )}
 </FormSection>

 {/* ═══ LOGGING ═══ */}
 <FormSection title="Logging Sys"icon={Activity} description="Server event audit trail.">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <ToggleField
 label="Enable Logging"
 description="Log server events"
 checked={settings.logsEnabled}
 onCheckedChange={(c) => update("logsEnabled", c)}
 />
 </div>

 {settings.logsEnabled && (
 <div className="space-y-2 mt-4">
 <label className="text-sm font-bold text-primary uppercase">Log Channel</label>
 <DiscordChannelPicker
 channels={channels}
 value={settings.logsChannel}
 onChange={(v) => update("logsChannel", v)}
 />
 <p className="text-xs text-muted-foreground uppercase">
 All server events will be logged here.
 </p>
 </div>
 )}
 </FormSection>

 {/* ═══ XP ═══ */}
 <FormSection title="Xp Engine"icon={Star} description="Experience and leveling configuration.">
 <ToggleField
 label="Enable XP"
 description="Track member XP and levels"
 checked={settings.xpEnabled}
 onCheckedChange={(c) => update("xpEnabled", c)}
 />

 {settings.xpEnabled && (
 <div className="space-y-6 mt-4">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 <div className="space-y-2 border border-border p-4 shadow-sm">
 <label className="text-sm font-bold text-primary uppercase">Xp Rate</label>
 <Input
 type="number"
 min={1}
 max={10}
 value={settings.xpRate}
 onChange={(e) => update("xpRate", parseInt(e.target.value) || 1)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 />
 <p className="text-xs text-muted-foreground uppercase">Global XP multiplier</p>
 </div>

 <div className="space-y-2 border border-border p-4 shadow-sm">
 <label className="text-sm font-bold text-primary uppercase">Xp Per Msg</label>
 <Input
 type="number"
 min={1}
 max={100}
 value={settings.xpPerMessage}
 onChange={(e) => update("xpPerMessage", parseInt(e.target.value) || 5)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 />
 <p className="text-xs text-muted-foreground uppercase">Base XP per message</p>
 </div>

 <div className="space-y-2 border border-border p-4 shadow-sm">
 <label className="text-sm font-bold text-primary uppercase">Xp Per Voice</label>
 <Input
 type="number"
 min={1}
 max={100}
 value={settings.xpPerVoiceMinute}
 onChange={(e) => update("xpPerVoiceMinute", parseInt(e.target.value) || 10)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 />
 <p className="text-xs text-muted-foreground uppercase">XP per voice minute</p>
 </div>

 <div className="space-y-2 border border-border p-4 shadow-sm">
 <label className="text-sm font-bold text-primary uppercase">Cooldown Sec</label>
 <Input
 type="number"
 min={0}
 max={600}
 value={settings.xpCooldown}
 onChange={(e) => update("xpCooldown", parseInt(e.target.value) || 60)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 />
 <p className="text-xs text-muted-foreground uppercase">Anti-spam cooldown</p>
 </div>

 <div className="space-y-2 border border-border p-4 shadow-sm">
 <label className="text-sm font-bold text-primary uppercase">Booster Mult</label>
 <Input
 type="number"
 min={100}
 max={1000}
 step={50}
 value={settings.xpBoosterMultiplier}
 onChange={(e) =>
 update("xpBoosterMultiplier", parseInt(e.target.value) || 200)
 }
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 />
 <p className="text-xs text-muted-foreground uppercase">{settings.xpBoosterMultiplier}% = {(settings.xpBoosterMultiplier / 100).toFixed(1)}x</p>
 </div>
 </div>

 <ToggleField
 label="Announce Level Up"
 description="Notify on level milestones"
 checked={settings.xpAnnounceLevelUp}
 onCheckedChange={(c) => update("xpAnnounceLevelUp", c)}
 />

 {settings.xpAnnounceLevelUp && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 border-l-2 border-primary/30">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Levelup Channel</label>
 <DiscordChannelPicker
 channels={channels}
 value={settings.levelUpChannel}
 onChange={(v) => update("levelUpChannel", v)}
 />
 <p className="text-xs text-muted-foreground uppercase">
 Leave empty for current channel.
 </p>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Levelup Msg</label>
 <Textarea
 value={settings.levelUpMessage ??""}
 onChange={(e) => update("levelUpMessage", e.target.value || null)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 placeholder="🎉 {user} reached level {level}!"
 rows={2}
 />
 </div>
 </div>
 )}

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Booster Role</label>
 <DiscordRolePicker
 roles={roles}
 value={settings.xpBoosterRole}
 onChange={(v) => update("xpBoosterRole", v)}
 />
 <p className="text-xs text-muted-foreground uppercase">
 Members with this role get boosted XP.
 </p>
 </div>
 </div>
 )}
 </FormSection>

 {/* ═══ AUTOROLE ═══ */}
 <FormSection title="Autorole Sys"icon={Users} description="Automatic role assignment on join.">
 <ToggleField
 label="Enable Autorole"
 description="Give roles on join"
 checked={settings.autoroleEnabled}
 onCheckedChange={(c) => update("autoroleEnabled", c)}
 />

 {settings.autoroleEnabled && (
 <div className="space-y-2 mt-4">
 <label className="text-sm font-bold text-primary uppercase">Assign Roles</label>
 <DiscordRoleMultiPicker
 roles={roles}
 value={autoroleRoleIds}
 onChange={setAutoroleRoles}
 />
 <p className="text-xs text-muted-foreground uppercase">
 All selected roles will be given to new members.
 </p>
 </div>
 )}
 </FormSection>

 {/* ═══ SECURITY ═══ */}
 <FormSection title="Security Matrix"icon={Shield} description="Guild-level security toggles.">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <ToggleField
 label="Core Security"
 description="Enable base security features"
 checked={settings.securityEnabled}
 onCheckedChange={(c) => update("securityEnabled", c)}
 />
 <ToggleField
 label="Anti-Raid"
 description="Block mass joins"
 checked={settings.antiRaidEnabled}
 onCheckedChange={(c) => update("antiRaidEnabled", c)}
 />
 <ToggleField
 label="Anti-Spam"
 description="Mute fast messaging"
 checked={settings.antiSpamEnabled}
 onCheckedChange={(c) => update("antiSpamEnabled", c)}
 />

 <div className="space-y-2 border border-border p-4 shadow-sm">
 <label className="text-sm font-bold text-primary uppercase">Max Mentions</label>
 <Input
 type="number"
 min={1}
 max={50}
 value={settings.maxMentions}
 onChange={(e) => update("maxMentions", parseInt(e.target.value) || 5)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 />
 <p className="text-xs text-muted-foreground uppercase">Max mentions per message</p>
 </div>

 <div className="space-y-2 border border-border p-4 shadow-sm">
 <label className="text-sm font-bold text-primary uppercase">Max Dupes</label>
 <Input
 type="number"
 min={1}
 max={20}
 value={settings.maxDuplicates}
 onChange={(e) => update("maxDuplicates", parseInt(e.target.value) || 3)}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 text-sm focus-visible:ring-0"
 />
 <p className="text-xs text-muted-foreground uppercase">Duplicate message threshold</p>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Alert Role</label>
 <DiscordRolePicker
 roles={roles}
 value={settings.securityAlertRole}
 onChange={(v) => update("securityAlertRole", v)}
 />
 <p className="text-xs text-muted-foreground uppercase">
 Pinged when security events occur.
 </p>
 </div>
 </div>
 </FormSection>

 {/* ═══ DANGER ZONE ═══ */}
 <FormSection
 title="Danger Zone"
 icon={ShieldAlert}
 description="Irreversible actions that will permanently purge data."
 variant="danger"
 >
 <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-background border border-destructive shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] gap-4">
 <div>
 <h4 className="font-bold text-destructive uppercase">Factory Reset</h4>
 <p className="text-xs text-muted-foreground font-bold uppercase">
 Wipes all guild settings permanently.
 </p>
 </div>
 <Button
 onClick={handleReset}
 disabled={isPending}
 variant="destructive"
 className="rounded-md border border-destructive font-black shadow-sm transition-all"
 >
 <Trash2 className="w-4 h-4 mr-2"/>Purge Data</Button>
 </div>
 </FormSection>

 {/* Save Bar */}
 <SaveBar
 hasChanges={hasChanges}
 isPending={isPending}
 onSave={handleSave}
 onDiscard={handleDiscard}
 />
 </div>
 );
}
