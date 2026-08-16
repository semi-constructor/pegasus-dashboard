import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { authUsers } from "./auth";

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "paused"
]);

export const hostedInstanceStatusEnum = pgEnum("hosted_instance_status", [
  "pending_setup",
  "provisioning",
  "deploying",
  "starting",
  "active",
  "updating",
  "suspended",
  "failed"
]);

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(), // We can use stripe subscription id as PK or generate one
  userId: text("user_id").notNull().references(() => authUsers.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  status: subscriptionStatusEnum("status").notNull(),
  currentPeriodStart: timestamp("current_period_start", { mode: 'date' }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", { mode: 'date' }).notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at", { mode: 'date' }).defaultNow(),
});

export const hostedInstances = pgTable("hosted_instances", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => authUsers.id, { onDelete: "cascade" }),
  name: text("name"),
  subscriptionId: text("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
  status: hostedInstanceStatusEnum("status").default('pending_setup').notNull(),
  discordBotId: text("discord_bot_id"),
  encryptedBotToken: text("encrypted_bot_token"),
  coolifyServiceUuid: text("coolify_service_uuid"),
  controlTokenHash: text('control_token_hash'),
  encryptedApiToken: text('encrypted_api_token'),
  apiUrl: text('api_url'),
  version: text('version'),
  commitSha: text('commit_sha'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const hostedInstanceGuilds = pgTable('hosted_instance_guilds', {
  guildId: text('guild_id').primaryKey(),
  instanceId: text('instance_id')
    .notNull()
    .references(() => hostedInstances.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});
