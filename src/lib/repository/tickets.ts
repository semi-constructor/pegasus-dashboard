import { db } from "@/lib/db";
import { ticketPanels, tickets, ticketMessages } from "@/../schemas/tickets";
import { ticketDepartments, ticketRatings } from "@/../schemas/ticket_workflows";
import { eq, and, desc } from "drizzle-orm";
import { getGuildContext } from "./guild";

export async function repoGetTicketPanels(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/tickets/panels`, { headers: { 'Authorization': `Bearer ${context.apiToken}` } });
    if (res.ok) return await res.json();
    return [];
  }
  return await db.select().from(ticketPanels).where(eq(ticketPanels.guildId, guildId)).orderBy(desc(ticketPanels.createdAt));
}

export async function repoCreateTicketPanel(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/tickets/panels`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${context.apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  }
  await db.insert(ticketPanels).values({ guildId, ...data });
  return true;
}

export async function repoDeleteTicketPanel(guildId: string, panelId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/tickets/panels/${panelId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${context.apiToken}` } });
    return res.ok;
  }
  await db.delete(ticketPanels).where(and(eq(ticketPanels.id, panelId), eq(ticketPanels.guildId, guildId)));
  return true;
}

export async function repoUpdateTicketPanel(guildId: string, panelId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/tickets/panels/${panelId}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${context.apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  }
  await db.update(ticketPanels).set({ ...data, updatedAt: new Date() }).where(and(eq(ticketPanels.id, panelId), eq(ticketPanels.guildId, guildId)));
  return true;
}

export async function repoGetTicketDepartments(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/tickets/departments`, { headers: { 'Authorization': `Bearer ${context.apiToken}` } });
    if (res.ok) return await res.json();
    return [];
  }
  return await db.select().from(ticketDepartments).where(eq(ticketDepartments.guildId, guildId)).orderBy(desc(ticketDepartments.createdAt));
}

export async function repoCreateTicketDepartment(guildId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/tickets/departments`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${context.apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  }
  await db.insert(ticketDepartments).values({ guildId, ...data });
  return true;
}

export async function repoUpdateTicketDepartment(guildId: string, deptId: string, data: any) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/tickets/departments/${deptId}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${context.apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  }
  await db.update(ticketDepartments).set({ ...data, updatedAt: new Date() }).where(and(eq(ticketDepartments.id, deptId), eq(ticketDepartments.guildId, guildId)));
  return true;
}

export async function repoDeleteTicketDepartment(guildId: string, deptId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/tickets/departments/${deptId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${context.apiToken}` } });
    return res.ok;
  }
  await db.delete(ticketDepartments).where(and(eq(ticketDepartments.id, deptId), eq(ticketDepartments.guildId, guildId)));
  return true;
}

export async function repoGetTickets(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/tickets`, { headers: { 'Authorization': `Bearer ${context.apiToken}` } });
    if (res.ok) return await res.json();
    return [];
  }
  return await db.select().from(tickets).where(eq(tickets.guildId, guildId)).orderBy(desc(tickets.createdAt)).limit(100);
}

export async function repoGetTicketMessages(guildId: string, ticketId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/tickets/${ticketId}/messages`, { headers: { 'Authorization': `Bearer ${context.apiToken}` } });
    if (res.ok) return await res.json();
    return [];
  }
  const ticket = await db.query.tickets.findFirst({ where: and(eq(tickets.id, ticketId), eq(tickets.guildId, guildId)) });
  if (!ticket) return [];
  return await db.select().from(ticketMessages).where(eq(ticketMessages.ticketId, ticketId)).orderBy(ticketMessages.createdAt);
}

export async function repoGetTicketById(guildId: string, ticketId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/tickets/${ticketId}`, { headers: { 'Authorization': `Bearer ${context.apiToken}` } });
    if (res.ok) return await res.json();
    return null;
  }
  const result = await db.select().from(tickets).where(and(eq(tickets.id, ticketId), eq(tickets.guildId, guildId)));
  return result[0] || null;
}

export async function repoGetTicketRatings(guildId: string) {
  const context = await getGuildContext(guildId);
  if (context.isHosted) {
    const res = await fetch(`${context.apiUrl}/guilds/${guildId}/tickets/ratings`, { headers: { 'Authorization': `Bearer ${context.apiToken}` } });
    if (res.ok) return await res.json();
    return [];
  }
  return await db.select().from(ticketRatings).where(eq(ticketRatings.guildId, guildId)).orderBy(desc(ticketRatings.createdAt)).limit(100);
}

export async function repoUpdateTicketStatus(
  guildId: string,
  ticketId: string,
  status: string,
  userId: string,
  closedReason?: string
) {
  const context = await getGuildContext(guildId);
  const apiUrl = context.isHosted ? context.apiUrl : (process.env.API_URL || "http://localhost:2000");
  const token = context.isHosted ? context.apiToken : process.env.BOT_API_TOKEN;

  let endpoint = status;
  if (status === 'closed') endpoint = 'close';

  const res = await fetch(`${apiUrl}/api/tickets/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ticketId,
      guildId,
      userId,
      reason: closedReason,
    }),
  });

  if (!res.ok) {
    return { success: false, error: "Failed to update ticket status via Bot API" };
  }
  return { success: true };
}

