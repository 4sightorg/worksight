import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Employees, Surveys, Assignments } from '@worksight/common';
import { createApp } from '../src/bootstrap';

describe('WorkSight API (e2e fixture mode)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const bootstrapped = await createApp();
    app = bootstrapped.app;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('System Endpoints', () => {
    it('GET /ping returns plain-text pong', () => {
      return request(app.getHttpServer())
        .get('/ping')
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .expect('pong');
    });

    it('GET /health returns status ok with fixture backend', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body.database).toBe('fixtures');
          expect(typeof res.body.uptime).toBe('number');
        });
    });
  });

  describe('Users & Teams Endpoints', () => {
    it('GET /users returns employee list', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('GET /users/stats returns aggregated employee stats', () => {
      return request(app.getHttpServer())
        .get('/users/stats')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalEmployees');
          expect(res.body).toHaveProperty('roles');
          expect(res.body).toHaveProperty('departments');
        });
    });

    it('GET /teams returns team list', () => {
      return request(app.getHttpServer())
        .get('/teams')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('Tasks & Activities Endpoints', () => {
    const validEmployeeId = Employees[0].id;

    it('GET /tasks returns assignment list', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /tasks?employee_id= accepts valid UUID', () => {
      return request(app.getHttpServer())
        .get(`/tasks?employee_id=${validEmployeeId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /tasks?employee_id= returns 400 for invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/tasks?employee_id=invalid-uuid-123')
        .expect(400);
    });

    it('GET /tasks/stats/:id returns stats for valid employee', () => {
      return request(app.getHttpServer())
        .get(`/tasks/stats/${validEmployeeId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalTasks');
          expect(res.body).toHaveProperty('completionRate');
        });
    });

    it('POST /tasks creates a new task in fixture mode', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          employee_id: validEmployeeId,
          type: 'feature',
          title: 'e2e Test Task',
          priority: 'high',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.employee_id).toBe(validEmployeeId);
          expect(res.body.title).toBe('e2e Test Task');
          expect(res.body.type).toBe('feature');
          expect(res.body.id).toBeDefined();
        });
    });

    it('PATCH /tasks/:id updates an existing task in fixture mode', () => {
      const taskId = Assignments[0].id;
      return request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({
          status: 'completed',
          priority: 'low',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(taskId);
          expect(res.body.status).toBe('completed');
          expect(res.body.priority).toBe('low');
        });
    });

    it('GET /activities returns activity list', () => {
      return request(app.getHttpServer())
        .get('/activities')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /activities?employee_id= returns 400 for invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/activities?employee_id=bad-uuid')
        .expect(400);
    });
  });

  describe('Attendance Endpoints', () => {
    const validEmployeeId = Employees[0].id;

    it('GET /attendance returns attendance records', () => {
      return request(app.getHttpServer())
        .get('/attendance')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /attendance?employee_id= returns 400 for invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/attendance?employee_id=bad-uuid')
        .expect(400);
    });

    it('GET /attendance/stats/:id returns stats for valid employee', () => {
      return request(app.getHttpServer())
        .get(`/attendance/stats/${validEmployeeId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalRecords');
          expect(res.body).toHaveProperty('daysPresent');
        });
    });
  });

  describe('Surveys Endpoints', () => {
    const validSurveyId = Surveys[0].id;
    const validEmployeeId = Employees[0].id;

    it('GET /surveys returns survey templates', () => {
      return request(app.getHttpServer())
        .get('/surveys')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('GET /surveys/:id/questions returns survey questions', () => {
      return request(app.getHttpServer())
        .get(`/surveys/${validSurveyId}/questions`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /surveys/responses returns survey submissions', () => {
      return request(app.getHttpServer())
        .get('/surveys/responses')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /surveys/responses?employee_id= returns 400 for invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/surveys/responses?employee_id=not-a-uuid')
        .expect(400);
    });

    it('POST /surveys/:id/responses submits survey answers', () => {
      return request(app.getHttpServer())
        .post(`/surveys/${validSurveyId}/responses`)
        .send({
          employee_id: validEmployeeId,
          answers: [
            { question_id: 1, response: 4 },
            { question_id: 2, response: 5 },
          ],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.survey_id).toBe(validSurveyId);
          expect(res.body.employee_id).toBe(validEmployeeId);
          expect(res.body.avg_score).toBe(4.5);
        });
    });
  });

  describe('Pagination', () => {
    it('supports limit and offset on list endpoints', async () => {
      const fullRes = await request(app.getHttpServer()).get('/users').expect(200);
      const paginatedRes = await request(app.getHttpServer())
        .get('/users?limit=2&offset=1')
        .expect(200);

      expect(paginatedRes.body.length).toBe(2);
      expect(paginatedRes.body[0]).toEqual(fullRes.body[1]);
      expect(paginatedRes.body[1]).toEqual(fullRes.body[2]);
    });

    it('returns 400 for invalid limit or offset', () => {
      return request(app.getHttpServer())
        .get('/users?limit=invalid')
        .expect(400);
    });
  });
});
