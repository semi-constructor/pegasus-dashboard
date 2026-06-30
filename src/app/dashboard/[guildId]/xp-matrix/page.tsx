import { getUserXpList, getXpRewards, createXpReward, deleteXpReward, triggerXpReset, getXpSettings, updateXpSettings, getGuildChannels, getGuildRoles, getGuildMembers } from '@/app/actions';
import { Award, Plus, Trash2, RefreshCw, Settings2, Save, Trophy } from 'lucide-react';
import MultiSelect from '@/components/MultiSelect';
import SaveButton from '@/components/SaveButton';
import { formatNumber } from '@/lib/utils';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';

export default async function XpMatrixPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const xpList = await getUserXpList(guildId);
  const xpRewards = await getXpRewards(guildId);
  const xpSettings = await getXpSettings(guildId);
  const channels = await getGuildChannels(guildId);
  const roles = await getGuildRoles(guildId);
  const members = await getGuildMembers(guildId);

  const membersMap = new Map(members.map(m => [m.id, m.username]));

  const channelOptions = channels
    .filter(c => c.type !== 'category')
    .map(c => ({ value: c.id, label: `${c.type === 'voice' ? '🔊 ' : '#'}${c.name}` }));
  const roleOptions = roles.map(r => ({ value: r.id, label: `@${r.name}` }));

  const parseJsonArray = (str?: string | null) => {
    if (!str) return [];
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  async function handleCreateXpReward(formData: FormData) {
    'use server';
    await createXpReward(guildId, formData);
  }

  async function handleDeleteXpReward(formData: FormData) {
    'use server';
    const levelStr = formData.get('level') as string;
    if (levelStr) {
      await deleteXpReward(guildId, parseInt(levelStr, 10), formData);
    }
  }

  async function handleUpdateXpSettings(formData: FormData) {
    'use server';
    await updateXpSettings(guildId, formData);
  }

  async function handleResetXp(formData: FormData) {
    'use server';
    await triggerXpReset(guildId, formData);
  }

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-16">
      <StaggerContainer>
      {/* Header */}
      <StaggerItem>
      <div className="border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 border border-white/5 px-3 py-1 bg-white/[0.01] mb-4 text-xs font-mono tracking-wide text-neutral-400">
            <Award className="w-3.5 h-3.5 text-[#5E5CE6]" />
            <span>XP Leveling & Progression Engine</span>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">XP Matrix & Leaderboards</h1>
          <p className="text-sm text-neutral-400 font-mono tracking-wide">
            Configure automated role rewards, adjust XP channel blacklists, and inspect active leaderboards for Guild ({guildId}).
          </p>
        </div>
        <form action={handleResetXp}>
          <SaveButton
            label="Reset Guild XP Leaderboard"
            savingLabel="Resetting..."
            savedLabel="Leaderboard Reset!"
            className="px-6 py-3 border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-black transition-all rounded-none"
            icon="alert"
            variant="danger"
          />
        </form>
      </div>
      </StaggerItem>

      {/* Section 1: XP General Settings CRUD */}
      <StaggerItem>
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Settings2 className="w-5 h-5 text-[#5E5CE6]" />
          <div>
            <h2 className="text-xl font-light text-white tracking-wide">XP Progression Parameters & Filters</h2>
            <p className="text-neutral-500 font-mono text-xs mt-1">Fine-tune reward stacking, channel whitelisting, and double XP zones.</p>
          </div>
        </div>
        <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 rounded-none">
          <form action={handleUpdateXpSettings} className="space-y-8 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Enable Level-Up Role Rewards</label>
                <select
                  name="levelUpRewardsEnabled"
                  defaultValue={xpSettings?.levelUpRewardsEnabled ? 'true' : 'false'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Enabled (Auto-assign on Level Up)</option>
                  <option value="false">Disabled (Tracking Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Stack Role Rewards</label>
                <select
                  name="stackRoleRewards"
                  defaultValue={xpSettings?.stackRoleRewards ? 'true' : 'false'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Stack Roles (Keep previous tier roles)</option>
                  <option value="false">Replace Roles (Remove previous tier roles)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Ignored Channels</label>
                <MultiSelect
                  name="ignoredChannels"
                  options={channelOptions}
                  initialSelected={parseJsonArray(xpSettings?.ignoredChannels)}
                  placeholder="Select channels to ignore..."
                  typeLabel="channel"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Ignored Roles</label>
                <MultiSelect
                  name="ignoredRoles"
                  options={roleOptions}
                  initialSelected={parseJsonArray(xpSettings?.ignoredRoles)}
                  placeholder="Select roles to ignore..."
                  typeLabel="role"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">No XP Channels (Muted Experience)</label>
                <MultiSelect
                  name="noXpChannels"
                  options={channelOptions}
                  initialSelected={parseJsonArray(xpSettings?.noXpChannels)}
                  placeholder="Select muted channels..."
                  typeLabel="channel"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Double XP Channels (Booster Zones)</label>
                <MultiSelect
                  name="doubleXpChannels"
                  options={channelOptions}
                  initialSelected={parseJsonArray(xpSettings?.doubleXpChannels)}
                  placeholder="Select booster channels..."
                  typeLabel="channel"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-end">
              <SaveButton
                label="Save XP Parameters"
                savingLabel="Saving XP Parameters..."
                savedLabel="XP Parameters Saved!"
                className="px-8"
                icon="save"
              />
            </div>
          </form>
        </div>
      </div>
      </StaggerItem>

      {/* Section 2: XP Rewards CRUD */}
      <StaggerItem>
      <div className="space-y-6 pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Award className="w-5 h-5 text-[#5E5CE6]" />
          <div>
            <h2 className="text-xl font-light text-white tracking-wide">Configure XP Role Rewards</h2>
            <p className="text-neutral-500 font-mono text-xs mt-1">Automatically grant prestigious Discord roles upon reaching level thresholds.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 rounded-none">
            <form action={handleCreateXpReward} className="space-y-6 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-2">Target Level Threshold</label>
                  <input
                    type="number"
                    name="level"
                    defaultValue={10}
                    required
                    placeholder="e.g. 10"
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-2">Reward Role ID</label>
                  <select
                    name="roleId"
                    required
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                  >
                    <option value="">-- Select Role --</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>
                        @{r.name} ({r.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <SaveButton
                label="Register Role Reward"
                savingLabel="Registering Reward..."
                savedLabel="Reward Registered!"
                className="w-full"
                icon="plus"
              />
            </form>
          </div>

          {/* XP Rewards Table */}
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md rounded-none overflow-hidden">
            <div className="p-4 border-b border-white/5 text-xs font-mono text-neutral-400 bg-white/[0.01]">
              {"// Active Tier Perks"}
            </div>
            {xpRewards.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/5 text-neutral-500 bg-white/[0.01]">
                    <th className="py-3 px-4 font-medium">LEVEL THRESHOLD</th>
                    <th className="py-3 px-4 font-medium">ASSIGNED ROLE ID</th>
                    <th className="py-3 px-4 font-medium text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300">
                  {xpRewards.map((reward) => (
                    <tr key={reward.level} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 px-4 text-emerald-400 font-medium">Level {reward.level}</td>
                      <td className="py-3 px-4 text-white font-mono">{reward.roleId}</td>
                      <td className="py-3 px-4 text-right">
                        <form action={handleDeleteXpReward} className="inline">
                          <input type="hidden" name="level" value={reward.level} />
                          <button
                            type="submit"
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                            title="Remove Reward"
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
                No XP role rewards registered yet.
              </div>
            )}
          </div>
        </div>
      </div>
      </StaggerItem>

      {/* Section 3: User XP Leaderboard */}
      <StaggerItem>
      <div className="space-y-6 pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Trophy className="w-5 h-5 text-[#5E5CE6]" />
          <h2 className="text-xl font-light text-white tracking-wide">Guild XP Progression Leaderboard</h2>
        </div>
        <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md rounded-none overflow-hidden">
          {xpList.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-neutral-500 bg-white/[0.01]">
                  <th className="py-4 px-6 font-medium">USER</th>
                  <th className="py-4 px-6 font-medium text-right">XP ACCUMULATED</th>
                  <th className="py-4 px-6 font-medium text-right">CURRENT LEVEL</th>
                  <th className="py-4 px-6 font-medium text-right">PRESTIGE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {xpList.map((userXp) => (
                  <tr key={userXp.userId} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-6 font-medium text-white">
                      {membersMap.get(userXp.userId) || `User (${userXp.userId})`}
                    </td>
                    <td className="py-4 px-6 text-right text-emerald-400 font-medium" title={userXp.xp.toLocaleString()}>
                      {formatNumber(userXp.xp)}
                    </td>
                    <td className="py-4 px-6 text-right text-amber-400 font-medium">Level {userXp.level}</td>
                    <td className="py-4 px-6 text-right text-[#5E5CE6] font-medium">Prestige {userXp.prestigeLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-xs font-mono text-neutral-500">
              No XP accumulated by users in this guild yet.
            </div>
          )}
        </div>
      </div>
      </StaggerItem>
      </StaggerContainer>
    </main>
  );
}
