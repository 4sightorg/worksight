import { Activities, Assignments } from '@worksight/common';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    service = new TasksService();
  });

  it('returns the shared assignment fixtures', () => {
    expect(service.findAll()).toEqual(Assignments);
  });

  it('filters assignments by employee', () => {
    const employeeId = Assignments[0].employee_id;
    const expected = Assignments.filter(a => a.employee_id === employeeId);
    expect(service.findAll(employeeId)).toEqual(expected);
  });

  it('finds an assignment by id', () => {
    expect(service.findById(Assignments[0].id)).toEqual(Assignments[0]);
    expect(service.findById('does-not-exist')).toBeNull();
  });

  it('computes per-employee stats from the fixtures', () => {
    const employeeId = Assignments[0].employee_id;
    const expectedTotal = Assignments.filter(a => a.employee_id === employeeId).length;
    const stats = service.getStatsForEmployee(employeeId);
    expect(stats.totalTasks).toBe(expectedTotal);
    expect(stats.completionRate).toBeGreaterThanOrEqual(0);
  });

  it('returns the shared activity fixtures', () => {
    expect(service.findAllActivities()).toEqual(Activities);
    const employeeId = Activities[0].employee_id;
    const expected = Activities.filter(a => a.employee_id === employeeId);
    expect(service.findAllActivities(employeeId)).toEqual(expected);
  });
});
