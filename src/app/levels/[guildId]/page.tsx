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
  
  const settings = await db
    .select({ publicLevels: guildSettings.publicLevels })
    .from(guildSettings)
    .where(eq(guildSettings.guildId, guildId))
    .limit(1);

  if (!settings.length || !settings[0].publicLevels) {
    return (
      <MarketingLayout>
        <div className="min-h-screen bg-black flex items-center justify-center selection:bg-white selection:text-black">
          <div className="text-center p-12 border border-white/10 bg-[#050505] max-w-md">
            <Shield className="w-8 h-8 text-white/30 mx-auto mb-4" />
            <h2 className="text-sm font-medium text-white uppercase tracking-[0.2em] mb-2">Private Leaderboard</h2>
            <p className="text-white/40 text-xs uppercase tracking-[0.2em]">This server has not enabled its public XP leaderboard.</p>
          </div>
        </div>
      </MarketingLayout>
    );
  }

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
      <div className="relative min-h-screen bg-black pt-48 pb-32 overflow-hidden selection:bg-white selection:text-black">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-white/[0.03]" />

        <div className="max-w-5xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="mb-24">
            <div className="inline-flex items-center gap-2 text-white/30 text-xs tracking-[0.3em] uppercase mb-8 border border-white/10 px-4 py-2">
              <Trophy className="w-3 h-3" /> SERVER_XP_RANKING
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white mb-8 uppercase leading-[0.9]">
              Server {guildId}
            </h1>
            <p className="text-white/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed">
              The most active members in this community. Start chatting to gain XP and climb the ranks.
            </p>
          </div>

          <div className="w-full h-px bg-white/10 mb-16" />

          <div className="border border-white/10 bg-[#050505]">
            {topUsers.length === 0 ? (
              <div className="text-center py-24">
                <Activity className="w-8 h-8 text-white/20 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-white/50 uppercase tracking-[0.2em] mb-2">No Active Members Yet</h3>
                <p className="text-white/30 text-xs uppercase tracking-[0.2em]">Nobody has gained XP in this server.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {topUsers.map((user, index) => (
                  <div 
                    key={user.id}
                    className="flex items-center gap-6 p-6 hover:bg-white/[0.02] transition-all"
                  >
                    <span className="text-2xl font-mono font-medium tracking-tighter text-white/20 w-12 text-right flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    
                    <div className="relative w-10 h-10 overflow-hidden flex-shrink-0 border border-white/10 grayscale hover:grayscale-0 transition-all">
                      <Image 
                        src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png"} 
                        alt={user.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate uppercase tracking-[0.1em]">
                        {user.username}
                      </h3>
                      <div className="text-[10px] text-white/20 font-mono uppercase tracking-[0.3em] mt-1">
                        ID: {user.id}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-medium text-white tracking-tighter">
                        Level {user.level}
                      </div>
                      <div className="text-[10px] text-white/20 uppercase tracking-[0.3em]">
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
