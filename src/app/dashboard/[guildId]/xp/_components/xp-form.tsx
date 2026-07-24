"use client";

import { useState } from"react";
import { Save, Info, TrendingUp, Settings, Target } from"lucide-react";
import { Input } from"@/components/ui/input";
import { Switch } from"@/components/ui/switch";
import { Button } from"@/components/ui/button";
import { saveXpSettings } from"../actions";
import { z } from"zod";

const xpSchema = z.object({
 levelUpRewardsEnabled: z.boolean(),
 stackRoleRewards: z.boolean(),
 ignoredChannels: z.string().refine(
 (val) => {
 try { JSON.parse(val); return true; } catch { return false; }
 },
 { message:"Must be a valid JSON array"}
 ),
 ignoredRoles: z.string().refine(
 (val) => {
 try { JSON.parse(val); return true; } catch { return false; }
 },
 { message:"Must be a valid JSON array"}
 ),
 noXpChannels: z.string().refine(
 (val) => {
 try { JSON.parse(val); return true; } catch { return false; }
 },
 { message:"Must be a valid JSON array"}
 ),
 doubleXpChannels: z.string().refine(
 (val) => {
 try { JSON.parse(val); return true; } catch { return false; }
 },
 { message:"Must be a valid JSON array"}
 ),
});

export default function XpForm({ guildId, initialData }: { guildId: string; initialData: any }) {
 const [formData, setFormData] = useState({
 levelUpRewardsEnabled: initialData?.levelUpRewardsEnabled ?? true,
 stackRoleRewards: initialData?.stackRoleRewards ?? false,
 ignoredChannels: initialData?.ignoredChannels ??"[]",
 ignoredRoles: initialData?.ignoredRoles ??"[]",
 noXpChannels: initialData?.noXpChannels ??"[]",
 doubleXpChannels: initialData?.doubleXpChannels ??"[]",
 });
 const [loading, setLoading] = useState(false);
 const [errors, setErrors] = useState<Record<string, string>>({});

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setErrors({});
 
 const result = xpSchema.safeParse(formData);
 if (!result.success) {
 const formattedErrors: Record<string, string> = {};
 result.error.issues.forEach((err) => {
 if (err.path[0]) {
 formattedErrors[err.path[0].toString()] = err.message;
 }
 });
 setErrors(formattedErrors);
 return;
 }

 setLoading(true);
 await saveXpSettings(guildId, result.data);
 setLoading(false);
 };

 return (
 <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-6 lg:p-10 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tight uppercase flex items-center gap-3">
 <TrendingUp className="w-10 h-10 text-primary"/>Leveling Matrix</h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Configure experience systems and progression metrics.
 </p>
 </div>
 <Button 
 type="submit"
 disabled={loading}
 variant="default"
 className="rounded-md border border-border shadow-sm hover:shadow-sm transition-all font-bold"
 >
 <Save className="w-4 h-4 mr-2"/>
 {loading ?"SYNCING...":"COMMIT_XP"}
 </Button>
 </div>

 <div className="grid gap-8">
 <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6">
 <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
 <Settings className="w-6 h-6 text-primary"/>
 <h2 className="text-xl font-black text-primary uppercase">Reward Config</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="flex items-center justify-between border border-border p-4 shadow-sm">
 <div className="space-y-0.5">
 <label className="text-base font-bold text-primary uppercase">Level Up Rewards</label>
 <p className="text-xs text-muted-foreground uppercase">Give roles on level up</p>
 </div>
 <Switch
 checked={formData.levelUpRewardsEnabled}
 onCheckedChange={(checked) => setFormData({ ...formData, levelUpRewardsEnabled: checked })}
 className="border border-border data-[state=checked]:bg-primary rounded-md ml-4"
 />
 </div>

 <div className="flex items-center justify-between border border-border p-4 shadow-sm">
 <div className="space-y-0.5">
 <label className="text-base font-bold text-primary uppercase">Stack Rewards</label>
 <p className="text-xs text-muted-foreground uppercase">Keep previous level roles</p>
 </div>
 <Switch
 checked={formData.stackRoleRewards}
 onCheckedChange={(checked) => setFormData({ ...formData, stackRoleRewards: checked })}
 className="border border-border data-[state=checked]:bg-primary rounded-md ml-4"
 />
 </div>
 </div>
 </div>

 <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6">
 <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
 <Target className="w-6 h-6 text-primary"/>
 <h2 className="text-xl font-black text-primary uppercase">Filter Metrics</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Ignored Channels</label>
 <Input
 value={formData.ignoredChannels}
 onChange={(e) => setFormData({ ...formData, ignoredChannels: e.target.value })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 placeholder='["123456789"]'
 />
 {errors.ignoredChannels && <p className="text-xs font-bold text-destructive uppercase">{errors.ignoredChannels}</p>}
 <p className="text-xs text-muted-foreground uppercase">Json array of channel IDs</p>
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Ignored Roles</label>
 <Input
 value={formData.ignoredRoles}
 onChange={(e) => setFormData({ ...formData, ignoredRoles: e.target.value })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 placeholder='["123456789"]'
 />
 {errors.ignoredRoles && <p className="text-xs font-bold text-destructive uppercase">{errors.ignoredRoles}</p>}
 <p className="text-xs text-muted-foreground uppercase">Json array of role IDs</p>
 </div>
 
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">No Xp Channels</label>
 <Input
 value={formData.noXpChannels}
 onChange={(e) => setFormData({ ...formData, noXpChannels: e.target.value })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 placeholder='[]'
 />
 {errors.noXpChannels && <p className="text-xs font-bold text-destructive uppercase">{errors.noXpChannels}</p>}
 </div>

 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">2X_XP_CHANNELS</label>
 <Input
 value={formData.doubleXpChannels}
 onChange={(e) => setFormData({ ...formData, doubleXpChannels: e.target.value })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 placeholder='[]'
 />
 {errors.doubleXpChannels && <p className="text-xs font-bold text-destructive uppercase">{errors.doubleXpChannels}</p>}
 </div>
 </div>
 </div>
 </div>
 </form>
 );
}
