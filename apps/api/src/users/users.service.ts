import { Injectable } from '@nestjs/common';
import {
  ActivityLookup,
  AssignmentLookup,
  AttendanceLookup,
  EmployeeLookup,
  EmployeeProfile,
  SurveyResponseList,
  Team,
  TeamLookup,
  Teams,
} from '@worksight/common';
import { WorksightRepository } from '../db/worksight.repository';

@Injectable()
export class UsersService {
  private readonly employees = new EmployeeLookup();
  private readonly teams = new TeamLookup(Teams);

  constructor(private readonly repo: WorksightRepository) {}

  async findAll(): Promise<EmployeeProfile[]> {
    if (this.repo.enabled) {
      return this.repo.listEmployees();
    }
    return this.employees.all();
  }

  async findById(id: string): Promise<EmployeeProfile | null> {
    if (this.repo.enabled) {
      return this.repo.getEmployee(id);
    }
    return this.employees.getById(id);
  }

  async getStats(): Promise<ReturnType<EmployeeLookup['getStats']>> {
    if (this.repo.enabled) {
      // Same lookup math, hydrated from Postgres instead of the fixtures.
      return new EmployeeLookup(await this.repo.listEmployees()).getStats();
    }
    return this.employees.getStats();
  }

  async getOrgStats(): Promise<{
    totalEmployees: number;
    activeTasks: number;
    tasksByStatus: { todo: number; in_progress: number; completed: number };
    avgAttendanceHours: number;
    recentSurveyAvg: number | null;
    activitiesLast7d: number;
  }> {
    if (this.repo.enabled) {
      return this.repo.getOrgStats();
    }

    const employees = this.employees.all();
    const assignments = new AssignmentLookup().all();
    const attendance = new AttendanceLookup().all();
    const submissions = SurveyResponseList;
    const activities = new ActivityLookup().all();

    const tasksByStatus = { todo: 0, in_progress: 0, completed: 0 };
    for (const a of assignments) {
      if (a.status in tasksByStatus) {
        tasksByStatus[a.status as keyof typeof tasksByStatus]++;
      }
    }

    const attHours = attendance
      .map((a: { hours_worked: number | null }) => a.hours_worked)
      .filter((h): h is number => h !== null && typeof h === 'number');
    const avgAttendanceHours = attHours.length
      ? Math.round((attHours.reduce((sum: number, h: number) => sum + h, 0) / attHours.length) * 100) / 100
      : 0;

    const surveyScores = submissions
      .map((s: { avg_score: number | null }) => s.avg_score)
      .filter((s): s is number => s !== null && typeof s === 'number');
    const recentSurveyAvg = surveyScores.length
      ? Math.round((surveyScores.reduce((sum: number, s: number) => sum + s, 0) / surveyScores.length) * 100) / 100
      : null;

    const maxTime = activities.length
      ? Math.max(...activities.map((a: { timestamp: string | Date }) => new Date(a.timestamp).getTime()))
      : Date.now();
    const weekAgo = maxTime - 7 * 24 * 60 * 60 * 1000;
    const activitiesLast7d = activities.filter(
      (a: { timestamp: string | Date }) => new Date(a.timestamp).getTime() >= weekAgo
    ).length;

    return {
      totalEmployees: employees.length,
      activeTasks: tasksByStatus.todo + tasksByStatus.in_progress,
      tasksByStatus,
      avgAttendanceHours,
      recentSurveyAvg,
      activitiesLast7d,
    };
  }

  async findAllTeams(): Promise<Team[]> {
    if (this.repo.enabled) {
      return this.repo.listTeams();
    }
    return this.teams.all();
  }

  async findTeamById(id: string): Promise<Team | null> {
    if (this.repo.enabled) {
      return this.repo.getTeam(id);
    }
    return this.teams.getById(id);
  }
}
