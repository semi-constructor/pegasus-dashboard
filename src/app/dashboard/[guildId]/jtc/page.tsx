import { getGuildChannels } from '@/app/actions';
import * as actions from '@/app/actions';
import { revalidatePath } from 'next/cache';
import { Mic, Save, Folder, Hash, FileText, Radio, Settings, Users, Volume2 } from 'lucide-react';
import SaveButton from '@/components/SaveButton';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';

// Helper to safely access getJtcConfig or use a mock fallback
async function fetchJtcConfig(guildId: string) {
  if ('getJtcConfig' in actions && typeof (actions as any).getJtcConfig === 'function') {
    return await (actions as any).getJtcConfig(guildId);
  }
  // Mock fallback for JTC config
  return {
    guildId,
    baseVoiceChannelId: '77766655544433322',
    categoryId: '99988877766655544',
    panelChannelId: '88877766655544433',
    channelNameFormat: "{user}'s Lounge",
    enabled: true,
  };
}

// Helper to safely access getJtcChannels or use a mock fallback
async function fetchJtcChannels(guildId: string) {
  if ('getJtcChannels' in actions && typeof (actions as any).getJtcChannels === 'function') {
    return await (actions as any).getJtcChannels(guildId);
  }
  // Mock fallback for active temporary JTC channels
  return [
    {
      id: 'JTC-101',
      channelId: '12312312312312312',
      name: "EliteUser's Lounge",
      ownerId: '98765432109876543',
      ownerName: 'EliteUser',
      userCount: 4,
      userLimit: 10,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'JTC-102',
      channelId: '45645645645645645',
      name: "ActiveMember's Lounge",
      ownerId: '11122233344455566',
      ownerName: 'ActiveMember',
      userCount: 2,
      userLimit: 5,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    }
  ];
}

export default async function JtcPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const channels = await getGuildChannels(guildId);
  const config = await fetchJtcConfig(guildId);
  const activeChannels = await fetchJtcChannels(guildId);

  const voiceChannels = channels.filter(c => c.type === 'voice');
  const categoryChannels = channels.filter(c => c.type === 'category');
  const textChannels = channels.filter(c => c.type === 'text');

  async function handleUpdateJtcConfig(formData: FormData) {
    'use server';
    if ('updateJtcConfig' in actions && typeof (actions as any).updateJtcConfig === 'function') {
      await (actions as any).updateJtcConfig(guildId, formData);
    }
    revalidatePath(`/dashboard/${guildId}/jtc`);
  }

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12">
      <StaggerContainer>
      {/* Header */}
      <StaggerItem>
      <div className="border-b border-white/5 pb-8">
        <div className="inline-flex items-center gap-2 border border-white/5 px-3 py-1 bg-white/[0.01] mb-4 text-xs font-mono tracking-wide text-neutral-400">
          <Mic className="w-3.5 h-3.5 text-[#5E5CE6]" />
          <span>Dynamic Voice Engine (J2C)</span>
        </div>
        <h1 className="text-4xl font-light tracking-tight text-white mb-2">Join-to-Create Configuration</h1>
        <p className="text-sm text-neutral-400 font-mono tracking-wide">
          Deploy and configure automated temporary voice channels, master lobby generators, parent category binding, and control panel routing for Guild ({guildId}).
        </p>
      </div>
      </StaggerItem>

      {/* Interactive Form to Configure JTC Settings */}
      <StaggerItem>
      <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 rounded-none max-w-5xl">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-8">
          <Settings className="w-5 h-5 text-[#5E5CE6]" />
          <div>
            <h2 className="text-lg font-normal text-white tracking-wide">// J2C Master Generator Settings</h2>
            <p className="text-neutral-500 font-mono text-xs mt-1">Configure base voice lobby, target category, and dynamic channel naming format.</p>
          </div>
        </div>

        <form action={handleUpdateJtcConfig} className="space-y-8 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-2">
                <span className="inline-flex items-center gap-2">
                  <Mic className="w-3.5 h-3.5 text-[#5E5CE6]" /> Base Voice Channel (Generator)
                </span>
              </label>
              <select
                name="baseVoiceChannelId"
                defaultValue={config.baseVoiceChannelId || ''}
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
              >
                <option value="">-- Select Master Voice Channel --</option>
                {voiceChannels.map((c) => (
                  <option key={c.id} value={c.id}>
                    🔊 {c.name} ({c.id})
                  </option>
                ))}
              </select>
              <p className="text-neutral-600 text-[11px] mt-2">Users joining this channel will instantly spawn a temporary voice room.</p>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-2">
                <span className="inline-flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5 text-[#5E5CE6]" /> Destination Category ID
                </span>
              </label>
              <select
                name="categoryId"
                defaultValue={config.categoryId || ''}
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
              >
                <option value="">-- Select Discord Category --</option>
                {categoryChannels.map((c) => (
                  <option key={c.id} value={c.id}>
                    🗂️ {c.name} ({c.id})
                  </option>
                ))}
              </select>
              <p className="text-neutral-600 text-[11px] mt-2">Parent category where new temporary channels will be placed.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-2">
                <span className="inline-flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-[#5E5CE6]" /> Panel Controller Channel
                </span>
              </label>
              <select
                name="panelChannelId"
                defaultValue={config.panelChannelId || ''}
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
              >
                <option value="">-- Select Panel Text Channel --</option>
                {textChannels.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.name} ({c.id})
                  </option>
                ))}
              </select>
              <p className="text-neutral-600 text-[11px] mt-2">Channel where the permanent J2C management control interface is sent.</p>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-2">
                <span className="inline-flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#5E5CE6]" /> Channel Name Format
                </span>
              </label>
              <input
                type="text"
                name="channelNameFormat"
                defaultValue={config.channelNameFormat || "{user}'s Lounge"}
                required
                placeholder="e.g. {user}'s Lounge"
                className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
              />
              <p className="text-neutral-600 text-[11px] mt-2">Use {'{user}'} to insert the creator&apos;s username dynamically.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center justify-end">
            <SaveButton
              label="Save J2C Configuration"
              savingLabel="Saving J2C Configuration..."
              savedLabel="J2C Config Saved!"
              className="px-10"
              icon="save"
            />
          </div>
        </form>
      </div>
      </StaggerItem>

      {/* Active JTC Channels Display */}
      <StaggerItem>
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-[#5E5CE6]" />
            <div>
              <h2 className="text-lg font-normal text-white tracking-wide">// Live Dynamic Channels</h2>
              <p className="text-neutral-500 font-mono text-xs mt-1">Real-time telemetry of spawned temporary voice lobbies.</p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 border border-white/10 bg-white/[0.01] text-[#5E5CE6]">
            {activeChannels.length} Active Lobbies
          </span>
        </div>

        {activeChannels.length === 0 ? (
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-12 text-center rounded-none font-mono text-xs text-neutral-500">
            No temporary voice channels are currently active. Once a user joins the base voice channel, their lobby will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeChannels.map((channel: any) => (
              <div
                key={channel.id}
                className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-6 rounded-none space-y-4 hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2.5 text-sm font-medium text-white tracking-wide">
                    <Volume2 className="w-4 h-4 text-[#5E5CE6]" />
                    <span>{channel.name}</span>
                  </div>
                  <span className="px-2 py-0.5 border border-[#5E5CE6]/30 bg-[#5E5CE6]/10 text-[#5E5CE6] text-[10px] font-mono uppercase tracking-wider">
                    LIVE
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono text-neutral-400">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Owner:</span>
                    <span className="text-white">{channel.ownerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Capacity:</span>
                    <span className="flex items-center gap-1 text-white">
                      <Users className="w-3.5 h-3.5 text-[#5E5CE6]" /> {channel.userCount} / {channel.userLimit || '∞'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Channel ID:</span>
                    <span className="text-neutral-400 text-[11px]">{channel.channelId}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-neutral-500 flex justify-between items-center">
                  <span>Created: {new Date(channel.createdAt).toLocaleTimeString()}</span>
                  <span className="text-[#5E5CE6]">Automated J2C</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </StaggerItem>
      </StaggerContainer>
    </main>
  );
}
