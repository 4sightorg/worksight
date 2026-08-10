import {
  BadRequestException,
  NotImplementedException,
} from '@nestjs/common';
import { Activities, Assignments, type Assignment } from '@worksight/common';
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

  it('computes per-employee stats from the fixtures', async () => {
    const employeeId = Assignments[0].employee_id;
    const expectedTotal = Assignments.filter(a => a.employee_id === employeeId).length;
    const stats = await service.getStatsForEmployee(employeeId);
    expect(stats.totalTasks).toBe(expectedTotal);
    expect(stats.completionRate).toBeGreaterThanOrEqual(0);
  });

  it('returns the shared activity fixtures', async () => {
    await expect(service.findAllActivities()).resolves.toEqual(Activities);
    const employeeId = Activities[0].employee_id;
    const expected = Activities.filter(a => a.employee_id === employeeId);
    await expect(service.findAllActivities(employeeId)).resolves.toEqual(expected);
  });

  it('refuses writes in fixture mode with a 501', async () => {
    await expect(
      service.create({
        employee_id: '11111111-1111-4111-8111-111111111111',
        type: 'bug',
      })
    ).rejects.toBeInstanceOf(NotImplementedException);
    await expect(service.update('any-id', { status: 'completed' })).rejects.toBeInstanceOf(
      NotImplementedException
    );
  });
});

describe('TasksService writes (postgres backend)', () => {
  const emp = '22222222-2222-4222-8222-222222222222';
  const source = '33333333-3333-4333-8333-333333333333';

  const stored: Assignment = {
    id: '11111111-1111-4111-8111-111111111111',
    employee_id: emp,
    source_id: null,
    external_id: null,
    type: 'bug',
    title: 'Fix it',
    status: 'todo',
    sprint: null,
    epic: null,
    points: 3,
    priority: 'low',
    created_at: new Date('2026-01-01T00:00:00Z'),
    updated_at: new Date('2026-01-01T00:00:00Z'),
  };

  let createAssignment: jest.Mock;
  let updateAssignment: jest.Mock;
  let service: TasksService;

  beforeEach(() => {
    createAssignment = jest.fn().mockResolvedValue(stored);
    updateAssignment = jest.fn().mockResolvedValue(stored);
    service = new TasksService({
      enabled: true,
      createAssignment,
      updateAssignment,
    } as unknown as WorksightRepository);
  });

  it('generates a uuid and applies shared defaults when creating', async () => {
    await expect(service.create({ employee_id: emp, type: 'bug' })).resolves.toEqual(stored);

    const row = createAssignment.mock.calls[0][0];
    expect(row.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
    expect(row.employee_id).toBe(emp);
    expect(row.status).toBe('todo');
    expect(row.priority).toBe('low');
    expect(row.title).toBeNull();
    expect(row.points).toBeNull();
  });

  it('maps a full Assignment-shaped body onto row columns', async () => {
    await service.create({
      id: stored.id,
      employee_id: emp,
      source_id: source,
      external_id: 'WS-12',
      type: 'feature',
      title: 'Ship it',
      status: 'in_progress',
      sprint: 'S1',
      epic: 'E1',
      points: 5,
      priority: 'high',
      created_at: '1999-01-01T00:00:00Z',
    });

    expect(createAssignment.mock.calls[0][0]).toMatchObject({
      id: stored.id,
      employee_id: emp,
      source_id: source,
      external_id: 'WS-12',
      type: 'feature',
      title: 'Ship it',
      status: 'in_progress',
      sprint: 'S1',
      epic: 'E1',
      points: 5,
      priority: 'high',
    });
  });

  it('rejects an invalid create body with a 400', async () => {
    await expect(service.create({ type: 'bug' })).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.create({ employee_id: emp, type: 'nope' })).rejects.toThrow(/type/);
    await expect(service.create({ employee_id: emp, type: 'bug', id: 'nope' })).rejects.toThrow(
      /id/
    );
    await expect(
      service.create({ employee_id: emp, type: 'bug', points: 1.5 })
    ).rejects.toThrow(/points/);
    expect(createAssignment).not.toHaveBeenCalled();
  });

  it('sends only the fields present in a patch', async () => {
    await expect(service.update(stored.id, { status: 'completed' })).resolves.toEqual(stored);
    expect(updateAssignment).toHaveBeenCalledWith(stored.id, { status: 'completed' });
  });

  it('allows nulling title and points, and ignores unknown keys', async () => {
    await service.update(stored.id, { title: null, points: null, employee_id: emp });
    expect(updateAssignment).toHaveBeenCalledWith(stored.id, { title: null, points: null });
  });

  it('does not reset status/priority when the patch omits them', async () => {
    await service.update(stored.id, { title: 'Renamed' });
    const patch = updateAssignment.mock.calls[0][1];
    expect(patch).not.toHaveProperty('status');
    expect(patch).not.toHaveProperty('priority');
  });

  it('rejects an empty or invalid patch with a 400', async () => {
    await expect(service.update(stored.id, {})).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.update(stored.id, { status: 'bogus' })).rejects.toThrow(/status/);
    await expect(service.update(stored.id, { points: 2.5 })).rejects.toThrow(/points/);
    expect(updateAssignment).not.toHaveBeenCalled();
  });

  it('returns null when the id does not exist so the controller can 404', async () => {
    updateAssignment.mockResolvedValue(null);
    await expect(service.update('missing', { status: 'todo' })).resolves.toBeNull();
  });
});
