import { Employees } from '../data/employees';
import {
  Departments,
  EmployeeProfile,
  EmployeeProfileSchema,
  Roles,
  Team,
  TeamSchema,
} from '../types';
import { BaseLookup } from './base';

type UUID = string;

/**
 * EmployeeLookup
 * ----------------
 * Thin wrapper around BaseLookup specialized for EmployeeProfile.
 * Provides helper methods for filtering, stats, and common queries.
 */
export class EmployeeLookup extends BaseLookup<typeof EmployeeProfileSchema> {
  constructor(entries: EmployeeProfile[] = Employees) {
    super(EmployeeProfileSchema, entries);
  }

  /** Summary statistics about employees */
  public getStats() {
    const roles = Roles.map(role => ({
      role,
      count: this.filter({ role }).count(),
    }));

    const departments = Departments.map(department => ({
      department,
      // `department` is an array field, so match by membership
      count: this.filter({
        department: (d: unknown) => Array.isArray(d) && d.includes(department),
      }).count(),
    }));

    const adminCount = this.entries.filter(e => !e.manager_id).length;

    return {
      totalEmployees: this.entries.length,
      roles,
      departments,
      adminCount,
    };
  }

  /** Get employee by UUID */
  public getById(id: UUID): EmployeeProfile | null {
    return this.filter({ id }).first() ?? null;
  }

  /** Get all employees reporting to a manager */
  public getByManager(manager_id: UUID): EmployeeProfile[] {
    return this.filter({ manager_id }).all();
  }
}

/**
 * TeamLookup
 * ----------------
 * Thin wrapper around BaseLookup specialized for Teams.
 * Provides helper methods and statistics for teams.
 */
export class TeamLookup extends BaseLookup<typeof TeamSchema> {
  constructor(entries: Team[] = []) {
    super(TeamSchema, entries);
  }

  /** Get a team by ID */
  public getById(id: UUID): Team | null {
    return this.filter({ id }).first() ?? null;
  }

  /** Get all teams under a manager */
  public getByManager(manager_id: UUID): Team[] {
    return this.filter({ manager_id }).all();
  }

  /** Get all teams in a department */
  public getByDepartment(department: string): Team[] {
    return this.filter({ department }).all();
  }

  /** Count total members in a team */
  public getMemberCount(team_id: UUID): number {
    const team = this.getById(team_id);
    return team ? team.member_ids.length : 0;
  }

  /** Team-level statistics */
  public getStats() {
    const allTeams = this.all();
    const totalTeams = allTeams.length;
    const totalMembers = allTeams.reduce((sum, t) => sum + t.member_ids.length, 0);
    const avgMembers = totalTeams ? totalMembers / totalTeams : 0;

    const departmentCounts: Record<string, number> = {};
    allTeams.forEach(t => {
      departmentCounts[t.department] = (departmentCounts[t.department] || 0) + 1;
    });

    return {
      totalTeams,
      totalMembers,
      avgMembers,
      departmentCounts,
    };
  }
}
