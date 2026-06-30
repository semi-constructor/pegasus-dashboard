import Link from 'next/link';
import { cookies, headers } from 'next/headers';
import { getUserAdminGuilds, NEXT_PUBLIC_DISCORD_CLIENT_ID, getAppUrl } from '@/lib/api';
import { Shield, Lock, ArrowRight, Server, CheckCircle2, AlertCircle, Terminal } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/StaggerAnimations';

export default async function DashboardSelectPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('discord_access_token')?.value;
  const userCookie = cookieStore.get('discord_user')?.value;
  const adminGuilds = await getUserAdminGuilds(accessToken);

  let userId: string | null = null;
  if (userCookie) {
    try {
      const userData = JSON.parse(userCookie);
      userId = userData.id;
    } catch (e) {}
  }

  let isSystemAdmin = false;
  if (userId) {
    let adminIds: string[] = [];
    try {
      if (process.env.ADMIN) {
        adminIds = JSON.parse(process.env.ADMIN);
      }
    } catch (e) {
      adminIds = [process.env.ADMIN || ''];
    }
    isSystemAdmin = adminIds.includes(userId);
  }

  const clientId = NEXT_PUBLIC_DISCORD_CLIENT_ID || '1375140177961418774';
  const headersList = await headers();
  const appUrl = await getAppUrl(headersList);

  if (!adminGuilds) {
    return (
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full flex flex-col items-center justify-center min-h-[70vh]">
        <div className="border border-white/10 bg-white/[0.01] p-12 max-w-lg w-full rounded-none flex flex-col items-center text-center relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#5E5CE6]" />
          <Lock className="w-12 h-12 text-[#5E5CE6] mb-6" />
          <h1 className="text-3xl font-light tracking-tight text-white mb-4">Authorization Required</h1>
          <p className="text-sm text-neutral-400 font-mono tracking-wide mb-8 leading-relaxed">
            Connect your Discord account to authenticate with Pegasus Systems. Only real servers where you hold active Administrator permissions will be displayed.
          </p>
          <a
            href="/api/auth/login"
            className="border border-[#5E5CE6]/40 bg-[#5E5CE6]/10 px-8 py-4 text-xs font-mono text-[#5E5CE6] hover:bg-[#5E5CE6] hover:text-black hover:border-[#5E5CE6] transition-all rounded-none w-full tracking-widest uppercase flex items-center justify-center gap-3 group"
          >
            <span>Login with Discord</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </main>
    );
  }

  const authorizedGuilds = adminGuilds.filter(g => g.isAdmin && g.botInServer);
  const missingInviteGuilds = adminGuilds.filter(g => g.isAdmin && !g.botInServer);
  const disabledGuilds = adminGuilds.filter(g => !g.isAdmin);

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
      <StaggerContainer>
        {/* Header */}
        <StaggerItem>
          <div className="border-b border-white/5 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 border border-white/5 px-3 py-1 bg-white/[0.01] mb-4 text-xs font-mono tracking-wide text-neutral-400">
                <Shield className="w-3.5 h-3.5 text-[#5E5CE6]" />
                <span>Administrator Access Verified</span>
              </div>
              <h1 className="text-4xl font-light tracking-tight text-white mb-2">Select Server</h1>
              <p className="text-sm text-neutral-400 font-mono tracking-wide">
                Choose a server to configure Pegasus systems. This dashboard categorizes your servers based on bot presence and your administrative permissions.
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-end gap-3 self-start md:self-auto">
              {isSystemAdmin && (
                <a
                  href="/admin"
                  className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-mono text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors rounded-none"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Admin Panel</span>
                </a>
              )}
              <a
                href="/api/auth/logout"
                className="border border-white/10 bg-white/[0.02] px-4 py-2 text-xs font-mono text-neutral-400 hover:border-red-500/40 hover:text-red-400 transition-colors rounded-none"
              >
                Disconnect Account
              </a>
            </div>
          </div>
        </StaggerItem>

      {adminGuilds.length === 0 ? (
        <div className="border border-white/5 bg-white/[0.005] p-12 text-center text-neutral-500 font-mono text-sm">
          No servers found for your Discord account.
        </div>
      ) : (
        <div className="space-y-16">
          {/* 1. Authorized Servers */}
          <StaggerItem>
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-[#5E5CE6]" />
                <h2 className="text-xl font-light tracking-tight text-white">Authorized Servers</h2>
              </div>
              <span className="border border-[#5E5CE6]/30 bg-[#5E5CE6]/10 px-2.5 py-1 text-xs font-mono text-[#5E5CE6]">
                {authorizedGuilds.length} Active
              </span>
            </div>
            {authorizedGuilds.length === 0 ? (
              <div className="border border-white/5 bg-white/[0.005] p-8 text-center text-neutral-500 font-mono text-xs">
                No authorized servers found where Pegasus is currently active.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {authorizedGuilds.map((guild) => (
                  <div
                    key={guild.id}
                    className="border border-white/10 bg-white/[0.01] p-8 flex flex-col justify-between rounded-none group hover:border-[#5E5CE6] transition-colors relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#5E5CE6]" />
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <Server className="w-6 h-6 text-[#5E5CE6]" />
                        <span className="inline-flex items-center gap-1.5 border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      </div>
                      <h3 className="text-xl font-normal text-white mb-2 tracking-wide group-hover:text-[#5E5CE6] transition-colors">
                        {guild.name}
                      </h3>
                      <p className="text-xs font-mono text-neutral-500 mb-8">
                        ID: {guild.id} • {guild.memberCount?.toLocaleString()} Members
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/${guild.id}`}
                      className="flex items-center justify-between border border-white/10 bg-white/[0.02] px-6 py-4 text-xs font-mono text-white hover:bg-[#5E5CE6] hover:text-black hover:border-[#5E5CE6] transition-all rounded-none group/btn w-full"
                    >
                      <span>Manage Server</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          </StaggerItem>

          {/* 2. Missing Invitation */}
          <StaggerItem>
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-light tracking-tight text-white">Missing Invitation</h2>
              </div>
              <span className="border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-mono text-amber-400">
                {missingInviteGuilds.length} Pending
              </span>
            </div>
            {missingInviteGuilds.length === 0 ? (
              <div className="border border-white/5 bg-white/[0.005] p-8 text-center text-neutral-500 font-mono text-xs">
                All administrator servers have Pegasus successfully invited.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missingInviteGuilds.map((guild) => (
                  <div
                    key={guild.id}
                    className="border border-white/5 bg-white/[0.005] p-8 flex flex-col justify-between rounded-none relative overflow-hidden opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <Lock className="w-6 h-6 text-amber-500/60" />
                        <span className="inline-flex items-center gap-1.5 border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                          Bot Not Invited
                        </span>
                      </div>
                      <h3 className="text-xl font-normal text-neutral-300 mb-2 tracking-wide">
                        {guild.name}
                      </h3>
                      <p className="text-xs font-mono text-neutral-500 mb-8">
                        ID: {guild.id} • {guild.memberCount?.toLocaleString()} Members
                      </p>
                    </div>
                    <a
                      href={`https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}&disable_guild_select=true`}
                      className="flex items-center justify-between border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-xs font-mono text-amber-300 hover:bg-amber-500 hover:text-black transition-all rounded-none group/btn w-full"
                    >
                      <span>Invite Bot</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
          </StaggerItem>

          {/* 3. Disabled / Admin Required */}
          <StaggerItem>
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-red-500/80" />
                <h2 className="text-xl font-light tracking-tight text-white">Disabled // Admin Required</h2>
              </div>
              <span className="border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-mono text-red-400">
                {disabledGuilds.length} Locked
              </span>
            </div>
            {disabledGuilds.length === 0 ? (
              <div className="border border-white/5 bg-white/[0.005] p-8 text-center text-neutral-500 font-mono text-xs">
                No disabled servers found. You hold Administrator privileges on all discovered guilds.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {disabledGuilds.map((guild) => (
                  <div
                    key={guild.id}
                    className="border border-white/5 bg-white/[0.005] p-8 flex flex-col justify-between rounded-none relative overflow-hidden opacity-50"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <Lock className="w-6 h-6 text-red-500/60" />
                        <span className="inline-flex items-center gap-1.5 border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-mono text-red-400 uppercase tracking-wider">
                          Admin Required
                        </span>
                      </div>
                      <h3 className="text-xl font-normal text-neutral-400 mb-2 tracking-wide">
                        {guild.name}
                      </h3>
                      <p className="text-xs font-mono text-neutral-500 mb-8">
                        ID: {guild.id} • {guild.memberCount?.toLocaleString()} Members
                      </p>
                    </div>
                    <button
                      disabled
                      className="flex items-center justify-between border border-white/5 bg-white/[0.01] px-6 py-4 text-xs font-mono text-neutral-500 cursor-not-allowed rounded-none w-full"
                    >
                      <span>Requires Administrator</span>
                      <Lock className="w-4 h-4 text-neutral-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          </StaggerItem>
        </div>
      )}
      </StaggerContainer>
    </main>
  );
}
