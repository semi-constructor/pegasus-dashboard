import { db } from "@/lib/db";
import { guilds, guildSettings, userXp } from "../../../schemas";
import { eq, sum, desc } from "drizzle-orm";
import Link from "next/link";
import { Trophy, Shield, Users, ChevronRight } from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";

export const dynamic = "force-dynamic";

export default async function GlobalLevelsPage() {
  const topGuilds = await db
    .select({
      id: guilds.id,
      name: guilds.language,
      totalXp: sum(userXp.xp).mapWith(Number),
    })
    .from(guilds)
    .innerJoin(guildSettings, eq(guilds.id, guildSettings.guildId))
    .innerJoin(userXp, eq(guilds.id, userXp.guildId))
    .where(eq(guildSettings.publicLevels, true))
    .groupBy(guilds.id)
    .orderBy(desc(sum(userXp.xp)))
    .limit(50);

  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-black pt-48 pb-32 overflow-hidden selection:bg-white selection:text-black">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-white/[0.03]" />

        <div className="max-w-5xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="mb-24">
            <div className="inline-flex items-center gap-2 text-white/30 text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 px-4 py-2">
              <Trophy className="w-3 h-3" /> GLOBAL_XP_RANKING
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-8 uppercase leading-[0.9]">
              Top Ranked<br/>Servers
            </h1>
            <p className="text-white/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed">
              Discover the most active communities competing on the global leaderboard. Enable Public Levels in your server settings to join the race.
            </p>
          </div>

          <div className="w-full h-px bg-white/10 mb-16" />

          <div className="border border-white/10 bg-[#050505]">
            {topGuilds.length === 0 ? (
              <div className="text-center py-24">
                <Shield className="w-8 h-8 text-white/20 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-white/50 uppercase tracking-[0.2em] mb-2">No Servers Found</h3>
                <p className="text-white/30 text-xs uppercase tracking-[0.2em]">Be the first to enable Public Levels and claim the #1 spot.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {topGuilds.map((guild, index) => (
                  <Link 
                    href={`/levels/${guild.id}`} 
                    key={guild.id}
                    className="flex items-center gap-6 p-6 hover:bg-white/[0.02] transition-all group"
                  >
                    <span className="text-2xl font-mono font-medium tracking-tighter text-white/20 w-12 text-right flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white uppercase tracking-[0.1em] truncate">
                        Server {guild.id}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-[0.3em] mt-1">
                        <Users className="w-3 h-3" /> Public Community
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-medium text-white tracking-tighter">
                        {guild.totalXp.toLocaleString()} XP
                      </div>
                      <div className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Total Volume</div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0 hidden sm:block" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
