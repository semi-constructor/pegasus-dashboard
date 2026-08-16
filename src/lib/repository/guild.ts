import { db } from '@/lib/db';
import { guildSettings, guilds } from 'schemas/guilds';
import { wordFilterRules } from 'schemas/moderation';
import { hostedInstanceGuilds, hostedInstances } from 'schemas/billing';
import { eq, and } from 'drizzle-orm';
import { getCachedData } from '@/lib/redis';
import { decryptToken } from '@/lib/encryption';

/**
 * Interface representing the unified Guild Settings
 */
export interface GuildSettings {
  guildId: string;
  logsEnabled: boolean;
  logsChannel: string | null;
  securityEnabled: boolean;
  antiRaidEnabled: boolean;
  antiSpamEnabled: boolean;
  // ... other fields as needed
}

export interface GuildContext {
  isHosted: boolean;
  instanceId?: string;
  apiUrl?: string;
  apiToken?: string;
}

/**
 * Resolves the location of a guild's data (VaultScope Central DB vs Hosted Instance API)
 */
export async function getGuildContext(guildId: string): Promise<GuildContext> {
  const result = await db.select({
    instanceId: hostedInstances.id,
    apiUrl: hostedInstances.apiUrl,
    encryptedApiToken: hostedInstances.encryptedApiToken,
  })
  .from(hostedInstanceGuilds)
  .innerJoin(hostedInstances, eq(hostedInstanceGuilds.instanceId, hostedInstances.id))
  .where(eq(hostedInstanceGuilds.guildId, guildId))
  .limit(1);

  if (result.length > 0) {
    const row = result[0];
    let apiToken = '';
    if (row.encryptedApiToken) {
      try {
        apiToken = decryptToken(row.encryptedApiToken);
      } catch (e) {
        console.error('Failed to decrypt instance api token for guild', guildId);
      }
    }

    return {
      isHosted: true,
      instanceId: row.instanceId,
      apiUrl: row.apiUrl || `http://pegasus-bot-${row.instanceId}:2000`,
      apiToken,
    };
  }

  return { isHosted: false };
}

/**
 * Fetch Guild Settings, transparently routing to Central DB or Hosted API
 */
export async function getGuildSettings(guildId: string): Promise<GuildSettings | null> {
  const context = await getGuildContext(guildId);

  if (context.isHosted) {
    // Route to Hosted Instance Internal API
    try {
      const res = await fetch(`${context.apiUrl}/guilds/${guildId}/settings`, {
        headers: {
          'Authorization': `Bearer ${context.apiToken}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error(`[Gateway] Failed to fetch hosted settings for ${guildId}:`, e);
      return null;
    }
  }

  // Route to Central VaultScope DB
  const results = await db.select().from(guildSettings).where(eq(guildSettings.guildId, guildId)).limit(1);
  return (results[0] as unknown as GuildSettings) || null;
}

/**
 * Update Guild Settings, transparently routing to Central DB or Hosted API
 */
export async function updateGuildSettings(guildId: string, data: Partial<GuildSettings>): Promise<boolean> {
  const context = await getGuildContext(guildId);

  if (context.isHosted) {
    // Route to Hosted Instance Internal API
    try {
      const res = await fetch(`${context.apiUrl}/settings`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${context.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch (e) {
      console.error(`[Gateway] Failed to update hosted settings for ${guildId}:`, e);
      return false;
    }
  }

  // Route to Central VaultScope DB
  try {
    await db.insert(guildSettings).values({
      guildId,
      ...data,
    } as any).onConflictDoUpdate({
      target: guildSettings.guildId,
      set: {
        ...data,
        updatedAt: new Date(),
      }
    });
    return true;
  } catch (e) {
    console.error(`[Central] Failed to update settings for ${guildId}:`, e);
    return false;
  }
}

export async function resetGuildSettings(guildId: string): Promise<boolean> {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/guilds/${guildId}/settings`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${context.apiToken}` }
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  try {
    await db.delete(guildSettings).where(eq(guildSettings.guildId, guildId));
    return true;
  } catch (e) {
    return false;
  }
}

export async function updateGuildConfig(guildId: string, data: { prefix: string, language: string }): Promise<boolean> {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/guilds/${guildId}/config`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${context.apiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  try {
    await db.update(guilds).set({
      prefix: data.prefix,
      language: data.language,
      updatedAt: new Date()
    }).where(eq(guilds.id, guildId));
    return true;
  } catch (e) {
    return false;
  }
}

export async function getWordFilters(guildId: string): Promise<any[]> {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/moderation/word-filters`, {
        headers: { 'Authorization': `Bearer ${context.apiToken}` }
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  }
  
  try {
    return await db.select().from(wordFilterRules).where(eq(wordFilterRules.guildId, guildId));
  } catch (e) {
    return [];
  }
}

export async function createWordFilter(guildId: string, data: { pattern: string, severity: string, autoDelete: boolean }): Promise<boolean> {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/moderation/word-filters`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${context.apiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.ok;
    } catch (e) {}
    return false;
  }
  try {
    await db.insert(wordFilterRules).values({
      guildId,
      ...data,
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteWordFilter(guildId: string, id: number): Promise<boolean> {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/moderation/word-filters/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${context.apiToken}` }
      });
      return res.ok;
    } catch (e) {}
    return false;
  }
  try {
    await db.delete(wordFilterRules).where(eq(wordFilterRules.id, id));
    return true;
  } catch (e) {
    return false;
  }
}

export async function getGuildChannelsRepo(guildId: string): Promise<any[]> {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/guilds/${guildId}/channels`, {
        headers: { Authorization: `Bearer ${context.apiToken}` },
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const channels = await res.json();
        return channels.filter((c: any) => c.type === 0 || c.type === 5);
      }
    } catch (e) {
      return [];
    }
  }

  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const channels = await res.json();
    return channels.filter((c: any) => c.type === 0 || c.type === 5);
  } catch (e) {
    return [];
  }
}

