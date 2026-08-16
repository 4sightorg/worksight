import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  CreateSurveyInput,
  SurveyMetadataLookup,
  SurveyQuestionLookup,
  SurveyResponseList,
  type Survey,
  type SurveyQuestion,
  type SurveyResponseMetadata,
  type SurveySubmission,
} from '@worksight/common';
import { paginate, PaginationQuery } from '../common/pagination.dto';
import { WorksightRepository } from '../db/worksight.repository';

@Injectable()
export class SurveysService {
  private readonly surveys = new SurveyMetadataLookup();
  private readonly questions = new SurveyQuestionLookup();
  // Fixture-mode submissions live in memory for the offline demo.
  private readonly submissions: SurveyResponseMetadata[] = [...SurveyResponseList];

  constructor(private readonly repo: WorksightRepository) {}

  async findAll(pagination?: PaginationQuery): Promise<Survey[]> {
    const list = this.repo.enabled ? await this.repo.listSurveys() : this.surveys.all();
    return paginate(list, pagination);
  }

  async findOne(id: string): Promise<Survey> {
    if (this.repo.enabled) {
      const survey = await this.repo.getSurvey(id);
      if (!survey) {
        throw new NotFoundException(`Survey ${id} not found`);
      }
      return survey;
    }
    const survey = this.surveys.filter({ id }).first();
    if (!survey) {
      throw new NotFoundException(`Survey ${id} not found`);
    }
    return survey;
  }

  async findQuestions(surveyId: string): Promise<SurveyQuestion[]> {
    if (this.repo.enabled) {
      const survey = await this.repo.getSurvey(surveyId);
      if (!survey) {
        throw new NotFoundException(`Survey ${surveyId} not found`);
      }
      return this.repo.listSurveyQuestions(surveyId);
    }
    if (!this.surveys.filter({ id: surveyId }).first()) {
      throw new NotFoundException(`Survey ${surveyId} not found`);
    }
    return this.questions.filter({ survey_id: surveyId }).all();
  }

  async findSubmissions(
    employeeId?: string,
    pagination?: PaginationQuery
  ): Promise<SurveyResponseMetadata[]> {
    const list = this.repo.enabled
      ? await this.repo.listSurveySubmissions(employeeId)
      : employeeId
        ? this.submissions.filter(s => s.employee_id === employeeId)
        : [...this.submissions];
    return paginate(list, pagination);
  }

  async findSubmissionsBySurvey(
    surveyId: string,
    employeeId?: string
  ): Promise<SurveyResponseMetadata[]> {
    await this.findOne(surveyId);
    if (this.repo.enabled) {
      return this.repo.listSurveySubmissionsBySurvey(surveyId, employeeId);
    }
    return this.submissions.filter(
      s => s.survey_id === surveyId && (!employeeId || s.employee_id === employeeId)
    );
  }

  async createSurvey(input: CreateSurveyInput): Promise<Survey> {
    if (this.repo.enabled) {
      return this.repo.createSurvey(input.created_by, input.questions);
    }
    const surveyId = randomUUID();
    const creator = input.created_by || '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025';
    const now = new Date();
    const newSurvey: Survey = {
      id: surveyId,
      created_by: creator,
      created_at: now,
      num_questions: input.questions?.length ?? 0,
    };
    this.surveys.add(newSurvey);
    if (input.questions) {
      input.questions.forEach((q, index) => {
        const questionObj: SurveyQuestion = {
          id: typeof q.id === 'number' ? q.id : index,
          survey_id: surveyId,
          question_text: q.question_text || `Question ${index + 1}`,
          question_subtext: q.question_subtext,
          dimension: q.dimension || 'general',
          type: q.type || 'text',
          required: q.required ?? true,
          options: q.options,
          reverseScore: q.reverseScore ?? false,
          min_value: q.min_value,
          min_label: q.min_label,
          max_value: q.max_value,
          max_label: q.max_label,
          defaultValue: q.defaultValue,
        };
        this.questions.add(questionObj);
      });
    }
    return newSurvey;
  }

  async submit(surveyId: string, submission: SurveySubmission): Promise<SurveyResponseMetadata> {
    const questions = await this.findQuestions(surveyId);
    const validQuestionIds = new Set(questions.map(q => q.id));

    // Validate that each answered question_id belongs to the survey
    for (const answer of submission.answers) {
      if (!validQuestionIds.has(answer.question_id)) {
        throw new BadRequestException(
          `Question ${answer.question_id} does not belong to survey ${surveyId}`
        );
      }
    }

    // Validate that all required questions are answered with non-null response
    const answersMap = new Map(submission.answers.map(a => [a.question_id, a.response]));
    for (const question of questions) {
      if (question.required) {
        const response = answersMap.get(question.id);
        if (response === undefined || response === null) {
          throw new BadRequestException(`Required question ${question.id} was not answered`);
        }
      }
    }

    // Compute per-dimension score breakdown
    const dimScores: Record<string, number[]> = {};
    for (const question of questions) {
      const response = answersMap.get(question.id);
      if (typeof response === 'number') {
        const dims = Array.isArray(question.dimension) ? question.dimension : [question.dimension];
        for (const dim of dims) {
          if (!dimScores[dim]) dimScores[dim] = [];
          dimScores[dim].push(response);
        }
      }
    }

    const dimensions: Record<string, number> = {};
    for (const [dim, scores] of Object.entries(dimScores)) {
      if (scores.length > 0) {
        dimensions[dim] =
          Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100;
      }
    }

    if (this.repo.enabled) {
      return this.repo.createSurveySubmission(surveyId, submission, dimensions);
    }

    const numeric = submission.answers
      .map(a => a.response)
      .filter((r): r is number => typeof r === 'number');
    const meta: SurveyResponseMetadata = {
      id: randomUUID(),
      survey_id: surveyId,
      employee_id: submission.employee_id,
      submitted_at: new Date(),
      avg_score: numeric.length
        ? Math.round((numeric.reduce((a, b) => a + b, 0) / numeric.length) * 100) / 100
        : null,
      dimensions,
    };
    this.submissions.push(meta);
    return meta;
  }
}
