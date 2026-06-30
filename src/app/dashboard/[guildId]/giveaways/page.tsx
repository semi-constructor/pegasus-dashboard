import { getGuildChannels } from '@/app/actions';
import * as actions from '@/app/actions';
import { revalidatePath } from 'next/cache';
import { Gift, Trash2, RefreshCw, CheckCircle, Clock, Plus, Hash, Trophy, Calendar, Users, FileText } from 'lucide-react';
import SaveButton from '@/components/SaveButton';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';

// Helper to safely access getGiveaways or use a mock fallback
async function fetchGiveaways(guildId: string) {
  if ('getGiveaways' in actions && typeof (actions as any).getGiveaways === 'function') {
    return await (actions as any).getGiveaways(guildId);
  }
  // Mock fallback for active giveaways
  return [
    {
      id: 'G-7789',
      prize: '1 Month Discord Nitro',
      description: 'Exclusive community giveaway for active members!',
      winnerCount: 1,
      endTime: new Date(Date.now() + 86400000).toISOString(),
      channelId: '77766655544433322',
      status: 'ACTIVE'
    },
    {
      id: 'G-3342',
      prize: 'VIP Champion Role & 10,000 Coins',
      description: 'Weekly economy booster pack giveaway.',
      winnerCount: 3,
      endTime: new Date(Date.now() + 172800000).toISOString(),
      channelId: '88877766655544433',
      status: 'ACTIVE'
    }
  ];
}

export default async function GiveawaysPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const channels = await getGuildChannels(guildId);
  const giveaways = await fetchGiveaways(guildId);

  const textChannels = channels.filter(c => c.type === 'text');

  async function handleCreateGiveaway(formData: FormData) {
    'use server';
    if ('createGiveaway' in actions && typeof (actions as any).createGiveaway === 'function') {
      await (actions as any).createGiveaway(guildId, formData);
    }
    revalidatePath(`/dashboard/${guildId}/giveaways`);
  }

  async function handleEndGiveaway(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    if ('endGiveaway' in actions && typeof (actions as any).endGiveaway === 'function') {
      await (actions as any).endGiveaway(guildId, id, formData);
    }
    revalidatePath(`/dashboard/${guildId}/giveaways`);
  }

  async function handleRerollGiveaway(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    if ('rerollGiveaway' in actions && typeof (actions as any).rerollGiveaway === 'function') {
      await (actions as any).rerollGiveaway(guildId, id, formData);
    }
    revalidatePath(`/dashboard/${guildId}/giveaways`);
  }

  async function handleDeleteGiveaway(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    if ('deleteGiveaway' in actions && typeof (actions as any).deleteGiveaway === 'function') {
      await (actions as any).deleteGiveaway(guildId, id, formData);
    }
    revalidatePath(`/dashboard/${guildId}/giveaways`);
  }

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12">
      <StaggerContainer>
      {/* Header */}
      <StaggerItem>
      <div className="border-b border-white/5 pb-8">
        <div className="inline-flex items-center gap-2 border border-white/5 px-3 py-1 bg-white/[0.01] mb-4 text-xs font-mono tracking-wide text-neutral-400">
          <Gift className="w-3.5 h-3.5 text-[#5E5CE6]" />
          <span>Community Engagement & Rewards</span>
        </div>
        <h1 className="text-4xl font-light tracking-tight text-white mb-2">Giveaways Management</h1>
        <p className="text-sm text-neutral-400 font-mono tracking-wide">
          Deploy interactive community giveaways, set prize pools, configure end conditions, and manage active draws for Guild ({guildId}).
        </p>
      </div>
      </StaggerItem>

      {/* Interactive Form to Create New Giveaway */}
      <StaggerItem>
      <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 rounded-none max-w-5xl relative overflow-hidden group">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-8">
          <Plus className="w-5 h-5 text-[#5E5CE6]" />
          <div>
            <h2 className="text-lg font-normal text-white tracking-wide">// Initialize New Giveaway</h2>
            <p className="text-neutral-500 font-mono text-xs mt-1">Deploy a new giveaway instance into a designated guild channel.</p>
          </div>
        </div>

        <form action={handleCreateGiveaway} className="space-y-8 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-2">
                <span className="inline-flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-[#5E5CE6]" /> Prize Title
                </span>
              </label>
              <input
                type="text"
                name="prize"
                required
                placeholder="e.g. 1 Month Discord Nitro or 5,000 Coins"
                className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-2">
                <span className="inline-flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-[#5E5CE6]" /> Target Discord Channel
                </span>
              </label>
              <select
                name="channelId"
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
              >
                <option value="">-- Select Destination Text Channel --</option>
                {textChannels.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.name} ({c.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 uppercase tracking-wider mb-2">
              <span className="inline-flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#5E5CE6]" /> Giveaway Description
              </span>
            </label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Provide rules, sponsor info, or exciting details about this giveaway..."
              className="w-full bg-black border border-white/10 p-4 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-2">
                <span className="inline-flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#5E5CE6]" /> Number of Winners
                </span>
              </label>
              <input
                type="number"
                name="winnerCount"
                min="1"
                max="50"
                defaultValue="1"
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-2">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#5E5CE6]" /> End Time (Duration / Date)
                </span>
              </label>
              <input
                type="datetime-local"
                name="endTime"
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center justify-end">
            <SaveButton
              label="Launch Giveaway"
              savingLabel="Launching Giveaway..."
              savedLabel="Giveaway Launched!"
              className="px-10"
              icon="plus"
            />
          </div>
        </form>
      </div>
      </StaggerItem>

      {/* Active Giveaways Display */}
      <StaggerItem>
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#5E5CE6]" />
            <div>
              <h2 className="text-lg font-normal text-white tracking-wide">// Active Giveaways Registry</h2>
              <p className="text-neutral-500 font-mono text-xs mt-1">Live overview of ongoing draws and past archives.</p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 border border-white/10 bg-white/[0.01] text-[#5E5CE6]">
            {giveaways.length} Active Draws
          </span>
        </div>

        {giveaways.length === 0 ? (
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-12 text-center rounded-none font-mono text-xs text-neutral-500">
            No active giveaways currently running in this guild. Use the configuration panel above to deploy one.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {giveaways.map((giveaway: any) => {
              const targetChannel = channels.find((c: any) => c.id === giveaway.channelId);
              return (
                <div
                  key={giveaway.id}
                  className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-6 rounded-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-white/10 transition-all"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-medium text-white tracking-wide flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-[#5E5CE6]" /> {giveaway.prize}
                      </span>
                      <span className="px-2 py-0.5 border border-[#5E5CE6]/30 bg-[#5E5CE6]/10 text-[#5E5CE6] text-[10px] font-mono uppercase tracking-wider">
                        {giveaway.status || 'ACTIVE'}
                      </span>
                      <span className="text-neutral-400 font-mono text-xs flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-neutral-500" /> {giveaway.winnerCount} {giveaway.winnerCount === 1 ? 'Winner' : 'Winners'}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 font-mono line-clamp-2">
                      {giveaway.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-500 flex-wrap pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-[#5E5CE6]" /> {targetChannel ? `#${targetChannel.name}` : `Channel: ${giveaway.channelId}`}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#5E5CE6]" /> Ends: {new Date(giveaway.endTime).toLocaleDateString()} {new Date(giveaway.endTime).toLocaleTimeString()}
                      </span>
                      <span>•</span>
                      <span>ID: {giveaway.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t border-white/5 md:border-none pt-4 md:pt-0">
                    <form action={handleEndGiveaway}>
                      <input type="hidden" name="id" value={giveaway.id} />
                      <button
                        type="submit"
                        className="flex items-center gap-2 border border-white/10 bg-white/[0.02] hover:bg-[#5E5CE6] hover:border-[#5E5CE6] hover:text-black text-white px-4 py-2 text-xs font-mono font-medium uppercase tracking-wider transition-all rounded-none"
                        title="Early End Giveaway"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>End</span>
                      </button>
                    </form>

                    <form action={handleRerollGiveaway}>
                      <input type="hidden" name="id" value={giveaway.id} />
                      <button
                        type="submit"
                        className="flex items-center gap-2 border border-white/10 bg-white/[0.02] hover:bg-[#5E5CE6] hover:border-[#5E5CE6] hover:text-black text-white px-4 py-2 text-xs font-mono font-medium uppercase tracking-wider transition-all rounded-none"
                        title="Reroll Winners"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reroll</span>
                      </button>
                    </form>

                    <form action={handleDeleteGiveaway}>
                      <input type="hidden" name="id" value={giveaway.id} />
                      <button
                        type="submit"
                        className="flex items-center gap-2 border border-white/10 bg-white/[0.02] hover:bg-red-600 hover:border-red-600 hover:text-white text-neutral-300 px-4 py-2 text-xs font-mono font-medium uppercase tracking-wider transition-all rounded-none"
                        title="Delete Giveaway"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </StaggerItem>
      </StaggerContainer>
    </main>
  );
}
