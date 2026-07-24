import Link from"next/link";
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
} from"lucide-react";

export function GuildSidebar({ guildId }: { guildId: string }) {
 return (
 <aside className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col h-full border-l">
 <div className="p-4 border-b border-border/50">
 <Link href="/dashboard"className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
 <ArrowLeft className="w-4 h-4"/>
 Back to Servers
 </Link>
 </div>
 
 <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
 <Link href={`/dashboard/${guildId}`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-foreground transition-colors text-sm font-medium">
 <LayoutDashboard className="w-4 h-4"/>
 Overview
 </Link>
 
 <div className="pt-6 pb-2">
 <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Features</p>
 </div>
 
        <Link href={`/dashboard/${guildId}/tickets`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Ticket className="w-4 h-4"/>
          Tickets
        </Link>
        <Link href={`/dashboard/${guildId}/economy`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Coins className="w-4 h-4"/>
          Economy
        </Link>
        <Link href={`/dashboard/${guildId}/xp`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Star className="w-4 h-4"/>
          XP System
        </Link>
        <Link href={`/dashboard/${guildId}/giveaways`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Gift className="w-4 h-4"/>
          Giveaways
        </Link>
        <Link href={`/dashboard/${guildId}/jtc`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Mic className="w-4 h-4"/>
          Join to Create
        </Link>
        <Link href={`/dashboard/${guildId}/custom-commands`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <Terminal className="w-4 h-4"/>
          Custom Commands
        </Link>
        <Link href={`/dashboard/${guildId}/warns`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <AlertTriangle className="w-4 h-4"/>
          Warns
        </Link>
      </nav>
 
 <div className="p-4 border-t border-border/50">
 <Link href={`/dashboard/${guildId}/settings`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors text-sm">
 <Settings className="w-4 h-4"/>
 Server Settings
 </Link>
 </div>
 </aside>
 );
}
