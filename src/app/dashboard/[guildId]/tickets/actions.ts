"use server";

import { db } from"@/lib/db";
import { ticketPanels, tickets, ticketMessages } from"@/../schemas/tickets";
import { ticketDepartments, ticketRatings } from"@/../schemas/ticket_workflows";
import { eq, and, desc } from"drizzle-orm";
import { revalidatePath } from"next/cache";
import { requireGuildAdmin } from"@/lib/auth-guard";

// ── Ticket Panels CRUD ─────────────────────────────────────────
export async function getTicketPanels(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(ticketPanels)
 .where(eq(ticketPanels.guildId, guildId))
 .orderBy(desc(ticketPanels.createdAt));
 } catch (error) {
 console.error("Failed to fetch ticket panels:", error);
 return [];
 }
}

export async function createTicketPanel(
 guildId: string,
 data: {
 panelId: string;
 title: string;
 description: string;
 imageUrl?: string;
 footer?: string;
 buttonLabel: string;
 buttonStyle: number;
 supportRoles: string[];
 categoryId?: string;
 ticketNameFormat: string;
 maxTicketsPerUser: number;
 welcomeMessage?: string;
 isActive: boolean;
 }
) {
 await requireGuildAdmin(guildId);
 try {
 await db.insert(ticketPanels).values({
 guildId,
 panelId: data.panelId,
 title: data.title,
 description: data.description,
 imageUrl: data.imageUrl || null,
 footer: data.footer || null,
 buttonLabel: data.buttonLabel ||"Create Ticket",
 buttonStyle: data.buttonStyle || 1,
 supportRoles: data.supportRoles,
 categoryId: data.categoryId || null,
 ticketNameFormat: data.ticketNameFormat ||"ticket-{number}",
 maxTicketsPerUser: data.maxTicketsPerUser || 1,
 welcomeMessage: data.welcomeMessage || null,
 isActive: data.isActive,
 });
 revalidatePath(`/dashboard/${guildId}/tickets`);
 return { success: true };
 } catch (error) {
 console.error("Failed to create ticket panel:", error);
 return { success: false, error:"Failed to create ticket panel"};
 }
}

export async function deleteTicketPanel(guildId: string, panelId: string) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .delete(ticketPanels)
 .where(and(eq(ticketPanels.id, panelId), eq(ticketPanels.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/tickets`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete ticket panel"};
 }
}

export async function updateTicketPanel(guildId: string, data: any) {
  return createTicketPanel(guildId, {
    ...data,
    panelId: data.panelId || "default",
    supportRoles: data.supportRoles || [],
    buttonStyle: data.buttonStyle || 1,
  });
}

// ── Ticket Departments CRUD ────────────────────────────────────
export async function getTicketDepartments(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(ticketDepartments)
 .where(eq(ticketDepartments.guildId, guildId))
 .orderBy(desc(ticketDepartments.createdAt));
 } catch (error) {
 console.error("Failed to fetch ticket departments:", error);
 return [];
 }
}

export async function createTicketDepartment(
 guildId: string,
 data: {
 panelId: string;
 departmentId: string;
 name: string;
 description: string;
 emoji?: string;
 categoryId?: string;
 supportRoles: string[];
 modalFields: any[]; // field builder: { type, label, placeholder, required }
 welcomeMessage?: string;
 slaTimeoutMinutes: number;
 }
) {
 await requireGuildAdmin(guildId);
 try {
 await db.insert(ticketDepartments).values({
 guildId,
 panelId: data.panelId,
 departmentId: data.departmentId,
 name: data.name,
 description: data.description,
 emoji: data.emoji || null,
 categoryId: data.categoryId || null,
 supportRoles: data.supportRoles,
 modalFields: data.modalFields,
 welcomeMessage: data.welcomeMessage || null,
 slaTimeoutMinutes: data.slaTimeoutMinutes || 60,
 });
 revalidatePath(`/dashboard/${guildId}/tickets`);
 return { success: true };
 } catch (error) {
 console.error("Failed to create department:", error);
 return { success: false, error:"Failed to create ticket department"};
 }
}

export async function deleteTicketDepartment(guildId: string, deptId: string) {
 await requireGuildAdmin(guildId);
 try {
 await db
 .delete(ticketDepartments)
 .where(and(eq(ticketDepartments.id, deptId), eq(ticketDepartments.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/tickets`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete ticket department"};
 }
}

// ── Live Ticket Board ──────────────────────────────────────────
export async function getTickets(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(tickets)
 .where(eq(tickets.guildId, guildId))
 .orderBy(desc(tickets.createdAt))
 .limit(100);
 } catch (error) {
 console.error("Failed to fetch tickets:", error);
 return [];
 }
}

export async function updateTicketStatus(
 guildId: string,
 ticketId: string,
 status: string, // open | claimed | closed | locked | frozen
 closedReason?: string
) {
 const { session } = await requireGuildAdmin(guildId);
 try {
 const updateData: any = { status, updatedAt: new Date() };

 if (status ==="claimed") {
 updateData.claimedBy = session.user.discordId;
 } else if (status ==="closed") {
 updateData.closedBy = session.user.discordId;
 updateData.closedReason = closedReason ||"Closed by admin";
 updateData.closedAt = new Date();
 } else if (status ==="locked") {
 updateData.lockedBy = session.user.discordId;
 updateData.lockedAt = new Date();
 } else if (status ==="frozen") {
 updateData.frozenBy = session.user.discordId;
 updateData.frozenAt = new Date();
 }

 await db
 .update(tickets)
 .set(updateData)
 .where(and(eq(tickets.id, ticketId), eq(tickets.guildId, guildId)));
 revalidatePath(`/dashboard/${guildId}/tickets`);
 return { success: true };
 } catch (error) {
 console.error("Failed to update ticket status:", error);
 return { success: false, error:"Failed to update ticket status"};
 }
}

// ── Ticket Messages & Ratings ─────────────────────────────────
export async function getTicketMessages(ticketId: string) {
 try {
 return await db
 .select()
 .from(ticketMessages)
 .where(eq(ticketMessages.ticketId, ticketId))
 .orderBy(ticketMessages.createdAt);
 } catch (error) {
 return [];
 }
}

export async function getTicketRatings(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await db
 .select()
 .from(ticketRatings)
 .where(eq(ticketRatings.guildId, guildId))
 .orderBy(desc(ticketRatings.createdAt))
 .limit(100);
 } catch (error) {
 return [];
 }
}
