import { Injectable } from '@nestjs/common';
import { EmployeeLookup, EmployeeProfile, Team, TeamLookup, Teams } from '@worksight/common';
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

  getStats(): ReturnType<EmployeeLookup['getStats']> {
    // Stats still come from the in-memory lookup util; Postgres path returns the
    // same shape over the loaded fixture until a SQL aggregate lands.
    return this.employees.getStats();
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
