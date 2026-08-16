import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EmployeeLookup, EmployeeProfile, Employees, Team, TeamLookup, Teams } from '@worksight/common';
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

