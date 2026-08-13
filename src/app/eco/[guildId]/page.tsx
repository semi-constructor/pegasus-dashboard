import { db } from "@/lib/db";
import { guilds, guildSettings, economyBalances, users } from "../../../../schemas";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Coins, Shield, Activity } from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function GuildEcoPage({ params }: { params: Promise<{ guildId: string }> }) {
  const { guildId } = await params;
  
  const settings = await db
    .select({ publicEco: guildSettings.publicEco })
    .from(guildSettings)
    .where(eq(guildSettings.guildId, guildId))
    .limit(1);

  if (!settings.length || !settings[0].publicEco) {
    return (
      <MarketingLayout>
        <div className="min-h-screen bg-background flex items-center justify-center selection:bg-foreground selection:text-background">
          <div className="text-center p-12 border border-border bg-[#050505] max-w-md">
            <Shield className="w-8 h-8 text-foreground/30 mx-auto mb-4" />
            <h2 className="text-sm font-medium text-foreground uppercase tracking-[0.2em] mb-2">Private Economy</h2>
            <p className="text-foreground/40 text-xs uppercase tracking-[0.2em]">This server has not enabled its public economy leaderboard.</p>
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
      balance: economyBalances.balance,
      bankBalance: economyBalances.bankBalance,
    })
    .from(economyBalances)
    .innerJoin(users, eq(users.id, economyBalances.userId))
    .where(eq(economyBalances.guildId, guildId))
    .orderBy(desc(economyBalances.balance))
    .limit(100);

  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-background pt-48 pb-32 overflow-hidden selection:bg-foreground selection:text-background">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-foreground/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-foreground/[0.03]" />

        <div className="max-w-5xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="mb-24">
            <div className="inline-flex items-center gap-2 text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
              <Coins className="w-3 h-3" /> SERVER_ECONOMY
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground mb-8 uppercase leading-[0.9]">
              Server {guildId}
            </h1>
            <p className="text-foreground/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed">
              The richest members in this community. Work, daily, and gamble your way to the top.
            </p>
          </div>

          <div className="w-full h-px bg-foreground/10 mb-16" />

          <div className="border border-border bg-[#050505]">
            {topUsers.length === 0 ? (
              <div className="text-center py-24">
                <Activity className="w-8 h-8 text-foreground/20 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-foreground/50 uppercase tracking-[0.2em] mb-2">No Wealthy Members Yet</h3>
                <p className="text-foreground/30 text-xs uppercase tracking-[0.2em]">Nobody has started their economic journey in this server.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {topUsers.map((user, index) => (
                  <div 
                    key={user.id}
                    className="flex items-center gap-6 p-6 hover:bg-foreground/[0.02] transition-all"
                  >
                    <span className="text-2xl font-mono font-medium tracking-tighter text-foreground/20 w-12 text-right flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    
                    <div className="relative w-10 h-10 overflow-hidden flex-shrink-0 border border-border grayscale hover:grayscale-0 transition-all">
                      <Image 
                        src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png"} 
                        alt={user.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground truncate uppercase tracking-[0.1em]">
                        {user.username}
                      </h3>
                      <div className="text-[10px] text-foreground/20 font-mono uppercase tracking-[0.3em] mt-1">
                        ID: {user.id}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-medium text-foreground tracking-tighter">
                        {(user.balance + user.bankBalance).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-foreground/20 uppercase tracking-[0.2em]">
                        W: {user.balance.toLocaleString()} | B: {user.bankBalance.toLocaleString()}
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
