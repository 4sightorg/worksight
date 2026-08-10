import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { Activity, ActivityLookup, Assignment, AssignmentLookup } from '@worksight/common';
import { randomUUID } from 'node:crypto';
import {
  AssignmentPatch,
  NewAssignmentInput,
  WorksightRepository,
} from '../db/worksight.repository';
import { parseCreateAssignment, parseUpdateAssignment } from './task-write.dto';

@Injectable()
export class TasksService {
  private readonly assignments = new AssignmentLookup();
  private readonly activities = new ActivityLookup();

  constructor(private readonly repo: WorksightRepository) {}

  async findAll(employeeId?: string): Promise<Assignment[]> {
    if (this.repo.enabled) {
      return this.repo.listAssignments(employeeId);
    }
    if (employeeId) {
      return this.assignments.getAssignmentsByEmployee(employeeId).all();
    }
    return this.assignments.all();
  }

  async findById(id: string): Promise<Assignment | null> {
    if (this.repo.enabled) {
      return this.repo.getAssignment(id);
    }
    return this.assignments.filter({ id }).first();
  }

  async getStatsForEmployee(employeeId: string): Promise<ReturnType<AssignmentLookup['getStats']>> {
    if (this.repo.enabled) {
      const [assignments, activities] = await Promise.all([
        this.repo.listAssignments(employeeId),
        this.repo.listActivities(employeeId),
      ]);
      return new AssignmentLookup(assignments).getStats(employeeId, activities);
    }
    return this.assignments.getStats(employeeId);
  }

  async findAllActivities(employeeId?: string): Promise<Activity[]> {
    if (this.repo.enabled) {
      return this.repo.listActivities(employeeId);
    }
    if (employeeId) {
      return this.activities.getActivitiesByEmployee(employeeId).all();
    }
    return this.activities.all();
  }

  /** `POST /tasks` — persist a new assignment (Postgres only). */
  async create(body: unknown): Promise<Assignment> {
    this.requireWritableBackend();
    const input = parseCreateAssignment(body);

    const row: NewAssignmentInput = {
      id: input.id ?? randomUUID(),
      employee_id: input.employee_id,
      source_id: input.source_id ?? null,
      external_id: input.external_id ?? null,
      type: input.type,
      title: input.title ?? null,
      status: input.status,
      sprint: input.sprint ?? null,
      epic: input.epic ?? null,
      points: input.points ?? null,
      priority: input.priority,
    };
    return this.repo.createAssignment(row);
  }

  /** `PATCH /tasks/:id` — returns `null` when the id does not exist. */
  async update(id: string, body: unknown): Promise<Assignment | null> {
    this.requireWritableBackend();
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
    return this.repo.updateAssignment(id, patch);
  }

  /**
   * Writes need Postgres. Fixture mode is read-only — fail with 501 so clients
   * do not think a mutation stuck.
   */
  private requireWritableBackend(): void {
    if (!this.repo.enabled) {
      throw new NotImplementedException(
        'Task writes require a database backend. Set DATABASE_URL to enable ' +
          'POST /tasks and PATCH /tasks/:id; fixture mode is read-only.'
      );
    }
  }
}
