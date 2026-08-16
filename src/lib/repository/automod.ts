import { db } from "@/lib/db";
import { autoModRules, autoModInfractions, quarantineVault } from "schemas/automod";
import { eq, and, desc } from "drizzle-orm";
import { getGuildContext } from "./guild";

export async function getAutoModRulesRepo(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/automod/rules/${guildId}`, {
        headers: { Authorization: `Bearer ${context.apiToken}` },
        cache: "no-store",
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  }
  return await db
    .select()
    .from(autoModRules)
    .where(eq(autoModRules.guildId, guildId))
    .orderBy(desc(autoModRules.createdAt));
}

export async function createAutoModRuleRepo(guildId: string, data: any, userId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/automod/rules`, {
        method: "POST",
        headers: { Authorization: `Bearer ${context.apiToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ guildId, createdBy: userId, ...data }),
      });
      return { success: res.ok };
    } catch (e) {
      return { success: false, error: "Failed to create AutoMod rule" };
    }
  }
  await db.insert(autoModRules).values({
    guildId,
    createdBy: userId,
    ...data,
  });
  return { success: true };
}

export async function toggleAutoModRuleRepo(guildId: string, ruleId: string, enabled: boolean) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/automod/rules/${ruleId}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${context.apiToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ guildId, enabled }),
      });
      return { success: res.ok };
    } catch (e) {
      return { success: false, error: "Failed to toggle rule" };
    }
  }
  await db
    .update(autoModRules)
    .set({ enabled, updatedAt: new Date() })
    .where(and(eq(autoModRules.id, ruleId), eq(autoModRules.guildId, guildId)));
  return { success: true };
}

export async function deleteAutoModRuleRepo(guildId: string, ruleId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/automod/rules/${ruleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${context.apiToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ guildId }),
      });
      return { success: res.ok };
    } catch (e) {
      return { success: false, error: "Failed to delete rule" };
    }
  }
  await db
    .delete(autoModRules)
    .where(and(eq(autoModRules.id, ruleId), eq(autoModRules.guildId, guildId)));
  return { success: true };
}

export async function getAutoModInfractionsRepo(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/automod/infractions/${guildId}`, {
        headers: { Authorization: `Bearer ${context.apiToken}` },
        cache: "no-store",
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  }
  return await db
    .select()
    .from(autoModInfractions)
    .where(eq(autoModInfractions.guildId, guildId))
    .orderBy(desc(autoModInfractions.createdAt))
    .limit(100);
}

export async function getQuarantineVaultRepo(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/automod/quarantine/${guildId}`, {
        headers: { Authorization: `Bearer ${context.apiToken}` },
        cache: "no-store",
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  }
  return await db
    .select()
    .from(quarantineVault)
    .where(eq(quarantineVault.guildId, guildId))
    .orderBy(desc(quarantineVault.createdAt));
}

export async function releaseFromQuarantineRepo(guildId: string, vaultId: string, userId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    try {
      const res = await fetch(`${context.apiUrl}/automod/quarantine/${vaultId}/release`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${context.apiToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ guildId, releasedBy: userId }),
      });
      return { success: res.ok };
    } catch (e) {
      return { success: false, error: "Failed to release user" };
    }
  }
  await db
    .update(quarantineVault)
    .set({
      released: true,
      releasedBy: userId,
      releasedAt: new Date(),
    })
    .where(and(eq(quarantineVault.id, vaultId), eq(quarantineVault.guildId, guildId)));
  return { success: true };
}
