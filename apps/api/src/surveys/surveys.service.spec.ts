import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SurveyQuestionnaire, SurveyResponseList, Surveys } from '@worksight/common';
import type { WorksightRepository } from '../db/worksight.repository';
import { SurveysService } from './surveys.service';

const SURVEY_ID = Surveys[0].id;
const EMPLOYEE_ID = SurveyResponseList[0].employee_id;

describe('SurveysService', () => {
  let service: SurveysService;

  beforeEach(() => {
    const fixturesOnly = { enabled: false } as WorksightRepository;
    service = new SurveysService(fixturesOnly);
  });

  it('returns the shared survey templates', async () => {
    await expect(service.findAll()).resolves.toEqual(Surveys);
  });

  it('returns single survey template or throws 404', async () => {
    await expect(service.findOne(SURVEY_ID)).resolves.toEqual(Surveys[0]);
    await expect(
      service.findOne('00000000-0000-4000-8000-000000000000')
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns the questionnaire for a survey', async () => {
    const questions = await service.findQuestions(SURVEY_ID);
    expect(questions).toHaveLength(SurveyQuestionnaire.length);
  });

  it('rejects unknown surveys', async () => {
    await expect(
      service.findQuestions('00000000-0000-4000-8000-000000000000')
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lists submissions, optionally by employee', async () => {
    await expect(service.findSubmissions()).resolves.toEqual(SurveyResponseList);
    await expect(service.findSubmissions(EMPLOYEE_ID)).resolves.toEqual(SurveyResponseList);
    await expect(
      service.findSubmissions('00000000-0000-4000-8000-000000000000')
    ).resolves.toEqual([]);
  });

  it('lists submissions per survey', async () => {
    const subs = await service.findSubmissionsBySurvey(SURVEY_ID);
    expect(subs).toEqual(SurveyResponseList);
  });

  it('rejects submission if question_id does not belong to survey', async () => {
    const answers = SurveyQuestionnaire.map(q => ({ question_id: q.id, response: 3 }));
    answers.push({ question_id: 999, response: 3 });

    await expect(
      service.submit(SURVEY_ID, {
        employee_id: EMPLOYEE_ID,
        answers,
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects submission if a required question is missing or null', async () => {
    const answers = SurveyQuestionnaire.slice(0, 5).map(q => ({ question_id: q.id, response: 3 }));

    await expect(
      service.submit(SURVEY_ID, {
        employee_id: EMPLOYEE_ID,
        answers,
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('accepts a valid submission, calculates avg_score and dimensions breakdown', async () => {
    const answers = SurveyQuestionnaire.map(q => ({ question_id: q.id, response: 4 }));
    const meta = await service.submit(SURVEY_ID, {
      employee_id: EMPLOYEE_ID,
      answers,
    });
    expect(meta.survey_id).toBe(SURVEY_ID);
    expect(meta.avg_score).toBe(4);
    expect(meta.dimensions).toEqual({
      workload: 4,
      balance: 4,
      support: 4,
      engagement: 4,
    });

    const mine = await service.findSubmissions(EMPLOYEE_ID);
    expect(mine).toContainEqual(meta);
  });

  it('allows creating a new survey template with questions', async () => {
    const created = await service.createSurvey({
      created_by: EMPLOYEE_ID,
      questions: [
        { question_text: 'Q1', dimension: 'test', type: 'scale', required: true },
        { question_text: 'Q2', dimension: 'test', type: 'text', required: false },
      ],
    });
    expect(created.id).toBeDefined();
    expect(created.num_questions).toBe(2);

    const questions = await service.findQuestions(created.id);
    expect(questions).toHaveLength(2);
  });
});

