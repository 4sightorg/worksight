import { Activities, Assignments } from '@worksight/common';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    service = new TasksService();
  });

  it('returns the shared assignment fixtures', async () => {
    expect(await service.findAll()).toEqual(Assignments);
  });

  it('filters assignments by employee', async () => {
    const employeeId = Assignments[0].employee_id;
    const expected = Assignments.filter(a => a.employee_id === employeeId);
    expect(await service.findAll(employeeId)).toEqual(expected);
  });

  it('finds an assignment by id', async () => {
    expect(await service.findById(Assignments[0].id)).toEqual(Assignments[0]);
    expect(await service.findById('does-not-exist')).toBeNull();
  });

  it('computes per-employee stats from the fixtures', async () => {
    const employeeId = Assignments[0].employee_id;
    const expectedTotal = Assignments.filter(a => a.employee_id === employeeId).length;
    const stats = await service.getStatsForEmployee(employeeId);
    expect(stats.totalTasks).toBe(expectedTotal);
    expect(stats.completionRate).toBeGreaterThanOrEqual(0);
  });

  it('returns the shared activity fixtures', async () => {
    expect(await service.findAllActivities()).toEqual(Activities);
    const employeeId = Activities[0].employee_id;
    const expected = Activities.filter(a => a.employee_id === employeeId);
    expect(await service.findAllActivities(employeeId)).toEqual(expected);
  });
});
