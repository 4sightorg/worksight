import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  ActivityLookup,
  AssignmentLookup,
  AttendanceLookup,
  EmployeeLookup,
  EmployeeProfile,
  Employees,
  SurveyResponseList,
  Team,
  TeamLookup,
  Teams,
} from '@worksight/common';
import { paginate, PaginationQuery } from '../common/pagination.dto';
import { WorksightRepository } from '../db/worksight.repository';
import { parseCreateUser, parseUpdateUser, type CreateUserInput, type UpdateUserInput } from './user-write.dto';

@Injectable()
export class UsersService {
  private readonly teams = new TeamLookup(Teams);
  private readonly fixtureUsers: EmployeeProfile[] = [...Employees];

  constructor(private readonly repo: WorksightRepository) {}

  async findAll(pagination?: PaginationQuery): Promise<EmployeeProfile[]> {
    const list = this.repo.enabled
      ? await this.repo.listEmployees()
      : [...this.fixtureUsers];
    return paginate(list, pagination);
  }

  async findById(id: string): Promise<EmployeeProfile | null> {
    if (this.repo.enabled) {
      return this.repo.getEmployee(id);
    }
    return this.fixtureUsers.find(u => u.id === id) ?? null;
  }

  async create(body: unknown): Promise<EmployeeProfile> {
    const input = parseCreateUser(body);
    if (this.repo.enabled) {
      return (this.repo as unknown as { createEmployee?: (i: CreateUserInput) => Promise<EmployeeProfile> }).createEmployee
        ? (this.repo as unknown as { createEmployee: (i: CreateUserInput) => Promise<EmployeeProfile> }).createEmployee(input)
        : this.createFixture(input);
    }
    return this.createFixture(input);
  }

  private createFixture(input: CreateUserInput): EmployeeProfile {
    const newEmployee: EmployeeProfile = {
      id: input.id || randomUUID(),
      internal_id: input.internal_id || `E${String(this.fixtureUsers.length + 1).padStart(3, '0')}`,
      email: input.email,
      name: input.name,
      role: input.role,
      department: Array.isArray(input.department) ? input.department : [input.department],
      team: input.team ?? null,
      manager_id: input.manager_id ?? null,
      date_joined: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.fixtureUsers.push(newEmployee);
    return newEmployee;
  }

  async update(id: string, body: unknown): Promise<EmployeeProfile | null> {
    const input = parseUpdateUser(body);
    if (this.repo.enabled) {
      return (this.repo as unknown as { updateEmployee?: (i: string, patch: UpdateUserInput) => Promise<EmployeeProfile | null> }).updateEmployee
        ? (this.repo as unknown as { updateEmployee: (i: string, patch: UpdateUserInput) => Promise<EmployeeProfile | null> }).updateEmployee(id, input)
        : this.updateFixture(id, input);
    }
    return this.updateFixture(id, input);
  }

  private updateFixture(id: string, input: UpdateUserInput): EmployeeProfile | null {
    const idx = this.fixtureUsers.findIndex(u => u.id === id);
    if (idx === -1) return null;
    const existing = this.fixtureUsers[idx];
    const updated: EmployeeProfile = {
      ...existing,
      ...input,
      department: input.department
        ? (Array.isArray(input.department) ? input.department : [input.department])
        : existing.department,
      updated_at: new Date(),
    };
    this.fixtureUsers[idx] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    if (this.repo.enabled) {
      return (this.repo as unknown as { deleteEmployee?: (i: string) => Promise<boolean> }).deleteEmployee
        ? (this.repo as unknown as { deleteEmployee: (i: string) => Promise<boolean> }).deleteEmployee(id)
        : this.deleteFixture(id);
    }
    return this.deleteFixture(id);
  }

  private deleteFixture(id: string): boolean {
    const idx = this.fixtureUsers.findIndex(u => u.id === id);
    if (idx === -1) return false;
    this.fixtureUsers.splice(idx, 1);
    return true;
  }

  async getStats(): Promise<ReturnType<EmployeeLookup['getStats']>> {
    if (this.repo.enabled) {
      return new EmployeeLookup(await this.repo.listEmployees()).getStats();
    }
    return new EmployeeLookup(this.fixtureUsers).getStats();
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

    const employees = this.fixtureUsers;
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

  async findAllTeams(pagination?: PaginationQuery): Promise<Team[]> {
    const list = this.repo.enabled ? await this.repo.listTeams() : this.teams.all();
    return paginate(list, pagination);
  }

  async findTeamById(id: string): Promise<Team | null> {
    if (this.repo.enabled) {
      return this.repo.getTeam(id);
    }
    return this.teams.getById(id);
  }
}

