import { db } from "@/lib/db";
import { guilds, guildSettings, userXp, users } from "../../../../schemas";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Trophy, Shield, Activity } from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function GuildLevelsPage({ params }: { params: Promise<{ guildId: string }> }) {
  const { guildId } = await params;
  
  // Check if guild has publicLevels enabled
  const settings = await db
    .select({ publicLevels: guildSettings.publicLevels })
    .from(guildSettings)
    .where(eq(guildSettings.guildId, guildId))
    .limit(1);

  if (!settings.length || !settings[0].publicLevels) {
    return (
      <MarketingLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center p-8 bg-white/5 border border-white/10 rounded-3xl max-w-md">
            <Shield className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Private Leaderboard</h2>
            <p className="text-white/50">This server has not enabled its public XP leaderboard.</p>
          </div>
        </div>
      </MarketingLayout>
    );
  }

  // Fetch top 100 users for this guild
  const topUsers = await db
    .select({
      id: users.id,
      username: users.username,
      avatar: users.avatar,
      level: userXp.level,
      xp: userXp.xp,
    })
    .from(userXp)
    .innerJoin(users, eq(users.id, userXp.userId))
    .where(eq(userXp.guildId, guildId))
    .orderBy(desc(userXp.xp))
    .limit(100);

  return (
    <MarketingLayout>
      <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 py-24 relative z-10">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
              <Trophy className="w-4 h-4" />
              Server XP Leaderboard
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">
              Server {guildId}
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              The most active members in this community. Start chatting to gain XP and climb the ranks!
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-2 md:p-6 backdrop-blur-xl">
            {topUsers.length === 0 ? (
              <div className="text-center py-24">
                <Activity className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white/70 mb-2">No Active Members Yet</h3>
                <p className="text-white/40">Nobody has gained XP in this server.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topUsers.map((user, index) => (
                  <div 
                    key={user.id}
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
                    
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/10 group-hover:border-purple-500/50 transition-colors">
                      <Image 
                        src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png"} 
                        alt={user.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white truncate">
                        {user.username}
                      </h3>
                      <div className="text-sm text-white/40 mt-1 font-mono">
                        ID: {user.id}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-purple-400">
                        Level {user.level}
                      </div>
                      <div className="text-xs text-white/30 uppercase font-bold tracking-wider">
                        {user.xp.toLocaleString()} XP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
