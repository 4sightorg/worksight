/**
 * Map Nest API (@worksight/common) payloads into the same view models as mvp-data.
 */
import { UserRole } from '@/auth/types';
import type { UserWithMetrics } from '@/schemas/user';
import type { MvpTask } from '@/lib/mvp-data';
import {
  toDate,
  worksightApi,
  type ApiAssignment,
  type ApiDataBackend,
  type ApiEmployee,
  type ApiTaskStats,
  type ApiTeam,
} from '@/lib/worksight-api';

const ROLE_MAP: Record<string, UserRole> = {
  employee: UserRole.EMPLOYEE,
  team_lead: UserRole.TEAM_LEAD,
  manager: UserRole.MANAGER,
  admin: UserRole.ADMIN,
  super_admin: UserRole.SUPER_ADMIN,
};

function mapRole(role: string): UserRole {
  return ROLE_MAP[role] ?? UserRole.EMPLOYEE;
}

function departmentLabel(employee: ApiEmployee): string {
  const first = employee.department.find(d => d && d.length > 0);
  return first || 'unassigned';
}

function teamLabel(employee: ApiEmployee, teams: ApiTeam[]): string {
  if (employee.team) {
    const team = teams.find(t => t.id === employee.team);
    if (team) return team.name;
  }
  const managed = teams.find(t => t.manager_id === employee.id);
  if (managed) return managed.name;
  const memberTeam = teams.find(t => t.member_ids.includes(employee.id));
  return memberTeam?.name ?? departmentLabel(employee);
}

function relativeTime(date: Date): string {
  const deltaMs = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.floor(deltaMs / 60_000));
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

function riskFromBurnout(score: number): 'low' | 'medium' | 'high' {
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}

function burnoutFromStats(stats: ApiTaskStats): number {
  return Math.min(10, Math.round(((100 - stats.workLifeBalanceScore) / 10) * 10) / 10);
}

function mapAssignmentStatus(status: ApiAssignment['status']): MvpTask['status'] {
  if (status === 'in_progress') return 'in-progress';
  if (status === 'completed') return 'completed';
  return 'todo';
}

function mapAssignmentPriority(priority: ApiAssignment['priority']): MvpTask['priority'] {
  if (priority === 'critical' || priority === 'high') return 'high';
  if (priority === 'medium') return 'medium';
  return 'low';
}

export async function fetchUsersWithMetricsFromApi(): Promise<UserWithMetrics[]> {
  const [employees, teams, tasks] = await Promise.all([
    worksightApi.getUsers(),
    worksightApi.getTeams(),
    worksightApi.getTasks(),
  ]);

  return employees
    .filter(e => e.role !== 'guest')
    .map(employee => {
      const employeeTasks = tasks.filter(t => t.employee_id === employee.id);
      const completedTasks = employeeTasks.filter(t => t.status === 'completed').length;
      // Approximate wellness without per-employee activity round-trips
      const openRatio = employeeTasks.length === 0 ? 0 : 1 - completedTasks / employeeTasks.length;
      const burnoutScore = Math.min(10, Math.round(openRatio * 8 * 10) / 10);

      return {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: mapRole(employee.role),
        department: departmentLabel(employee),
        team: teamLabel(employee, teams),
        burnoutScore,
        lastActive: relativeTime(toDate(employee.updated_at)),
        surveyCompleted: false,
        riskLevel: riskFromBurnout(burnoutScore),
        tasksCompleted: completedTasks,
      };
    });
}

export async function fetchMvpTasksFromApi(): Promise<MvpTask[]> {
  const assignments = await worksightApi.getTasks();
  if (assignments.length === 0) {
    throw new Error('API returned zero tasks; refusing silent empty fallback');
  }
  return assignments.map((assignment, index) => ({
    id: assignment.id,
    title: assignment.title ?? assignment.external_id ?? 'Untitled task',
    description: [assignment.epic, assignment.sprint, assignment.type].filter(Boolean).join(' · '),
    status: mapAssignmentStatus(assignment.status),
    priority: mapAssignmentPriority(assignment.priority),
    dueDate: toDate(assignment.updated_at).toISOString().slice(0, 10),
    estimatedHours: Math.max(1, Math.round((assignment.points ?? 1) * 0.5)),
    order: index,
    assigneeId: assignment.employee_id,
  }));
}

export async function fetchDashboardTasksFromApi(): Promise<
  Array<{
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    storyPoints: number;
  }>
> {
  const assignments = await worksightApi.getTasks();
  if (assignments.length === 0) {
    throw new Error('API returned zero tasks; refusing silent empty fallback');
  }
  return assignments.map(assignment => ({
    id: assignment.id,
    title: assignment.title ?? assignment.external_id ?? 'Untitled task',
    description: [assignment.epic, assignment.sprint, assignment.type].filter(Boolean).join(' · '),
    status:
      assignment.status === 'completed'
        ? 'completed'
        : assignment.status === 'in_progress'
          ? 'in-progress'
          : 'pending',
    priority:
      assignment.priority === 'critical' || assignment.priority === 'high'
        ? 'high'
        : assignment.priority === 'medium'
          ? 'medium'
          : 'low',
    dueDate: toDate(assignment.updated_at).toISOString().slice(0, 10),
    storyPoints: assignment.points ?? 1,
  }));
}

/**
 * Normalized GET /health for the demo page. `dataBackend` collapses to `unknown`
 * when the API predates the Drizzle layer, so the UI never renders `undefined`.
 */
export type DemoHealth = {
  status: string;
  dataBackend: ApiDataBackend | 'unknown';
  databaseUrlConfigured: boolean | null;
  uptimeSeconds: number | null;
};

export async function fetchApiHealth(): Promise<DemoHealth> {
  const health = await worksightApi.getHealth();
  return {
    status: health.status || 'unknown',
    dataBackend:
      health.dataBackend === 'postgres' || health.dataBackend === 'fixtures'
        ? health.dataBackend
        : 'unknown',
    databaseUrlConfigured:
      typeof health.databaseUrlConfigured === 'boolean' ? health.databaseUrlConfigured : null,
    uptimeSeconds: typeof health.uptime === 'number' ? health.uptime : null,
  };
}

export type DemoSnapshot = {
  users: ApiEmployee[];
  teams: ApiTeam[];
  tasks: ApiAssignment[];
  userStats: Awaited<ReturnType<typeof worksightApi.getUserStats>>;
  wellness: Array<{
    employeeId: string;
    name: string;
    workLifeBalanceScore: number;
    burnoutScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    completedTasks: number;
    totalTasks: number;
  }>;
};

export async function fetchDemoSnapshot(): Promise<DemoSnapshot> {
  const [users, teams, tasks, userStats] = await Promise.all([
    worksightApi.getUsers(),
    worksightApi.getTeams(),
    worksightApi.getTasks(),
    worksightApi.getUserStats(),
  ]);

  // Sample a few employees for wellness framing (avoid N×round-trips for everyone)
  const sample = users.filter(u => u.role !== 'guest').slice(0, 6);
  const wellness = await Promise.all(
    sample.map(async employee => {
      const stats = await worksightApi.getTaskStats(employee.id);
      const burnoutScore = burnoutFromStats(stats);
      return {
        employeeId: employee.id,
        name: employee.name,
        workLifeBalanceScore: stats.workLifeBalanceScore,
        burnoutScore,
        riskLevel: riskFromBurnout(burnoutScore),
        completedTasks: stats.completedTasks,
        totalTasks: stats.totalTasks,
      };
    })
  );

  return { users, teams, tasks, userStats, wellness };
}
