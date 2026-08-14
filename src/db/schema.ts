import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, doublePrecision, jsonb } from 'drizzle-orm/pg-core';

// Define the 'users' table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  targetTrack: text('target_track').default('GATE Mining'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'exam_attempts' table
export const examAttempts = pgTable('exam_attempts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  userUid: text('user_uid'),
  testId: text('test_id').notNull(),
  testTitle: text('test_title').notNull(),
  track: text('track').notNull(),
  date: text('date').notNull(),
  totalScore: doublePrecision('total_score').notNull(),
  maxScore: doublePrecision('max_score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  attemptedQuestions: integer('attempted_questions').notNull(),
  correctCount: integer('correct_count').notNull(),
  incorrectCount: integer('incorrect_count').notNull(),
  unattemptedCount: integer('unattempted_count').notNull(),
  accuracy: doublePrecision('accuracy').notNull(),
  percentile: doublePrecision('percentile').notNull(),
  simulatedAIR: integer('simulated_air').notNull(),
  timeTakenSeconds: integer('time_taken_seconds').notNull(),
  answersJson: jsonb('answers_json'),
  subjectPerformanceJson: jsonb('subject_performance_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  attempts: many(examAttempts),
}));

export const examAttemptsRelations = relations(examAttempts, ({ one }) => ({
  user: one(users, {
    fields: [examAttempts.userId],
    references: [users.id],
  }),
}));
