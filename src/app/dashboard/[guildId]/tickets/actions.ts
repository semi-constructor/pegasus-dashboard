"use server";

import {
  repoGetTicketPanels,
  repoCreateTicketPanel,
  repoDeleteTicketPanel,
  repoUpdateTicketPanel,
  repoGetTicketDepartments,
  repoCreateTicketDepartment,
  repoUpdateTicketDepartment,
  repoDeleteTicketDepartment,
  repoGetTickets,
  repoGetTicketMessages,
  repoGetTicketById,
  repoGetTicketRatings,
  repoUpdateTicketStatus,
} from "@/lib/repository/tickets";
import { revalidatePath } from "next/cache";
import { requireGuildAdmin } from "@/lib/auth-guard";

// ── Ticket Panels CRUD ─────────────────────────────────────────
export async function getTicketPanels(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await repoGetTicketPanels(guildId);
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
 await repoCreateTicketPanel(guildId, data);
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
 await repoDeleteTicketPanel(guildId, panelId);
 revalidatePath(`/dashboard/${guildId}/tickets`);
 return { success: true };
 } catch (error) {
 return { success: false, error:"Failed to delete ticket panel"};
 }
}

export async function updateTicketPanel(guildId: string, panelId: string, data: any) {
  await requireGuildAdmin(guildId);
  try {
    await repoUpdateTicketPanel(guildId, panelId, data);
    revalidatePath(`/dashboard/${guildId}/tickets`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update ticket panel:", error);
    return { success: false, error: "Failed to update ticket panel" };
  }
}

// ── Ticket Departments CRUD ────────────────────────────────────
export async function getTicketDepartments(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await repoGetTicketDepartments(guildId);
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
 await repoCreateTicketDepartment(guildId, data);
 revalidatePath(`/dashboard/${guildId}/tickets`);
 return { success: true };
 } catch (error) {
 console.error("Failed to create department:", error);
 return { success: false, error:"Failed to create ticket department"};
 }
}

export async function updateTicketDepartment(guildId: string, deptId: string, data: any) {
  await requireGuildAdmin(guildId);
  try {
    await repoUpdateTicketDepartment(guildId, deptId, data);
    revalidatePath(`/dashboard/${guildId}/tickets`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update department:", error);
    return { success: false, error: "Failed to update ticket department" };
  }
}

export async function deleteTicketDepartment(guildId: string, deptId: string) {
 await requireGuildAdmin(guildId);
 try {
 await repoDeleteTicketDepartment(guildId, deptId);
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
 return await repoGetTickets(guildId);
 } catch (error) {
 console.error("Failed to fetch tickets:", error);
 return [];
 }
}

export async function getTicketMessages(guildId: string, ticketId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await repoGetTicketMessages(guildId, ticketId);
  } catch (error) {
    console.error("Failed to fetch ticket messages:", error);
    return [];
  }
}

export async function getTicketById(guildId: string, ticketId: string) {
  await requireGuildAdmin(guildId);
  try {
    return await repoGetTicketById(guildId, ticketId);
  } catch (error) {
    console.error("Failed to fetch ticket:", error);
    return null;
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
    const result = await repoUpdateTicketStatus(
      guildId,
      ticketId,
      status,
      session.user.discordId,
      closedReason
    );
    if (!result.success) {
      return result;
    }

    revalidatePath(`/dashboard/${guildId}/tickets`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update ticket status:", error);
    return { success: false, error: "Failed to update ticket status" };
  }
}

// ── Ticket Messages & Ratings ─────────────────────────────────

export async function getTicketRatings(guildId: string) {
 await requireGuildAdmin(guildId);
 try {
 return await repoGetTicketRatings(guildId);
 } catch (error) {
 return [];
 }
}
