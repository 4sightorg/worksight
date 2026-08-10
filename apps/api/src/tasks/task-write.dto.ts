import { BadRequestException } from '@nestjs/common';
import {
  AssignmentPriority,
  AssignmentPrioritySchema,
  AssignmentSchema,
  AssignmentStatus,
  AssignmentStatusSchema,
  AssignmentType,
} from '@worksight/common';

/**
 * Write-side validation for the task endpoints, derived from the shared
 * `AssignmentSchema` so the API can never drift from `@worksight/common`.
 *
 * Zod is not a direct dependency of the API, so the schema constants stay
 * module-private: exporting them would force `tsc` to name Zod's inferred
 * types through `packages/common/node_modules` (TS2742). The exported surface
 * is the two hand-written input types plus the parse functions.
 */

/**
 * `PATCH /tasks/:id` — every field optional, unknown keys stripped.
 *
 * `status` / `priority` are re-declared from their bare enums instead of being
 * `.pick()`ed: the shared schema gives them a `.default()`, and `.partial()`
 * does **not** drop defaults, so an empty PATCH body would otherwise silently
 * reset both columns to `todo` / `low`.
 */
const UpdateAssignmentSchema = AssignmentSchema.pick({
  title: true,
  points: true,
})
  .partial()
  .extend({
    status: AssignmentStatusSchema.optional(),
    priority: AssignmentPrioritySchema.optional(),
  });

/**
 * `POST /tasks` — Assignment-shaped. `employee_id` and `type` are required, a
 * supplied `id` must be a UUID (one is generated when missing), and `status` /
 * `priority` fall back to the shared defaults. Timestamps are server-owned:
 * `created_at` / `updated_at` in the body are ignored rather than rejected.
 */
const CreateAssignmentSchema = AssignmentSchema.omit({
  created_at: true,
  updated_at: true,
}).partial({
  id: true,
  source_id: true,
  external_id: true,
  title: true,
  sprint: true,
  epic: true,
  points: true,
});

export type CreateAssignmentInput = {
  id?: string;
  employee_id: string;
  source_id?: string | null;
  external_id?: string | null;
  type: AssignmentType;
  title?: string | null;
  status: AssignmentStatus;
  sprint?: string | null;
  epic?: string | null;
  points?: number | null;
  priority: AssignmentPriority;
};

export type UpdateAssignmentInput = {
  status?: AssignmentStatus;
  priority?: AssignmentPriority;
  title?: string | null;
  points?: number | null;
};

export function parseCreateAssignment(body: unknown): CreateAssignmentInput {
  const parsed = CreateAssignmentSchema.safeParse(body);
  if (!parsed.success) {
    throw new BadRequestException(describeIssues(parsed.error));
  }
  assertIntegerPoints(parsed.data.points);
  return parsed.data;
}

export function parseUpdateAssignment(body: unknown): UpdateAssignmentInput {
  const parsed = UpdateAssignmentSchema.safeParse(body);
  if (!parsed.success) {
    throw new BadRequestException(describeIssues(parsed.error));
  }
  assertIntegerPoints(parsed.data.points);
  return parsed.data;
}

type IssueLike = { path: PropertyKey[]; message: string };

/** Flatten Zod issues into one human-readable line for a 400 response. */
function describeIssues(error: { issues: readonly IssueLike[] }): string {
  return error.issues
    .map(issue => `${issue.path.map(String).join('.') || 'body'}: ${issue.message}`)
    .join('; ');
}

/** `points` maps to an integer column; reject floats before Postgres does. */
function assertIntegerPoints(points: number | null | undefined): void {
  if (typeof points === 'number' && !Number.isInteger(points)) {
    throw new BadRequestException('points: expected an integer');
  }
}
