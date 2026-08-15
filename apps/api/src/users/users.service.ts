import { Injectable } from '@nestjs/common';
import { EmployeeLookup, EmployeeProfile, Team, TeamLookup, Teams } from '@worksight/common';
import { paginate, PaginationQuery } from '../common/pagination.dto';
import { WorksightRepository } from '../db/worksight.repository';

@Injectable()
export class UsersService {
  private readonly employees = new EmployeeLookup();
  private readonly teams = new TeamLookup(Teams);

  constructor(private readonly repo: WorksightRepository) {}

  async findAll(pagination?: PaginationQuery): Promise<EmployeeProfile[]> {
    const list = this.repo.enabled ? await this.repo.listEmployees() : this.employees.all();
    return paginate(list, pagination);
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
