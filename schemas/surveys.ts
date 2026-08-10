import { pgTable, text, timestamp, uuid, jsonb, boolean, integer, pgEnum, unique } from 'drizzle-orm/pg-core';
import { guilds } from './guilds';
import { users } from './users';

export const surveyScopeEnum = pgEnum('survey_scope', ['GUILD', 'SYSTEM']);
export const surveyStatusEnum = pgEnum('survey_status', ['DRAFT', 'ACTIVE', 'CLOSED']);
export const questionTypeEnum = pgEnum('question_type', [
  'TEXT', 'LONG_TEXT', 'MULTIPLE_CHOICE', 'CHECKBOXES', 'DROPDOWN', 'RATING', 'NUMBER', 'DATE'
]);

export const surveys = pgTable('surveys', {
  id: uuid('id').defaultRandom().primaryKey(),
  scope: surveyScopeEnum('scope').notNull(),
  guildId: text('guild_id').references(() => guilds.id, { onDelete: 'cascade' }), // Nullable for SYSTEM scope
  creatorId: text('creator_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  status: surveyStatusEnum('status').default('DRAFT').notNull(),
  settings: jsonb('settings').$type<{
    access: { authentication: 'PUBLIC' | 'DISCORD' | 'GUILD_MEMBER', anonymous: boolean },
    allowMultipleResponses: boolean,
    showProgressBar: boolean,
    shuffleQuestions: boolean,
    confirmationMessage: string
  }>().notNull().default({
    access: { authentication: 'DISCORD', anonymous: false }, // Updated defaults for the new requirements
    allowMultipleResponses: false,
    showProgressBar: true,
    shuffleQuestions: false,
    confirmationMessage: "Thanks for your response!"
  }),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const surveySections = pgTable('survey_sections', {
  id: uuid('id').defaultRandom().primaryKey(),
  surveyId: uuid('survey_id').references(() => surveys.id, { onDelete: 'cascade' }).notNull(),
  title: text('title'),
  description: text('description'),
  order: integer('order').notNull(),
});

export const surveyQuestions = pgTable('survey_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  surveyId: uuid('survey_id').references(() => surveys.id, { onDelete: 'cascade' }).notNull(),
  sectionId: uuid('section_id').references(() => surveySections.id, { onDelete: 'cascade' }),
  key: text('key').notNull(), // Stable identifier
  type: questionTypeEnum('type').notNull(),
  questionText: text('question_text').notNull(),
  options: jsonb('options').$type<Array<{ id: string, label: string }>>(), // Structured options
  required: boolean('required').default(false).notNull(),
  order: integer('order').notNull(),
});

export const surveyResponses = pgTable('survey_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  surveyId: uuid('survey_id').references(() => surveys.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id), // Nullable for anonymous
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  // Application logic handles strict one-per-user checking based on survey settings
  unique('unq_survey_user').on(t.surveyId, t.userId)
]);

export const surveyAnswers = pgTable('survey_answers', {
  id: uuid('id').defaultRandom().primaryKey(),
  responseId: uuid('response_id').references(() => surveyResponses.id, { onDelete: 'cascade' }).notNull(),
  questionId: uuid('question_id').references(() => surveyQuestions.id, { onDelete: 'cascade' }).notNull(),
  answerText: text('answer_text'),
  answerChoices: jsonb('answer_choices'), // Array of option IDs
  answerNumber: integer('answer_number'),
  answerDate: timestamp('answer_date'),
});
