import { db } from "@/lib/db";
import { giveaways, giveawayEntries, users } from "../../../../schemas";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Gift, Clock, Users, Check, Shield } from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function PublicGiveawayPage({ params }: { params: Promise<{ gwId: string }> }) {
  const { gwId } = await params;

  const gwList = await db
    .select()
    .from(giveaways)
    .where(eq(giveaways.giveawayId, gwId))
    .limit(1);

  if (!gwList.length) {
    return (
      <MarketingLayout>
        <div className="min-h-screen bg-background flex items-center justify-center selection:bg-foreground selection:text-background">
          <div className="text-center p-12 border border-border bg-[#050505] max-w-md">
            <Shield className="w-8 h-8 text-foreground/30 mx-auto mb-4" />
            <h2 className="text-sm font-medium text-foreground uppercase tracking-[0.2em] mb-2">Not Found</h2>
            <p className="text-foreground/40 text-xs uppercase tracking-[0.2em]">This giveaway does not exist or has been deleted.</p>
          </div>
        </div>
      </MarketingLayout>
    );
  }

  const gw = gwList[0];

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
      <div className="relative min-h-screen bg-background pt-48 pb-32 overflow-hidden selection:bg-foreground selection:text-background">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-foreground/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-foreground/[0.03]" />
        
        <div className="max-w-4xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="mb-24">
            <div className="inline-flex items-center gap-2 text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
              <Gift className="w-3 h-3" /> PUBLIC_GIVEAWAY
            </div>
            <h1 className="text-4xl md:text-6xl font-medium tracking-tighter text-foreground mb-8 uppercase leading-[0.95]">
              {gw.prize}
            </h1>
            {gw.description && (
              <p className="text-foreground/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed mb-8">
                {gw.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-px bg-foreground/10 mb-8 w-fit">
              <div className="flex items-center gap-2 px-6 py-3 bg-[#050505]">
                <Clock className="w-3 h-3 text-foreground/30" />
                <span className="text-xs text-foreground/60 uppercase tracking-[0.2em]">{isEnded ? "Ended" : "Ends on"} {new Date(gw.endTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-[#050505]">
                <Users className="w-3 h-3 text-foreground/30" />
                <span className="text-xs text-foreground/60 uppercase tracking-[0.2em]">{gw.winnerCount} {gw.winnerCount === 1 ? 'Winner' : 'Winners'}</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-[#050505]">
                <Check className="w-3 h-3 text-foreground/30" />
                <span className="text-xs text-foreground/60 uppercase tracking-[0.2em]">{gw.entries} Entries</span>
              </div>
            </div>
            
            {!isEnded && (
              <div className="border border-border bg-[#050505] p-6 inline-block">
                <p className="text-foreground/40 text-xs uppercase tracking-[0.3em]">Head over to the Discord Server to enter this giveaway.</p>
              </div>
            )}
          </div>

          <div className="w-full h-px bg-foreground/10 mb-16" />

          <div className="border border-border bg-[#050505]">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-medium text-foreground uppercase tracking-[0.3em]">Participants ({entries.length}{gw.entries > 100 ? '+' : ''})</h2>
            </div>
            
            {entries.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-8 h-8 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/30 text-xs uppercase tracking-[0.2em]">Nobody has entered this giveaway yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 divide-white/5">
                {entries.map((user) => (
                  <div 
                    key={user.id}
                    className="flex items-center gap-4 p-6 hover:bg-foreground/[0.02] transition-all border-b border-border last:border-0 md:odd:border-r"
                  >
                    <div className="relative w-8 h-8 overflow-hidden flex-shrink-0 border border-border grayscale hover:grayscale-0 transition-all">
                      <Image 
                        src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png"} 
                        alt={user.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-medium text-foreground truncate uppercase tracking-[0.1em]">
                        {user.username}
                      </h3>
                      <div className="text-[10px] text-foreground/20 uppercase tracking-[0.2em] mt-0.5">
                        Joined {new Date(user.joinedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium text-foreground tracking-tighter">{user.entries}</div>
                      <div className="text-[10px] text-foreground/20 uppercase tracking-[0.3em]">Entries</div>
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
