import { Injectable } from '@nestjs/common';
import { EmployeeLookup, EmployeeProfile, Team, TeamLookup, Teams } from '@worksight/common';

@Injectable()
export class UsersService {
  private readonly employees = new EmployeeLookup();
  private readonly teams = new TeamLookup(Teams);

  findAll(): EmployeeProfile[] {
    return this.employees.all();
  }

  findById(id: string): EmployeeProfile | null {
    return this.employees.getById(id);
  }

  getStats(): ReturnType<EmployeeLookup['getStats']> {
    return this.employees.getStats();
  }

  findAllTeams(): Team[] {
    return this.teams.all();
  }

  findTeamById(id: string): Team | null {
    return this.teams.getById(id);
  }
}
