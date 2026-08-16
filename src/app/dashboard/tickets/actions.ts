"use server";

import { db } from "@/lib/db";
import { dashboardTickets, dashboardTicketMessages, authUsers } from "../../../../schemas";
import { auth } from "@/auth";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function isAdminUser(discordId?: string) {
  if (!discordId) return false;
  let adminIds: string[] = [];
  try {
    adminIds = JSON.parse(process.env.ADMIN || "[]");
  } catch {
    adminIds = (process.env.ADMIN_DISCORD_IDS || "").split(",").map(id => id.trim());
  }
  return adminIds.includes(discordId);
}

export async function getUserTickets() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  return await db.select()
    .from(dashboardTickets)
    .where(eq(dashboardTickets.userId, session.user.id))
    .orderBy(desc(dashboardTickets.createdAt));
}

export async function getAllTickets() {
  const session = await auth();
  const discordId = (session?.user as any)?.discordId;
  if (!isAdminUser(discordId)) throw new Error("Unauthorized");
  
  return await db.select({
    ticket: dashboardTickets,
    user: {
      username: authUsers.name,
      avatar: authUsers.image
    }
  })
    .from(dashboardTickets)
    .leftJoin(authUsers, eq(dashboardTickets.userId, authUsers.id))
    .orderBy(desc(dashboardTickets.createdAt));
}

export async function getTicketDetails(ticketId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const [ticketData] = await db.select({
    ticket: dashboardTickets,
    user: {
      username: authUsers.name,
      avatar: authUsers.image
    }
  })
  .from(dashboardTickets)
  .leftJoin(authUsers, eq(dashboardTickets.userId, authUsers.id))
  .where(eq(dashboardTickets.id, ticketId))
  .limit(1);
  
  if (!ticketData?.ticket) throw new Error("Ticket not found");
  
  const isOwner = ticketData.ticket.userId === session.user.id;
  const discordId = (session.user as any).discordId;
  const isAdmin = isAdminUser(discordId);
  
  if (!isOwner && !isAdmin) throw new Error("Unauthorized");
  
  const messagesData = await db.select({
    message: dashboardTicketMessages,
    user: {
      username: authUsers.name,
      avatar: authUsers.image
    }
  })
  .from(dashboardTicketMessages)
  .leftJoin(authUsers, eq(dashboardTicketMessages.userId, authUsers.id))
  .where(eq(dashboardTicketMessages.ticketId, ticketId))
  .orderBy(dashboardTicketMessages.createdAt);
  
  return { 
    ticket: ticketData.ticket, 
    creator: ticketData.user,
    messages: messagesData 
  };
}

export async function createTicket(title: string, message: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const [ticket] = await db.insert(dashboardTickets).values({
    userId: session.user.id,
    title,
    status: 'open'
  }).returning();
  
  await db.insert(dashboardTicketMessages).values({
    ticketId: ticket.id,
    userId: session.user.id,
    content: message
  });
  
  revalidatePath('/dashboard/tickets');
  revalidatePath('/dashboard/admin/tickets');
  redirect(`/dashboard/tickets/${ticket.id}`);
}

export async function addTicketMessage(ticketId: string, content: string, asAdmin: boolean = false) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const [ticket] = await db.select().from(dashboardTickets).where(eq(dashboardTickets.id, ticketId)).limit(1);
  if (!ticket) throw new Error("Ticket not found");
  
  const isOwner = ticket.userId === session.user.id;
  const discordId = (session.user as any).discordId;
  const isAdminUserFlag = isAdminUser(discordId);
  
  if (!isOwner && !isAdminUserFlag) throw new Error("Unauthorized");
  
  // Only allow setting isAdmin=true if they are actually an admin
  const finalIsAdmin = asAdmin && isAdminUserFlag;
  
  await db.insert(dashboardTicketMessages).values({
    ticketId,
    userId: session.user.id,
    content,
    isAdmin: finalIsAdmin
  });
  
  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath(`/dashboard/admin/tickets/${ticketId}`);
}

export async function closeTicket(ticketId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const [ticket] = await db.select().from(dashboardTickets).where(eq(dashboardTickets.id, ticketId)).limit(1);
  if (!ticket) throw new Error("Ticket not found");
  
  const isOwner = ticket.userId === session.user.id;
  const discordId = (session.user as any).discordId;
  const isAdmin = isAdminUser(discordId);
  
  if (!isOwner && !isAdmin) throw new Error("Unauthorized");
  
  await db.update(dashboardTickets)
    .set({ status: 'closed', updatedAt: new Date() })
    .where(eq(dashboardTickets.id, ticketId));
    
  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath(`/dashboard/admin/tickets/${ticketId}`);
  revalidatePath('/dashboard/tickets');
  revalidatePath('/dashboard/admin/tickets');
}
