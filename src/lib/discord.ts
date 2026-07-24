import { getCachedData, setCachedData } from "./redis";
import { db } from "./db";
import { accounts } from "../../schemas/auth";
import { eq } from "drizzle-orm";

const DISCORD_API = "https://discord.com/api/v10";

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

export async function getBotGuilds(): Promise<DiscordGuild[]> {
  return getCachedData(
    "bot_guilds",
    async () => {
      const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch bot guilds");
      return res.json();
    },
    300 // Cache for 5 minutes
  );
}

export async function getUserGuilds(userId: string): Promise<DiscordGuild[]> {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  });

  if (!account || !account.access_token) {
    throw new Error("No Discord account or access token found for user");
  }

  return getCachedData(
    `user_guilds:${userId}`,
    async () => {
      const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user guilds");
      return res.json();
    },
    60 // Cache for 1 minute
  );
}

export async function getSyncedGuilds(userId: string) {
  const [botGuilds, userGuilds] = await Promise.all([
    getBotGuilds(),
    getUserGuilds(userId),
  ]);

  const botGuildIds = new Set(botGuilds.map((g) => g.id));

  // Filter for guilds where user is owner or has MANAGE_GUILD (0x20) or ADMINISTRATOR (0x8)
  const manageGuilds = userGuilds.filter((g) => {
    const perms = BigInt(g.permissions);
    return g.owner || (perms & BigInt(0x20)) === BigInt(0x20) || (perms & BigInt(0x8)) === BigInt(0x8);
  });

  return manageGuilds.map((g) => ({
    ...g,
    botJoined: botGuildIds.has(g.id),
  }));
}
