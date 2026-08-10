import { Injectable, Optional } from '@nestjs/common';
import { EmployeeLookup, EmployeeProfile, Team, TeamLookup, Teams } from '@worksight/common';
import { DbService } from '../db/db.service';

@Injectable()
export class UsersService {
  private readonly employees = new EmployeeLookup();
  private readonly teams = new TeamLookup(Teams);

  constructor(@Optional() private readonly db?: DbService) {}

  async findAll(): Promise<EmployeeProfile[]> {
    if (this.db?.enabled) {
      return this.db.listEmployees();
    }
    return this.employees.all();
  }

  async findById(id: string): Promise<EmployeeProfile | null> {
    if (this.db?.enabled) {
      return this.db.getEmployeeById(id);
    }
    return this.employees.getById(id);
  }

  async getStats(): Promise<ReturnType<EmployeeLookup['getStats']>> {
    if (this.db?.enabled) {
      return this.db.getEmployeeStats();
    }
    return this.employees.getStats();
  }

  async findAllTeams(): Promise<Team[]> {
    if (this.db?.enabled) {
      return this.db.listTeams();
    }
    return this.teams.all();
  }

  async findTeamById(id: string): Promise<Team | null> {
    if (this.db?.enabled) {
      return this.db.getTeamById(id);
    }
    return this.teams.getById(id);
  }
}
