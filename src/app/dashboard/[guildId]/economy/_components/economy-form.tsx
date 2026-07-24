"use client";

import { useState } from"react";
import { Save, Info, Coins, Briefcase, Zap, Dice5 } from"lucide-react";
import { Input } from"@/components/ui/input";
import { Switch } from"@/components/ui/switch";
import { Button } from"@/components/ui/button";
import { saveEconomySettings } from"../actions";
import { z } from"zod";

const economySchema = z.object({
 currencySymbol: z.string().min(1).max(10),
 currencyName: z.string().min(1).max(50),
 startingBalance: z.coerce.number().min(0),
 dailyAmount: z.coerce.number().min(0),
 dailyStreak: z.boolean(),
 dailyStreakBonus: z.coerce.number().min(0),
 workMinAmount: z.coerce.number().min(0),
 workMaxAmount: z.coerce.number().min(0),
 workCooldown: z.coerce.number().min(0),
 robEnabled: z.boolean(),
 robMinAmount: z.coerce.number().min(0),
 robSuccessRate: z.coerce.number().min(0).max(100),
 robCooldown: z.coerce.number().min(0),
 maxBet: z.coerce.number().min(0),
 minBet: z.coerce.number().min(0),
}).refine((data) => data.workMaxAmount >= data.workMinAmount, {
 message:"Max work amount must be >= min amount",
 path: ["workMaxAmount"],
});

export default function EconomyForm({ guildId, initialData }: { guildId: string; initialData: any }) {
 const [formData, setFormData] = useState({
 currencySymbol: initialData?.currencySymbol ??"🪙",
 currencyName: initialData?.currencyName ??"coins",
 startingBalance: initialData?.startingBalance ?? 100,
 dailyAmount: initialData?.dailyAmount ?? 100,
 dailyStreak: initialData?.dailyStreak ?? true,
 dailyStreakBonus: initialData?.dailyStreakBonus ?? 10,
 workMinAmount: initialData?.workMinAmount ?? 50,
 workMaxAmount: initialData?.workMaxAmount ?? 200,
 workCooldown: initialData?.workCooldown ?? 3600,
 robEnabled: initialData?.robEnabled ?? true,
 robMinAmount: initialData?.robMinAmount ?? 100,
 robSuccessRate: initialData?.robSuccessRate ?? 50,
 robCooldown: initialData?.robCooldown ?? 86400,
 maxBet: initialData?.maxBet ?? 10000,
 minBet: initialData?.minBet ?? 10,
 });
 const [loading, setLoading] = useState(false);
 const [errors, setErrors] = useState<Record<string, string>>({});

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setErrors({});
 
 const result = economySchema.safeParse(formData);
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
 await saveEconomySettings(guildId, result.data);
 setLoading(false);
 };

 return (
 <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-6 lg:p-10 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
 <div>
 <h1 className="text-4xl font-black text-primary tracking-tight uppercase flex items-center gap-3">
 <Coins className="w-10 h-10 text-primary"/>Econ Matrix</h1>
 <p className="text-muted-foreground mt-2 text-sm">
 Configure banking, yields, and risk parameters.
 </p>
 </div>
 <Button 
 type="submit"
 disabled={loading}
 variant="default"
 className="rounded-md border border-border shadow-sm hover:shadow-sm transition-all font-bold"
 >
 <Save className="w-4 h-4 mr-2"/>
 {loading ?"SYNCING...":"COMMIT_ECONOMY"}
 </Button>
 </div>

 <div className="grid gap-8">
 <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6">
 <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
 <Coins className="w-6 h-6 text-primary"/>
 <h2 className="text-xl font-black text-primary uppercase">Currency Sys</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Currency Name</label>
 <Input
 value={formData.currencyName}
 onChange={(e) => setFormData({ ...formData, currencyName: e.target.value })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 {errors.currencyName && <p className="text-xs font-bold text-destructive uppercase">{errors.currencyName}</p>}
 </div>
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Symbol Char</label>
 <Input
 value={formData.currencySymbol}
 onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 {errors.currencySymbol && <p className="text-xs font-bold text-destructive uppercase">{errors.currencySymbol}</p>}
 </div>
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Init Balance</label>
 <Input
 type="number"
 value={formData.startingBalance}
 onChange={(e) => setFormData({ ...formData, startingBalance: parseInt(e.target.value) || 0 })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 {errors.startingBalance && <p className="text-xs font-bold text-destructive uppercase">{errors.startingBalance}</p>}
 </div>
 </div>
 </div>

 <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6">
 <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
 <Briefcase className="w-6 h-6 text-primary"/>
 <h2 className="text-xl font-black text-primary uppercase">Yield Models</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Daily Yield</label>
 <Input
 type="number"
 value={formData.dailyAmount}
 onChange={(e) => setFormData({ ...formData, dailyAmount: parseInt(e.target.value) || 0 })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 </div>
 <div className="flex items-center justify-between border border-border p-4 shadow-sm">
 <div className="space-y-0.5">
 <label className="text-base font-bold text-primary uppercase">Streak Bonus</label>
 <p className="text-xs text-muted-foreground uppercase">Compound yields</p>
 </div>
 <Switch
 checked={formData.dailyStreak}
 onCheckedChange={(checked) => setFormData({ ...formData, dailyStreak: checked })}
 className="border border-border data-[state=checked]:bg-primary rounded-md"
 />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Bonus Amount</label>
 <Input
 type="number"
 value={formData.dailyStreakBonus}
 onChange={(e) => setFormData({ ...formData, dailyStreakBonus: parseInt(e.target.value) || 0 })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 disabled={!formData.dailyStreak}
 />
 </div>

 <div className="space-y-2 pt-4 border-t-2 border-primary/20 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Work Min Yield</label>
 <Input
 type="number"
 value={formData.workMinAmount}
 onChange={(e) => setFormData({ ...formData, workMinAmount: parseInt(e.target.value) || 0 })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Work Max Yield</label>
 <Input
 type="number"
 value={formData.workMaxAmount}
 onChange={(e) => setFormData({ ...formData, workMaxAmount: parseInt(e.target.value) || 0 })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 {errors.workMaxAmount && <p className="text-xs font-bold text-destructive uppercase">{errors.workMaxAmount}</p>}
 </div>
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Work Cooldown (S)</label>
 <Input
 type="number"
 value={formData.workCooldown}
 onChange={(e) => setFormData({ ...formData, workCooldown: parseInt(e.target.value) || 0 })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 </div>
 </div>
 </div>
 </div>

 <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6">
 <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
 <Zap className="w-6 h-6 text-primary"/>
 <h2 className="text-xl font-black text-primary uppercase">Crime Syndicate</h2>
 </div>
 
 <div className="flex items-center justify-between border border-border p-4 shadow-sm w-fit min-w-[250px] mb-6">
 <div className="space-y-0.5">
 <label className="text-base font-bold text-primary uppercase">Pvp Robbing</label>
 <p className="text-xs text-muted-foreground uppercase">Enable user theft</p>
 </div>
 <Switch
 checked={formData.robEnabled}
 onCheckedChange={(checked) => setFormData({ ...formData, robEnabled: checked })}
 className="border border-border data-[state=checked]:bg-primary rounded-md ml-4"
 />
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Min Theft Yield</label>
 <Input
 type="number"
 value={formData.robMinAmount}
 onChange={(e) => setFormData({ ...formData, robMinAmount: parseInt(e.target.value) || 0 })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 disabled={!formData.robEnabled}
 />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Success Rate (%)</label>
 <Input
 type="number"
 value={formData.robSuccessRate}
 onChange={(e) => setFormData({ ...formData, robSuccessRate: parseInt(e.target.value) || 0 })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 disabled={!formData.robEnabled}
 />
 {errors.robSuccessRate && <p className="text-xs font-bold text-destructive uppercase">{errors.robSuccessRate}</p>}
 </div>
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Rob Cooldown (S)</label>
 <Input
 type="number"
 value={formData.robCooldown}
 onChange={(e) => setFormData({ ...formData, robCooldown: parseInt(e.target.value) || 0 })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 disabled={!formData.robEnabled}
 />
 </div>
 </div>
 </div>

 <div className="bg-card border border-border shadow-sm rounded-xl p-6 space-y-6">
 <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
 <Dice5 className="w-6 h-6 text-primary"/>
 <h2 className="text-xl font-black text-primary uppercase">Risk Limits</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Min Wager</label>
 <Input
 type="number"
 value={formData.minBet}
 onChange={(e) => setFormData({ ...formData, minBet: parseInt(e.target.value) || 0 })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-bold text-primary uppercase">Max Wager</label>
 <Input
 type="number"
 value={formData.maxBet}
 onChange={(e) => setFormData({ ...formData, maxBet: parseInt(e.target.value) || 0 })}
 className="w-full bg-background border border-border rounded-md shadow-sm px-4 py-2 focus-visible:ring-0"
 />
 </div>
 </div>
 </div>
 </div>
 </form>
 );
}
