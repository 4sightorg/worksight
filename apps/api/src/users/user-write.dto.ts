import { BadRequestException } from '@nestjs/common';
import {
  DepartmentsSchema,
  RoleSchema,
} from '@worksight/common';
import { z } from 'zod';

/**
 * Write-side validation for user endpoints, derived from shared `@worksight/common` schemas.
 */

const CreateUserSchema = z.object({
  id: z.string().uuid().optional(),
  internal_id: z.string().optional(),
  email: z.string().email(),
  name: z.string().min(1, 'Name is required'),
  role: RoleSchema.default('employee'),
  department: z.array(DepartmentsSchema).optional().default(['engineering']),
  team: z.string().uuid().nullable().optional(),
  manager_id: z.string().uuid().nullable().optional(),
});

const UpdateUserSchema = CreateUserSchema.partial();

export type CreateUserInput = {
  id?: string;
  internal_id?: string;
  email: string;
  name: string;
  role: 'employee' | 'team_lead' | 'manager' | 'admin' | 'super_admin' | 'guest';
  department: Array<
    'frontend' | 'backend' | 'data' | 'sysadmin' | 'guest' | 'business' | 'engineering' | ''
  >;
  team?: string | null;
  manager_id?: string | null;
};

export type UpdateUserInput = {
  email?: string;
  name?: string;
  role?: 'employee' | 'team_lead' | 'manager' | 'admin' | 'super_admin' | 'guest';
  department?: Array<
    'frontend' | 'backend' | 'data' | 'sysadmin' | 'guest' | 'business' | 'engineering' | ''
  >;
  team?: string | null;
  manager_id?: string | null;
};

type IssueLike = { path: PropertyKey[]; message: string };

function describeIssues(error: { issues: readonly IssueLike[] }): string {
  return error.issues
    .map(issue => `${issue.path.map(String).join('.') || 'body'}: ${issue.message}`)
    .join('; ');
}

export function parseCreateUser(body: unknown): CreateUserInput {
  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) {
    throw new BadRequestException(describeIssues(parsed.error));
  }
  return parsed.data as CreateUserInput;
}

export function parseUpdateUser(body: unknown): UpdateUserInput {
  const parsed = UpdateUserSchema.safeParse(body);
  if (!parsed.success) {
    throw new BadRequestException(describeIssues(parsed.error));
  }
  return parsed.data as UpdateUserInput;
}
