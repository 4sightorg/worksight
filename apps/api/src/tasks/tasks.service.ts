import { Injectable } from '@nestjs/common';
import { Activity, ActivityLookup, Assignment, AssignmentLookup } from '@worksight/common';
import { WorksightRepository } from '../db/worksight.repository';

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

  getStatsForEmployee(employeeId: string): ReturnType<AssignmentLookup['getStats']> {
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
}
