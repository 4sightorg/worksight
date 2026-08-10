import type {
  Activity,
  ActivityType,
  Assignment,
  AssignmentPriority,
  AssignmentStatus,
  AssignmentType,
  DataSource,
  EmployeeProfile,
  Team,
} from '@worksight/common';
import type { ActivityRow, AssignmentRow, DataSourceRow, EmployeeRow, TeamRow } from './schema';

export function toEmployeeProfile(row: EmployeeRow): EmployeeProfile {
  return {
    id: row.id,
    internal_id: row.internalId,
    email: row.email,
    name: row.name,
    role: row.role as EmployeeProfile['role'],
    department: row.department as EmployeeProfile['department'],
    team: row.team ?? undefined,
    manager_id: row.managerId ?? undefined,
    date_joined: row.dateJoined,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

export function toTeam(row: TeamRow): Team {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    department: row.department as Team['department'],
    manager_id: row.managerId,
    member_ids: row.memberIds,
    parent_team_id: row.parentTeamId,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

export function toAssignment(row: AssignmentRow): Assignment {
  return {
    id: row.id,
    employee_id: row.employeeId,
    source_id: row.sourceId,
    external_id: row.externalId,
    type: row.type as AssignmentType,
    title: row.title,
    status: row.status as AssignmentStatus,
    sprint: row.sprint,
    epic: row.epic,
    points: row.points,
    priority: row.priority as AssignmentPriority,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

export function toActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    source_id: row.sourceId,
    external_id: row.externalId,
    employee_id: row.employeeId,
    type: row.type as ActivityType,
    timestamp: row.timestamp,
    description: row.description,
    is_after_hours: row.isAfterHours,
    is_weekend: row.isWeekend,
    is_urgent: row.isUrgent,
    created_at: row.createdAt,
  };
}

export function toDataSource(row: DataSourceRow): DataSource {
  return {
    id: row.id,
    name: row.name,
    type: row.type as DataSource['type'],
    base_url: row.baseUrl,
    is_active: row.isActive,
    modules: row.modules,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

/** Empty / sentinel manager ids from fixtures → SQL NULL */
export function normalizeOptionalId(value: string | null | undefined): string | null {
  if (value == null || value === '' || value === 'admin') {
    return null;
  }
  return value;
}
