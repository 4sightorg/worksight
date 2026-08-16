import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Activities,
  Activity,
  ActivityLookup,
  Assignment,
  AssignmentLookup,
  Assignments,
} from '@worksight/common';
import { randomUUID } from 'node:crypto';
import { paginate, PaginationQuery } from '../common/pagination.dto';
import {
  AssignmentPatch,
  NewAssignmentInput,
  WorksightRepository,
} from '../db/worksight.repository';
import { parseCreateAssignment, parseUpdateAssignment } from './task-write.dto';

@Injectable()
export class TasksService {
  private readonly fixtureAssignments: Assignment[] = [...Assignments];
  private readonly activities = new ActivityLookup(Activities);

  constructor(private readonly repo: WorksightRepository) {}

  private get assignmentLookup(): AssignmentLookup {
    return new AssignmentLookup(this.fixtureAssignments);
  }

  async findAll(employeeId?: string, pagination?: PaginationQuery): Promise<Assignment[]> {
    const list = this.repo.enabled
      ? await this.repo.listAssignments(employeeId)
      : employeeId
        ? this.assignmentLookup.getAssignmentsByEmployee(employeeId).all()
        : this.assignmentLookup.all();
    return paginate(list, pagination);
  }

  async findById(id: string): Promise<Assignment | null> {
    if (this.repo.enabled) {
      return this.repo.getAssignment(id);
    }
    return this.assignmentLookup.filter({ id }).first();
  }

  async getStatsForEmployee(
    employeeId: string
  ): Promise<ReturnType<AssignmentLookup['getStats']>> {
    if (this.repo.enabled) {
      const [assignments, activities] = await Promise.all([
        this.repo.listAssignments(employeeId),
        this.repo.listActivities(employeeId),
      ]);
      return new AssignmentLookup(assignments).getStats(employeeId, activities);
    }
    return this.assignmentLookup.getStats(employeeId);
  }

  async findAllActivities(employeeId?: string, pagination?: PaginationQuery): Promise<Activity[]> {
    const list = this.repo.enabled
      ? await this.repo.listActivities(employeeId)
      : employeeId
        ? this.activities.getActivitiesByEmployee(employeeId).all()
        : this.activities.all();
    return paginate(list, pagination);
  }

  /** `POST /tasks` — persist a new assignment. */
  async create(body: unknown): Promise<Assignment> {
    const input = parseCreateAssignment(body);

    if (this.repo.enabled) {
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

    const now = new Date();
    const newAssignment: Assignment = {
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
      created_at: now,
      updated_at: now,
    };
    this.fixtureAssignments.unshift(newAssignment);
    return newAssignment;
  }

  /** `PATCH /tasks/:id` — returns `null` when the id does not exist. */
  async update(id: string, body: unknown): Promise<Assignment | null> {
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

    if (this.repo.enabled) {
      return this.repo.updateAssignment(id, patch);
    }

    const index = this.fixtureAssignments.findIndex(a => a.id === id);
    if (index === -1) {
      return null;
    }
    const existing = this.fixtureAssignments[index];
    const updated: Assignment = {
      ...existing,
      ...patch,
      updated_at: new Date(),
    };
    this.fixtureAssignments[index] = updated;
    return updated;
  }
}
