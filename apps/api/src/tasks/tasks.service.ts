import { BadRequestException, Injectable, NotImplementedException, Optional } from '@nestjs/common';
import { Activity, ActivityLookup, Assignment, AssignmentLookup } from '@worksight/common';
import { randomUUID } from 'node:crypto';
import { AssignmentPatch, DbService, NewAssignmentRow } from '../db/db.service';
import { parseCreateAssignment, parseUpdateAssignment } from './task-write.dto';

@Injectable()
export class TasksService {
  private readonly assignments = new AssignmentLookup();
  private readonly activities = new ActivityLookup();

  constructor(@Optional() private readonly db?: DbService) {}

  async findAll(employeeId?: string): Promise<Assignment[]> {
    if (this.db?.enabled) {
      return this.db.listAssignments(employeeId);
    }
    if (employeeId) {
      return this.assignments.getAssignmentsByEmployee(employeeId).all();
    }
    return this.assignments.all();
  }

  async findById(id: string): Promise<Assignment | null> {
    if (this.db?.enabled) {
      return this.db.getAssignmentById(id);
    }
    return this.assignments.filter({ id }).first();
  }

  async getStatsForEmployee(
    employeeId: string
  ): Promise<ReturnType<AssignmentLookup['getStats']>> {
    if (this.db?.enabled) {
      return this.db.getAssignmentStats(employeeId);
    }
    return this.assignments.getStats(employeeId);
  }

  async findAllActivities(employeeId?: string): Promise<Activity[]> {
    if (this.db?.enabled) {
      return this.db.listActivities(employeeId);
    }
    if (employeeId) {
      return this.activities.getActivitiesByEmployee(employeeId).all();
    }
    return this.activities.all();
  }

  /** `POST /tasks` — persist a new assignment. */
  async create(body: unknown): Promise<Assignment> {
    const db = this.requireWritableBackend();
    const input = parseCreateAssignment(body);

    const now = new Date();
    const row: NewAssignmentRow = {
      id: input.id ?? randomUUID(),
      employeeId: input.employee_id,
      sourceId: input.source_id ?? null,
      externalId: input.external_id ?? null,
      type: input.type,
      title: input.title ?? null,
      status: input.status,
      sprint: input.sprint ?? null,
      epic: input.epic ?? null,
      points: input.points ?? null,
      priority: input.priority,
      createdAt: now,
      updatedAt: now,
    };
    return db.createAssignment(row);
  }

  /** `PATCH /tasks/:id` — returns `null` when the id does not exist. */
  async update(id: string, body: unknown): Promise<Assignment | null> {
    const db = this.requireWritableBackend();
    const input = parseUpdateAssignment(body);

    const patch: AssignmentPatch = {};
    if (input.status !== undefined) patch.status = input.status;
    if (input.priority !== undefined) patch.priority = input.priority;
    if (input.title !== undefined) patch.title = input.title;
    if (input.points !== undefined) patch.points = input.points;

    if (Object.keys(patch).length === 0) {
      throw new BadRequestException(
        'PATCH body must set at least one of: status, priority, title, points'
      );
    }
    return db.updateAssignment(id, patch);
  }

  /**
   * Writes need a real database. In fixture mode the data lives in
   * `@worksight/common` and is read-only, so we fail loudly (501) rather than
   * accepting a mutation that silently disappears.
   */
  private requireWritableBackend(): DbService {
    if (!this.db?.enabled) {
      throw new NotImplementedException(
        'Task writes require a database backend. Set DATABASE_URL to enable ' +
          'POST /tasks and PATCH /tasks/:id; fixture mode is read-only.'
      );
    }
    return this.db;
  }
}
