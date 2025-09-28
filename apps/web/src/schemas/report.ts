import { z } from 'zod';

// Report types
export const ReportType = z.enum([
  'burnout_analysis',
  'survey_results',
  'user_activity',
  'department_overview',
  'risk_assessment',
  'task_completion',
  'engagement_metrics',
]);

// Time period schema
export const TimePeriodSchema = z.object({
  start: z.string().datetime('Invalid start date'),
  end: z.string().datetime('Invalid end date'),
  period: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
});

// Report filter schema
export const ReportFilterSchema = z.object({
  departments: z.array(z.string()).default([]),
  teams: z.array(z.string()).default([]),
  roles: z.array(z.string()).default([]),
  riskLevels: z.array(z.enum(['low', 'medium', 'high'])).default([]),
  userIds: z.array(z.string()).default([]),
});

// Chart data schema
export const ChartDataSchema = z.object({
  type: z.enum(['line', 'bar', 'pie', 'area', 'scatter']),
  data: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      color: z.string().optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    })
  ),
  title: z.string(),
  description: z.string().optional(),
});

// Report metric schema
export const ReportMetricSchema = z.object({
  name: z.string().min(1, 'Metric name is required'),
  value: z.number(),
  previousValue: z.number().optional(),
  change: z.number().optional(), // percentage change
  changeType: z.enum(['increase', 'decrease', 'stable']).optional(),
  unit: z.string().optional(), // %, count, score, etc.
  trend: z.enum(['up', 'down', 'flat']).optional(),
  color: z.enum(['green', 'red', 'yellow', 'blue', 'gray']).default('blue'),
});

// Report section schema
export const ReportSectionSchema = z.object({
  id: z.string().min(1, 'Section ID is required'),
  title: z.string().min(1, 'Section title is required'),
  description: z.string().optional(),
  type: z.enum(['metrics', 'chart', 'table', 'text']),
  data: z.union([
    z.array(ReportMetricSchema), // for metrics
    ChartDataSchema, // for charts
    z.array(z.record(z.string(), z.unknown())), // for tables
    z.string(), // for text
  ]),
  order: z.number().min(0, 'Order cannot be negative'),
});

// Main report schema
export const ReportSchema = z.object({
  id: z.string().min(1, 'Report ID is required'),
  title: z.string().min(1, 'Report title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  type: ReportType,
  createdBy: z.string().min(1, 'Creator ID is required'),
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
  timePeriod: TimePeriodSchema,
  filters: ReportFilterSchema,
  sections: z.array(ReportSectionSchema).min(1, 'Report must have at least one section'),
  status: z.enum(['generating', 'completed', 'failed']).default('generating'),
  downloadUrl: z.string().url().optional(),
  scheduledRefresh: z.boolean().default(false),
  lastRefreshed: z.string().datetime().optional(),
});

// Report creation schema
export const CreateReportSchema = z.object({
  title: z.string().min(1, 'Report title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  type: ReportType,
  timePeriod: TimePeriodSchema,
  filters: ReportFilterSchema.optional(),
  scheduledRefresh: z.boolean().default(false),
});

// Report update schema
export const UpdateReportSchema = z.object({
  id: z.string().min(1, 'Report ID is required'),
  title: z.string().min(1, 'Report title is required').max(200, 'Title too long').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  timePeriod: TimePeriodSchema.optional(),
  filters: ReportFilterSchema.optional(),
  scheduledRefresh: z.boolean().optional(),
});

// Report filters for listing
export const ReportFiltersSchema = z.object({
  searchTerm: z.string().max(100, 'Search term too long').default(''),
  type: z.enum(['all', ...ReportType.options]).default('all'),
  status: z.enum(['all', 'generating', 'completed', 'failed']).default('all'),
  createdBy: z.string().max(50, 'Creator filter too long').default('all'),
  dateRange: z
    .object({
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    })
    .optional(),
});

// Burnout analytics specific schema
export const BurnoutAnalyticsSchema = z.object({
  averageScore: z.number().min(0).max(10),
  highRiskCount: z.number().min(0),
  mediumRiskCount: z.number().min(0),
  lowRiskCount: z.number().min(0),
  totalUsers: z.number().min(0),
  departmentBreakdown: z.array(
    z.object({
      department: z.string(),
      averageScore: z.number().min(0).max(10),
      userCount: z.number().min(0),
    })
  ),
  trendData: z.array(
    z.object({
      date: z.string().datetime(),
      averageScore: z.number().min(0).max(10),
    })
  ),
});

// Type exports
export type Report = z.infer<typeof ReportSchema>;
export type CreateReport = z.infer<typeof CreateReportSchema>;
export type UpdateReport = z.infer<typeof UpdateReportSchema>;
export type ReportSection = z.infer<typeof ReportSectionSchema>;
export type ReportMetric = z.infer<typeof ReportMetricSchema>;
export type ChartData = z.infer<typeof ChartDataSchema>;
export type TimePeriod = z.infer<typeof TimePeriodSchema>;
export type ReportFilter = z.infer<typeof ReportFilterSchema>;
export type ReportFilters = z.infer<typeof ReportFiltersSchema>;
export type BurnoutAnalytics = z.infer<typeof BurnoutAnalyticsSchema>;
export type ReportTypeValue = z.infer<typeof ReportType>;

// Validation helper functions
export const validateReport = (data: unknown) => ReportSchema.safeParse(data);
export const validateCreateReport = (data: unknown) => CreateReportSchema.safeParse(data);
export const validateUpdateReport = (data: unknown) => UpdateReportSchema.safeParse(data);
export const validateReportSection = (data: unknown) => ReportSectionSchema.safeParse(data);
export const validateReportFilters = (data: unknown) => ReportFiltersSchema.safeParse(data);
export const validateBurnoutAnalytics = (data: unknown) => BurnoutAnalyticsSchema.safeParse(data);

// Custom validation rules
export const validateReportDates = (timePeriod: TimePeriod) => {
  const start = new Date(timePeriod.start);
  const end = new Date(timePeriod.end);

  if (start >= end) {
    return { success: false, error: 'End date must be after start date' };
  }

  // Check if date range is reasonable for the period type
  const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  switch (timePeriod.period) {
    case 'daily':
      if (diffDays > 31) {
        return { success: false, error: 'Daily reports should not exceed 31 days' };
      }
      break;
    case 'weekly':
      if (diffDays > 365) {
        return { success: false, error: 'Weekly reports should not exceed 1 year' };
      }
      break;
    case 'monthly':
      if (diffDays > 730) {
        return { success: false, error: 'Monthly reports should not exceed 2 years' };
      }
      break;
  }

  return { success: true };
};

export const validateSectionOrder = (sections: ReportSection[]) => {
  const orders = sections.map((s) => s.order);
  const uniqueOrders = new Set(orders);
  if (orders.length !== uniqueOrders.size) {
    return { success: false, error: 'Section orders must be unique' };
  }
  return { success: true };
};
