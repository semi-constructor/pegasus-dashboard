import Link from "next/link";
import {
  LayoutDashboard,
  Settings,
  Ticket,
  Activity,
  Coins,
  Star,
  Shield,
  ArrowLeft,
  Wand2,
  Gift,
  Trophy,
  Mic,
  Terminal,
  AlertTriangle,
  Calendar,
  Send,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import { getTranslations } from 'next-intl/server';

export async function GuildSidebar({ guildId }: { guildId: string }) {
  const t = await getTranslations('guild');

  return (
    <aside className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col h-full border-l">
      <div className="p-4 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('backToServers')}
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <Link href={`/dashboard/${guildId}`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-foreground transition-colors text-sm font-medium">
          <LayoutDashboard className="w-4 h-4" />
          {t('overview')}
        </Link>

        <div className="pt-6 pb-2">
          <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('features')}</p>
        </div>

        <Link href={`/dashboard/${guildId}/analytics`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Activity className="w-4 h-4" />
          Analytics
        </Link>
        <Link href={`/dashboard/${guildId}/tickets`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Ticket className="w-4 h-4" />
          {t('tickets')}
        </Link>
        <Link href={`/dashboard/${guildId}/economy`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Coins className="w-4 h-4" />
          {t('economy')}
        </Link>
        <Link href={`/dashboard/${guildId}/xp`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Star className="w-4 h-4" />
          {t('xpSystem')}
        </Link>
        <Link href={`/dashboard/${guildId}/engagement`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Trophy className="w-4 h-4" />
          {t('engagementHub')}
        </Link>
        <Link href={`/dashboard/${guildId}/giveaways`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Gift className="w-4 h-4" />
          {t('giveaways')}
        </Link>
        <Link href={`/dashboard/${guildId}/schedule`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Calendar className="w-4 h-4" />
          {t('schedule')}
        </Link>
        <Link href={`/dashboard/${guildId}/jtc`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Mic className="w-4 h-4" />
          {t('joinToCreate')}
        </Link>
        <Link href={`/dashboard/${guildId}/custom-commands`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Terminal className="w-4 h-4" />
          {t('customCommands')}
        </Link>
        <Link href={`/dashboard/${guildId}/starboard`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Star className="w-4 h-4" />
          Starboard
        </Link>
        <Link href={`/dashboard/${guildId}/reaction-roles`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <CheckCircle2 className="w-4 h-4" />
          Reaction Roles
        </Link>
        <Link href={`/dashboard/${guildId}/surveys`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ClipboardList className="w-4 h-4" />
          Surveys
        </Link>
        <Link href={`/dashboard/${guildId}/control-panel`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Send className="w-4 h-4" />
          Control Panel
        </Link>
        <Link href={`/dashboard/${guildId}/embed-builder`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Wand2 className="w-4 h-4" />
          Embed Builder
        </Link>
        <Link href={`/dashboard/${guildId}/warns`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <AlertTriangle className="w-4 h-4" />
          {t('warns')}
        </Link>
        <Link href={`/dashboard/${guildId}/automod/advanced`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Shield className="w-4 h-4" />
          AutoMod
        </Link>
      </nav>

      <div className="p-4 border-t border-border/50">
        <Link href={`/dashboard/${guildId}/settings`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Settings className="w-4 h-4" />
          {t('serverSettings')}
        </Link>
      </div>
    </aside>
  );
}
