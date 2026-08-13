"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
 Coins,
 ShoppingBag,
 Users,
 History,
 Plus,
 Trash2,
 Edit2,
 Save,
 CheckCircle,
 ChevronLeft,
 ChevronRight,
 Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormSection } from "@/components/dashboard/forms/FormSection";
import { ToggleField } from "@/components/dashboard/forms/ToggleField";
import {
 DiscordRolePicker,
 type RoleOption,
} from "@/components/dashboard/pickers/DiscordRolePicker";
import {
 saveEconomySettings,
 createShopItem,
 deleteShopItem,
 updateUserBalanceOverride,
} from "../actions";
import { formatNumber } from "@/lib/utils";

interface EconomyClientProps {
 guildId: string;
 initialSettings: any;
 initialShopItems: any[];
 initialUserBalances: any[];
 initialTransactions: any[];
 roles: RoleOption[];
}

export default function EconomyClient({
 guildId,
 initialSettings,
 initialShopItems,
 initialUserBalances,
 initialTransactions,
 roles,
}: EconomyClientProps) {
 const t = useTranslations('guildEconomy');
 const [activeTab, setActiveTab] = useState<
  "settings" | "shop" | "balances" | "transactions"
 >("settings");
 const [isPending, startTransition] = useTransition();

 // ── Settings State ─────────────────────────────────────────────
 const [settings, setSettings] = useState({
  currencySymbol: initialSettings?.currencySymbol ?? "💰",
  currencyName: initialSettings?.currencyName ?? "coins",
  startingBalance: initialSettings?.startingBalance ?? 100,
  dailyAmount: initialSettings?.dailyAmount ?? 100,
  dailyStreak: initialSettings?.dailyStreak ?? true,
  dailyStreakBonus: initialSettings?.dailyStreakBonus ?? 10,
  workMinAmount: initialSettings?.workMinAmount ?? 50,
  workMaxAmount: initialSettings?.workMaxAmount ?? 200,
  workCooldown: initialSettings?.workCooldown ?? 3600,
  robEnabled: initialSettings?.robEnabled ?? true,
  robMinAmount: initialSettings?.robMinAmount ?? 100,
  robSuccessRate: initialSettings?.robSuccessRate ?? 50,
  robCooldown: initialSettings?.robCooldown ?? 86400,
  robProtectionCost: initialSettings?.robProtectionCost ?? 1000,
  robProtectionDuration: initialSettings?.robProtectionDuration ?? 86400,
  minBet: initialSettings?.minBet ?? 10,
  maxBet: initialSettings?.maxBet ?? 10000,
 });

 // ── New Shop Item State (Adapts effectValue to effectType) ───────
 const [newItem, setNewItem] = useState({
  name: "",
  description: "",
  price: 500,
  type: "custom",
  effectType: "rob_protection",
  stock: -1,
  requiresRole: null as string | null,
  enabled: true,
  // Dynamic effectValue fields
  effectDuration: 86400,
  effectMultiplier: 2,
  effectRoleId: null as string | null,
  effectNote: "",
  tradeable: true,
 });

 // ── User Balance Override State ─────────────────────────────────
 const [editingUser, setEditingUser] = useState<{
  userId: string;
  balance: number;
  bankBalance: number;
 } | null>(null);

 const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
 const [isShopItemDialogOpen, setIsShopItemDialogOpen] = useState(false);

 // ── Pagination and Search State ─────────────────────────────────
 const [balanceSearch, setBalanceSearch] = useState("");
 const [balancePage, setBalancePage] = useState(1);
 const [txSearch, setTxSearch] = useState("");
 const [txPage, setTxPage] = useState(1);
 const ITEMS_PER_PAGE = 10;

 const filteredBalances = initialUserBalances.filter(b => b.userId.includes(balanceSearch));
 const totalBalancePages = Math.max(1, Math.ceil(filteredBalances.length / ITEMS_PER_PAGE));
 const currentBalances = filteredBalances.slice((balancePage - 1) * ITEMS_PER_PAGE, balancePage * ITEMS_PER_PAGE);

 const filteredTransactions = initialTransactions.filter(tx => 
  tx.userId.includes(txSearch) || 
  (tx.description || "").toLowerCase().includes(txSearch.toLowerCase()) || 
  tx.type.toLowerCase().includes(txSearch.toLowerCase())
 );
 const totalTxPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
 const currentTransactions = filteredTransactions.slice((txPage - 1) * ITEMS_PER_PAGE, txPage * ITEMS_PER_PAGE);

 const handleSaveSettings = () => {
  startTransition(async () => {
   await saveEconomySettings(guildId, settings);
  });
 };

 const handleCreateShopItem = () => {
  if (!newItem.name || !newItem.description) return;

  // Adapt effectValue based on effectType (Non-negotiable constraint)
  let effectValue: any = {};
  if (newItem.effectType === "rob_protection") {
   effectValue = { durationSeconds: Number(newItem.effectDuration) };
  } else if (newItem.effectType === "xp_boost") {
   effectValue = {
    multiplier: Number(newItem.effectMultiplier),
    durationSeconds: Number(newItem.effectDuration),
   };
  } else if (newItem.effectType === "role") {
   effectValue = { roleId: newItem.effectRoleId };
  } else {
   effectValue = { note: newItem.effectNote };
  }

  startTransition(async () => {
   await createShopItem(guildId, {
    name: newItem.name,
    description: newItem.description,
    price: Number(newItem.price),
    type: newItem.type,
    effectType: newItem.effectType,
    effectValue,
    stock: Number(newItem.stock),
    requiresRole: newItem.requiresRole || undefined,
    enabled: newItem.enabled,
    tradeable: newItem.tradeable,
   });

   setIsShopItemDialogOpen(false);
   setNewItem({
    name: "",
    description: "",
    price: 500,
    type: "custom",
    effectType: "rob_protection",
    stock: -1,
    requiresRole: null,
    enabled: true,
    effectDuration: 86400,
    effectMultiplier: 2,
    effectRoleId: null,
    effectNote: "",
    tradeable: true,
   });
  });
 };

  const handleSaveBalanceOverride = () => {
   if (!editingUser) return;
   startTransition(async () => {
    await updateUserBalanceOverride(
     guildId,
     editingUser.userId,
     Number(editingUser.balance),
     Number(editingUser.bankBalance)
    );
    setEditingUser(null);
    setIsUserDialogOpen(false);
   });
  };

  const tabs = [
    { id: "settings", label: t("tabs.settings"), icon: Coins },
    { id: "shop", label: t("tabs.shop"), icon: ShoppingBag },
    { id: "balances", label: t("tabs.balances"), icon: Users },
    { id: "transactions", label: t("tabs.transactions"), icon: History },
  ];

  return (
    <div className="p-2 sm:p-6 md:p-10 relative flex-1 overflow-hidden animate-in fade-in duration-500 max-w-[1600px] mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
          <Coins className="w-8 h-8 sm:w-10 sm:h-10 text-primary shrink-0" />{t("title")}
        </h1>
        <p className="text-foreground/60 mt-1.5 sm:mt-2 text-xs sm:text-sm">
          {t("subtitle")}
        </p>
      </div>

      <div className="bg-foreground/5 border border-border rounded-2xl shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col backdrop-blur-md">
        {/* Browser-style Tabs Header */}
        <div className="flex overflow-x-auto items-end bg-background/40 pt-3 sm:pt-4 px-2 sm:px-4 border-b border-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 touch-pan-x">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "group relative flex items-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 font-bold text-xs sm:text-sm tracking-wide rounded-t-xl border-t border-x -mb-[1px] shrink-0 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-foreground/10 border-border text-foreground z-10 backdrop-blur-xl"
                  : "bg-transparent border-transparent text-foreground/40 hover:bg-foreground/5 hover:text-foreground/80 hover:border-border z-0"
              )}
            >
              <tab.icon className={cn("w-4 h-4 transition-colors shrink-0", activeTab === tab.id ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/60")} />
              {tab.label}
              
              {activeTab === tab.id && (
                <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[#0c0c0c]" />
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="p-3 sm:p-6 md:p-10 relative flex-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-foreground/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

   {/* Tab 1: Economy Settings */}
   {activeTab === "settings" && (
    <FormSection title={t("settings.title")} icon={Coins} description={t("settings.desc")}>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t("settings.symbol")}</label>
       <Input
        value={settings.currencySymbol}
        onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
        className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t("settings.name")}</label>
       <Input
        value={settings.currencyName}
        onChange={(e) => setSettings({ ...settings, currencyName: e.target.value })}
        className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t("settings.startBalance")}</label>
       <Input
        type="number"
        value={settings.startingBalance}
        onChange={(e) => setSettings({ ...settings, startingBalance: Number(e.target.value) })}
        className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t("settings.dailyReward")}</label>
       <Input
        type="number"
        value={settings.dailyAmount}
        onChange={(e) => setSettings({ ...settings, dailyAmount: Number(e.target.value) })}
        className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t("settings.workMin")}</label>
       <Input
        type="number"
        value={settings.workMinAmount}
        onChange={(e) => setSettings({ ...settings, workMinAmount: Number(e.target.value) })}
        className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t("settings.workMax")}</label>
       <Input
        type="number"
        value={settings.workMaxAmount}
        onChange={(e) => setSettings({ ...settings, workMaxAmount: Number(e.target.value) })}
        className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t("settings.minBet")}</label>
       <Input
        type="number"
        value={settings.minBet}
        onChange={(e) => setSettings({ ...settings, minBet: Number(e.target.value) })}
        className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>

      <div className="flex flex-col gap-2">
       <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">{t("settings.maxBet")}</label>
       <Input
        type="number"
        value={settings.maxBet}
        onChange={(e) => setSettings({ ...settings, maxBet: Number(e.target.value) })}
        className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>
     </div>

     <div className="mt-4">
      <ToggleField
       label={t("settings.enableRobbery")}
       description={t("settings.enableRobberyDesc")}
       checked={settings.robEnabled}
       onCheckedChange={(c) => setSettings({ ...settings, robEnabled: c })}
      />
     </div>

     <Button
      onClick={handleSaveSettings}
      disabled={isPending}
      className="rounded-md border border-border shadow-sm font-medium text-xs mt-4"
     >
      <Save className="w-4 h-4 mr-2" />Save Economy Settings</Button>
    </FormSection>
   )}

   {/* Tab 2: Shop Items CRUD */}
   {activeTab === "shop" && (
    <div className="space-y-6">
      <Dialog open={isShopItemDialogOpen} onOpenChange={(open) => {
        setIsShopItemDialogOpen(open);
        if (!open) {
          setNewItem({
            name: "",
            description: "",
            price: 500,
            type: "custom",
            effectType: "rob_protection",
            stock: -1,
            requiresRole: null,
            enabled: true,
            effectDuration: 86400,
            effectMultiplier: 2,
            effectRoleId: null,
            effectNote: "",
            tradeable: true,
          });
        }
      }}>
        <DialogContent className="bg-background/90 border border-border text-foreground backdrop-blur-xl sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Create Shop Item
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
         <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Item Name</label>
         <Input
          placeholder="2x XP Booster / Shield"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
         />
        </div>

        <div className="flex flex-col gap-2">
         <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Price ({settings.currencySymbol})</label>
         <Input
          type="number"
          min={1}
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
          className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
         />
        </div>

        <div className="space-y-1 md:col-span-2">
         <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Item Description</label>
         <Textarea
          placeholder="Protects you against robbery attempts for 24 hours..."
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
          rows={2}
         />
        </div>

        <div className="flex flex-col gap-2">
         <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Effect Type</label>
         <select
          value={newItem.effectType}
          onChange={(e) => setNewItem({ ...newItem, effectType: e.target.value })}
          className="w-full min-h-[40px] px-3 py-2 bg-background/40 border border-border rounded-lg text-sm uppercase text-foreground [&>option]:bg-neutral-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
         >
          <option value="rob_protection">Robbery Protection Shield</option>
          <option value="xp_boost">XP Multiplier Booster</option>
          <option value="role">Assignable Discord Role</option>
          <option value="custom">Custom Perpetual Effect</option>
         </select>
        </div>

        <div className="flex flex-col gap-2">
         <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Stock Limit (-1 = Unlimited)</label>
         <Input
          type="number"
          value={newItem.stock}
          onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })}
          className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
         />
        </div>
       </div>

       <div className="p-4 border border-border bg-primary/5 space-y-4 mt-4 rounded-md">
        <h4 className="font-bold text-sm uppercase text-primary border-b border-primary/20 pb-1">Effect Value Fields ({newItem.effectType})
        </h4>

        {newItem.effectType === "rob_protection" && (
         <div className="flex flex-col gap-2">
          <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Shield Protection Duration (Seconds)</label>
          <Input
           type="number"
           value={newItem.effectDuration}
           onChange={(e) => setNewItem({ ...newItem, effectDuration: Number(e.target.value) })}
           className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
          />
          <p className="text-xs text-foreground/50 mt-1">
           86400s = 24 Hours | 604800s = 7 Days
          </p>
         </div>
        )}

        {newItem.effectType === "xp_boost" && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
           <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">XP Multiplier Factor</label>
           <Input
            type="number"
            step="0.5"
            value={newItem.effectMultiplier}
            onChange={(e) => setNewItem({ ...newItem, effectMultiplier: Number(e.target.value) })}
            className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
           />
          </div>
          <div className="flex flex-col gap-2">
           <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Booster Duration (Seconds)</label>
           <Input
            type="number"
            value={newItem.effectDuration}
            onChange={(e) => setNewItem({ ...newItem, effectDuration: Number(e.target.value) })}
            className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
           />
          </div>
         </div>
        )}

        {newItem.effectType === "role" && (
         <div className="flex flex-col gap-2">
          <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Role Granted Upon Purchase</label>
          <DiscordRolePicker
           roles={roles}
           value={newItem.effectRoleId}
           onChange={(r) => setNewItem({ ...newItem, effectRoleId: r })}
          />
         </div>
        )}

        {newItem.effectType === "custom" && (
         <div className="flex flex-col gap-2">
          <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Custom Effect Instructions / Metadata (Optional)</label>
          <Input
           placeholder="e.g. VIP Lounge Access Badge"
           value={newItem.effectNote}
           onChange={(e) => setNewItem({ ...newItem, effectNote: e.target.value })}
           className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
          />
         </div>
        )}
       </div>
       <div className="mt-4">
        <ToggleField
         label="Allow User Trading"
         description="If enabled, users can trade this item with others."
         checked={newItem.tradeable}
         onCheckedChange={(c) => setNewItem({ ...newItem, tradeable: c })}
        />
       </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="ghost" onClick={() => setIsShopItemDialogOpen(false)} className="text-foreground/50 hover:text-foreground">
              Cancel
            </Button>
            <Button
              onClick={handleCreateShopItem}
              disabled={isPending}
              className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Shop Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

     <FormSection 
       title="Guild Marketplace Items" 
       icon={ShoppingBag} 
       description="Configured shop items available for purchase."
       headerAction={
        <Button
         onClick={() => setIsShopItemDialogOpen(true)}
         className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-0 shadow-sm font-bold text-xs uppercase"
        >
         <Plus className="w-4 h-4 mr-2" />Add Item
        </Button>
       }
     >
      <div className="space-y-3">
       {initialShopItems.length === 0 ? (
        <p className="text-foreground/40 text-sm uppercase p-4 border border-border">
         No shop items added yet.
        </p>
       ) : (
        initialShopItems.map((item) => (
         <div
          key={item.id}
          className="p-4 rounded-xl border border-border bg-background/20 text-foreground backdrop-blur-md hover:bg-foreground/5 transition-all flex items-center gap-3 justify-between shadow-sm"
         >
          <div>
           <div className="flex items-center gap-2">
            <span className="font-bold uppercase text-primary">{item.name}</span>
            <span className="text-xs border px-2 py-0.5 border-primary font-bold text-yellow-500">
             {formatNumber(item.price)} {settings.currencySymbol}
            </span>
            <Badge variant="outline" className="text-xs border-secondary uppercase">
             {item.effectType}
            </Badge>
           </div>
           <p className="text-xs text-foreground/40 mt-1">
            Description: {item.description} | Stock: {item.stock === -1 ? "Unlimited" : item.stock} | Effect: {JSON.stringify(item.effectValue)}
           </p>
          </div>

          <Button
           size="sm"
           className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"onClick={() => startTransition(async () => { await deleteShopItem(guildId, item.id); })}
          >
           <Trash2 className="w-3.5 h-3.5" />
          </Button>
         </div>
        ))
       )}
      </div>
     </FormSection>
    </div>
   )}

   {/* Tab 3: User Balances Admin Override */}
   {activeTab === "balances" && (
    <div className="space-y-6">
      <Dialog open={isUserDialogOpen} onOpenChange={(open) => {
        setIsUserDialogOpen(open);
        if (!open) setEditingUser(null);
      }}>
        <DialogContent className="bg-background/90 border border-border text-foreground backdrop-blur-xl sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Users className="w-5 h-5 text-primary" />
              Modify Balance
            </DialogTitle>
          </DialogHeader>
          
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
                <p className="text-sm font-bold text-primary break-all">USER ID: {editingUser.userId}</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Wallet Balance</label>
                <Input
                  type="number"
                  value={editingUser.balance}
                  onChange={(e) => setEditingUser({ ...editingUser, balance: Number(e.target.value) })}
                  className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Bank Balance</label>
                <Input
                  type="number"
                  value={editingUser.bankBalance}
                  onChange={(e) => setEditingUser({ ...editingUser, bankBalance: Number(e.target.value) })}
                  className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="ghost" onClick={() => setIsUserDialogOpen(false)} className="text-foreground/50 hover:text-foreground">
              Cancel
            </Button>
            <Button
              onClick={handleSaveBalanceOverride}
              disabled={isPending}
              className="bg-foreground/10 hover:bg-foreground/20 text-foreground border-0"
            >
              <Save className="w-4 h-4 mr-2" />
              Commit Override
            </Button>
          </div>
        </DialogContent>
      </Dialog>

     <FormSection title="User Balances Admin Override" icon={Users} description="View and directly modify member wallet and bank balances.">

     <div className="flex items-center justify-between mb-4 gap-4">
      <div className="relative flex-1 max-w-sm">
       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
       <Input
        placeholder="Search by User ID..."
        value={balanceSearch}
        onChange={(e) => {
         setBalanceSearch(e.target.value);
         setBalancePage(1);
        }}
        className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] pl-10 pr-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>
     </div>

     <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left border-collapse text-sm">
       <thead className="bg-primary/10 border-b border-border text-xs uppercase text-foreground/60">
        <tr>
         <th className="p-3">User ID</th>
         <th className="p-3">Wallet Balance</th>
         <th className="p-3">Bank Balance</th>
         <th className="p-3">Total Earned</th>
         <th className="p-3">Actions</th>
        </tr>
       </thead>
       <tbody className="divide-y divide-primary/20">
        {currentBalances.length === 0 ? (
         <tr>
          <td colSpan={5} className="p-6 text-center text-foreground/40 uppercase">
           No economy balances found.
          </td>
         </tr>
        ) : (
         currentBalances.map((b) => (
          <tr key={b.userId} className="hover:bg-primary/5 transition-colors">
           <td className="p-3 font-medium">{b.userId}</td>
           <td className="p-3 font-medium text-emerald-500">
            {formatNumber(b.balance)} {settings.currencySymbol}
           </td>
           <td className="p-3 font-medium text-blue-500">
            {formatNumber(b.bankBalance)} {settings.currencySymbol}
           </td>
           <td className="p-3 text-foreground/40">{formatNumber(b.totalEarned)}</td>
           <td className="p-3">
            <Button
             size="sm"
             className="bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border"onClick={() => {
              setEditingUser({
               userId: b.userId,
               balance: b.balance,
               bankBalance: b.bankBalance,
              });
              setIsUserDialogOpen(true);
             }}
            >
             <Edit2 className="w-3.5 h-3.5 mr-1" />
             Edit Balance
            </Button>
           </td>
          </tr>
         ))
        )}
       </tbody>
      </table>
     </div>

     {totalBalancePages > 1 && (
      <div className="flex items-center justify-end gap-2 mt-4">
       <Button
        variant="outline"
        size="sm"
        onClick={() => setBalancePage(p => Math.max(1, p - 1))}
        disabled={balancePage === 1}
       >
        <ChevronLeft className="w-4 h-4" />
       </Button>
       <span className="text-sm font-medium text-foreground/40">
        Page {balancePage} of {totalBalancePages}
       </span>
       <Button
        variant="outline"
        size="sm"
        onClick={() => setBalancePage(p => Math.min(totalBalancePages, p + 1))}
        disabled={balancePage === totalBalancePages}
       >
        <ChevronRight className="w-4 h-4" />
       </Button>
      </div>
     )}
     </FormSection>
    </div>
   )}

   {/* Tab 4: Transaction History */}
   {activeTab === "transactions" && (
    <FormSection title="Transaction Audit Log" icon={History} description="Real-time record of all economy operations.">
     <div className="flex items-center justify-between mb-4 gap-4">
      <div className="relative flex-1 max-w-sm">
       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
       <Input
        placeholder="Search transactions..."
        value={txSearch}
        onChange={(e) => {
         setTxSearch(e.target.value);
         setTxPage(1);
        }}
        className="w-full bg-foreground/5 border border-border text-foreground placeholder:text-foreground/30 rounded-lg min-h-[40px] pl-10 pr-3 py-2 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
       />
      </div>
     </div>

     <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left border-collapse text-sm">
       <thead className="bg-primary/10 border-b border-border text-xs uppercase text-foreground/60">
        <tr>
         <th className="p-3">Type</th>
         <th className="p-3">User ID</th>
         <th className="p-3">Amount</th>
         <th className="p-3">Description (Optional)</th>
         <th className="p-3">Date</th>
        </tr>
       </thead>
       <tbody className="divide-y divide-primary/20">
        {currentTransactions.length === 0 ? (
         <tr>
          <td colSpan={5} className="p-6 text-center text-foreground/40 uppercase">
           No economy transactions found.
          </td>
         </tr>
        ) : (
         currentTransactions.map((tx) => (
          <tr key={tx.id} className="hover:bg-primary/5 transition-colors">
           <td className="p-3 uppercase font-medium">
            <span className="px-2 py-0.5 rounded-md border border-primary/20 bg-primary/10 text-xs">
             {tx.type}
            </span>
           </td>
           <td className="p-3 font-medium">{tx.userId}</td>
           <td className="p-3 font-medium text-yellow-500">
            {tx.amount > 0 ? `+${formatNumber(tx.amount)}` : formatNumber(tx.amount)}
           </td>
           <td className="p-3 truncate max-w-xs">{tx.description || "N/A"}</td>
           <td className="p-3 text-xs text-foreground/40">
            {new Date(tx.createdAt).toLocaleString()}
           </td>
          </tr>
         ))
        )}
       </tbody>
      </table>
     </div>

     {totalTxPages > 1 && (
      <div className="flex items-center justify-end gap-2 mt-4">
       <Button
        variant="outline"
        size="sm"
        onClick={() => setTxPage(p => Math.max(1, p - 1))}
        disabled={txPage === 1}
       >
        <ChevronLeft className="w-4 h-4" />
       </Button>
       <span className="text-sm font-medium text-foreground/40">
        Page {txPage} of {totalTxPages}
       </span>
       <Button
        variant="outline"
        size="sm"
        onClick={() => setTxPage(p => Math.min(totalTxPages, p + 1))}
        disabled={txPage === totalTxPages}
       >
        <ChevronRight className="w-4 h-4" />
       </Button>
      </div>
     )}
    </FormSection>
   )}
        </div>
      </div>
    </div>
 );
}
