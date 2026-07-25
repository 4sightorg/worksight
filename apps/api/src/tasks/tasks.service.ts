import { Injectable } from '@nestjs/common';
import { Activity, ActivityLookup, Assignment, AssignmentLookup } from '@worksight/common';

@Injectable()
export class TasksService {
  private readonly assignments = new AssignmentLookup();
  private readonly activities = new ActivityLookup();

  findAll(employeeId?: string): Assignment[] {
    if (employeeId) {
      return this.assignments.getAssignmentsByEmployee(employeeId).all();
    }
    return this.assignments.all();
  }

  findById(id: string): Assignment | null {
    return this.assignments.filter({ id }).first();
  }

  getStatsForEmployee(employeeId: string): ReturnType<AssignmentLookup['getStats']> {
    return this.assignments.getStats(employeeId);
  }

  findAllActivities(employeeId?: string): Activity[] {
    if (employeeId) {
      return this.activities.getActivitiesByEmployee(employeeId).all();
    }
    return this.activities.all();
  }
}
