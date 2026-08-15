import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  SurveyMetadataLookup,
  SurveyQuestionLookup,
  SurveyResponseList,
  type Survey,
  type SurveyQuestion,
  type SurveyResponseMetadata,
  type SurveySubmission,
} from '@worksight/common';
import { WorksightRepository } from '../db/worksight.repository';

@Injectable()
export class SurveysService {
  private readonly surveys = new SurveyMetadataLookup();
  private readonly questions = new SurveyQuestionLookup();
  // Fixture-mode submissions live in memory for the offline demo.
  private readonly submissions: SurveyResponseMetadata[] = [...SurveyResponseList];

  private readonly customSurveys: Survey[] = [];

  constructor(private readonly repo: WorksightRepository) {}

  async findAll(): Promise<Survey[]> {
    if (this.repo.enabled) {
      return this.repo.listSurveys();
    }
    return [...this.surveys.all(), ...this.customSurveys];
  }

  async create(body: { created_by?: string; num_questions?: number }): Promise<Survey> {
    const survey: Survey = {
      id: randomUUID(),
      created_by: body?.created_by || randomUUID(),
      created_at: new Date(),
      num_questions: body?.num_questions ?? 0,
    };
    if (!this.repo.enabled) {
      this.customSurveys.push(survey);
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

  async findSubmissions(employeeId?: string): Promise<SurveyResponseMetadata[]> {
    if (this.repo.enabled) {
      return this.repo.listSurveySubmissions(employeeId);
    }
    if (employeeId) {
      return this.submissions.filter(s => s.employee_id === employeeId);
    }
    return [...this.submissions];
  }

  async submit(surveyId: string, submission: SurveySubmission): Promise<SurveyResponseMetadata> {
    if (this.repo.enabled) {
      const survey = await this.repo.getSurvey(surveyId);
      if (!survey) {
        throw new NotFoundException(`Survey ${surveyId} not found`);
      }
      return this.repo.createSurveySubmission(surveyId, submission);
    }

    if (!this.surveys.filter({ id: surveyId }).first()) {
      throw new NotFoundException(`Survey ${surveyId} not found`);
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
    };
    this.submissions.push(meta);
    return meta;
  }
}
