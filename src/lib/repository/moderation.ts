import { db } from "@/lib/db";
import {
  modCases,
  warnings,
  warningAutomations,
  modLogSettings,
  wordFilterRules,
} from "@/../schemas/moderation";
import { eq, and, desc } from "drizzle-orm";
import { getGuildContext } from "./guild";

export async function getModCases(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/moderation/cases`, {
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (!res.ok) return [];
    return await res.json();
  }

  return await db
    .select()
    .from(modCases)
    .where(eq(modCases.guildId, guildId))
    .orderBy(desc(modCases.createdAt))
    .limit(100);
}

export async function getWarnings(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/moderation/warnings`, {
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (!res.ok) return [];
    return await res.json();
  }

  return await db
    .select()
    .from(warnings)
    .where(eq(warnings.guildId, guildId))
    .orderBy(desc(warnings.createdAt))
    .limit(100);
}

export async function createWarning(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/moderation/warnings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.apiToken}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create warning");
    return;
  }

  const warnId = `WARN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  await db.insert(warnings).values({
    warnId,
    guildId,
    ...data,
    active: true,
  });
}

export async function toggleWarningStatus(guildId: string, warningId: number, active: boolean, moderatorId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/moderation/warnings/${warningId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.apiToken}`
      },
      body: JSON.stringify({ active, moderatorId })
    });
    if (!res.ok) throw new Error("Failed to update warning status");
    return;
  }

  await db
    .update(warnings)
    .set({
      active,
      editedAt: new Date(),
      editedBy: moderatorId,
    })
    .where(and(eq(warnings.id, warningId), eq(warnings.guildId, guildId)));
}

export async function deleteWarning(guildId: string, warningId: number) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/moderation/warnings/${warningId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (!res.ok) throw new Error("Failed to delete warning");
    return;
  }

  await db
    .delete(warnings)
    .where(and(eq(warnings.id, warningId), eq(warnings.guildId, guildId)));
}

export async function getWarningAutomations(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/moderation/automations`, {
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (!res.ok) return [];
    return await res.json();
  }

  return await db
    .select()
    .from(warningAutomations)
    .where(eq(warningAutomations.guildId, guildId))
    .orderBy(desc(warningAutomations.createdAt));
}

export async function createWarningAutomation(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/moderation/automations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.apiToken}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create warning automation");
    return;
  }

  const automationId = `AUTO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  await db.insert(warningAutomations).values({
    automationId,
    guildId,
    ...data,
    enabled: true,
  });
}

export async function deleteWarningAutomation(guildId: string, id: number) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/moderation/automations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (!res.ok) throw new Error("Failed to delete warning automation");
    return;
  }

  await db
    .delete(warningAutomations)
    .where(and(eq(warningAutomations.id, id), eq(warningAutomations.guildId, guildId)));
}

export async function getWordFilters(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/moderation/filters`, {
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (!res.ok) return [];
    return await res.json();
  }

  return await db
    .select()
    .from(wordFilterRules)
    .where(eq(wordFilterRules.guildId, guildId))
    .orderBy(desc(wordFilterRules.createdAt));
}

export async function createWordFilterRule(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/moderation/filters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.apiToken}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create word filter rule");
    return;
  }

  await db.insert(wordFilterRules).values({
    guildId,
    ...data,
  });
}

export async function deleteWordFilterRule(guildId: string, id: number) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/moderation/filters/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (!res.ok) throw new Error("Failed to delete word filter rule");
    return;
  }

  await db
    .delete(wordFilterRules)
    .where(and(eq(wordFilterRules.id, id), eq(wordFilterRules.guildId, guildId)));
}

export async function getModLogSettings(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/moderation/log-settings`, {
      headers: { Authorization: `Bearer ${context.apiToken}` }
    });
    if (!res.ok) return [];
    return await res.json();
  }

  return await db
    .select()
    .from(modLogSettings)
    .where(eq(modLogSettings.guildId, guildId));
}

export async function saveModLogSetting(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/moderation/log-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.apiToken}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to save mod log setting");
    return;
  }

  const existing = await db
    .select()
    .from(modLogSettings)
    .where(
      and(
        eq(modLogSettings.guildId, guildId),
        eq(modLogSettings.category, data.category)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(modLogSettings)
      .set({
        channelId: data.channelId,
        enabled: data.enabled,
        updatedAt: new Date(),
      })
      .where(eq(modLogSettings.id, existing[0].id));
  } else {
    await db.insert(modLogSettings).values({
      guildId,
      category: data.category,
      channelId: data.channelId,
      enabled: data.enabled,
    });
  }
}
