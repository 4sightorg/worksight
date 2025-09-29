import { SurveyQuestionnaire, SurveyResponseList, SurveyResponses, Surveys } from '@worksight/common/data';
import {
  Survey,
  SurveyQuestion,
  SurveyQuestionSchema,
  SurveyQuestionStats,
  SurveyQuestionType,
  SurveyQuestionTypeSchema,
  SurveyResponse,
  SurveyResponseMetadata,
  SurveyResponseMetadataSchema,
  SurveyResponseMetadataStats,
  SurveyResponseSchema,
  SurveyResponseStats,
  SurveySchema,
  SurveyStats
} from '@worksight/common/types';
import { BaseLookup } from './base';

/**
 * Lookup for surveys
 */
export class SurveyMetadataLookup extends BaseLookup<typeof SurveySchema> {
  constructor(entries: Survey[] = Surveys) {
    super(SurveySchema, entries);
  }

  /**
   * Compute summary stats for surveys
   */
  public getStats(): SurveyStats {
    const totalSurveys = this.entries.length;
    const avgQuestions =
      totalSurveys > 0
        ? this.entries.reduce((sum, s) => sum + s.num_questions, 0) / totalSurveys
        : 0;

    return { totalSurveys, avgQuestionsPerSurvey: avgQuestions };
  }
}

/**
 * Lookup for survey questions
 */
export class SurveyQuestionLookup extends BaseLookup<typeof SurveyQuestionSchema> {
  constructor(entries: SurveyQuestion[] = SurveyQuestionnaire) {
    super(SurveyQuestionSchema, entries);
  }

  /**
   * Compute detailed statistics for survey questions
   * @param survey_id optional survey UUID
   */
  public getStats(survey_id?: string): SurveyQuestionStats {
    const entries = survey_id
      ? this.entries.filter((q) => q.survey_id === survey_id)
      : this.entries;

    // Type breakdown
    const typeBreakdown: Record<SurveyQuestionType, number> = Object.fromEntries(
      SurveyQuestionTypeSchema.options.map((t) => [t, 0])
    ) as Record<SurveyQuestionType, number>;
    entries.forEach((q) => typeBreakdown[q.type] += 1);

    // Dimension breakdown
    const dimensionBreakdown: Record<string, number> = {};
    entries.forEach((q) => {
      const dims = Array.isArray(q.dimension) ? q.dimension : [q.dimension];
      dims.forEach((d) => dimensionBreakdown[d] = (dimensionBreakdown[d] || 0) + 1);
    });

    // Required / optional counts
    const requiredCount = entries.filter((q) => q.required).length;
    const optionalCount = entries.length - requiredCount;

    // Reverse score
    const reverseScoreCount = entries.filter((q) => q.reverseScore).length;

    // Options stats
    const optionLengths = entries.filter((q) => q.options?.length).map((q) => q.options!.length);
    const avgOptions = optionLengths.length ? optionLengths.reduce((a, b) => a + b, 0) / optionLengths.length : 0;
    const maxOptions = optionLengths.length ? Math.max(...optionLengths) : 0;
    const minOptions = optionLengths.length ? Math.min(...optionLengths) : 0;

    // Scale questions
    const scaleQuestions = entries.filter(q => q.type === 'scale' || q.type === 'number');
    const minScale = scaleQuestions.map(q => q.min_value ?? Infinity).reduce((a, b) => Math.min(a, b), Infinity);
    const maxScale = scaleQuestions.map(q => q.max_value ?? -Infinity).reduce((a, b) => Math.max(a, b), -Infinity);

    // Default values and subtext
    const defaultValueCount = entries.filter(q => q.defaultValue !== undefined).length;
    const subtextCount = entries.filter(q => q.question_subtext).length;

    return {
      totalQuestions: entries.length,
      requiredCount,
      optionalCount,
      reverseScoreCount,
      typeBreakdown,
      dimensionBreakdown,
      scaleRange: scaleQuestions.length ? { min: minScale, max: maxScale } : null,
      optionsStats: optionLengths.length ? { avgOptions, maxOptions, minOptions } : null,
      defaultValueCount,
      subtextCount,
    };
  }
}

/**
 * Lookup for survey response metadata
 */
export class SurveyResponsesLookup extends BaseLookup<typeof SurveyResponseMetadataSchema> {
  constructor(entries: SurveyResponseMetadata[] = SurveyResponseList) {
    super(SurveyResponseMetadataSchema, entries);
  }

  public getStats(): SurveyResponseMetadataStats {
    const totalSubmissions = this.entries.length;
    const avgScore = totalSubmissions ? this.entries.reduce((sum, r) => sum + (r.avg_score ?? 0), 0) / totalSubmissions : null;
    const submissionsPerSurvey: Record<string, number> = {};
    this.entries.forEach(r => submissionsPerSurvey[r.survey_id] = (submissionsPerSurvey[r.survey_id] || 0) + 1);
    return { totalSubmissions, avgScore, submissionsPerSurvey };
  }
}

/**
 * Lookup for survey responses
 */
export class SurveyResponseLookup extends BaseLookup<typeof SurveyResponseSchema> {
  constructor(entries: SurveyResponse[] = SurveyResponses) {
    super(SurveyResponseSchema, entries);
  }

  public getStats(): SurveyResponseStats {
    const totalResponses = this.entries.length;
    const nullResponses = this.entries.filter(r => r.response === null).length;

    const numericResponses = this.entries.map(r => typeof r.response === 'number' ? r.response : null).filter(r => r !== null) as number[];
    const avgNumericResponse = numericResponses.length ? numericResponses.reduce((a, b) => a + b, 0) / numericResponses.length : null;

    const responsesPerQuestion: Record<string, number> = {};
    this.entries.forEach(r => {
      const qid = r.question_id.toString();
      responsesPerQuestion[qid] = (responsesPerQuestion[qid] || 0) + 1;
    });

    return { totalResponses, nullResponses, avgNumericResponse, responsesPerQuestion };
  }
}
