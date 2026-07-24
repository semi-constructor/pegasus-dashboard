"use client";

import { useState, useTransition } from"react";
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
 });

 // ── User Balance Override State ─────────────────────────────────
 const [editingUser, setEditingUser] = useState<{
  userId: string;
  balance: number;
  bankBalance: number;
 } | null>(null);

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
   });

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
  });
 };

 return (
  <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
   <div className="flex items-center justify-between border-b border-border pb-4">
    <div>
     <h1 className="text-4xl font-black text-primary tracking-tighter uppercase flex items-center gap-3">
      <Coins className="w-10 h-10 text-primary" />Economy System</h1>
     <p className="text-muted-foreground mt-2 text-sm">
      Currency settings, item shop CRUD with dynamic effect values, balance admin overrides, and transactions.
     </p>
    </div>
   </div>

   {/* Navigation Tabs */}
   <div className="flex flex-wrap gap-2 border-b border-border/50 pb-2">
    {[
     { id: "settings", label: "Economy Settings", icon: Coins },
     { id: "shop", label: "Shop Items CRUD", icon: ShoppingBag },
     { id: "balances", label: "User Balances Override", icon: Users },
     { id: "transactions", label: "Transaction History", icon: History },
    ].map((tab) => (
     <Button
      key={tab.id}
      variant={activeTab === tab.id ? "default" : "ghost"}
      onClick={() => setActiveTab(tab.id as any)}
      className="rounded-md border border-border font-medium text-xs"
     >
      <tab.icon className="w-4 h-4 mr-2" />
      {tab.label}
     </Button>
    ))}
   </div>

   {/* Tab 1: Economy Settings */}
   {activeTab === "settings" && (
    <FormSection title="Currency And Jobs Config" icon={Coins} description="Global economy parameters and minigame limits.">
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-1">
       <label className="text-xs font-bold uppercase">Currency Symbol</label>
       <Input
        value={settings.currencySymbol}
        onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
        className="rounded-md border border-border"
       />
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase">Currency Name</label>
       <Input
        value={settings.currencyName}
        onChange={(e) => setSettings({ ...settings, currencyName: e.target.value })}
        className="rounded-md border border-border"
       />
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase">Starting Balance</label>
       <Input
        type="number"
        value={settings.startingBalance}
        onChange={(e) => setSettings({ ...settings, startingBalance: Number(e.target.value) })}
        className="rounded-md border border-border"
       />
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase">Daily Base Reward</label>
       <Input
        type="number"
        value={settings.dailyAmount}
        onChange={(e) => setSettings({ ...settings, dailyAmount: Number(e.target.value) })}
        className="rounded-md border border-border"
       />
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase">Work Min Payout</label>
       <Input
        type="number"
        value={settings.workMinAmount}
        onChange={(e) => setSettings({ ...settings, workMinAmount: Number(e.target.value) })}
        className="rounded-md border border-border"
       />
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase">Work Max Payout</label>
       <Input
        type="number"
        value={settings.workMaxAmount}
        onChange={(e) => setSettings({ ...settings, workMaxAmount: Number(e.target.value) })}
        className="rounded-md border border-border"
       />
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase">Min Gambling Bet</label>
       <Input
        type="number"
        value={settings.minBet}
        onChange={(e) => setSettings({ ...settings, minBet: Number(e.target.value) })}
        className="rounded-md border border-border"
       />
      </div>

      <div className="space-y-1">
       <label className="text-xs font-bold uppercase">Max Gambling Bet</label>
       <Input
        type="number"
        value={settings.maxBet}
        onChange={(e) => setSettings({ ...settings, maxBet: Number(e.target.value) })}
        className="rounded-md border border-border"
       />
      </div>
     </div>

     <div className="mt-4">
      <ToggleField
       label="Enable Robbery"
       description="Allow members to attempt robbing peers"
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
     <FormSection title="Create Shop Item" icon={ShoppingBag} description="Add items to guild marketplace with type-adapted effect value forms.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="space-y-1">
        <label className="text-xs font-bold uppercase">Item Name</label>
        <Input
         placeholder="2x XP Booster / Shield"
         value={newItem.name}
         onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
         className="rounded-md border border-border"
        />
       </div>

       <div className="space-y-1">
        <label className="text-xs font-bold uppercase">Price ({settings.currencySymbol})</label>
        <Input
         type="number"
         min={1}
         value={newItem.price}
         onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
         className="rounded-md border border-border"
        />
       </div>

       <div className="space-y-1 md:col-span-2">
        <label className="text-xs font-bold uppercase">Item Description</label>
        <Textarea
         placeholder="Protects you against robbery attempts for 24 hours..."
         value={newItem.description}
         onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
         className="rounded-md border border-border"
         rows={2}
        />
       </div>

       <div className="space-y-1">
        <label className="text-xs font-bold uppercase">Effect Type</label>
        <select
         value={newItem.effectType}
         onChange={(e) => setNewItem({ ...newItem, effectType: e.target.value })}
         className="w-full p-2 bg-background border border-border rounded-md text-sm uppercase"
        >
         <option value="rob_protection">Robbery Protection Shield</option>
         <option value="xp_boost">XP Multiplier Booster</option>
         <option value="role">Assignable Discord Role</option>
         <option value="custom">Custom Perpetual Effect</option>
        </select>
       </div>

       <div className="space-y-1">
        <label className="text-xs font-bold uppercase">Stock Limit (-1 = Unlimited)</label>
        <Input
         type="number"
         value={newItem.stock}
         onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })}
         className="rounded-md border border-border"
        />
       </div>
      </div>

      <div className="p-4 border border-border bg-primary/5 space-y-4 mt-4">
       <h4 className="font-bold text-sm uppercase text-primary border-b border-primary/20 pb-1">Effect Value Fields ({newItem.effectType})
       </h4>

       {newItem.effectType === "rob_protection" && (
        <div className="space-y-1">
         <label className="text-xs font-bold uppercase">Shield Protection Duration (Seconds)</label>
         <Input
          type="number"
          value={newItem.effectDuration}
          onChange={(e) => setNewItem({ ...newItem, effectDuration: Number(e.target.value) })}
          className="rounded-md border border-border"
         />
         <p className="text-xs text-muted-foreground">
          86400s = 24 Hours | 604800s = 7 Days
         </p>
        </div>
       )}

       {newItem.effectType === "xp_boost" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="space-y-1">
          <label className="text-xs font-bold uppercase">XP Multiplier Factor</label>
          <Input
           type="number"
           step="0.5"
           value={newItem.effectMultiplier}
           onChange={(e) => setNewItem({ ...newItem, effectMultiplier: Number(e.target.value) })}
           className="rounded-md border border-border"
          />
         </div>
         <div className="space-y-1">
          <label className="text-xs font-bold uppercase">Booster Duration (Seconds)</label>
          <Input
           type="number"
           value={newItem.effectDuration}
           onChange={(e) => setNewItem({ ...newItem, effectDuration: Number(e.target.value) })}
           className="rounded-md border border-border"
          />
         </div>
        </div>
       )}

       {newItem.effectType === "role" && (
        <div className="space-y-1">
         <label className="text-xs font-bold uppercase">Role Granted Upon Purchase</label>
         <DiscordRolePicker
          roles={roles}
          value={newItem.effectRoleId}
          onChange={(r) => setNewItem({ ...newItem, effectRoleId: r })}
         />
        </div>
       )}

       {newItem.effectType === "custom" && (
        <div className="space-y-1">
         <label className="text-xs font-bold uppercase">Custom Effect Instructions / Metadata</label>
         <Input
          placeholder="e.g. VIP Lounge Access Badge"
          value={newItem.effectNote}
          onChange={(e) => setNewItem({ ...newItem, effectNote: e.target.value })}
          className="rounded-md border border-border"
         />
        </div>
       )}
      </div>

      <Button
       onClick={handleCreateShopItem}
       disabled={isPending}
       className="rounded-md border border-border shadow-sm font-medium text-xs mt-4"
      >
       <Plus className="w-4 h-4 mr-2" />Create Shop Item</Button>
     </FormSection>

     <FormSection title="Guild Marketplace Items" icon={ShoppingBag} description="Configured shop items available for purchase.">
      <div className="space-y-3">
       {initialShopItems.length === 0 ? (
        <p className="text-muted-foreground text-sm uppercase p-4 border border-border">
         No shop items added yet.
        </p>
       ) : (
        initialShopItems.map((item) => (
         <div
          key={item.id}
          className="p-4 border border-border bg-card flex justify-between items-center shadow-sm"
         >
          <div>
           <div className="flex items-center gap-2">
            <span className="font-bold uppercase text-primary">{item.name}</span>
            <span className="text-xs border px-2 py-0.5 border-primary font-bold text-yellow-500">
             {formatNumber(item.price)} {settings.currencySymbol}
            </span>
            <span className="text-xs border px-1 border-secondary uppercase">
             {item.effectType}
            </span>
           </div>
           <p className="text-xs text-muted-foreground mt-1">
            Description: {item.description} | Stock: {item.stock === -1 ? "Unlimited" : item.stock} | Effect: {JSON.stringify(item.effectValue)}
           </p>
          </div>

          <Button
           size="sm"
           variant="destructive"
           onClick={() => startTransition(async () => { await deleteShopItem(guildId, item.id); })}
           className="rounded-md border border-destructive text-xs uppercase"
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
    <FormSection title="User Balances Admin Override" icon={Users} description="View and directly modify member wallet and bank balances.">
     {editingUser && (
      <div className="p-4 border border-border bg-primary/10 mb-4 space-y-4">
       <h4 className="font-bold text-sm uppercase text-primary">
        Modify Balance: USER {editingUser.userId}
       </h4>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
         <label className="text-xs font-bold uppercase">Wallet Balance</label>
         <Input
          type="number"
          value={editingUser.balance}
          onChange={(e) => setEditingUser({ ...editingUser, balance: Number(e.target.value) })}
          className="rounded-md border border-border"
         />
        </div>
        <div className="space-y-1">
         <label className="text-xs font-bold uppercase">Bank Balance</label>
         <Input
          type="number"
          value={editingUser.bankBalance}
          onChange={(e) => setEditingUser({ ...editingUser, bankBalance: Number(e.target.value) })}
          className="rounded-md border border-border"
         />
        </div>
       </div>
       <div className="flex items-center gap-2">
        <Button
         size="sm"
         onClick={handleSaveBalanceOverride}
         disabled={isPending}
         className="rounded-md border border-border text-xs font-medium"
        >
         <Save className="w-3.5 h-3.5 mr-1" />Commit Override</Button>
        <Button
         size="sm"
         variant="outline"
         onClick={() => setEditingUser(null)}
         className="rounded-md border border-border text-xs uppercase"
        >
         Cancel
        </Button>
       </div>
      </div>
     )}

     <div className="flex items-center justify-between mb-4 gap-4">
      <div className="relative flex-1 max-w-sm">
       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
       <Input
        placeholder="Search by User ID..."
        value={balanceSearch}
        onChange={(e) => {
         setBalanceSearch(e.target.value);
         setBalancePage(1);
        }}
        className="pl-9"
       />
      </div>
     </div>

     <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left border-collapse text-sm">
       <thead className="bg-primary/10 border-b border-border text-xs uppercase">
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
          <td colSpan={5} className="p-6 text-center text-muted-foreground uppercase">
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
           <td className="p-3 text-muted-foreground">{formatNumber(b.totalEarned)}</td>
           <td className="p-3">
            <Button
             size="sm"
             variant="outline"
             onClick={() =>
              setEditingUser({
               userId: b.userId,
               balance: b.balance,
               bankBalance: b.bankBalance,
              })
             }
             className="text-xs"
            >
             <Edit2 className="w-3.5 h-3.5 mr-1" />
             Override
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
       <span className="text-sm font-medium text-muted-foreground">
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
   )}

   {/* Tab 4: Transaction History */}
   {activeTab === "transactions" && (
    <FormSection title="Transaction Audit Log" icon={History} description="Real-time record of all economy operations.">
     <div className="flex items-center justify-between mb-4 gap-4">
      <div className="relative flex-1 max-w-sm">
       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
       <Input
        placeholder="Search transactions..."
        value={txSearch}
        onChange={(e) => {
         setTxSearch(e.target.value);
         setTxPage(1);
        }}
        className="pl-9"
       />
      </div>
     </div>

     <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left border-collapse text-sm">
       <thead className="bg-primary/10 border-b border-border text-xs uppercase">
        <tr>
         <th className="p-3">Type</th>
         <th className="p-3">User ID</th>
         <th className="p-3">Amount</th>
         <th className="p-3">Description</th>
         <th className="p-3">Date</th>
        </tr>
       </thead>
       <tbody className="divide-y divide-primary/20">
        {currentTransactions.length === 0 ? (
         <tr>
          <td colSpan={5} className="p-6 text-center text-muted-foreground uppercase">
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
           <td className="p-3 text-xs text-muted-foreground">
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
       <span className="text-sm font-medium text-muted-foreground">
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
 );
}
