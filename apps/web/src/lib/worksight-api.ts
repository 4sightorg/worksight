/**
 * Client for the Nest API (@worksight/api).
 * Responses are typed against @worksight/common; payloads are fixture-backed.
 */
import type { Activity, Assignment, EmployeeProfile, Team } from '@worksight/common/types';

export type DataSourceMode = 'api' | 'fixtures';

export function getApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001').replace(/\/$/, '');
}

/** Prefer Nest API when NEXT_PUBLIC_USE_API=true; otherwise local common fixtures. */
export function getDataSourceMode(): DataSourceMode {
  return process.env.NEXT_PUBLIC_USE_API === 'true' ? 'api' : 'fixtures';
}

export function isApiDataMode(): boolean {
  return getDataSourceMode() === 'api';
}

/** Bounded wait so an unreachable (vs. refusing) API host fails fast instead of hanging. */
function timeoutSignal(ms: number): AbortSignal | undefined {
  return typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
    ? AbortSignal.timeout(ms)
    : undefined;
}

async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal,
  });
  if (!response.ok) {
    throw new Error(`API ${path} failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

/** Which store the API is reading from (Postgres vs fixtures). */
export type ApiDataBackend = 'postgres' | 'fixtures';

/**
 * GET /health.
 * - #28 stack exposes `database` (`fixtures` | `postgres` | `unreachable`)
 * - older Drizzle experiments used `dataBackend`
 * Either shape is accepted; older builds may return `{ status, uptime }` only.
 */
export type ApiHealth = {
  status: string;
  database?: ApiDataBackend | 'unreachable';
  dataBackend?: ApiDataBackend;
  databaseUrlConfigured?: boolean;
  uptime?: number;
};

export type ApiEmployeeStats = {
  totalEmployees: number;
  roles: Array<{ role: string; count: number }>;
  departments: Array<{ department: string; count: number }>;
  adminCount: number;
};

export type ApiTaskStats = {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalStoryPoints: number;
  completedStoryPoints: number;
  storyPointsCompletionRate: number;
  totalActivities: number;
  afterHoursActivities: number;
  weekendActivities: number;
  urgentActivities?: number;
  workLifeBalanceScore: number;
};

/** JSON dates arrive as strings from Nest. */
export type ApiEmployee = Omit<EmployeeProfile, 'date_joined' | 'created_at' | 'updated_at'> & {
  date_joined: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
};

export type ApiAssignment = Omit<Assignment, 'created_at' | 'updated_at'> & {
  created_at: string | Date;
  updated_at: string | Date;
};

export type ApiActivity = Omit<Activity, 'timestamp' | 'created_at'> & {
  timestamp: string | Date;
  created_at: string | Date;
};

export type ApiTeam = Team;

export const worksightApi = {
  getHealth: (timeoutMs = 5000) => apiGet<ApiHealth>('/health', timeoutSignal(timeoutMs)),
  getUsers: () => apiGet<ApiEmployee[]>('/users'),
  getUserStats: () => apiGet<ApiEmployeeStats>('/users/stats'),
  getTeams: () => apiGet<ApiTeam[]>('/teams'),
  getTasks: (employeeId?: string) =>
    apiGet<ApiAssignment[]>(
      employeeId ? `/tasks?employee_id=${encodeURIComponent(employeeId)}` : '/tasks'
    ),
  getTaskStats: (employeeId: string) =>
    apiGet<ApiTaskStats>(`/tasks/stats/${encodeURIComponent(employeeId)}`),
  getActivities: (employeeId?: string) =>
    apiGet<ApiActivity[]>(
      employeeId ? `/activities?employee_id=${encodeURIComponent(employeeId)}` : '/activities'
    ),
};

export function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}
