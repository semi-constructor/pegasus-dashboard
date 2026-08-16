import { pgTable, varchar, timestamp, text, uuid, boolean } from 'drizzle-orm/pg-core';
import { authUsers } from './auth';

export const dashboardTickets = pgTable('dashboard_tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => authUsers.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  status: varchar('status', { length: 20 }).default('open').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const dashboardTicketMessages = pgTable('dashboard_ticket_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticketId: uuid('ticket_id').references(() => dashboardTickets.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => authUsers.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  isAdmin: boolean('is_admin').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
