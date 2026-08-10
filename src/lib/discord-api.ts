import { getCachedData } from "@/lib/redis";

const DISCORD_API = "https://discord.com/api/v10";

// Discord channel types
const TEXT_CHANNEL = 0;
const ANNOUNCEMENT_CHANNEL = 5;
const VOICE_CHANNEL = 2;
const CATEGORY_CHANNEL = 4;
const STAGE_CHANNEL = 13;
const FORUM_CHANNEL = 15;

export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
  position: number;
  parent_id: string | null;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
  permissions: string;
  managed: boolean;
  icon: string | null;
  unicode_emoji: string | null;
}

export interface DiscordMember {
  user: {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
    discriminator: string;
  };
  nick: string | null;
  roles: string[];
  joined_at: string;
}

/**
 * Fetch all channels for a guild (bot token, cached 60s).
 * Returns text + announcement channels by default.
 */
export async function getGuildChannels(
  guildId: string,
  filter: "text" | "voice" | "category" | "all" = "text"
): Promise<DiscordChannel[]> {
  const channels = await getCachedData<DiscordChannel[]>(
    `discord:channels:${guildId}`,
    async () => {
      const res = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      });
      if (!res.ok) return [];
      return res.json();
    },
    60
  );

  if (filter === "all") return channels;

  const typeMap: Record<string, number[]> = {
    text: [TEXT_CHANNEL, ANNOUNCEMENT_CHANNEL, FORUM_CHANNEL],
    voice: [VOICE_CHANNEL, STAGE_CHANNEL],
    category: [CATEGORY_CHANNEL],
  };

  return channels
    .filter((c) => typeMap[filter]?.includes(c.type))
    .sort((a, b) => a.position - b.position);
}

/**
 * Fetch all roles for a guild (bot token, cached 60s).
 * Excludes @everyone and managed (bot) roles by default.
 */
export async function getGuildRoles(
  guildId: string,
  includeManaged = false
): Promise<DiscordRole[]> {
  const roles = await getCachedData<DiscordRole[]>(
    `discord:roles:${guildId}`,
    async () => {
      const res = await fetch(`${DISCORD_API}/guilds/${guildId}/roles`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      });
      if (!res.ok) return [];
      return res.json();
    },
    60
  );

  return roles
    .filter((r) => r.name !== "@everyone" && (includeManaged || !r.managed))
    .sort((a, b) => b.position - a.position);
}

/**
 * Search guild members by query string (bot token, not cached — live search).
 * Returns up to `limit` members matching the query.
 */
export async function searchGuildMembers(
  guildId: string,
  query: string,
  limit = 25
): Promise<DiscordMember[]> {
  if (!query || query.length < 1) return [];

  try {
    const res = await fetch(
      `${DISCORD_API}/guilds/${guildId}/members/search?query=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/**
 * Convert a Discord color int to hex string.
 */
export function colorIntToHex(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}

/**
 * Fetch a guild by ID.
 */
export async function getGuild(guildId: string): Promise<any> {
  return await getCachedData(
    `discord:guild:${guildId}`,
    async () => {
      const res = await fetch(`${DISCORD_API}/guilds/${guildId}`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      });
      if (!res.ok) return null;
      return res.json();
    },
    300
  );
}
