import { Injectable, Optional } from '@nestjs/common';
import { Activity, ActivityLookup, Assignment, AssignmentLookup } from '@worksight/common';
import { DbService } from '../db/db.service';

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
}
