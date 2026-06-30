'use server';

import { db } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import * as schema from '../../schemas/index';
import * as api from '@/lib/api';

// ==========================================
// Bot API & Discord Data Helpers
// ==========================================
export async function getGuildChannels(guildId: string) {
  try {
    return await api.getGuildChannels(guildId);
  } catch (error) {
    console.error('API fetch error getGuildChannels:', error);
    return [];
  }
}

export async function getGuildRoles(guildId: string) {
  try {
    return await api.getGuildRoles(guildId);
  } catch (error) {
    console.error('API fetch error getGuildRoles:', error);
    return [];
  }
}

export async function getGuildMembers(guildId: string) {
  try {
    const members = await api.getGuildMembers(guildId);
    return members.map(m => ({
      id: m.id,
      username: m.username,
      displayName: m.username.split('#')[0],
      bot: false,
      online: true,
      roles: ['99988877766655544']
    }));
  } catch (error) {
    console.error('API fetch error getGuildMembers:', error);
    return [];
  }
}

// ==========================================
// Guild Settings CRUD
// ==========================================
export async function getGuildSettings(guildId: string) {
  try {
    const guildRes = await db.select().from(schema.guilds).where(eq(schema.guilds.id, guildId));
    const settingsRes = await db.select().from(schema.guildSettings).where(eq(schema.guildSettings.guildId, guildId));
    
    const prefix = guildRes.length > 0 ? guildRes[0].prefix || '!' : '!';
    const language = guildRes.length > 0 ? guildRes[0].language || 'en' : 'en';

    if (settingsRes.length > 0) {
      return { ...settingsRes[0], prefix, language };
    }
    return {
      guildId,
      prefix,
      language,
      welcomeEnabled: false,
      welcomeChannel: '',
      welcomeMessage: '',
      welcomeEmbedEnabled: false,
      welcomeEmbedColor: '#0099FF',
      welcomeEmbedTitle: '',
      welcomeDmEnabled: false,
      welcomeDmMessage: '',
      goodbyeEnabled: false,
      goodbyeChannel: '',
      goodbyeMessage: '',
      goodbyeEmbedEnabled: false,
      goodbyeEmbedColor: '#FF0000',
      goodbyeEmbedTitle: '',
      logsEnabled: false,
      logsChannel: '',
      xpEnabled: true,
      xpRate: 1,
      xpPerMessage: 5,
      xpPerVoiceMinute: 10,
      xpCooldown: 60,
      xpAnnounceLevelUp: true,
      levelUpMessage: '',
      levelUpChannel: '',
      autoroleEnabled: false,
      autoroleRoles: '[]',
      securityEnabled: true,
      securityAlertRole: '',
      antiRaidEnabled: true,
      antiSpamEnabled: true,
      maxMentions: 5,
      maxDuplicates: 3,
    };
  } catch (error) {
    console.error('DB fetch error getGuildSettings:', error);
    return {
      guildId,
      prefix: '!',
      language: 'en',
      welcomeEnabled: false,
      welcomeChannel: '',
      welcomeMessage: '',
      welcomeEmbedEnabled: false,
      welcomeEmbedColor: '#0099FF',
      welcomeEmbedTitle: '',
      welcomeDmEnabled: false,
      welcomeDmMessage: '',
      goodbyeEnabled: false,
      goodbyeChannel: '',
      goodbyeMessage: '',
      goodbyeEmbedEnabled: false,
      goodbyeEmbedColor: '#FF0000',
      goodbyeEmbedTitle: '',
      logsEnabled: false,
      logsChannel: '',
      xpEnabled: true,
      xpRate: 1,
      xpPerMessage: 5,
      xpPerVoiceMinute: 10,
      xpCooldown: 60,
      xpAnnounceLevelUp: true,
      levelUpMessage: '',
      levelUpChannel: '',
      autoroleEnabled: false,
      autoroleRoles: '[]',
      securityEnabled: true,
      securityAlertRole: '',
      antiRaidEnabled: true,
      antiSpamEnabled: true,
      maxMentions: 5,
      maxDuplicates: 3,
    };
  }
}

export async function updateGuildSettings(guildId: string, formData: FormData): Promise<void> {
  try {
    const prefix = (formData.get('prefix') as string) || '!';
    const language = (formData.get('language') as string) || 'en';
    
    const welcomeEnabled = formData.get('welcomeEnabled') === 'true';
    const welcomeChannel = formData.get('welcomeChannel') as string;
    const welcomeMessage = formData.get('welcomeMessage') as string;
    const welcomeEmbedEnabled = formData.get('welcomeEmbedEnabled') === 'true';
    const welcomeEmbedColor = (formData.get('welcomeEmbedColor') as string) || '#0099FF';
    const welcomeEmbedTitle = formData.get('welcomeEmbedTitle') as string;
    const welcomeDmEnabled = formData.get('welcomeDmEnabled') === 'true';
    const welcomeDmMessage = formData.get('welcomeDmMessage') as string;

    const goodbyeEnabled = formData.get('goodbyeEnabled') === 'true';
    const goodbyeChannel = formData.get('goodbyeChannel') as string;
    const goodbyeMessage = formData.get('goodbyeMessage') as string;
    const goodbyeEmbedEnabled = formData.get('goodbyeEmbedEnabled') === 'true';
    const goodbyeEmbedColor = (formData.get('goodbyeEmbedColor') as string) || '#FF0000';
    const goodbyeEmbedTitle = formData.get('goodbyeEmbedTitle') as string;

    const logsEnabled = formData.get('logsEnabled') === 'true';
    const logsChannel = formData.get('logsChannel') as string;

    const autoroleEnabled = formData.get('autoroleEnabled') === 'true';
    const autoroleRoles = formData.get('autoroleRoles') as string || '[]';

    const securityEnabled = formData.get('securityEnabled') === 'true';
    const securityAlertRole = formData.get('securityAlertRole') as string;
    const antiRaidEnabled = formData.get('antiRaidEnabled') === 'true';
    const antiSpamEnabled = formData.get('antiSpamEnabled') === 'true';
    const maxMentions = parseInt(formData.get('maxMentions') as string, 10) || 5;
    const maxDuplicates = parseInt(formData.get('maxDuplicates') as string, 10) || 3;

    await db.insert(schema.guilds).values({ id: guildId, prefix, language }).onConflictDoUpdate({
      target: schema.guilds.id,
      set: { prefix, language, updatedAt: new Date() },
    });

    await db.insert(schema.guildSettings).values({
      guildId,
      welcomeEnabled,
      welcomeChannel,
      welcomeMessage,
      welcomeEmbedEnabled,
      welcomeEmbedColor,
      welcomeEmbedTitle,
      welcomeDmEnabled,
      welcomeDmMessage,
      goodbyeEnabled,
      goodbyeChannel,
      goodbyeMessage,
      goodbyeEmbedEnabled,
      goodbyeEmbedColor,
      goodbyeEmbedTitle,
      logsEnabled,
      logsChannel,
      autoroleEnabled,
      autoroleRoles,
      securityEnabled,
      securityAlertRole,
      antiRaidEnabled,
      antiSpamEnabled,
      maxMentions,
      maxDuplicates,
    }).onConflictDoUpdate({
      target: schema.guildSettings.guildId,
      set: {
        welcomeEnabled,
        welcomeChannel,
        welcomeMessage,
        welcomeEmbedEnabled,
        welcomeEmbedColor,
        welcomeEmbedTitle,
        welcomeDmEnabled,
        welcomeDmMessage,
        goodbyeEnabled,
        goodbyeChannel,
        goodbyeMessage,
        goodbyeEmbedEnabled,
        goodbyeEmbedColor,
        goodbyeEmbedTitle,
        logsEnabled,
        logsChannel,
        autoroleEnabled,
        autoroleRoles,
        securityEnabled,
        securityAlertRole,
        antiRaidEnabled,
        antiSpamEnabled,
        maxMentions,
        maxDuplicates,
        updatedAt: new Date(),
      },
    });

    // Notify bot API
    await api.updateGuildSettingsApi(guildId, {
      general: { prefix, language },
      notifications: { welcome_enabled: welcomeEnabled, welcome_channel: welcomeChannel, welcome_message: welcomeMessage },
      automod: { enabled: securityEnabled, anti_spam: antiSpamEnabled, max_mentions: maxMentions },
      logging: { enabled: logsEnabled, log_channel: logsChannel }
    });
  } catch (error) {
    console.error('DB update error updateGuildSettings:', error);
  }
  revalidatePath(`/dashboard/${guildId}/settings`);
}

// ==========================================
// Economy CRUD
// ==========================================
export async function getEconomyBalances(guildId: string) {
  try {
    return await db.select().from(schema.economyBalances).where(eq(schema.economyBalances.guildId, guildId));
  } catch (error) {
    console.error('DB fetch error getEconomyBalances:', error);
    return [];
  }
}

export async function updateUserBalance(guildId: string, userId: string, balance: number, bankBalance: number): Promise<void> {
  try {
    await db.insert(schema.economyBalances).values({
      userId,
      guildId,
      balance,
      bankBalance,
    }).onConflictDoUpdate({
      target: [schema.economyBalances.userId, schema.economyBalances.guildId],
      set: { balance, bankBalance, updatedAt: new Date() },
    });
  } catch (error) {
    console.error('DB update error updateUserBalance:', error);
  }
  revalidatePath(`/dashboard/${guildId}/economy`);
}

export async function getShopItems(guildId: string) {
  try {
    return await db.select().from(schema.economyShopItems).where(eq(schema.economyShopItems.guildId, guildId));
  } catch (error) {
    console.error('DB fetch error getShopItems:', error);
    return [];
  }
}

export async function createShopItem(guildId: string, formData: FormData): Promise<void> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseInt(formData.get('price') as string, 10);
    const type = formData.get('type') as string;
    const stock = parseInt(formData.get('stock') as string, 10);

    await db.insert(schema.economyShopItems).values({
      guildId,
      name,
      description,
      price,
      type,
      stock,
      enabled: true,
    });

    await api.createShopItemApi(guildId, { name, description, price, type, stock, enabled: true });
  } catch (error) {
    console.error('DB insert error createShopItem:', error);
  }
  revalidatePath(`/dashboard/${guildId}/economy`);
}

export async function deleteShopItem(guildId: string, itemId: string, formData?: FormData): Promise<void> {
  try {
    await db.delete(schema.economyShopItems).where(and(eq(schema.economyShopItems.guildId, guildId), eq(schema.economyShopItems.id, itemId)));
    await api.deleteShopItemApi(guildId, itemId);
  } catch (error) {
    console.error('DB delete error deleteShopItem:', error);
  }
  revalidatePath(`/dashboard/${guildId}/economy`);
}

export async function updateShopItem(guildId: string, itemId: string, formData: FormData): Promise<void> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseInt(formData.get('price') as string, 10);
    const type = formData.get('type') as string;
    const stock = parseInt(formData.get('stock') as string, 10);

    await db.update(schema.economyShopItems)
      .set({ name, description, price, type, stock, updatedAt: new Date() })
      .where(and(eq(schema.economyShopItems.guildId, guildId), eq(schema.economyShopItems.id, itemId)));

    await api.updateShopItemApi(guildId, itemId, { name, description, price, type, stock });
  } catch (error) {
    console.error('DB update error updateShopItem:', error);
  }
  revalidatePath(`/dashboard/${guildId}/economy`);
}

export async function getEconomyTransactions(guildId: string) {
  try {
    return await db.select().from(schema.economyTransactions).where(eq(schema.economyTransactions.guildId, guildId)).limit(20);
  } catch (error) {
    console.error('DB fetch error getEconomyTransactions:', error);
    return [];
  }
}

export async function triggerEconomyReset(guildId: string, formData?: FormData): Promise<void> {
  try {
    await api.executeEconomyReset(guildId);
  } catch (error) {
    console.error('Error triggerEconomyReset:', error);
  }
  revalidatePath(`/dashboard/${guildId}/economy`);
}

export async function getEconomySettings(guildId: string) {
  try {
    const res = await db.select().from(schema.economySettings).where(eq(schema.economySettings.guildId, guildId));
    if (res.length > 0) return res[0];
  } catch (error) {
    console.error('DB fetch error getEconomySettings:', error);
  }
  return {
    guildId,
    currencySymbol: '🪙',
    currencyName: 'coins',
    startingBalance: 100,
    dailyAmount: 100,
    dailyStreak: true,
    dailyStreakBonus: 10,
    workMinAmount: 50,
    workMaxAmount: 200,
    workCooldown: 3600,
    robEnabled: true,
    robMinAmount: 100,
    robSuccessRate: 50,
    robCooldown: 86400,
    robProtectionCost: 1000,
    robProtectionDuration: 86400,
    maxBet: 10000,
    minBet: 10,
  };
}

export async function updateEconomySettings(guildId: string, formData: FormData): Promise<void> {
  try {
    const currencySymbol = formData.get('currencySymbol') as string || '🪙';
    const currencyName = formData.get('currencyName') as string || 'coins';
    const startingBalance = parseInt(formData.get('startingBalance') as string, 10) || 100;
    const dailyAmount = parseInt(formData.get('dailyAmount') as string, 10) || 100;
    const dailyStreak = formData.get('dailyStreak') === 'true';
    const dailyStreakBonus = parseInt(formData.get('dailyStreakBonus') as string, 10) || 10;
    const workMinAmount = parseInt(formData.get('workMinAmount') as string, 10) || 50;
    const workMaxAmount = parseInt(formData.get('workMaxAmount') as string, 10) || 200;
    const workCooldown = parseInt(formData.get('workCooldown') as string, 10) || 3600;
    const robEnabled = formData.get('robEnabled') === 'true';
    const robMinAmount = parseInt(formData.get('robMinAmount') as string, 10) || 100;
    const robSuccessRate = parseInt(formData.get('robSuccessRate') as string, 10) || 50;
    const robCooldown = parseInt(formData.get('robCooldown') as string, 10) || 86400;
    const robProtectionCost = parseInt(formData.get('robProtectionCost') as string, 10) || 1000;
    const robProtectionDuration = parseInt(formData.get('robProtectionDuration') as string, 10) || 86400;
    const maxBet = parseInt(formData.get('maxBet') as string, 10) || 10000;
    const minBet = parseInt(formData.get('minBet') as string, 10) || 10;

    await db.insert(schema.economySettings).values({
      guildId,
      currencySymbol,
      currencyName,
      startingBalance,
      dailyAmount,
      dailyStreak,
      dailyStreakBonus,
      workMinAmount,
      workMaxAmount,
      workCooldown,
      robEnabled,
      robMinAmount,
      robSuccessRate,
      robCooldown,
      robProtectionCost,
      robProtectionDuration,
      maxBet,
      minBet,
    }).onConflictDoUpdate({
      target: schema.economySettings.guildId,
      set: {
        currencySymbol,
        currencyName,
        startingBalance,
        dailyAmount,
        dailyStreak,
        dailyStreakBonus,
        workMinAmount,
        workMaxAmount,
        workCooldown,
        robEnabled,
        robMinAmount,
        robSuccessRate,
        robCooldown,
        robProtectionCost,
        robProtectionDuration,
        maxBet,
        minBet,
        updatedAt: new Date(),
      },
    });

    await api.updateEconomySettingsApi(guildId, {
      currencySymbol,
      currencyName,
      startingBalance,
      dailyAmount,
      workMinAmount,
      workMaxAmount,
      workCooldown,
      robEnabled,
      robSuccessRate,
      robCooldown,
    });
  } catch (error) {
    console.error('DB update error updateEconomySettings:', error);
  }
  revalidatePath(`/dashboard/${guildId}/economy`);
}

// ==========================================
// Moderation CRUD & API Actions
// ==========================================
export async function getWarnings(guildId: string) {
  try {
    return await db.select().from(schema.warnings).where(eq(schema.warnings.guildId, guildId));
  } catch (error) {
    console.error('DB fetch error getWarnings:', error);
    return [];
  }
}

export async function deleteWarning(guildId: string, id: number, formData?: FormData): Promise<void> {
  try {
    await db.delete(schema.warnings).where(and(eq(schema.warnings.guildId, guildId), eq(schema.warnings.id, id)));
  } catch (error) {
    console.error('DB delete error deleteWarning:', error);
  }
  revalidatePath(`/dashboard/${guildId}/moderation`);
}

export async function getWarningAutomations(guildId: string) {
  try {
    return await db.select().from(schema.warningAutomations).where(eq(schema.warningAutomations.guildId, guildId));
  } catch (error) {
    console.error('DB fetch error getWarningAutomations:', error);
    return [];
  }
}

export async function createWarningAutomation(guildId: string, formData: FormData): Promise<void> {
  try {
    const name = formData.get('name') as string;
    const triggerType = formData.get('triggerType') as string;
    const triggerValue = parseInt(formData.get('triggerValue') as string, 10);
    const actionType = formData.get('actionType') as string;

    const automationId = `A-${Math.floor(Math.random() * 9000 + 1000)}`;

    await db.insert(schema.guilds).values({ id: guildId, prefix: '!', language: 'en' }).onConflictDoNothing();
    await db.insert(schema.users).values({ id: '98765432101234567', username: 'Admin', discriminator: '0001' }).onConflictDoNothing();

    await db.insert(schema.warningAutomations).values({
      automationId,
      guildId,
      name,
      triggerType,
      triggerValue,
      actions: [{ type: actionType }],
      enabled: true,
      createdBy: '98765432101234567',
    });
  } catch (error) {
    console.error('DB insert error createWarningAutomation:', error);
  }
  revalidatePath(`/dashboard/${guildId}/moderation`);
}

export async function deleteWarningAutomation(guildId: string, id: number, formData?: FormData): Promise<void> {
  try {
    await db.delete(schema.warningAutomations).where(and(eq(schema.warningAutomations.guildId, guildId), eq(schema.warningAutomations.id, id)));
  } catch (error) {
    console.error('DB delete error deleteWarningAutomation:', error);
  }
  revalidatePath(`/dashboard/${guildId}/moderation`);
}

export async function getAuditLogs(guildId: string) {
  try {
    return await db.select().from(schema.auditLogs).where(eq(schema.auditLogs.guildId, guildId)).limit(20);
  } catch (error) {
    console.error('DB fetch error getAuditLogs:', error);
    return [];
  }
}

export async function triggerBotModeration(guildId: string, action: 'warn' | 'ban' | 'kick' | 'mute', formData: FormData): Promise<void> {
  try {
    const userId = formData.get('userId') as string;
    const reason = formData.get('reason') as string;
    await api.executeModerationAction(guildId, action, { userId, reason });
  } catch (error) {
    console.error('Error triggerBotModeration:', error);
  }
  revalidatePath(`/dashboard/${guildId}/moderation`);
}

export async function getModLogSettings(guildId: string) {
  try {
    return await db.select().from(schema.modLogSettings).where(eq(schema.modLogSettings.guildId, guildId));
  } catch (error) {
    console.error('DB fetch error getModLogSettings:', error);
    return [];
  }
}

export async function updateModLogSettings(guildId: string, formData: FormData): Promise<void> {
  try {
    const category = formData.get('category') as string;
    const channelId = formData.get('channelId') as string;
    const enabled = formData.get('enabled') === 'true';

    await db.insert(schema.guilds).values({ id: guildId, prefix: '!', language: 'en' }).onConflictDoNothing();

    await db.insert(schema.modLogSettings).values({
      guildId,
      category,
      channelId,
      enabled,
    }).onConflictDoUpdate({
      target: [schema.modLogSettings.guildId, schema.modLogSettings.category],
      set: { channelId, enabled, updatedAt: new Date() },
    });
  } catch (error) {
    console.error('DB update error updateModLogSettings:', error);
  }
  revalidatePath(`/dashboard/${guildId}/moderation`);
}

export async function getWordFilterRules(guildId: string) {
  try {
    return await db.select().from(schema.wordFilterRules).where(eq(schema.wordFilterRules.guildId, guildId));
  } catch (error) {
    console.error('DB fetch error getWordFilterRules:', error);
    return [];
  }
}

export async function createWordFilterRule(guildId: string, formData: FormData): Promise<void> {
  try {
    const pattern = formData.get('pattern') as string;
    const matchType = formData.get('matchType') as string || 'literal';
    const severity = formData.get('severity') as string || 'medium';
    const autoDelete = formData.get('autoDelete') === 'true';

    await db.insert(schema.guilds).values({ id: guildId, prefix: '!', language: 'en' }).onConflictDoNothing();

    await db.insert(schema.wordFilterRules).values({
      guildId,
      pattern,
      matchType,
      severity,
      autoDelete,
    });
  } catch (error) {
    console.error('DB insert error createWordFilterRule:', error);
  }
  revalidatePath(`/dashboard/${guildId}/moderation`);
}

export async function deleteWordFilterRule(guildId: string, id: number, formData?: FormData): Promise<void> {
  try {
    await db.delete(schema.wordFilterRules).where(and(eq(schema.wordFilterRules.guildId, guildId), eq(schema.wordFilterRules.id, id)));
  } catch (error) {
    console.error('DB delete error deleteWordFilterRule:', error);
  }
  revalidatePath(`/dashboard/${guildId}/moderation`);
}

// ==========================================
// Tickets & XP CRUD
// ==========================================
export async function getTicketPanels(guildId: string) {
  try {
    return await db.select().from(schema.ticketPanels).where(eq(schema.ticketPanels.guildId, guildId));
  } catch (error) {
    console.error('DB fetch error getTicketPanels:', error);
    return [];
  }
}

export async function createTicketPanel(guildId: string, formData: FormData): Promise<void> {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const buttonLabel = formData.get('buttonLabel') as string || 'Create Ticket';
    const buttonStyle = parseInt(formData.get('buttonStyle') as string, 10) || 1;
    const channelId = formData.get('channelId') as string;
    const categoryId = formData.get('categoryId') as string;
    const welcomeMessage = formData.get('welcomeMessage') as string;
    const maxTicketsPerUser = parseInt(formData.get('maxTicketsPerUser') as string, 10) || 1;
    const imageUrl = formData.get('imageUrl') as string || null;
    const footer = formData.get('footer') as string || null;
    const supportRoles = formData.get('supportRoles') as string || '[]';
    const ticketNameFormat = formData.get('ticketNameFormat') as string || 'ticket-{number}';
    const isActive = formData.get('isActive') !== 'false';

    const panelId = `TP-${Math.floor(Math.random() * 900 + 100)}`;

    await db.insert(schema.guilds).values({ id: guildId, prefix: '!', language: 'en' }).onConflictDoNothing();

    await db.insert(schema.ticketPanels).values({
      guildId,
      panelId,
      title,
      description,
      imageUrl,
      footer,
      buttonLabel,
      buttonStyle,
      supportRoles: JSON.parse(supportRoles),
      channelId,
      categoryId,
      ticketNameFormat,
      welcomeMessage,
      maxTicketsPerUser,
      isActive,
    });

    await api.createTicketPanelApi(guildId, {
      title,
      description,
      imageUrl,
      footer,
      buttonLabel,
      buttonStyle,
      supportRoles: JSON.parse(supportRoles),
      channelId,
      categoryId,
      ticketNameFormat,
      welcomeMessage,
      maxTicketsPerUser,
      isActive,
    });
  } catch (error) {
    console.error('DB insert error createTicketPanel:', error);
  }
  revalidatePath(`/dashboard/${guildId}/tickets`);
}

export async function deleteTicketPanel(guildId: string, id: string, formData?: FormData): Promise<void> {
  try {
    await db.delete(schema.ticketPanels).where(and(eq(schema.ticketPanels.guildId, guildId), eq(schema.ticketPanels.id, id)));
  } catch (error) {
    console.error('DB delete error deleteTicketPanel:', error);
  }
  revalidatePath(`/dashboard/${guildId}/tickets`);
}

export async function updateTicketPanel(guildId: string, panelId: string, formData: FormData): Promise<void> {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const buttonLabel = formData.get('buttonLabel') as string || 'Create Ticket';
    const buttonStyle = parseInt(formData.get('buttonStyle') as string, 10) || 1;
    const channelId = formData.get('channelId') as string;
    const categoryId = formData.get('categoryId') as string;
    const welcomeMessage = formData.get('welcomeMessage') as string;
    const maxTicketsPerUser = parseInt(formData.get('maxTicketsPerUser') as string, 10) || 1;
    const imageUrl = formData.get('imageUrl') as string || null;
    const footer = formData.get('footer') as string || null;
    const supportRoles = formData.get('supportRoles') as string || '[]';
    const ticketNameFormat = formData.get('ticketNameFormat') as string || 'ticket-{number}';
    const isActive = formData.get('isActive') !== 'false';

    await db.update(schema.ticketPanels)
      .set({ title, description, imageUrl, footer, buttonLabel, buttonStyle, supportRoles: JSON.parse(supportRoles), channelId, categoryId, ticketNameFormat, welcomeMessage, maxTicketsPerUser, isActive, updatedAt: new Date() })
      .where(and(eq(schema.ticketPanels.guildId, guildId), eq(schema.ticketPanels.id, panelId)));

    await api.updateTicketPanelApi(guildId, panelId, { title, description, imageUrl, footer, buttonLabel, buttonStyle, supportRoles: JSON.parse(supportRoles), channelId, categoryId, ticketNameFormat, welcomeMessage, maxTicketsPerUser, isActive });
  } catch (error) {
    console.error('DB update error updateTicketPanel:', error);
  }
  revalidatePath(`/dashboard/${guildId}/tickets`);
}

export async function getTicketDepartments(guildId: string) {
  try {
    return await db.select().from(schema.ticketDepartments).where(eq(schema.ticketDepartments.guildId, guildId));
  } catch (error) {
    console.error('DB fetch error getTicketDepartments:', error);
    return [];
  }
}

export async function createTicketDepartment(guildId: string, formData: FormData): Promise<void> {
  try {
    const panelId = formData.get('panelId') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const emoji = formData.get('emoji') as string || null;
    const categoryId = formData.get('categoryId') as string || null;
    const supportRoles = formData.get('supportRoles') as string || '[]';
    const modalFields = formData.get('modalFields') as string || '[]';
    const welcomeMessage = formData.get('welcomeMessage') as string || null;
    const slaTimeoutMinutes = parseInt(formData.get('slaTimeoutMinutes') as string, 10) || 60;

    const departmentId = `TD-${Math.floor(Math.random() * 9000 + 1000)}`;

    await db.insert(schema.guilds).values({ id: guildId, prefix: '!', language: 'en' }).onConflictDoNothing();

    await db.insert(schema.ticketDepartments).values({
      guildId,
      panelId,
      departmentId,
      name,
      description,
      emoji,
      categoryId,
      supportRoles: JSON.parse(supportRoles),
      modalFields: JSON.parse(modalFields),
      welcomeMessage,
      slaTimeoutMinutes,
    });
  } catch (error) {
    console.error('DB insert error createTicketDepartment:', error);
  }
  revalidatePath(`/dashboard/${guildId}/tickets`);
}

export async function deleteTicketDepartment(guildId: string, id: string, formData?: FormData): Promise<void> {
  try {
    await db.delete(schema.ticketDepartments).where(and(eq(schema.ticketDepartments.guildId, guildId), eq(schema.ticketDepartments.id, id)));
  } catch (error) {
    console.error('DB delete error deleteTicketDepartment:', error);
  }
  revalidatePath(`/dashboard/${guildId}/tickets`);
}

export async function getActiveTickets(guildId: string) {
  try {
    return await db.select().from(schema.tickets).where(eq(schema.tickets.guildId, guildId));
  } catch (error) {
    console.error('DB fetch error getActiveTickets:', error);
    return [];
  }
}

export async function triggerTicketClose(guildId: string, ticketId: string, reason: string): Promise<void> {
  try {
    await api.executeTicketAction(guildId, ticketId, 'close', { reason });
    await db.update(schema.tickets).set({ status: 'closed', closedReason: reason, closedAt: new Date(), updatedAt: new Date() }).where(and(eq(schema.tickets.guildId, guildId), eq(schema.tickets.id, ticketId)));
  } catch (error) {
    console.error('Error triggerTicketClose:', error);
  }
  revalidatePath(`/dashboard/${guildId}/tickets`);
}

export async function triggerTicketClaim(guildId: string, ticketId: string, userId: string): Promise<void> {
  try {
    await api.directTicketClaimApi({ guildId, ticketId, userId });
    await db.update(schema.tickets).set({ status: 'claimed', claimedBy: userId, updatedAt: new Date() }).where(and(eq(schema.tickets.guildId, guildId), eq(schema.tickets.id, ticketId)));
  } catch (error) {
    console.error('Error triggerTicketClaim:', error);
  }
  revalidatePath(`/dashboard/${guildId}/tickets`);
}

export async function triggerTicketLock(guildId: string, ticketId: string, userId: string): Promise<void> {
  try {
    await api.directTicketLockApi({ guildId, ticketId, userId });
    await db.update(schema.tickets).set({ status: 'locked', lockedBy: userId, lockedAt: new Date(), updatedAt: new Date() }).where(and(eq(schema.tickets.guildId, guildId), eq(schema.tickets.id, ticketId)));
  } catch (error) {
    console.error('Error triggerTicketLock:', error);
  }
  revalidatePath(`/dashboard/${guildId}/tickets`);
}

export async function triggerTicketFreeze(guildId: string, ticketId: string, userId: string): Promise<void> {
  try {
    await api.directTicketFreezeApi({ guildId, ticketId, userId });
    await db.update(schema.tickets).set({ status: 'frozen', frozenBy: userId, frozenAt: new Date(), updatedAt: new Date() }).where(and(eq(schema.tickets.guildId, guildId), eq(schema.tickets.id, ticketId)));
  } catch (error) {
    console.error('Error triggerTicketFreeze:', error);
  }
  revalidatePath(`/dashboard/${guildId}/tickets`);
}

export async function getUserXpList(guildId: string) {
  try {
    return await db.select().from(schema.userXp).where(eq(schema.userXp.guildId, guildId)).limit(20);
  } catch (error) {
    console.error('DB fetch error getUserXpList:', error);
    return [];
  }
}

export async function getXpRewards(guildId: string) {
  try {
    return await db.select().from(schema.xpRewards).where(eq(schema.xpRewards.guildId, guildId));
  } catch (error) {
    console.error('DB fetch error getXpRewards:', error);
    return [];
  }
}

export async function createXpReward(guildId: string, formData: FormData): Promise<void> {
  try {
    const level = parseInt(formData.get('level') as string, 10);
    const roleId = formData.get('roleId') as string;

    await db.insert(schema.guilds).values({ id: guildId, prefix: '!', language: 'en' }).onConflictDoNothing();

    await db.insert(schema.xpRewards).values({
      guildId,
      level,
      roleId,
    });

    await api.createXpRewardApi(guildId, { level, roleId });
  } catch (error) {
    console.error('DB insert error createXpReward:', error);
  }
  revalidatePath(`/dashboard/${guildId}/xp-matrix`);
}

export async function deleteXpReward(guildId: string, level: number, formData?: FormData): Promise<void> {
  try {
    await db.delete(schema.xpRewards).where(and(eq(schema.xpRewards.guildId, guildId), eq(schema.xpRewards.level, level)));
    await api.deleteXpRewardApi(guildId, level);
  } catch (error) {
    console.error('DB delete error deleteXpReward:', error);
  }
  revalidatePath(`/dashboard/${guildId}/xp-matrix`);
}

export async function triggerXpReset(guildId: string, formData?: FormData): Promise<void> {
  try {
    await api.executeXpReset(guildId);
  } catch (error) {
    console.error('Error triggerXpReset:', error);
  }
  revalidatePath(`/dashboard/${guildId}/xp-matrix`);
}

export async function getXpSettings(guildId: string) {
  try {
    const res = await db.select().from(schema.xpSettings).where(eq(schema.xpSettings.guildId, guildId));
    if (res.length > 0) return res[0];
  } catch (error) {
    console.error('DB fetch error getXpSettings:', error);
  }
  return {
    guildId,
    ignoredChannels: '[]',
    ignoredRoles: '[]',
    noXpChannels: '[]',
    doubleXpChannels: '[]',
    roleMultipliers: '{}',
    levelUpRewardsEnabled: true,
    stackRoleRewards: false,
  };
}

export async function updateXpSettings(guildId: string, formData: FormData): Promise<void> {
  try {
    const ignoredChannels = formData.get('ignoredChannels') as string || '[]';
    const ignoredRoles = formData.get('ignoredRoles') as string || '[]';
    const noXpChannels = formData.get('noXpChannels') as string || '[]';
    const doubleXpChannels = formData.get('doubleXpChannels') as string || '[]';
    const levelUpRewardsEnabled = formData.get('levelUpRewardsEnabled') === 'true';
    const stackRoleRewards = formData.get('stackRoleRewards') === 'true';

    await db.insert(schema.guilds).values({ id: guildId, prefix: '!', language: 'en' }).onConflictDoNothing();

    await db.insert(schema.xpSettings).values({
      guildId,
      ignoredChannels,
      ignoredRoles,
      noXpChannels,
      doubleXpChannels,
      levelUpRewardsEnabled,
      stackRoleRewards,
    }).onConflictDoUpdate({
      target: schema.xpSettings.guildId,
      set: {
        ignoredChannels,
        ignoredRoles,
        noXpChannels,
        doubleXpChannels,
        levelUpRewardsEnabled,
        stackRoleRewards,
        updatedAt: new Date(),
      },
    });

    await api.updateXpSettingsApi(guildId, {
      enabled: levelUpRewardsEnabled,
      xpBlacklistRoles: JSON.parse(ignoredRoles),
      xpBlacklistChannels: JSON.parse(ignoredChannels),
    });
  } catch (error) {
    console.error('DB update error updateXpSettings:', error);
  }
  revalidatePath(`/dashboard/${guildId}/xp-matrix`);
}

// ==========================================
// Giveaways CRUD & API Actions
// ==========================================
export async function getGiveaways(guildId: string) {
  try {
    return await db.select().from(schema.giveaways).where(eq(schema.giveaways.guildId, guildId));
  } catch (error) {
    console.error('DB fetch error getGiveaways:', error);
    return [];
  }
}

export async function createGiveaway(guildId: string, formData: FormData): Promise<void> {
  try {
    const channelId = formData.get('channelId') as string;
    const prize = formData.get('prize') as string;
    const description = (formData.get('description') as string) || '';
    const winnerCount = parseInt(formData.get('winnerCount') as string, 10) || 1;
    const endTimeStr = formData.get('endTime') as string;
    const endTime = endTimeStr ? new Date(endTimeStr) : new Date(Date.now() + 86400000);
    const hostedBy = (formData.get('hostedBy') as string) || '98765432101234567';
    const giveawayId = `GA-${Math.floor(Math.random() * 90000 + 10000)}`;

    await db.insert(schema.guilds).values({ id: guildId, prefix: '!', language: 'en' }).onConflictDoNothing();
    await db.insert(schema.users).values({ id: hostedBy, username: 'Admin', discriminator: '0001' }).onConflictDoNothing();

    await db.insert(schema.giveaways).values({
      giveawayId,
      guildId,
      channelId,
      hostedBy,
      prize,
      description,
      winnerCount,
      endTime,
      status: 'active',
      entries: 0,
      requirements: {},
      bonusEntries: {},
      embedColor: 0x0099ff,
    });

    await api.createGiveawayApi(guildId, {
      giveawayId,
      channelId,
      hostedBy,
      prize,
      description,
      winnerCount,
      endTime: endTime.toISOString(),
    });
  } catch (error) {
    console.error('DB insert error createGiveaway:', error);
  }
  revalidatePath(`/dashboard/${guildId}/giveaways`);
}

export async function deleteGiveaway(guildId: string, giveawayId: string, formData?: FormData): Promise<void> {
  try {
    await db.delete(schema.giveaways).where(and(eq(schema.giveaways.guildId, guildId), eq(schema.giveaways.giveawayId, giveawayId)));
    await api.deleteGiveawayApi(guildId, giveawayId);
  } catch (error) {
    console.error('DB delete error deleteGiveaway:', error);
  }
  revalidatePath(`/dashboard/${guildId}/giveaways`);
}

export async function endGiveaway(guildId: string, giveawayId: string, formData?: FormData): Promise<void> {
  try {
    await db.update(schema.giveaways)
      .set({ status: 'ended', endedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(schema.giveaways.guildId, guildId), eq(schema.giveaways.giveawayId, giveawayId)));
    await api.endGiveawayApi(guildId, giveawayId);
  } catch (error) {
    console.error('DB update error endGiveaway:', error);
  }
  revalidatePath(`/dashboard/${guildId}/giveaways`);
}

export async function rerollGiveaway(guildId: string, giveawayId: string, formData?: FormData): Promise<void> {
  try {
    await db.update(schema.giveaways)
      .set({ updatedAt: new Date() })
      .where(and(eq(schema.giveaways.guildId, guildId), eq(schema.giveaways.giveawayId, giveawayId)));
    await api.rerollGiveawayApi(guildId, giveawayId);
  } catch (error) {
    console.error('DB update error rerollGiveaway:', error);
  }
  revalidatePath(`/dashboard/${guildId}/giveaways`);
}

// ==========================================
// Join to Create (JTC) CRUD & API Actions
// ==========================================
export async function getJtcConfig(guildId: string) {
  try {
    const res = await db.select().from(schema.jtcConfigs).where(eq(schema.jtcConfigs.guildId, guildId));
    if (res.length > 0) return res[0];
  } catch (error) {
    console.error('DB fetch error getJtcConfig:', error);
  }
  return {
    guildId,
    baseVoiceChannelId: '',
    categoryId: '',
    panelChannelId: '',
    panelMessageId: '',
    channelNameFormat: "{user}'s Channel",
  };
}

export async function updateJtcConfig(guildId: string, formData: FormData): Promise<void> {
  try {
    const baseVoiceChannelId = (formData.get('baseVoiceChannelId') as string) || '';
    const categoryId = (formData.get('categoryId') as string) || '';
    const panelChannelId = (formData.get('panelChannelId') as string) || '';
    const panelMessageId = (formData.get('panelMessageId') as string) || '';
    const channelNameFormat = (formData.get('channelNameFormat') as string) || "{user}'s Channel";

    await db.insert(schema.guilds).values({ id: guildId, prefix: '!', language: 'en' }).onConflictDoNothing();

    await db.insert(schema.jtcConfigs).values({
      guildId,
      baseVoiceChannelId,
      categoryId,
      panelChannelId,
      panelMessageId,
      channelNameFormat,
    }).onConflictDoUpdate({
      target: schema.jtcConfigs.guildId,
      set: {
        baseVoiceChannelId,
        categoryId,
        panelChannelId,
        panelMessageId,
        channelNameFormat,
        updatedAt: new Date(),
      },
    });

    await api.updateJtcConfigApi({
      guildId,
      baseVoiceChannelId,
      categoryId,
      panelChannelId,
      panelMessageId,
      channelNameFormat,
    });
  } catch (error) {
    console.error('DB update error updateJtcConfig:', error);
  }
  revalidatePath(`/dashboard/${guildId}/jtc`);
}

export async function getJtcChannels(guildId: string) {
  try {
    return await db.select().from(schema.jtcChannels).where(eq(schema.jtcChannels.guildId, guildId));
  } catch (error) {
    console.error('DB fetch error getJtcChannels:', error);
    return [];
  }
}
