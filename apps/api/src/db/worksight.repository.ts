import { Injectable } from '@nestjs/common';
import type { Activity, Assignment, EmployeeProfile, Team } from '@worksight/common';
import { DatabaseService } from './database.service';

type EmployeeRow = {
  id: string;
  internal_id: string;
  email: string;
  name: string;
  role: EmployeeProfile['role'];
  department: EmployeeProfile['department'];
  team_id: string | null;
  manager_id: string | null;
  date_joined: Date;
  created_at: Date;
  updated_at: Date;
};

type TeamRow = {
  id: string;
  name: string;
  description: string | null;
  department: Team['department'];
  manager_id: string;
  member_ids: string[];
  parent_team_id: string | null;
  created_at: Date;
  updated_at: Date;
};

type AssignmentRow = {
  id: string;
  employee_id: string;
  source_id: string | null;
  external_id: string | null;
  type: Assignment['type'];
  title: string | null;
  status: Assignment['status'];
  sprint: string | null;
  epic: string | null;
  points: number | null;
  priority: Assignment['priority'];
  created_at: Date;
  updated_at: Date;
};

type ActivityRow = {
  id: string;
  source_id: string;
  external_id: string;
  employee_id: string;
  type: Activity['type'];
  timestamp: Date;
  description: string;
  is_after_hours: boolean;
  is_weekend: boolean;
  is_urgent: boolean;
  created_at: Date;
};

@Injectable()
export class WorksightRepository {
  constructor(private readonly db: DatabaseService) {}

  get enabled(): boolean {
    return this.db.enabled;
  }

  async listEmployees(): Promise<EmployeeProfile[]> {
    const { rows } = await this.db.query<EmployeeRow>(
      `SELECT * FROM employees ORDER BY internal_id`
    );
    return rows.map(toEmployee);
  }

  async getEmployee(id: string): Promise<EmployeeProfile | null> {
    const { rows } = await this.db.query<EmployeeRow>(
      `SELECT * FROM employees WHERE id = $1`,
      [id]
    );
    return rows[0] ? toEmployee(rows[0]) : null;
  }

  async listTeams(): Promise<Team[]> {
    const { rows } = await this.db.query<TeamRow>(`SELECT * FROM teams ORDER BY name`);
    return rows.map(toTeam);
  }

  async getTeam(id: string): Promise<Team | null> {
    const { rows } = await this.db.query<TeamRow>(`SELECT * FROM teams WHERE id = $1`, [id]);
    return rows[0] ? toTeam(rows[0]) : null;
  }

  async listAssignments(employeeId?: string): Promise<Assignment[]> {
    const { rows } = employeeId
      ? await this.db.query<AssignmentRow>(
          `SELECT * FROM assignments WHERE employee_id = $1 ORDER BY updated_at DESC`,
          [employeeId]
        )
      : await this.db.query<AssignmentRow>(
          `SELECT * FROM assignments ORDER BY updated_at DESC`
        );
    return rows.map(toAssignment);
  }

  async getAssignment(id: string): Promise<Assignment | null> {
    const { rows } = await this.db.query<AssignmentRow>(
      `SELECT * FROM assignments WHERE id = $1`,
      [id]
    );
    return rows[0] ? toAssignment(rows[0]) : null;
  }

  async listActivities(employeeId?: string): Promise<Activity[]> {
    const { rows } = employeeId
      ? await this.db.query<ActivityRow>(
          `SELECT * FROM activities WHERE employee_id = $1 ORDER BY timestamp DESC`,
          [employeeId]
        )
      : await this.db.query<ActivityRow>(
          `SELECT * FROM activities ORDER BY timestamp DESC`
        );
    return rows.map(toActivity);
  }
}

function toEmployee(row: EmployeeRow): EmployeeProfile {
  return {
    id: row.id,
    internal_id: row.internal_id,
    email: row.email,
    name: row.name,
    role: row.role,
    department: row.department ?? [],
    team: row.team_id,
    manager_id: row.manager_id ?? undefined,
    date_joined: new Date(row.date_joined),
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  };
}

function toTeam(row: TeamRow): Team {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    department: row.department,
    manager_id: row.manager_id,
    member_ids: row.member_ids ?? [],
    parent_team_id: row.parent_team_id,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  };
}

function toAssignment(row: AssignmentRow): Assignment {
  return {
    id: row.id,
    employee_id: row.employee_id,
    source_id: row.source_id,
    external_id: row.external_id,
    type: row.type,
    title: row.title,
    status: row.status,
    sprint: row.sprint,
    epic: row.epic,
    points: row.points,
    priority: row.priority,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  };
}

function toActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    source_id: row.source_id,
    external_id: row.external_id,
    employee_id: row.employee_id,
    type: row.type,
    timestamp: new Date(row.timestamp),
    description: row.description,
    is_after_hours: row.is_after_hours,
    is_weekend: row.is_weekend,
    is_urgent: row.is_urgent,
    created_at: new Date(row.created_at),
  };
}
