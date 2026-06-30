import { getWarnings, deleteWarning, getWarningAutomations, createWarningAutomation, deleteWarningAutomation, getAuditLogs, triggerBotModeration, getModLogSettings, updateModLogSettings, getWordFilterRules, createWordFilterRule, deleteWordFilterRule, getGuildMembers, getGuildChannels } from '@/app/actions';
import { Shield, ShieldAlert, Zap, Trash2, UserX, AlertOctagon, Plus, FileText, Filter, Eye } from 'lucide-react';
import SaveButton from '@/components/SaveButton';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';

export default async function ModerationPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  const warnings = await getWarnings(guildId);
  const automations = await getWarningAutomations(guildId);
  const auditLogs = await getAuditLogs(guildId);
  const modLogSettings = await getModLogSettings(guildId);
  const wordFilterRules = await getWordFilterRules(guildId);
  const members = await getGuildMembers(guildId);
  const channels = await getGuildChannels(guildId);

  const textChannels = channels.filter(c => c.type === 'text');
  const membersMap = new Map(members.map(m => [m.id, m.username || m.displayName]));

  async function handleCreateAutomation(formData: FormData) {
    'use server';
    await createWarningAutomation(guildId, formData);
  }

  async function handleDeleteAutomation(formData: FormData) {
    'use server';
    const idStr = formData.get('id') as string;
    if (idStr) {
      await deleteWarningAutomation(guildId, parseInt(idStr, 10), formData);
    }
  }

  async function handleDeleteWarning(formData: FormData) {
    'use server';
    const idStr = formData.get('id') as string;
    if (idStr) {
      await deleteWarning(guildId, parseInt(idStr, 10), formData);
    }
  }

  async function handleExecuteAction(formData: FormData) {
    'use server';
    const action = formData.get('action') as 'warn' | 'ban' | 'kick' | 'mute';
    if (action) {
      await triggerBotModeration(guildId, action, formData);
    }
  }

  async function handleUpdateModLogSettings(formData: FormData) {
    'use server';
    await updateModLogSettings(guildId, formData);
  }

  async function handleCreateWordFilterRule(formData: FormData) {
    'use server';
    await createWordFilterRule(guildId, formData);
  }

  async function handleDeleteWordFilterRule(formData: FormData) {
    'use server';
    const idStr = formData.get('id') as string;
    if (idStr) {
      await deleteWordFilterRule(guildId, parseInt(idStr, 10), formData);
    }
  }

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-16">
      <StaggerContainer>
      {/* Header */}
      <StaggerItem>
      <div className="border-b border-white/5 pb-8">
        <div className="inline-flex items-center gap-2 border border-white/5 px-3 py-1 bg-white/[0.01] mb-4 text-xs font-mono tracking-wide text-neutral-400">
          <Shield className="w-3.5 h-3.5 text-[#5E5CE6]" />
          <span>Security & Auto-Moderation Shield</span>
        </div>
        <h1 className="text-4xl font-light tracking-tight text-white mb-2">Moderation & Automod Engine</h1>
        <p className="text-sm text-neutral-400 font-mono tracking-wide">
          Enforce server rules, execute real-time moderation actions, establish word filter patterns, configure warning thresholds, and inspect audit logs for Guild ({guildId}).
        </p>
      </div>
      </StaggerItem>

      {/* Grid Layout for Action & Filtering */}
      <StaggerItem>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Section 1: Real-time Moderation Execution */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Zap className="w-5 h-5 text-[#5E5CE6]" />
            <div>
              <h2 className="text-xl font-light text-white tracking-wide">Execute Moderation Action</h2>
              <p className="text-neutral-500 font-mono text-xs mt-1">Issue real-time sanctions directly to Discord members.</p>
            </div>
          </div>
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 rounded-none">
            <form action={handleExecuteAction} className="space-y-6 font-mono text-xs">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Select Target Member</label>
                <select
                  name="userId"
                  required
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="">-- Select Discord Member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.username || m.displayName} ({m.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Action Type</label>
                <select
                  name="action"
                  required
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="warn">⚠️ Issue Warning</option>
                  <option value="mute">🔇 Mute User (Timeout)</option>
                  <option value="kick">🚪 Kick from Guild</option>
                  <option value="ban">🔨 Ban from Guild</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Reason for Sanction</label>
                <textarea
                  name="reason"
                  required
                  rows={2}
                  placeholder="Violation of community guidelines regarding spam."
                  className="w-full bg-black border border-white/10 p-4 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors resize-y"
                />
              </div>

              <SaveButton
                label="Execute Mod Sanction"
                savingLabel="Executing Sanction..."
                savedLabel="Sanction Executed!"
                className="w-full"
                icon="alert"
                variant="danger"
              />
            </form>
          </div>

          {/* Active Warnings Table */}
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md rounded-none overflow-hidden">
            <div className="p-4 border-b border-white/5 text-xs font-mono text-neutral-400 bg-white/[0.01]">
              // Active User Warnings Database
            </div>
            {warnings.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/5 text-neutral-500 bg-white/[0.01]">
                    <th className="py-3 px-4 font-medium">USER</th>
                    <th className="py-3 px-4 font-medium">WARNING / REASON</th>
                    <th className="py-3 px-4 font-medium text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300">
                  {warnings.map((w) => (
                    <tr key={w.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 px-4 font-medium text-white">
                        {membersMap.get(w.userId) || `User (${w.userId})`}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white font-medium">{w.title}</div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-xs">{w.description}</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <form action={handleDeleteWarning} className="inline">
                          <input type="hidden" name="id" value={w.id} />
                          <button
                            type="submit"
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                            title="Revoke Warning"
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
                No active warnings exist in this guild database.
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Word Filter Rules */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Filter className="w-5 h-5 text-[#5E5CE6]" />
            <div>
              <h2 className="text-xl font-light text-white tracking-wide">Word Filter & Regex Engine</h2>
              <p className="text-neutral-500 font-mono text-xs mt-1">Intercept and purge prohibited keywords or pattern expressions.</p>
            </div>
          </div>
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 rounded-none">
            <form action={handleCreateWordFilterRule} className="space-y-6 font-mono text-xs">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Text Pattern / Keyword</label>
                <input
                  type="text"
                  name="pattern"
                  required
                  placeholder="e.g. discord.gg/ or badword"
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-2">Match Strategy</label>
                  <select
                    name="matchType"
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                  >
                    <option value="literal">Literal String</option>
                    <option value="regex">Regular Expression (Regex)</option>
                    <option value="wildcard">Wildcard Match</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase tracking-wider mb-2">Sanction Severity</label>
                  <select
                    name="severity"
                    className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                  >
                    <option value="low">Low (Silent Delete)</option>
                    <option value="medium">Medium (Warn User)</option>
                    <option value="high">High (Mute User)</option>
                    <option value="critical">Critical (Ban User)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Automated Purge</label>
                <select
                  name="autoDelete"
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Yes, automatically delete offending message</option>
                  <option value="false">No, log for moderator review only</option>
                </select>
              </div>

              <SaveButton
                label="Register Filter Rule"
                savingLabel="Registering Rule..."
                savedLabel="Rule Registered!"
                className="w-full"
                icon="plus"
              />
            </form>
          </div>

          {/* Word Filter Rules Table */}
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md rounded-none overflow-hidden">
            <div className="p-4 border-b border-white/5 text-xs font-mono text-neutral-400 bg-white/[0.01]">
              // Active Interception Rules
            </div>
            {wordFilterRules.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/5 text-neutral-500 bg-white/[0.01]">
                    <th className="py-3 px-4 font-medium">PATTERN</th>
                    <th className="py-3 px-4 font-medium">STRATEGY</th>
                    <th className="py-3 px-4 font-medium">SEVERITY</th>
                    <th className="py-3 px-4 font-medium text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300">
                  {wordFilterRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 px-4 font-medium text-white">{rule.pattern}</td>
                      <td className="py-3 px-4 text-neutral-400 uppercase text-[10px]">{rule.matchType}</td>
                      <td className="py-3 px-4 text-neutral-400 uppercase text-[10px]">{rule.severity}</td>
                      <td className="py-3 px-4 text-right">
                        <form action={handleDeleteWordFilterRule} className="inline">
                          <input type="hidden" name="id" value={rule.id} />
                          <button
                            type="submit"
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                            title="Delete Rule"
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
                No word filter rules currently registered.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Warning Automations */}
      <div className="space-y-6 pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <ShieldAlert className="w-5 h-5 text-[#5E5CE6]" />
          <div>
            <h2 className="text-xl font-light text-white tracking-wide">Warning Automation Triggers</h2>
            <p className="text-neutral-500 font-mono text-xs mt-1">Configure progressive discipline escalations based on accumulated infractions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Automation Form */}
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 rounded-none lg:col-span-1 h-fit">
            <form action={handleCreateAutomation} className="space-y-6 font-mono text-xs">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Rule Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. 3 Warnings = Timeout"
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Trigger Metric</label>
                <select
                  name="triggerType"
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="warn_count">Total Warning Count</option>
                  <option value="warn_level">Cumulative Warning Level</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Threshold Value</label>
                <input
                  type="number"
                  name="triggerValue"
                  defaultValue={3}
                  required
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Automated Penalty</label>
                <select
                  name="actionType"
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="mute">🔇 Auto Mute (1 Hour)</option>
                  <option value="kick">🚪 Auto Kick</option>
                  <option value="ban">🔨 Auto Ban</option>
                </select>
              </div>

              <SaveButton
                label="Deploy Automation"
                savingLabel="Deploying Automation..."
                savedLabel="Automation Deployed!"
                className="w-full"
                icon="plus"
              />
            </form>
          </div>

          {/* Automations Table */}
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md rounded-none overflow-hidden lg:col-span-2">
            <div className="p-4 border-b border-white/5 text-xs font-mono text-neutral-400 bg-white/[0.01]">
              // Active Infraction Automations
            </div>
            {automations.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/5 text-neutral-500 bg-white/[0.01]">
                    <th className="py-4 px-6 font-medium">RULE NAME</th>
                    <th className="py-4 px-6 font-medium">TRIGGER</th>
                    <th className="py-4 px-6 font-medium">THRESHOLD</th>
                    <th className="py-4 px-6 font-medium">AUTOMATED ACTION</th>
                    <th className="py-4 px-6 font-medium text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300">
                  {automations.map((a) => (
                    <tr key={a.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-6 font-medium text-white">{a.name}</td>
                      <td className="py-4 px-6 text-neutral-400 uppercase text-[10px]">{a.triggerType}</td>
                      <td className="py-4 px-6 text-emerald-400 font-medium">{a.triggerValue}</td>
                      <td className="py-4 px-6 text-amber-400 font-medium uppercase text-[10px]">
                        {Array.isArray(a.actions) && a.actions[0] ? (a.actions[0] as any).type : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <form action={handleDeleteAutomation} className="inline">
                          <input type="hidden" name="id" value={a.id} />
                          <button
                            type="submit"
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                            title="Delete Automation"
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
              <div className="p-12 text-center text-xs font-mono text-neutral-500">
                No warning automations established yet.
              </div>
            )}
          </div>
        </div>
      </div>
      </StaggerItem>

      {/* Section 4: Auto-Moderation Warnings Setup */}
      <StaggerItem>
      <div className="space-y-6 pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Eye className="w-5 h-5 text-[#5E5CE6]" />
          <div>
            <h2 className="text-xl font-light text-white tracking-wide">Categorized Moderation Logs</h2>
            <p className="text-neutral-500 font-mono text-xs mt-1">Designate specialized channels for specific security audit trails.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 rounded-none lg:col-span-1 h-fit">
            <form action={handleUpdateModLogSettings} className="space-y-6 font-mono text-xs">
              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Log Category</label>
                <select
                  name="category"
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="moderation">Moderation (Warn/Mute/Kick/Ban)</option>
                  <option value="word_filter">Word Filter & Regex Interceptions</option>
                  <option value="join_leave">Verification & Join/Leave Logs</option>
                  <option value="message_edit">Message Delete & Edit Logging</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Destination Channel</label>
                <select
                  name="channelId"
                  required
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="">-- Select Text Channel --</option>
                  {textChannels.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase tracking-wider mb-2">Status</label>
                <select
                  name="enabled"
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                >
                  <option value="true">Active (Log Feed ON)</option>
                  <option value="false">Paused (Standby)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-white/5">
                <SaveButton
                  label="Save Log Channel Allocation"
                  savingLabel="Saving Allocation..."
                  savedLabel="Allocation Saved!"
                  className="w-full"
                  icon="save"
                />
              </div>
            </form>
          </div>

          {/* Active Mod Log Routing Table */}
          <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md rounded-none overflow-hidden lg:col-span-2">
            <div className="p-4 border-b border-white/5 text-xs font-mono text-neutral-400 bg-white/[0.01]">
              // Active Mod Log Routing Configurations
            </div>
            {modLogSettings.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/5 text-neutral-500 bg-white/[0.01]">
                    <th className="py-4 px-6 font-medium">LOG CATEGORY</th>
                    <th className="py-4 px-6 font-medium">DESTINATION CHANNEL</th>
                    <th className="py-4 px-6 font-medium text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300">
                  {modLogSettings.map((setting) => {
                    const channel = channels.find((c) => c.id === setting.channelId);
                    return (
                      <tr key={setting.category} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 px-6 font-medium text-white uppercase">{setting.category}</td>
                        <td className="py-4 px-6 text-neutral-400">
                          {channel ? `#${channel.name} (${setting.channelId})` : setting.channelId}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {setting.enabled ? (
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase tracking-wider">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-neutral-500/10 text-neutral-400 border border-neutral-500/20 text-[10px] uppercase tracking-wider">
                              Paused
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-xs font-mono text-neutral-500">
                No mod log routing configurations currently established.
              </div>
            )}
          </div>
        </div>
      </div>
      </StaggerItem>

      {/* Section 5: Audit Logs View */}
      <StaggerItem>
      <div className="space-y-6 pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <FileText className="w-5 h-5 text-[#5E5CE6]" />
          <h2 className="text-xl font-light text-white tracking-wide">Master Security Audit Trail</h2>
        </div>
        <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md rounded-none overflow-hidden">
          {auditLogs.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-neutral-500 bg-white/[0.01]">
                  <th className="py-4 px-6 font-medium">ACTION</th>
                  <th className="py-4 px-6 font-medium">USER</th>
                  <th className="py-4 px-6 font-medium">TARGET</th>
                  <th className="py-4 px-6 font-medium">DETAILS</th>
                  <th className="py-4 px-6 font-medium text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-6 font-medium text-white uppercase">{log.action}</td>
                    <td className="py-4 px-6 text-neutral-400">
                      {membersMap.get(log.userId) || log.userId}
                    </td>
                    <td className="py-4 px-6 text-neutral-400">
                      {log.targetId ? (membersMap.get(log.targetId) || log.targetId) : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-neutral-500 max-w-sm truncate">
                      {JSON.stringify(log.details || {})}
                    </td>
                    <td className="py-4 px-6 text-right text-neutral-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-xs font-mono text-neutral-500">
              No recent audit log occurrences recorded in the database.
            </div>
          )}
        </div>
      </div>
      </StaggerItem>
      </StaggerContainer>
    </main>
  );
}
