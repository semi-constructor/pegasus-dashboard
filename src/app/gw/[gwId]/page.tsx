import { db } from "@/lib/db";
import { giveaways, giveawayEntries, users } from "../../../../schemas";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Gift, Clock, Users, CheckCircle2, Shield } from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function PublicGiveawayPage({ params }: { params: Promise<{ gwId: string }> }) {
  const { gwId } = await params;

  // Fetch giveaway details
  const gwList = await db
    .select()
    .from(giveaways)
    .where(eq(giveaways.giveawayId, gwId))
    .limit(1);

  if (!gwList.length) {
    return (
      <MarketingLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center p-8 bg-white/5 border border-white/10 rounded-3xl max-w-md">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Not Found</h2>
            <p className="text-white/50">This giveaway does not exist or has been deleted.</p>
          </div>
        </div>
      </MarketingLayout>
    );
  }

  const gw = gwList[0];

  // Fetch entries
  const entries = await db
    .select({
      id: users.id,
      username: users.username,
      avatar: users.avatar,
      entries: giveawayEntries.entries,
      joinedAt: giveawayEntries.joinedAt,
    })
    .from(giveawayEntries)
    .innerJoin(users, eq(users.id, giveawayEntries.userId))
    .where(eq(giveawayEntries.giveawayId, gwId))
    .orderBy(desc(giveawayEntries.joinedAt))
    .limit(100);

  const isEnded = gw.status === "ended" || gw.status === "cancelled" || new Date() > new Date(gw.endTime);

  return (
    <MarketingLayout>
      <div className="min-h-screen bg-black text-white selection:bg-pink-500/30 pb-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 py-24 relative z-10">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium">
              <Gift className="w-4 h-4" />
              Public Giveaway
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">
              {gw.prize}
            </h1>
            {gw.description && (
              <p className="text-lg text-white/50 max-w-2xl mx-auto">
                {gw.description}
              </p>
            )}
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <Clock className="w-5 h-5 text-white/40" />
                <span className="font-medium">{isEnded ? "Ended" : "Ends on"} {new Date(gw.endTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <Users className="w-5 h-5 text-white/40" />
                <span className="font-medium">{gw.winnerCount} {gw.winnerCount === 1 ? 'Winner' : 'Winners'}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-white/40" />
                <span className="font-medium">{gw.entries} Entries</span>
              </div>
            </div>
            
            {!isEnded && (
              <div className="mt-8 p-4 bg-pink-500/10 border border-pink-500/20 rounded-2xl inline-block">
                <p className="text-pink-400 font-medium">Head over to the Discord Server to enter this giveaway!</p>
              </div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-2 md:p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-6 px-4">Participants ({entries.length}{gw.entries > 100 ? '+' : ''})</h2>
            
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/40">Nobody has entered this giveaway yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {entries.map((user) => (
                  <div 
                    key={user.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10">
                      <Image 
                        src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png"} 
                        alt={user.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate">
                        {user.username}
                      </h3>
                      <div className="text-xs text-white/40 mt-1">
                        Joined {new Date(user.joinedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-pink-400">
                        {user.entries}
                      </div>
                      <div className="text-[10px] text-white/30 uppercase font-bold tracking-wider">Entries</div>
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
