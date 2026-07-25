import { NotFoundException } from '@nestjs/common';
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

  it('accepts a submission and averages numeric answers', async () => {
    const meta = await service.submit(SURVEY_ID, {
      employee_id: EMPLOYEE_ID,
      answers: [
        { question_id: 0, response: 4 },
        { question_id: 1, response: 2 },
        { question_id: 9, response: 'free text is ignored by the average' },
      ],
    });
    expect(meta.survey_id).toBe(SURVEY_ID);
    expect(meta.avg_score).toBe(3);

    const mine = await service.findSubmissions(EMPLOYEE_ID);
    expect(mine).toContainEqual(meta);
  });
});
