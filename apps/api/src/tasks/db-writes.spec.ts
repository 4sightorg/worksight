import type { DatabaseHandle } from '../db/client';
import { DbService } from '../db/db.service';
import type { AssignmentRow } from '../db/schema';

/**
 * Exercises the `DbService` write helpers against a hand-rolled Drizzle stub —
 * no Postgres required, so this runs in the default fixture-mode CI lane.
 */

const row: AssignmentRow = {
  id: '11111111-1111-4111-8111-111111111111',
  employeeId: 'emp-1',
  sourceId: null,
  externalId: null,
  type: 'bug',
  title: 'Fix it',
  status: 'in_progress',
  sprint: null,
  epic: null,
  points: 3,
  priority: 'high',
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-02T00:00:00Z'),
};

type Captured = { insertValues?: unknown; setPatch?: Record<string, unknown> };

function stubService(returning: AssignmentRow[]): { service: DbService; captured: Captured } {
  const captured: Captured = {};
  const db = {
    insert: () => ({
      values: (values: unknown) => {
        captured.insertValues = values;
        return { returning: async () => returning };
      },
    }),
    update: () => ({
      set: (patch: Record<string, unknown>) => {
        captured.setPatch = patch;
        return { where: () => ({ returning: async () => returning }) };
      },
    }),
  };
  const handle = { db, sql: { end: async () => undefined } } as unknown as DatabaseHandle;
  return { service: new DbService(handle), captured };
}

describe('DbService write helpers', () => {
  it('reports the postgres backend when a handle is supplied', () => {
    const { service } = stubService([row]);
    expect(service.backend).toBe('postgres');
    expect(service.enabled).toBe(true);
  });

  it('inserts and maps the returned row back to an Assignment', async () => {
    const { service, captured } = stubService([row]);
    const created = await service.createAssignment({ ...row });

    expect(captured.insertValues).toMatchObject({ id: row.id, employeeId: 'emp-1' });
    expect(created).toEqual({
      id: row.id,
      employee_id: 'emp-1',
      source_id: null,
      external_id: null,
      type: 'bug',
      title: 'Fix it',
      status: 'in_progress',
      sprint: null,
      epic: null,
      points: 3,
      priority: 'high',
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    });
  });

  it('bumps updated_at on every patch', async () => {
    const { service, captured } = stubService([row]);
    await service.updateAssignment(row.id, { status: 'completed' });

    expect(captured.setPatch).toMatchObject({ status: 'completed' });
    expect(captured.setPatch?.updatedAt).toBeInstanceOf(Date);
  });

  it('returns null when the update matched no row', async () => {
    const { service } = stubService([]);
    await expect(service.updateAssignment('missing', { status: 'todo' })).resolves.toBeNull();
  });

  it('throws a clear error when writes are attempted without a handle', async () => {
    const fixtureService = new DbService(null);
    expect(fixtureService.backend).toBe('fixtures');
    await expect(fixtureService.createAssignment({ ...row })).rejects.toThrow(/DATABASE_URL/);
  });
});
