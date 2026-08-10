import { db } from "@/lib/db";
import { guilds, guildSettings, userXp } from "../../../schemas";
import { eq, sum, desc } from "drizzle-orm";
import Link from "next/link";
import { Trophy, Shield, Users, ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";

export const dynamic = "force-dynamic";

export default async function GlobalLevelsPage() {
  // Query guilds that have publicLevels enabled
  // We need to join guilds, guildSettings, and userXp to get total XP
  const topGuilds = await db
    .select({
      id: guilds.id,
      name: guilds.language, // Fallback since name isn't stored in guilds. In production we'd sync guild names or fetch from bot
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
      <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 py-24 relative z-10">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
              <Trophy className="w-4 h-4" />
              Global XP Leaderboard
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">
              Top Ranked Servers
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Discover the most active communities competing on the global leaderboard. Enable Public Levels in your server settings to join the race.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-2 md:p-6 backdrop-blur-xl">
            {topGuilds.length === 0 ? (
              <div className="text-center py-24">
                <Shield className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white/70 mb-2">No Servers Found</h3>
                <p className="text-white/40">Be the first to enable Public Levels and claim the #1 spot!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topGuilds.map((guild, index) => (
                  <Link 
                    href={`/levels/${guild.id}`} 
                    key={guild.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all group"
                  >
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-xl shrink-0 ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.3)]' :
                      index === 1 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/50' :
                      index === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/50' :
                      'bg-white/5 text-white/40 border border-white/10'
                    }`}>
                      #{index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white truncate flex items-center gap-2">
                        Server {guild.id}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-white/40 mt-1">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Public Community</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-purple-400">
                        {guild.totalXp.toLocaleString()} XP
                      </div>
                      <div className="text-xs text-white/30 uppercase font-bold tracking-wider">Total Volume</div>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors shrink-0 ml-2 hidden sm:flex">
                      <ArrowRight className="w-4 h-4" />
                    </div>
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
