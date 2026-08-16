import { db } from "@/lib/db";
import { xpSettings, xpRewards, xpMultipliers, userXp } from "@/../schemas/xp";
import { eq, and, desc } from "drizzle-orm";
import { getGuildContext } from "./guild";

export async function repoGetXpSettings(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/xp/settings`, { headers: { 'Authorization': `Bearer ${context.apiToken}` } });
    if (res.ok) return await res.json();
    return null;
  }
  const res = await db.select().from(xpSettings).where(eq(xpSettings.guildId, guildId)).limit(1);
  return res[0] || null;
}

export async function repoSaveXpSettings(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/xp/settings`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${context.apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  }
  await db.insert(xpSettings).values({ guildId, ...data }).onConflictDoUpdate({
    target: xpSettings.guildId,
    set: { ...data, updatedAt: new Date() },
  });
  return true;
}

export async function repoGetXpRewards(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/xp/rewards`, { headers: { 'Authorization': `Bearer ${context.apiToken}` } });
    if (res.ok) return await res.json();
    return [];
  }
  return await db.select().from(xpRewards).where(eq(xpRewards.guildId, guildId)).orderBy(xpRewards.level);
}

export async function repoCreateXpReward(guildId: string, level: number, roleId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/xp/rewards`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${context.apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, roleId })
    });
    return res.ok;
  }
  await db.insert(xpRewards).values({ guildId, level, roleId });
  return true;
}

export async function repoDeleteXpReward(guildId: string, level: number, roleId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/xp/rewards/${level}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${context.apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId })
    });
    return res.ok;
  }
  await db.delete(xpRewards).where(and(eq(xpRewards.guildId, guildId), eq(xpRewards.level, level), eq(xpRewards.roleId, roleId)));
  return true;
}

export async function repoGetXpMultipliers(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/xp/multipliers`, { headers: { 'Authorization': `Bearer ${context.apiToken}` } });
    if (res.ok) return await res.json();
    return [];
  }
  return await db.select().from(xpMultipliers).where(eq(xpMultipliers.guildId, guildId));
}

export async function repoCreateXpMultiplier(guildId: string, targetId: string, targetType: string, multiplier: number) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/xp/multipliers`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${context.apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetId, targetType, multiplier })
    });
    return res.ok;
  }
  await db.insert(xpMultipliers).values({ guildId, targetId, targetType, multiplier });
  return true;
}

export async function repoDeleteXpMultiplier(guildId: string, targetId: string, targetType: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/xp/multipliers/${targetType}/${targetId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${context.apiToken}` }
    });
    return res.ok;
  }
  await db.delete(xpMultipliers).where(and(eq(xpMultipliers.guildId, guildId), eq(xpMultipliers.targetId, targetId), eq(xpMultipliers.targetType, targetType)));
  return true;
}

export async function repoGetUserXpList(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/xp/users`, { headers: { 'Authorization': `Bearer ${context.apiToken}` } });
    if (res.ok) return await res.json();
    return [];
  }
  return await db.select().from(userXp).where(eq(userXp.guildId, guildId)).orderBy(desc(userXp.xp)).limit(100);
}

export async function repoUpdateUserXpOverride(guildId: string, userId: string, xp: number, level: number, prestigeLevel: number) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/xp/user/${userId}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${context.apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ xp, level, prestigeLevel })
    });
    return res.ok;
  }
  await db.insert(userXp).values({ userId, guildId, xp, level, prestigeLevel, lastXpGain: new Date() }).onConflictDoUpdate({
    target: [userXp.userId, userXp.guildId],
    set: { xp, level, prestigeLevel, updatedAt: new Date() },
  });
  return true;
}
