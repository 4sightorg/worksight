import { z } from 'zod';

/** ----------------- */
/** Constants         */
/** ----------------- */

/** Departments in the organization */
export const Departments = [
  'frontend',
  'backend',
  'data',
  'sysadmin',
  'guest',
  'business',
  'engineering',
  '',
] as const;

/** Employee roles */
export const Roles = [
  'employee',
  'team_lead',
  'manager',
  'admin',
  'super_admin',
  'guest'
] as const;

/** ----------------- */
/** Zod Enums         */
/** ----------------- */

/** Department enum schema */
export const DepartmentsSchema = z.enum(Departments);

/** Role enum schema */
export const RoleSchema = z.enum(Roles);

/** ----------------- */
/** Employee Profile  */
/** ----------------- */

export const EmployeeProfileSchema = z.object({
  id: z.uuid(),                        // Unique employee ID
  internal_id: z.string(),             // Internal employee code
  email: z.email(),           // Email address
  name: z.string(),                     // Full name
  role: RoleSchema,                     // Role
  department: z.array(DepartmentsSchema), // Departments
  team: z.uuid().nullable().optional(),   // Optional team ID
  manager_id: z.uuid().optional(),        // Optional manager ID
  date_joined: z.date(),                 // Joining date
  created_at: z.date(),
  updated_at: z.date(),
});
export type EmployeeProfile = z.infer<typeof EmployeeProfileSchema>;

/** ----------------- */
/** Employee Credentials */
/** ----------------- */

export const EmployeeCredentialSchema = z.object({
  system_id: z.uuid(),
  password: z.string(),
});
export type EmployeeCredential = z.infer<typeof EmployeeCredentialSchema>;

/** ----------------- */
/** Team Schema       */
/** ----------------- */

export const TeamSchema = z.object({
  id: z.uuid(),                  // Team ID
  name: z.string(),              // Team name
  description: z.string().optional(),
  department: DepartmentsSchema,
  manager_id: z.uuid(),
  member_ids: z.array(z.uuid()),
  parent_team_id: z.uuid().nullable().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});
export type Team = z.infer<typeof TeamSchema>;
