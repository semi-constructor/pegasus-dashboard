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
    <div className="space-y-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-medium tracking-[0.3em] uppercase text-foreground">
          {t('servers.title')}
        </h2>
        <p className="text-foreground/50 text-sm tracking-wide">{t('servers.description')}</p>
      </div>

      <div className="space-y-12">
        {botGuilds.length === 0 ? (
          <div className="bg-background border border-border p-12 text-center">
            <p className="text-foreground/50 text-sm tracking-widest uppercase">{t('servers.noServers')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 border border-border">
            {botGuilds.map((guild: any) => {
              const isConfigured = configuredGuildIds.includes(guild.id);
              
              return (
                <Link key={guild.id} href={`/dashboard/${guild.id}`}>
                  <div className="bg-background p-8 hover:bg-foreground/5 transition-colors group h-full flex flex-col justify-between">
                    <div className="flex items-center gap-6 w-full mb-8">
                      {guild.icon ? (
                        <img
                          src={getGuildIconUrl(guild.id, guild.icon)!}
                          alt={`${guild.name} icon`}
                          className="w-12 h-12 rounded-none object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all border border-border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-none bg-foreground/5 border border-border flex items-center justify-center text-foreground font-medium text-lg shrink-0">
                          {guild.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground group-hover:text-foreground transition-colors truncate tracking-wide" title={guild.name}>
                          {guild.name}
                        </h3>
                        <p className="text-[10px] text-foreground/50 font-mono mt-1">
                          {guild.id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex gap-2">
                        {isConfigured ? (
                          <span className="px-3 py-1 text-[10px] uppercase tracking-widest border border-border text-foreground">
                            {t('servers.configured')}
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-[10px] uppercase tracking-widest border border-border/30 text-foreground/50">
                            {t('servers.unconfigured')}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-foreground/30 group-hover:text-foreground transition-colors shrink-0" />
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
