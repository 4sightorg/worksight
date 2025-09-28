import { z } from 'zod';

// Survey question types
export const QuestionType = z.enum([
  'multiple_choice',
  'single_choice',
  'text',
  'rating',
  'yes_no',
  'scale',
  'date',
]);

// Survey question schema
export const SurveyQuestionSchema = z.object({
  id: z.string().min(1, 'Question ID is required'),
  type: QuestionType,
  title: z.string().min(1, 'Question title is required').max(200, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // For multiple choice questions
  minValue: z.number().optional(), // For rating/scale questions
  maxValue: z.number().optional(), // For rating/scale questions
  order: z.number().min(0, 'Order cannot be negative'),
});

// Survey schema
export const SurveySchema = z.object({
  id: z.string().min(1, 'Survey ID is required'),
  title: z.string().min(1, 'Survey title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  status: z.enum(['draft', 'active', 'completed', 'archived']),
  createdBy: z.string().min(1, 'Creator ID is required'),
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
  startDate: z.string().datetime('Invalid start date').optional(),
  endDate: z.string().datetime('Invalid end date').optional(),
  targetDepartments: z.array(z.string()).default([]),
  targetRoles: z.array(z.string()).default([]),
  questions: z.array(SurveyQuestionSchema).min(1, 'Survey must have at least one question'),
  responseCount: z.number().min(0, 'Response count cannot be negative').default(0),
  completionRate: z.number().min(0).max(100, 'Completion rate cannot exceed 100%').default(0),
});

// Survey creation schema (without ID and timestamps)
export const CreateSurveySchema = z.object({
  title: z.string().min(1, 'Survey title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  startDate: z.string().datetime('Invalid start date').optional(),
  endDate: z.string().datetime('Invalid end date').optional(),
  targetDepartments: z.array(z.string()).default([]),
  targetRoles: z.array(z.string()).default([]),
  questions: z
    .array(SurveyQuestionSchema.omit({ id: true }))
    .min(1, 'Survey must have at least one question'),
});

// Survey update schema
export const UpdateSurveySchema = z.object({
  id: z.string().min(1, 'Survey ID is required'),
  title: z.string().min(1, 'Survey title is required').max(200, 'Title too long').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  status: z.enum(['draft', 'active', 'completed', 'archived']).optional(),
  startDate: z.string().datetime('Invalid start date').optional(),
  endDate: z.string().datetime('Invalid end date').optional(),
  targetDepartments: z.array(z.string()).optional(),
  targetRoles: z.array(z.string()).optional(),
  questions: z.array(SurveyQuestionSchema).optional(),
});

// Survey response schema
export const SurveyResponseSchema = z.object({
  id: z.string().min(1, 'Response ID is required'),
  surveyId: z.string().min(1, 'Survey ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  responses: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
  ),
  completedAt: z.string().datetime('Invalid completion date'),
  timeSpent: z.number().min(0, 'Time spent cannot be negative'), // in seconds
});

// Survey filters schema
export const SurveyFiltersSchema = z.object({
  searchTerm: z.string().max(100, 'Search term too long').default(''),
  status: z.enum(['all', 'draft', 'active', 'completed', 'archived']).default('all'),
  department: z.string().max(50, 'Department filter too long').default('all'),
  createdBy: z.string().max(50, 'Creator filter too long').default('all'),
  dateRange: z
    .object({
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    })
    .optional(),
});

// Type exports
export type Survey = z.infer<typeof SurveySchema>;
export type CreateSurvey = z.infer<typeof CreateSurveySchema>;
export type UpdateSurvey = z.infer<typeof UpdateSurveySchema>;
export type SurveyQuestion = z.infer<typeof SurveyQuestionSchema>;
export type SurveyResponse = z.infer<typeof SurveyResponseSchema>;
export type SurveyFilters = z.infer<typeof SurveyFiltersSchema>;
export type QuestionTypeValue = z.infer<typeof QuestionType>;

// Validation helper functions
export const validateSurvey = (data: unknown) => SurveySchema.safeParse(data);
export const validateCreateSurvey = (data: unknown) => CreateSurveySchema.safeParse(data);
export const validateUpdateSurvey = (data: unknown) => UpdateSurveySchema.safeParse(data);
export const validateSurveyQuestion = (data: unknown) => SurveyQuestionSchema.safeParse(data);
export const validateSurveyResponse = (data: unknown) => SurveyResponseSchema.safeParse(data);
export const validateSurveyFilters = (data: unknown) => SurveyFiltersSchema.safeParse(data);

// Custom validation rules
export const validateSurveyDates = (survey: CreateSurvey | UpdateSurvey) => {
  if (survey.startDate && survey.endDate) {
    const start = new Date(survey.startDate);
    const end = new Date(survey.endDate);
    if (start >= end) {
      return { success: false, error: 'End date must be after start date' };
    }
  }
  return { success: true };
};

export const validateQuestionOrder = (questions: SurveyQuestion[]) => {
  const orders = questions.map((q) => q.order);
  const uniqueOrders = new Set(orders);
  if (orders.length !== uniqueOrders.size) {
    return { success: false, error: 'Question orders must be unique' };
  }
  return { success: true };
};
