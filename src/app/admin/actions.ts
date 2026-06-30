'use server';

import { db } from '@/lib/db';
import * as schema from '../../../schemas/index';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const ALL_KNOWN_TABLES = [
  'guilds', 'guildSettings', 'users', 'members', 'modCases', 'warnings',
  'warningAutomations', 'modLogSettings', 'wordFilterRules', 'giveaways',
  'giveawayEntries', 'ticketPanels', 'tickets', 'ticketMessages', 'userXp',
  'xpRewards', 'xpMultipliers', 'xpSettings', 'economyBalances',
  'economyTransactions', 'economyShopItems', 'economyUserItems', 'economyCooldowns',
  'economyGamblingStats', 'economySettings', 'securityLogs', 'blacklist',
  'auditLogs', 'rateLimitViolations', 'securityIncidents', 'apiKeys',
  'jtcConfigs', 'jtcChannels', 'autoModRules', 'autoModInfractions',
  'quarantineVault', 'achievements', 'userAchievements', 'engagementQuests',
  'userQuestProgress', 'userReputation', 'ticketDepartments', 'ticketRatings'
];

export async function updateDatabaseEntry(tableName: string, pkObjStr: string, existingRowJson: string, formData: FormData) {
  if (!ALL_KNOWN_TABLES.includes(tableName)) throw new Error(`Invalid table name: ${tableName}`);
  const table = (schema as any)[tableName];
  if (!table) throw new Error(`Table ${tableName} not found in schema`);

  const pkObj = JSON.parse(pkObjStr);
  const existingRow = JSON.parse(existingRowJson);
  
  // Build the where clause
  const conditions = Object.entries(pkObj).map(([colName, colValue]) => {
    if (!table[colName] || colName === '_' || colName === 'getSQL' || colName === 'config') {
      throw new Error(`Invalid column name: ${colName}`);
    }
    return eq(table[colName], colValue);
  });
  
  const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);

  // Build the update data
  const updateData: Record<string, any> = {};
  
  for (const colName of Object.keys(existingRow)) {
    if (colName in pkObj) continue; // don't update primary key
    if (colName === '_' || colName === 'createdAt' || colName === 'updatedAt' || colName === 'getSQL' || colName === 'config') continue;
    if (!table[colName]) continue;
    
    if (formData.has(colName)) {
      const formValue = formData.get(colName) as string;
      const existingVal = existingRow[colName];
      const colObj = table[colName];
      const dataType = colObj ? (colObj as any).dataType : '';

      if (typeof existingVal === 'number' || dataType === 'number' || dataType === 'bigint' || dataType === 'integer') {
        const parsed = Number(formValue);
        if (!isNaN(parsed)) updateData[colName] = parsed;
      } else if (typeof existingVal === 'boolean' || dataType === 'boolean') {
        updateData[colName] = formValue === 'true';
      } else if ((typeof existingVal === 'object' && existingVal !== null) || dataType === 'json' || dataType === 'jsonb') {
        try {
          updateData[colName] = JSON.parse(formValue);
        } catch (e) {
          updateData[colName] = formValue;
        }
      } else {
        updateData[colName] = formValue;
      }
    }
  }

  if (Object.keys(updateData).length > 0) {
    await db.update(table).set(updateData).where(whereClause);
  }

  revalidatePath('/admin/database');
  redirect(`/admin/database?table=${encodeURIComponent(tableName)}&msg=successfully_updated`);
}

export async function createDatabaseEntry(tableName: string, formData: FormData) {
  if (!ALL_KNOWN_TABLES.includes(tableName)) throw new Error(`Invalid table name: ${tableName}`);
  const table = (schema as any)[tableName];
  if (!table) throw new Error(`Table ${tableName} not found in schema`);

  const insertData: Record<string, any> = {};

  for (const key of Object.keys(table)) {
    if (key === '_' || key === 'getSQL' || key === 'config') continue;
    const colObj = table[key];
    if (!colObj || typeof colObj !== 'object') continue;

    const dataType = (colObj as any).dataType || (colObj as any).columnType || 'string';

    if (formData.has(key)) {
      const formValue = formData.get(key) as string;
      if (!formValue && (key === 'createdAt' || key === 'updatedAt')) continue; // let db defaultNow() handle it
      if (!formValue && key === 'id' && dataType !== 'string') continue; // let serial/uuid handle it if empty

      if (dataType === 'number' || dataType === 'integer' || dataType === 'bigint') {
        const parsed = Number(formValue);
        if (!isNaN(parsed)) insertData[key] = parsed;
      } else if (dataType === 'boolean') {
        insertData[key] = formValue === 'true';
      } else if (dataType === 'json' || dataType === 'jsonb') {
        try {
          insertData[key] = JSON.parse(formValue);
        } catch (e) {
          insertData[key] = formValue;
        }
      } else {
        insertData[key] = formValue;
      }
    }
  }

  await db.insert(table).values(insertData);

  revalidatePath('/admin/database');
  redirect(`/admin/database?table=${encodeURIComponent(tableName)}&msg=successfully_created`);
}

export async function deleteDatabaseEntry(tableName: string, pkObjStr: string) {
  if (!ALL_KNOWN_TABLES.includes(tableName)) throw new Error(`Invalid table name: ${tableName}`);
  const table = (schema as any)[tableName];
  if (!table) throw new Error(`Table ${tableName} not found in schema`);

  const pkObj = JSON.parse(pkObjStr);
  
  const conditions = Object.entries(pkObj).map(([colName, colValue]) => {
    if (!table[colName] || colName === '_' || colName === 'getSQL' || colName === 'config') {
      throw new Error(`Invalid column name: ${colName}`);
    }
    return eq(table[colName], colValue);
  });
  
  const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);

  await db.delete(table).where(whereClause);

  revalidatePath('/admin/database');
  redirect(`/admin/database?table=${encodeURIComponent(tableName)}&msg=successfully_deleted`);
}
