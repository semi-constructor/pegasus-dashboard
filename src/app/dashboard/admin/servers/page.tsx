import { Shield, Server, ChevronRight } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { guilds as dbGuilds } from "../../../../../schemas";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function AdminServersPage() {
  const t = await getTranslations('adminPages');
  const botToken = process.env.DISCORD_BOT_TOKEN;
  let botGuilds: any[] = [];
  
  if (botToken) {
    const res = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      cache: "no-store",
    });
    
    if (res.ok) {
      botGuilds = await res.json();
    }
  }

  // Fetch configured guilds from database
  const configured = await db.select({ id: dbGuilds.id }).from(dbGuilds);
  const configuredGuildIds = configured.map((c) => c.id);

  const getGuildIconUrl = (guildId: string, iconHash: string | null) => {
    if (!iconHash) return null;
    return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          {t('servers.title')}
        </h2>
        <p className="text-white/40 mt-1">{t('servers.description')}</p>
      </div>

      <div className="space-y-8">
        {botGuilds.length === 0 ? (
          <div className="bg-card/50 border border-border/50 rounded-xl p-8 text-center">
            <p className="text-white/40">{t('servers.noServers')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {botGuilds.map((guild: any) => {
              const isConfigured = configuredGuildIds.includes(guild.id);
              
              return (
                <Link key={guild.id} href={`/dashboard/${guild.id}`}>
                  <div className="bg-card border border-border/50 rounded-xl p-4 hover:border-primary/50 transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.1)] group h-full flex flex-col justify-between">
                    <div className="flex items-center gap-4 w-full mb-3">
                      {guild.icon ? (
                        <img
                          src={getGuildIconUrl(guild.id, guild.icon)!}
                          alt={`${guild.name} icon`}
                          className="w-12 h-12 rounded-full object-cover border border-border/50"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                          {guild.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate" title={guild.name}>
                          {guild.name}
                        </h3>
                        <p className="text-xs text-white/40 font-mono">
                          {guild.id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex gap-2">
                        {isConfigured ? (
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                            {t('servers.configured')}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/5 text-white/40 border border-white/10">
                            {t('servers.unconfigured')}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
