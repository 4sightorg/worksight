import { z } from 'zod';

/** ----------------------------- */
/** Survey Question Types         */
/** ----------------------------- */

/**
 * Allowed question types in a survey.
 */
export const SurveyQuestionTypeSchema = z.enum([
  'scale',
  'text',
  'radio',
  'number',
  'email',
]);

/** ----------------------------- */
/** Survey Template               */
/** ----------------------------- */

/**
 * Survey (admin-created template)
 */
export const SurveySchema = z.object({
  /** Unique survey ID */
  id: z.uuid(),
  /** Creator's employee id */
  created_by: z.uuid(),
  /** Creation timestamp */
  created_at: z.date(),
  /** Number of questions in the survey */
  num_questions: z.number().int().nonnegative(),
});

/** ----------------------------- */
/** Survey Question               */
/** ----------------------------- */

/**
 * Single survey question definition.
 */
export const SurveyQuestionSchema = z.object({
  id: z.number().int().nonnegative(),
  survey_id: z.uuid(),
  question_text: z.string(),
  question_subtext: z.string().optional(),
  dimension: z.union([z.string(), z.array(z.string())]),
  type: SurveyQuestionTypeSchema,
  required: z.boolean().default(true),
  options: z.array(z.string()).optional(), // for radio/select
  reverseScore: z.boolean().default(false),
  min_value: z.number().optional(),
  min_label: z.string().optional(),
  max_value: z.number().optional(),
  max_label: z.string().optional(),
  defaultValue: z.union([z.string(), z.number()]).optional(),
});

/** ----------------------------- */
/** Survey Response Metadata      */
/** ----------------------------- */

/**
 * Metadata for a single survey submission
 */
export const SurveyResponseMetadataSchema = z.object({
  id: z.uuid(),
  survey_id: z.uuid(),
  employee_id: z.uuid(),
  submitted_at: z.date(),
  avg_score: z.number().nullable(),
});

/** ----------------------------- */
/** Survey Response               */
/** ----------------------------- */

/**
 * Single answer to a survey question
 */
export const SurveyResponseSchema = z.object({
  id: z.uuid(),
  response_meta_id: z.uuid(),
  question_id: z.number().int(),
  response: z.union([z.string(), z.number()]).nullable(),
  created_at: z.date(),
});

/** ----------------------------- */
/** Survey Submission (API input) */
/** ----------------------------- */

/**
 * Payload for submitting a filled survey.
 */
export const SurveySubmissionSchema = z.object({
  employee_id: z.uuid(),
  answers: z
    .array(
      z.object({
        question_id: z.number().int().nonnegative(),
        response: z.union([z.string(), z.number()]).nullable(),
      })
    )
    .min(1),
});

/** ----------------------------- */
/** Survey Question Stats         */
/** ----------------------------- */

/**
 * Option question statistics
 */
export const OptionQuestionStatsSchema = z.object({
  avgOptions: z.number(),
  maxOptions: z.number(),
  minOptions: z.number(),
});

/**
 * Scale/number question range
 */
export const ScaleRangeSchema = z.object({
  min: z.number(),
  max: z.number(),
});

/**
 * Aggregated stats for survey questions
 */
export const SurveyQuestionStatsSchema = z.object({
  totalQuestions: z.number(),
  requiredCount: z.number(),
  optionalCount: z.number(),
  reverseScoreCount: z.number(),
  typeBreakdown: z.record(SurveyQuestionTypeSchema, z.number()),
  dimensionBreakdown: z.record(z.string(), z.number()),
  scaleRange: ScaleRangeSchema.nullable(),
  optionsStats: OptionQuestionStatsSchema.nullable(),
  defaultValueCount: z.number(),
  subtextCount: z.number(),
});

/** ----------------------------- */
/** Survey Stats                  */
/** ----------------------------- */

export const SurveyStatsSchema = z.object({
  totalSurveys: z.number(),
  avgQuestionsPerSurvey: z.number(),
});

/** ----------------------------- */
/** Survey Response Stats         */
/** ----------------------------- */

/**
 * Stats for survey submission metadata
 */
export const SurveyResponseMetadataStatsSchema = z.object({
  totalSubmissions: z.number(),
  avgScore: z.number().nullable(),
  submissionsPerSurvey: z.record(z.string(), z.number()),
});

/**
 * Stats for individual survey responses
 */
export const SurveyResponseStatsSchema = z.object({
  totalResponses: z.number(),
  nullResponses: z.number(),
  avgNumericResponse: z.number().nullable(),
  responsesPerQuestion: z.record(z.string(), z.number()),
});

/** ----------------------------- */
/** Type Inference                */
/** ----------------------------- */

export type Survey = z.infer<typeof SurveySchema>;
export type SurveyStats = z.infer<typeof SurveyStatsSchema>;
export type SurveyQuestion = z.infer<typeof SurveyQuestionSchema>;
export type SurveyQuestionType = z.infer<typeof SurveyQuestionTypeSchema>;
export type SurveyQuestionStats = z.infer<typeof SurveyQuestionStatsSchema>;
export type SurveyResponse = z.infer<typeof SurveyResponseSchema>;
export type SurveySubmission = z.infer<typeof SurveySubmissionSchema>;
export type SurveyResponseStats = z.infer<typeof SurveyResponseStatsSchema>;
export type SurveyResponseMetadata = z.infer<typeof SurveyResponseMetadataSchema>;
export type SurveyResponseMetadataStats = z.infer<typeof SurveyResponseMetadataStatsSchema>;
