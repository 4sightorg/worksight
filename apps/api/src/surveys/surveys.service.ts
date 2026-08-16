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
