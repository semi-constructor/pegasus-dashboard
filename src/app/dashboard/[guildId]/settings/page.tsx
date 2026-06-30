import { getGuildSettings, updateGuildSettings, getGuildChannels, getGuildRoles } from '@/app/actions';
import { Settings, Save, Shield, Bell, FileText, Lock, Globe } from 'lucide-react';
import MultiSelect from '@/components/MultiSelect';
import SaveButton from '@/components/SaveButton';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';

export default async function GuildSettingsPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const settings = await getGuildSettings(guildId);
  const channels = await getGuildChannels(guildId);
  const roles = await getGuildRoles(guildId);

  const textChannels = channels.filter(c => c.type === 'text');
  const roleOptions = roles.map(r => ({ value: r.id, label: r.name }));
  if (roleOptions.length === 0) {
    roleOptions.push(
      { value: '99988877766655544', label: 'Member' },
      { value: '88877766655544433', label: 'VIP' },
      { value: '77766655544433322', label: 'Subscriber' }
    );
  }

  let initialAutoroleRoles: string[] = [];
  try {
    initialAutoroleRoles = JSON.parse(settings.autoroleRoles || '[]');
  } catch {
    initialAutoroleRoles = [];
  }

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12">
      <StaggerContainer>
      {/* Header */}
      <StaggerItem>
      <div className="border-b border-white/5 pb-8">
        <div className="inline-flex items-center gap-2 border border-white/5 px-3 py-1 bg-white/[0.01] mb-4 text-xs font-mono tracking-wide text-neutral-400">
          <Settings className="w-3.5 h-3.5 text-[#5E5CE6]" />
          <span>Module Configuration & Integration</span>
        </div>
        <h1 className="text-4xl font-light tracking-tight text-white mb-2">Guild Settings & Notifications</h1>
        <p className="text-sm text-neutral-400 font-mono tracking-wide">
          Configure core bot behaviors, automated welcome/goodbye notifications, logging channels, and active security modules for Guild ({guildId}).
        </p>
      </div>
      </StaggerItem>

      {/* Settings Form */}
      <StaggerItem>
      <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 rounded-none max-w-5xl mt-12">
        <form action={updateGuildSettings.bind(null, guildId)} className="space-y-12 font-mono text-xs">
          {/* General Bot Configuration */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Globe className="w-5 h-5 text-[#5E5CE6]" />
              <div>
                <h2 className="text-lg font-normal text-white tracking-wide">// General Bot Preferences</h2>
                <p className="text-neutral-500 mt-1">Configure command prefix and response localization.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Command Prefix</label>
                <input
                  type="text"
                  name="prefix"
                  defaultValue={settings.prefix || '!'}
                  placeholder="e.g. ! or ?"
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Server Language</label>
                <select
                  name="language"
                  defaultValue={settings.language || 'en'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="en">English (en)</option>
                  <option value="es">Spanish (es)</option>
                  <option value="fr">French (fr)</option>
                  <option value="de">German (de)</option>
                  <option value="ja">Japanese (ja)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Welcome Module */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Bell className="w-5 h-5 text-[#5E5CE6]" />
              <div>
                <h2 className="text-lg font-normal text-white tracking-wide">// Welcome Module Automation</h2>
                <p className="text-neutral-500 mt-1">Automatically greet new members with custom rich embeds and direct messages.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Enable Welcome Module</label>
                <select
                  name="welcomeEnabled"
                  defaultValue={settings.welcomeEnabled ? 'true' : 'false'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Enabled (Active)</option>
                  <option value="false">Disabled (Standby)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Welcome Channel Selection</label>
                <select
                  name="welcomeChannel"
                  defaultValue={settings.welcomeChannel || ''}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="">-- Select Discord Channel --</option>
                  {textChannels.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-2">Welcome Message Template</label>
              <textarea
                name="welcomeMessage"
                defaultValue={settings.welcomeMessage || ''}
                rows={3}
                placeholder="Welcome {user} to {server}! Enjoy your stay."
                className="w-full bg-black border border-white/10 p-4 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors resize-y"
              />
              <p className="text-neutral-600 text-[11px] mt-2">Available placeholders: {'{user}'}, {'{server}'}, {'{memberCount}'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Rich Embed Greeter</label>
                <select
                  name="welcomeEmbedEnabled"
                  defaultValue={settings.welcomeEmbedEnabled ? 'true' : 'false'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Use Rich Embed</option>
                  <option value="false">Plain Text Only</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Embed Accent Color</label>
                <input
                  type="text"
                  name="welcomeEmbedColor"
                  defaultValue={settings.welcomeEmbedColor || '#0099FF'}
                  placeholder="e.g. #5E5CE6"
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Embed Title</label>
                <input
                  type="text"
                  name="welcomeEmbedTitle"
                  defaultValue={settings.welcomeEmbedTitle || ''}
                  placeholder="e.g. Welcome to the Community!"
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Direct Message Greeting</label>
                <select
                  name="welcomeDmEnabled"
                  defaultValue={settings.welcomeDmEnabled ? 'true' : 'false'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Send DM to User</option>
                  <option value="false">Do Not Send DM</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">DM Message Template</label>
                <input
                  type="text"
                  name="welcomeDmMessage"
                  defaultValue={settings.welcomeDmMessage || ''}
                  placeholder="Hey {user}, welcome to {server}! Make sure to read the rules."
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Goodbye Module */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Bell className="w-5 h-5 text-[#5E5CE6]" />
              <div>
                <h2 className="text-lg font-normal text-white tracking-wide">// Goodbye Module Automation</h2>
                <p className="text-neutral-500 mt-1">Broadcast farewell announcements when members depart the guild.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Enable Goodbye Module</label>
                <select
                  name="goodbyeEnabled"
                  defaultValue={settings.goodbyeEnabled ? 'true' : 'false'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Enabled (Active)</option>
                  <option value="false">Disabled (Standby)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Goodbye Channel Selection</label>
                <select
                  name="goodbyeChannel"
                  defaultValue={settings.goodbyeChannel || ''}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="">-- Select Discord Channel --</option>
                  {textChannels.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase tracking-wider mb-2">Goodbye Message Template</label>
              <textarea
                name="goodbyeMessage"
                defaultValue={settings.goodbyeMessage || ''}
                rows={2}
                placeholder="{user} has left {server}. We now have {memberCount} members."
                className="w-full bg-black border border-white/10 p-4 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors resize-y"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Rich Embed Farewell</label>
                <select
                  name="goodbyeEmbedEnabled"
                  defaultValue={settings.goodbyeEmbedEnabled ? 'true' : 'false'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Use Rich Embed</option>
                  <option value="false">Plain Text Only</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Embed Accent Color</label>
                <input
                  type="text"
                  name="goodbyeEmbedColor"
                  defaultValue={settings.goodbyeEmbedColor || '#FF0000'}
                  placeholder="e.g. #FF0000"
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Embed Title</label>
                <input
                  type="text"
                  name="goodbyeEmbedTitle"
                  defaultValue={settings.goodbyeEmbedTitle || ''}
                  placeholder="e.g. Member Departure"
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Logging Configuration */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <FileText className="w-5 h-5 text-[#5E5CE6]" />
              <div>
                <h2 className="text-lg font-normal text-white tracking-wide">// Server Logging Engine</h2>
                <p className="text-neutral-500 mt-1">Designate a master destination channel for general server event logs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Enable General Logging</label>
                <select
                  name="logsEnabled"
                  defaultValue={settings.logsEnabled ? 'true' : 'false'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Enabled (Logging Active)</option>
                  <option value="false">Disabled (Standby)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Master Log Channel Selection</label>
                <select
                  name="logsChannel"
                  defaultValue={settings.logsChannel || ''}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="">-- Select Discord Channel --</option>
                  {textChannels.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Autorole Module */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Shield className="w-5 h-5 text-[#5E5CE6]" />
              <div>
                <h2 className="text-lg font-normal text-white tracking-wide">// Automated Role Assignment</h2>
                <p className="text-neutral-500 mt-1">Assign designated roles to users immediately upon passing server verification.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Enable Autorole Module</label>
                <select
                  name="autoroleEnabled"
                  defaultValue={settings.autoroleEnabled ? 'true' : 'false'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Enabled (Active)</option>
                  <option value="false">Disabled (Standby)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Target Roles (Multi-Select)</label>
                <MultiSelect
                  name="autoroleRoles"
                  options={roleOptions}
                  initialSelected={initialAutoroleRoles}
                  placeholder="Select roles to automatically assign..."
                  typeLabel="role"
                />
              </div>
            </div>
          </div>

          {/* Security & Automod Engine */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Lock className="w-5 h-5 text-[#5E5CE6]" />
              <div>
                <h2 className="text-lg font-normal text-white tracking-wide">// Security & Automod Shield</h2>
                <p className="text-neutral-500 mt-1">Configure spam defenses, raid mitigation, and mention limits.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Master Security Shield</label>
                <select
                  name="securityEnabled"
                  defaultValue={settings.securityEnabled ? 'true' : 'false'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Shield Active</option>
                  <option value="false">Shield Standby</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Anti-Raid Mitigation</label>
                <select
                  name="antiRaidEnabled"
                  defaultValue={settings.antiRaidEnabled ? 'true' : 'false'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Enabled (Strict)</option>
                  <option value="false">Disabled</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Anti-Spam Filter</label>
                <select
                  name="antiSpamEnabled"
                  defaultValue={settings.antiSpamEnabled ? 'true' : 'false'}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Enabled (Automute)</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Max Mentions Per Message</label>
                <input
                  type="number"
                  name="maxMentions"
                  defaultValue={settings.maxMentions || 5}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Max Duplicate Messages</label>
                <input
                  type="number"
                  name="maxDuplicates"
                  defaultValue={settings.maxDuplicates || 3}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Security Alert Role ID</label>
                <select
                  name="securityAlertRole"
                  defaultValue={settings.securityAlertRole || ''}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="">-- Select Discord Role --</option>
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>
                      @{r.label} ({r.value})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-8 border-t border-white/5 flex items-center justify-end">
            <SaveButton
              label="Save System Settings"
              savingLabel="Saving Settings..."
              savedLabel="Settings Saved!"
              className="w-full sm:w-auto"
            />
          </div>
        </form>
      </div>
      </StaggerItem>
      </StaggerContainer>
    </main>
  );
}
