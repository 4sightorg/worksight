import { UserRole } from '@/auth/types';
import { z } from 'zod';

// User schema for validation
export const UserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(UserRole),
  department: z.string().min(1, 'Department is required').max(50, 'Department name too long'),
  team: z.string().min(1, 'Team is required').max(50, 'Team name too long'),
});

// User with metrics schema for admin interface
export const UserWithMetricsSchema = UserSchema.extend({
  burnoutScore: z
    .number()
    .min(0, 'Burnout score cannot be negative')
    .max(10, 'Burnout score cannot exceed 10'),
  lastActive: z.string().min(1, 'Last active time is required'),
  surveyCompleted: z.boolean(),
  riskLevel: z.enum(['low', 'medium', 'high']),
  tasksCompleted: z.number().min(0, 'Tasks completed cannot be negative'),
});

// User creation schema (without ID and metrics)
export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(UserRole),
  department: z.string().min(1, 'Department is required').max(50, 'Department name too long'),
  team: z.string().min(1, 'Team is required').max(50, 'Team name too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),
});

// User update schema (all fields optional except ID)
export const UpdateUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  role: z.nativeEnum(UserRole).optional(),
  department: z
    .string()
    .min(1, 'Department is required')
    .max(50, 'Department name too long')
    .optional(),
  team: z.string().min(1, 'Team is required').max(50, 'Team name too long').optional(),
});

// Search and filter schema
export const UserFiltersSchema = z.object({
  searchTerm: z.string().max(100, 'Search term too long').default(''),
  department: z.string().max(50, 'Department filter too long').default('all'),
  riskLevel: z.enum(['all', 'low', 'medium', 'high']).default('all'),
  role: z.enum(['all', ...Object.values(UserRole)]).default('all'),
});

// Type exports
export type UserWithMetrics = z.infer<typeof UserWithMetricsSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UserFilters = z.infer<typeof UserFiltersSchema>;

// Validation helper functions
export const validateUser = (data: unknown) => UserSchema.safeParse(data);
export const validateUserWithMetrics = (data: unknown) => UserWithMetricsSchema.safeParse(data);
export const validateCreateUser = (data: unknown) => CreateUserSchema.safeParse(data);
export const validateUpdateUser = (data: unknown) => UpdateUserSchema.safeParse(data);
export const validateUserFilters = (data: unknown) => UserFiltersSchema.safeParse(data);

// Bulk validation helper
export const validateUserArray = (data: unknown[]) => {
  const results = data.map((item, index) => {
    const result = UserWithMetricsSchema.safeParse(item);
    return {
      index,
      success: result.success,
      data: result.success ? result.data : null,
      errors: result.success ? null : result.error?.issues || [],
    };
  });

  return {
    valid: results.filter((r) => r.success),
    invalid: results.filter((r) => !r.success),
    allValid: results.every((r) => r.success),
  };
};
