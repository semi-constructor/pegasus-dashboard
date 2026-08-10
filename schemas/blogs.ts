import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  index,
} from 'drizzle-orm/pg-core';
import { authUsers } from './auth';

export const blogs = pgTable(
  'blogs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    shortDescription: text('short_description'),
    content: text('content').notNull(),
    authorId: varchar('author_id', { length: 255 })
      .references(() => authUsers.id, { onDelete: 'set null' }),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    slugIdx: index('blogs_slug_idx').on(table.slug),
    publishedIdx: index('blogs_published_idx').on(table.publishedAt),
  })
);
