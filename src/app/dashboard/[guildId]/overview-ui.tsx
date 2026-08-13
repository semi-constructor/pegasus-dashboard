import { LayoutDashboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OverviewClientWrapper, StatCard, ModulesCard } from "./overview-client";

export function OverviewUI({ 
  guildName, 
  shardId, 
  stats, 
  modules, 
  guildId,
  t 
}: { 
  guildName: string, 
  shardId?: number, 
  stats: any[], 
  modules: any[], 
  guildId: string,
  t: (key: string) => string
}) {
  return (
    <OverviewClientWrapper>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-foreground/5 rounded-2xl border border-border backdrop-blur-md">
              <LayoutDashboard className="w-8 h-8 text-foreground" />
            </div>
            {t('serverOverview')}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <p className="text-foreground/40 text-sm font-medium tracking-wide uppercase">{guildName}</p>
            {shardId !== undefined && (
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                Shard #{shardId}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} stat={stat} i={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <ModulesCard modules={modules} guildId={guildId} />
      </div>
    </OverviewClientWrapper>
  );
}
