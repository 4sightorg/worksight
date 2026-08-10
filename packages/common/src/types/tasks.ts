import { z } from 'zod';

/** ----------------------------- */
/** Assignment Types              */
/** ----------------------------- */
export const AssignmentTypeSchema = z.enum([
  'feature', 'bug', 'task', 'research', 'documentation', 'infrastructure'
]);

export const AssignmentStatusSchema = z.enum(['todo', 'in_progress', 'completed']);
export const AssignmentPrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);

/**
 * Assignment object representing a task/feature/bug for an employee
 */
export const AssignmentSchema = z.object({
  id: z.uuid(),
  employee_id: z.uuid(),
  source_id: z.uuid().nullable(),
  external_id: z.string().nullable(),
  type: AssignmentTypeSchema,
  title: z.string().nullable(),
  status: AssignmentStatusSchema.default('todo'),
  sprint: z.string().nullable(),
  epic: z.string().nullable(),
  points: z.number().nullable(),
  priority: AssignmentPrioritySchema.default('low'),
  created_at: z.date(),
  updated_at: z.date(),
});

/** ----------------------------- */
/** Activity Types                */
/** ----------------------------- */
export const ActivityTypeSchema = z.enum([
  'code_commit',
  'task_update',
  'task_creation',
  'communication',
  'research',
  'incident_response',
  'hotfix',
  'documentation',
]);

/**
 * Employee activity log
 */
export const ActivitySchema = z.object({
  id: z.uuid(),
  source_id: z.uuid(),
  external_id: z.string(),
  employee_id: z.uuid(),
  type: ActivityTypeSchema,
  timestamp: z.date(),
  description: z.string(),
  is_after_hours: z.boolean(),
  is_weekend: z.boolean(),
  is_urgent: z.boolean(),
  created_at: z.date(),
});

/** ----------------------------- */
/** Type Inference                */
/** ----------------------------- */
export type Activity = z.infer<typeof ActivitySchema>;
export type ActivityType = z.infer<typeof ActivityTypeSchema>;
export type AssignmentType = z.infer<typeof AssignmentTypeSchema>;
export type Assignment = z.infer<typeof AssignmentSchema>;
export type AssignmentStatus = z.infer<typeof AssignmentStatusSchema>;
export type AssignmentPriority = z.infer<typeof AssignmentPrioritySchema>;
