import { BadRequestException, NotImplementedException } from '@nestjs/common';
import { Activities, Assignment, Assignments } from '@worksight/common';
import type { DbService } from '../db/db.service';
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

  it('refuses writes in fixture mode with a 501', async () => {
    await expect(service.create({ employee_id: 'e1', type: 'bug' })).rejects.toBeInstanceOf(
      NotImplementedException
    );
    await expect(service.update('any-id', { status: 'completed' })).rejects.toBeInstanceOf(
      NotImplementedException
    );
  });

  it('refuses writes when no DbService is injected at all', async () => {
    const noDb = new TasksService(undefined);
    await expect(noDb.create({ employee_id: 'e1', type: 'bug' })).rejects.toThrow(/DATABASE_URL/);
  });
});

describe('TasksService writes (postgres backend)', () => {
  const stored: Assignment = {
    id: '11111111-1111-4111-8111-111111111111',
    employee_id: 'emp-1',
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
    } as unknown as DbService);
  });

  it('generates a uuid and applies shared defaults when creating', async () => {
    await expect(service.create({ employee_id: 'emp-1', type: 'bug' })).resolves.toEqual(stored);

    const row = createAssignment.mock.calls[0][0];
    expect(row.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(row.employeeId).toBe('emp-1');
    expect(row.status).toBe('todo');
    expect(row.priority).toBe('low');
    expect(row.title).toBeNull();
    expect(row.points).toBeNull();
    expect(row.createdAt).toBeInstanceOf(Date);
    expect(row.updatedAt).toEqual(row.createdAt);
  });

  it('maps a full Assignment-shaped body onto row columns', async () => {
    await service.create({
      id: stored.id,
      employee_id: 'emp-1',
      source_id: 'jira',
      external_id: 'WS-12',
      type: 'feature',
      title: 'Ship it',
      status: 'in_progress',
      sprint: 'S1',
      epic: 'E1',
      points: 5,
      priority: 'high',
      created_at: '1999-01-01T00:00:00Z', // server-owned: ignored
    });

    const row = createAssignment.mock.calls[0][0];
    expect(row).toMatchObject({
      id: stored.id,
      employeeId: 'emp-1',
      sourceId: 'jira',
      externalId: 'WS-12',
      type: 'feature',
      title: 'Ship it',
      status: 'in_progress',
      sprint: 'S1',
      epic: 'E1',
      points: 5,
      priority: 'high',
    });
    expect(row.createdAt.getUTCFullYear()).toBeGreaterThan(1999);
  });

  it('rejects an invalid create body with a 400', async () => {
    await expect(service.create({ type: 'bug' })).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.create({ employee_id: 'e', type: 'nope' })).rejects.toThrow(/type/);
    await expect(service.create({ employee_id: 'e', type: 'bug', id: 'nope' })).rejects.toThrow(
      /id/
    );
    await expect(
      service.create({ employee_id: 'e', type: 'bug', points: 1.5 })
    ).rejects.toThrow(/points/);
    expect(createAssignment).not.toHaveBeenCalled();
  });

  it('sends only the fields present in a patch', async () => {
    await expect(service.update(stored.id, { status: 'completed' })).resolves.toEqual(stored);
    expect(updateAssignment).toHaveBeenCalledWith(stored.id, { status: 'completed' });
  });

  it('allows nulling title and points, and ignores unknown keys', async () => {
    await service.update(stored.id, { title: null, points: null, employee_id: 'hijack' });
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
