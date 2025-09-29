import { Activities, Assignments } from '@worksight/common/data';
import { Activity, ActivitySchema, AssignmentSchema } from '@worksight/common/types';
import z from 'zod';
import { BaseLookup } from './base';

/**
 * Lookup for employee activities
 */
export class ActivityLookup extends BaseLookup<typeof ActivitySchema> {
  constructor(entries: z.infer<typeof ActivitySchema>[] = Activities) {
    super(ActivitySchema, entries);
  }

  /** Filter activities for a given employee, with optional extra filters */
  getActivitiesByEmployee(
    employeeId: string,
    filters: Partial<Record<keyof z.infer<typeof ActivitySchema>, unknown>> = {}
  ) {
    return this.filter({ employee_id: employeeId, ...filters });
  }

  getAfterHoursActivities(): Activity[] {
    return this.filter({ is_after_hours: true }).all();
  }

  getWeekendActivities(): Activity[] {
    return this.filter({ is_weekend: true }).all();
  }

  getUrgentActivities(): Activity[] {
    return this.filter({ is_urgent: true }).all();
  }
}

/**
 * Lookup for employee assignments
 */
export class AssignmentLookup extends BaseLookup<typeof AssignmentSchema> {
  constructor(entries: z.infer<typeof AssignmentSchema>[] = Assignments) {
    super(AssignmentSchema, entries);
  }

  /** Filter assignments for a given employee, with optional extra filters */
  getAssignmentsByEmployee(
    employee_id: string,
    filters: Partial<Record<keyof z.infer<typeof ActivitySchema>, unknown>> = {}
  ) {
    return this.filter({ employee_id, ...filters });
  }

  /** Compute stats for a given employee across tasks and activities */
  getStats(employee_id: string) {
    const employeeAssignments = this.filter({ employee_id });
    const completedAssignments = employeeAssignments.filter({ status: 'completed' });

    const totalStoryPoints = employeeAssignments.all().reduce((sum, t) => sum + (t.points ?? 0), 0);
    const completedStoryPoints = completedAssignments.all().reduce((sum, t) => sum + (t.points ?? 0), 0);

    // Activities stats
    const employeeActivities = Activities.filter((a) => a.employee_id === employee_id);
    const afterHours = employeeActivities.filter((a) => a.is_after_hours).length;
    const weekend = employeeActivities.filter((a) => a.is_weekend).length;
    const urgent = employeeActivities.filter((a) => a.is_urgent).length;

    return {
      // Tasks
      totalTasks: employeeAssignments.count(),
      completedTasks: completedAssignments.count(),
      completionRate: employeeAssignments.count() ? (completedAssignments.count() / employeeAssignments.count()) * 100 : 0,

      // Story points
      totalStoryPoints,
      completedStoryPoints,
      storyPointsCompletionRate: totalStoryPoints ? (completedStoryPoints / totalStoryPoints) * 100 : 0,

      // Activities
      totalActivities: employeeActivities.length,
      afterHoursActivities: afterHours,
      weekendActivities: weekend,
      urgentActivities: urgent,

      // Derived work-life score
      workLifeBalanceScore: Math.max(0, 100 - afterHours * 10 - weekend * 5),
    };
  }
}
