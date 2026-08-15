import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Activity, ActivityLookup, Assignment, AssignmentLookup, Assignments } from '@worksight/common';
import { randomUUID } from 'node:crypto';
import {
  AssignmentPatch,
  NewAssignmentInput,
  WorksightRepository,
} from '../db/worksight.repository';
import { parseCreateAssignment, parseUpdateAssignment } from './task-write.dto';

@Injectable()
export class TasksService {
  // In fixture mode, task modifications live in memory for the offline demo.
  private readonly inMemoryAssignments: Assignment[] = [...Assignments];
  private readonly activities = new ActivityLookup();

  constructor(private readonly repo: WorksightRepository) {}

  async findAll(employeeId?: string): Promise<Assignment[]> {
    if (this.repo.enabled) {
      return this.repo.listAssignments(employeeId);
    }
    if (employeeId) {
      return this.inMemoryAssignments.filter(a => a.employee_id === employeeId);
    }
    return [...this.inMemoryAssignments];
  }

  async findById(id: string): Promise<Assignment | null> {
    if (this.repo.enabled) {
      return this.repo.getAssignment(id);
    }
    return this.inMemoryAssignments.find(a => a.id === id) ?? null;
  }

  async getStatsForEmployee(employeeId: string): Promise<ReturnType<AssignmentLookup['getStats']>> {
    if (this.repo.enabled) {
      const [assignments, activities] = await Promise.all([
        this.repo.listAssignments(employeeId),
        this.repo.listActivities(employeeId),
      ]);
      return new AssignmentLookup(assignments).getStats(employeeId, activities);
    }
    return new AssignmentLookup(this.inMemoryAssignments).getStats(employeeId);
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

  /** `POST /tasks` — persist a new assignment. */
  async create(body: unknown): Promise<Assignment> {
    const input = parseCreateAssignment(body);
    const id = input.id ?? randomUUID();

    if (this.repo.enabled) {
      const row: NewAssignmentInput = {
        id,
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
    const created: Assignment = {
      id,
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
    this.inMemoryAssignments.unshift(created);
    return created;
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

    const index = this.inMemoryAssignments.findIndex(a => a.id === id);
    if (index === -1) return null;

    const existing = this.inMemoryAssignments[index];
    const updated: Assignment = {
      ...existing,
      ...(patch.status !== undefined && { status: patch.status }),
      ...(patch.priority !== undefined && { priority: patch.priority }),
      ...(patch.title !== undefined && { title: patch.title }),
      ...(patch.points !== undefined && { points: patch.points }),
      updated_at: new Date(),
    };
    this.inMemoryAssignments[index] = updated;
    return updated;
  }

  /** `DELETE /tasks/:id` — returns false when the assignment is not found. */
  async delete(id: string): Promise<boolean> {
    if (this.repo.enabled) {
      return this.repo.deleteAssignment(id);
    }
    const index = this.inMemoryAssignments.findIndex(a => a.id === id);
    if (index === -1) return false;
    this.inMemoryAssignments.splice(index, 1);
    return true;
  }
}
