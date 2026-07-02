import { getEconomyBalances, updateUserBalance, getShopItems, createShopItem, updateShopItem, deleteShopItem, getEconomyTransactions, triggerEconomyReset, getEconomySettings, updateEconomySettings, getGuildMembers } from '@/app/actions';
import { Coins, Plus, Trash2, RefreshCw, Wallet, Store, History, Settings2, Save } from 'lucide-react';
import SaveButton from '@/components/SaveButton';
import { formatNumber } from '@/lib/utils';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';
import { SectionTabs } from '@/components/SectionTabs';

export default async function EconomyPage({
  params,
  searchParams,
}: {
  params: Promise<{ guildId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { guildId } = await params;
  const sp = await searchParams;
  const currentTab = (sp.tab as string) || 'settings';
  const balances = await getEconomyBalances(guildId);
  const shopItems = await getShopItems(guildId);
  const transactions = await getEconomyTransactions(guildId);
  const ecoSettings = await getEconomySettings(guildId);
  const members = await getGuildMembers(guildId);

  const membersMap = new Map(members.map(m => [m.id, m.username || m.displayName]));

  async function handleUpdateBalance(formData: FormData) {
    'use server';
    const userId = formData.get('userId') as string;
    const balance = parseInt(formData.get('balance') as string, 10);
    const bankBalance = parseInt(formData.get('bankBalance') as string, 10);
    if (userId) {
      await updateUserBalance(guildId, userId, isNaN(balance) ? 0 : balance, isNaN(bankBalance) ? 0 : bankBalance);
    }
  }

  async function handleUpdateShopItem(formData: FormData) {
    'use server';
    const itemId = formData.get('itemId') as string;
    if (itemId) {
      await updateShopItem(guildId, itemId, formData);
    }
  }

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-16">
      <StaggerContainer>
      {/* Header */}
      <StaggerItem>
      <div className="border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 border border-white/5 px-3 py-1 bg-white/[0.01] mb-4 text-xs font-mono tracking-wide text-neutral-400">
            <Coins className="w-3.5 h-3.5 text-[#5E5CE6]" />
            <span>Economy Engine & Marketplace</span>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">Economy Management</h1>
          <p className="text-sm text-neutral-400 font-mono tracking-wide">
            Manage user balances, configure custom marketplace items, tune economic parameters, and inspect transaction logs for Guild ({guildId}).
          </p>
        </div>
        <form action={triggerEconomyReset.bind(null, guildId)}>
          <button
            type="submit"
            className="flex items-center gap-2 border border-red-500/30 bg-red-500/10 px-6 py-3 text-xs font-mono text-red-400 hover:bg-red-500 hover:text-black transition-all rounded-none"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Server Economy</span>
          </button>
        </form>
      </div>
      </StaggerItem>

      {/* Navigation Tabs */}
      <StaggerItem>
        <SectionTabs 
          currentTab={currentTab}
          tabs={[
            { id: 'settings', label: 'Economy Settings', icon: <Settings2 className="w-4 h-4" /> },
            { id: 'balances', label: 'User Balances', icon: <Wallet className="w-4 h-4" /> },
            { id: 'shop', label: 'Shop Items', icon: <Store className="w-4 h-4" /> },
            { id: 'logs', label: 'Transaction Logs', icon: <History className="w-4 h-4" /> }
          ]} 
        />
      </StaggerItem>
      </StaggerContainer>

      {/* Conditionally rendered tab content re-animates on switch */}
      <StaggerContainer key={currentTab}>
      {/* Section 1: Economy Global Settings CRUD */}
      {currentTab === 'settings' && (
      <StaggerItem>
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Settings2 className="w-5 h-5 text-[#5E5CE6]" />
          <div>
            <h2 className="text-xl font-light text-white tracking-wide">Economic Parameters & Tuning</h2>
            <p className="text-neutral-500 font-mono text-xs mt-1">Configure inflation rates, daily stipends, robbery chances, and job payouts.</p>
          </div>
        </div>
        <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 rounded-none">
          <form action={updateEconomySettings.bind(null, guildId)} className="space-y-8 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Currency Symbol</label>
                <input
                  type="text"
                  name="currencySymbol"
                  defaultValue={ecoSettings.currencySymbol || '🪙'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Currency Name</label>
                <input
                  type="text"
                  name="currencyName"
                  defaultValue={ecoSettings.currencyName || 'coins'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Starting Balance</label>
                <input
                  type="number"
                  name="startingBalance"
                  defaultValue={ecoSettings.startingBalance || 100}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Daily Amount</label>
                <input
                  type="number"
                  name="dailyAmount"
                  defaultValue={ecoSettings.dailyAmount || 100}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Daily Streak Bonus</label>
                <select
                  name="dailyStreak"
                  defaultValue={ecoSettings.dailyStreak ? 'true' : 'false'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Streak Bonus Amount</label>
                <input
                  type="number"
                  name="dailyStreakBonus"
                  defaultValue={ecoSettings.dailyStreakBonus || 10}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Work Min Payout</label>
                <input
                  type="number"
                  name="workMinAmount"
                  defaultValue={ecoSettings.workMinAmount || 50}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Work Max Payout</label>
                <input
                  type="number"
                  name="workMaxAmount"
                  defaultValue={ecoSettings.workMaxAmount || 200}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Work Cooldown (sec)</label>
                <input
                  type="number"
                  name="workCooldown"
                  defaultValue={ecoSettings.workCooldown || 3600}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Enable Robbery</label>
                <select
                  name="robEnabled"
                  defaultValue={ecoSettings.robEnabled ? 'true' : 'false'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Enabled (PvP Active)</option>
                  <option value="false">Disabled (Safe Mode)</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Rob Min Amount</label>
                <input
                  type="number"
                  name="robMinAmount"
                  defaultValue={ecoSettings.robMinAmount || 100}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Rob Success Rate (%)</label>
                <input
                  type="number"
                  name="robSuccessRate"
                  defaultValue={ecoSettings.robSuccessRate || 50}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Rob Cooldown (sec)</label>
                <input
                  type="number"
                  name="robCooldown"
                  defaultValue={ecoSettings.robCooldown || 86400}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Rob Protection Cost</label>
                <input
                  type="number"
                  name="robProtectionCost"
                  defaultValue={ecoSettings.robProtectionCost || 1000}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Protection Duration</label>
                <input
                  type="number"
                  name="robProtectionDuration"
                  defaultValue={ecoSettings.robProtectionDuration || 86400}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Max Bet Amount</label>
                <input
                  type="number"
                  name="maxBet"
                  defaultValue={ecoSettings.maxBet || 10000}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Min Bet Amount</label>
                <input
                  type="number"
                  name="minBet"
                  defaultValue={ecoSettings.minBet || 10}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-end">
              <SaveButton
                label="Save Economic Parameters"
                savingLabel="Saving Parameters..."
                savedLabel="Parameters Saved!"
                className="px-8"
                icon="save"
              />
            </div>
          </form>
        </div>
      </div>
      </StaggerItem>
      )}

      {/* Section 2: Update User Balance CRUD */}
      {currentTab === 'balances' && (
      <StaggerItem>
      <div className="space-y-6 max-w-5xl">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Wallet className="w-5 h-5 text-[#5E5CE6]" />
            <h2 className="text-xl font-light text-white tracking-wide">Update User Balance</h2>
          </div>
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 rounded-none">
            <form action={handleUpdateBalance} className="space-y-6 font-mono text-xs">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Select Target User / Member</label>
                <select
                  name="userId"
                  required
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="">-- Select Member from Discord / DB --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.username || m.displayName} ({m.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-2">Wallet Balance</label>
                  <input
                    type="number"
                    name="balance"
                    defaultValue={1000}
                    required
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-2">Bank Balance</label>
                  <input
                    type="number"
                    name="bankBalance"
                    defaultValue={5000}
                    required
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <SaveButton
                label="Save User Balance"
                savingLabel="Saving Balance..."
                savedLabel="Balance Saved!"
                className="w-full"
                icon="save"
              />
            </form>
          </div>

          {/* User Balances List */}
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md rounded-none overflow-hidden">
            <div className="p-4 border-b border-white/5 text-xs font-mono text-neutral-400 bg-white/[0.01]">
              // Current Active Balances (Database)
            </div>
            {balances.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/5 text-neutral-500 bg-white/[0.01]">
                    <th className="py-3 px-4 font-medium">USER</th>
                    <th className="py-3 px-4 font-medium text-right">WALLET</th>
                    <th className="py-3 px-4 font-medium text-right">BANK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300">
                  {balances.map((b) => (
                    <tr key={b.userId} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 px-4 text-white font-medium">
                        {membersMap.get(b.userId) || `User (${b.userId})`}
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-400" title={b.balance.toLocaleString()}>
                        {formatNumber(b.balance)}
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-500" title={b.bankBalance.toLocaleString()}>
                        {formatNumber(b.bankBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-xs font-mono text-neutral-500">
                No user balances established in this guild yet.
              </div>
            )}
          </div>
        </div>
      </StaggerItem>
      )}

      {/* Section 3: Manage Shop Items CRUD */}
      {currentTab === 'shop' && (
      <StaggerItem>
      <div className="space-y-6 max-w-5xl">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Store className="w-5 h-5 text-[#5E5CE6]" />
            <h2 className="text-xl font-light text-white tracking-wide">Marketplace Inventory</h2>
          </div>
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 rounded-none">
            <form action={createShopItem.bind(null, guildId)} className="space-y-6 font-mono text-xs">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Item Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. VIP Booster Pass"
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  placeholder="Grants exclusive voice channel privileges and 2x XP boost."
                  className="w-full bg-black border border-white/10 p-4 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors resize-y"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={5000}
                    required
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-2">Type</label>
                  <select
                    name="type"
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                  >
                    <option value="booster">Booster</option>
                    <option value="protection">Protection</option>
                    <option value="role">Role Pass</option>
                    <option value="custom">Custom Perk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-2">Initial Stock</label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue={-1}
                    required
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <SaveButton
                label="Publish to Marketplace"
                savingLabel="Publishing Item..."
                savedLabel="Item Published!"
                className="w-full"
                icon="plus"
              />
            </form>
          </div>

          {/* Shop Items List */}
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md rounded-none overflow-hidden">
            <div className="p-4 border-b border-white/5 text-xs font-mono text-neutral-400 bg-white/[0.01]">
              // Active Marketplace Listing
            </div>
            {shopItems.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/5 text-neutral-500 bg-white/[0.01]">
                    <th className="py-3 px-4 font-medium">ITEM NAME</th>
                    <th className="py-3 px-4 font-medium text-right">PRICE</th>
                    <th className="py-3 px-4 font-medium text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300">
                  {shopItems.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{item.name}</div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-xs">{item.description}</div>
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-400 font-medium" title={item.price.toLocaleString()}>
                        {formatNumber(item.price)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <form action={deleteShopItem.bind(null, guildId, item.id)} className="inline">
                          <input type="hidden" name="itemId" value={item.id} />
                          <button
                            type="submit"
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-xs font-mono text-neutral-500">
                Marketplace inventory is currently empty.
              </div>
            )}
          </div>

          {/* Edit Shop Item Form */}
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 rounded-none space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-lg font-light text-white tracking-wide">// Edit Existing Shop Item</h3>
              <p className="text-neutral-500 text-xs mt-1">Select an active marketplace item to modify its parameters dynamically.</p>
            </div>
            {shopItems.length > 0 ? (
              <form action={handleUpdateShopItem} className="space-y-6 font-mono text-xs">
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-2">Select Item to Edit</label>
                  <select
                    name="itemId"
                    required
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                  >
                    <option value="">-- Select Shop Item --</option>
                    {shopItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} (🪙 {item.price})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-2">Updated Item Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. VIP Booster Pass (Updated)"
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-2">Updated Description</label>
                  <textarea
                    name="description"
                    required
                    rows={2}
                    placeholder="Grants exclusive privileges and enhanced perks."
                    className="w-full bg-black border border-white/10 p-4 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors resize-y"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-2">Updated Price</label>
                    <input
                      type="number"
                      name="price"
                      defaultValue={5000}
                      required
                      className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-2">Type</label>
                    <select
                      name="type"
                      className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                    >
                      <option value="booster">Booster</option>
                      <option value="protection">Protection</option>
                      <option value="role">Role Pass</option>
                      <option value="custom">Custom Perk</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 uppercase tracking-wider mb-2">Updated Stock</label>
                    <input
                      type="number"
                      name="stock"
                      defaultValue={-1}
                      required
                      className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <SaveButton
                  label="Update Marketplace Item"
                  savingLabel="Updating Item..."
                  savedLabel="Item Updated!"
                  className="w-full"
                  icon="save"
                />
              </form>
            ) : (
              <div className="p-8 text-center text-xs font-mono text-neutral-500">
                No active items available to edit.
              </div>
            )}
          </div>
        </div>
      </StaggerItem>
      )}

      {/* Section 4: Transaction Logs */}
      {currentTab === 'logs' && (
      <StaggerItem>
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <History className="w-5 h-5 text-[#5E5CE6]" />
          <h2 className="text-xl font-light text-white tracking-wide">Recent Economy Transactions</h2>
        </div>
        <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md rounded-none overflow-hidden">
          {transactions.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-neutral-500 bg-white/[0.01]">
                  <th className="py-4 px-6 font-medium">TYPE</th>
                  <th className="py-4 px-6 font-medium">USER</th>
                  <th className="py-4 px-6 font-medium text-right">AMOUNT</th>
                  <th className="py-4 px-6 font-medium">DESCRIPTION</th>
                  <th className="py-4 px-6 font-medium text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-6 font-medium text-white uppercase">{tx.type}</td>
                    <td className="py-4 px-6 text-neutral-400">
                      {membersMap.get(tx.userId) || `User (${tx.userId})`}
                    </td>
                    <td className="py-4 px-6 text-right text-emerald-400 font-medium" title={tx.amount.toLocaleString()}>
                      {formatNumber(tx.amount)}
                    </td>
                    <td className="py-4 px-6 text-neutral-400">{tx.description || 'N/A'}</td>
                    <td className="py-4 px-6 text-right text-neutral-500">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-xs font-mono text-neutral-500">
              No recent economy transactions logged in the database.
            </div>
          )}
        </div>
      </div>
      </StaggerItem>
      )}
      </StaggerContainer>
    </main>
  );
}
