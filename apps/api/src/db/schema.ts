import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Postgres schema mirrored from `@worksight/common` types.
 * IDs are `text` (not uuid) because shared fixtures include non-RFC UUIDs
 * and sentinel manager ids like "" / "admin".
 */

export const dataSources = pgTable('data_sources', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').array().notNull(),
  baseUrl: text('base_url').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  modules: text('modules').array().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const employees = pgTable('employees', {
  id: text('id').primaryKey(),
  internalId: text('internal_id').notNull(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  department: text('department').array().notNull(),
  team: text('team'),
  managerId: text('manager_id'),
  dateJoined: timestamp('date_joined', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const teams = pgTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  department: text('department').notNull(),
  managerId: text('manager_id').notNull(),
  memberIds: text('member_ids').array().notNull(),
  parentTeamId: text('parent_team_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const assignments = pgTable('assignments', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  sourceId: text('source_id'),
  externalId: text('external_id'),
  type: text('type').notNull(),
  title: text('title'),
  status: text('status').notNull().default('todo'),
  sprint: text('sprint'),
  epic: text('epic'),
  points: integer('points'),
  priority: text('priority').notNull().default('low'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const activities = pgTable('activities', {
  id: text('id').primaryKey(),
  sourceId: text('source_id').notNull(),
  externalId: text('external_id').notNull(),
  employeeId: text('employee_id').notNull(),
  type: text('type').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  description: text('description').notNull(),
  isAfterHours: boolean('is_after_hours').notNull().default(false),
  isWeekend: boolean('is_weekend').notNull().default(false),
  isUrgent: boolean('is_urgent').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});

export type EmployeeRow = typeof employees.$inferSelect;
export type TeamRow = typeof teams.$inferSelect;
export type AssignmentRow = typeof assignments.$inferSelect;
export type ActivityRow = typeof activities.$inferSelect;
export type DataSourceRow = typeof dataSources.$inferSelect;
