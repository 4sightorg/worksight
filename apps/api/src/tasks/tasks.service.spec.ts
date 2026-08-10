import { Activities, Assignments } from '@worksight/common';
import type { WorksightRepository } from '../db/worksight.repository';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    const fixturesOnly = { enabled: false } as WorksightRepository;
    service = new TasksService(fixturesOnly);
  });

  it('returns the shared assignment fixtures', async () => {
    await expect(service.findAll()).resolves.toEqual(Assignments);
  });

  it('filters assignments by employee', async () => {
    const employeeId = Assignments[0].employee_id;
    const expected = Assignments.filter(a => a.employee_id === employeeId);
    await expect(service.findAll(employeeId)).resolves.toEqual(expected);
  });

  it('finds an assignment by id', async () => {
    await expect(service.findById(Assignments[0].id)).resolves.toEqual(Assignments[0]);
    await expect(service.findById('does-not-exist')).resolves.toBeNull();
  });

  it('computes per-employee stats from the fixtures', () => {
    const employeeId = Assignments[0].employee_id;
    const expectedTotal = Assignments.filter(a => a.employee_id === employeeId).length;
    const stats = service.getStatsForEmployee(employeeId);
    expect(stats.totalTasks).toBe(expectedTotal);
    expect(stats.completionRate).toBeGreaterThanOrEqual(0);
  });

  it('returns the shared activity fixtures', async () => {
    await expect(service.findAllActivities()).resolves.toEqual(Activities);
    const employeeId = Activities[0].employee_id;
    const expected = Activities.filter(a => a.employee_id === employeeId);
    await expect(service.findAllActivities(employeeId)).resolves.toEqual(expected);
  });
});
