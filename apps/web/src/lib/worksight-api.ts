/**
 * Client for the Nest API (@worksight/api).
 * Responses are typed against @worksight/common; payloads are fixture-backed
 * or Postgres when the API has DATABASE_URL.
 */
import type {
  Activity,
  Assignment,
  AssignmentPriority,
  AssignmentStatus,
  AssignmentType,
  AttendanceRecord,
  AttendanceStats,
  EmployeeProfile,
  Survey,
  SurveyQuestion,
  SurveyResponseMetadata,
  SurveySubmission,
  Team,
} from '@worksight/common/types';

export type DataSourceMode = 'api' | 'fixtures';

/** Production Nest deploy (Neon-backed). Matches local `pnpm demo` + DATABASE_URL. */
export const PRODUCTION_API_URL = 'https://worksight-api.vercel.app';

/**
 * Nest base URL.
 * - Explicit `NEXT_PUBLIC_API_URL` always wins (local demo sets localhost:3001).
 * - On Vercel builds / browser hosts for worksight-web, default to the sibling API
 *   so remote matches `DEMO_WITH_POSTGRES=1 pnpm demo`.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  if (process.env.VERCEL) return PRODUCTION_API_URL;

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'worksight-web.vercel.app' || host.startsWith('worksight-web-')) {
      return PRODUCTION_API_URL;
    }
  }

  return 'http://localhost:3001';
}

/** Prefer Nest API when NEXT_PUBLIC_USE_API=true; on Vercel, default to API mode. */
export function getDataSourceMode(): DataSourceMode {
  const flag = process.env.NEXT_PUBLIC_USE_API;
  if (flag === 'true') return 'api';
  if (flag === 'false') return 'fixtures';
  // Remote web deploy without an explicit flag → same as local `pnpm demo`.
  if (process.env.VERCEL) return 'api';
  return 'fixtures';
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

async function apiSend<T>(
  method: 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
  signal?: AbortSignal
): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    cache: 'no-store',
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    signal,
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(
      `API ${method} ${path} failed: ${response.status} ${response.statusText}${detail ? ` — ${detail.slice(0, 200)}` : ''}`
    );
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

async function apiDelete<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal,
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(
      `API DELETE ${path} failed: ${response.status} ${response.statusText}${detail ? ` — ${detail.slice(0, 200)}` : ''}`
    );
  }
  if (response.status === 204) {
    return undefined as T;
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

export type ApiOrgStats = {
  totalEmployees: number;
  activeTasks: number;
  tasksByStatus: {
    todo: number;
    in_progress: number;
    completed: number;
  };
  avgAttendanceHours: number;
  recentSurveyAvg: number | null;
  activitiesLast7d: number;
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

export type ApiSurvey = Omit<Survey, 'created_at'> & { created_at: string | Date };
export type ApiSurveyQuestion = SurveyQuestion;
export type ApiSurveySubmissionMeta = Omit<SurveyResponseMetadata, 'submitted_at'> & {
  submitted_at: string | Date;
};

export type CreateTaskInput = {
  id?: string;
  employee_id: string;
  source_id?: string | null;
  external_id?: string | null;
  type: AssignmentType;
  title?: string | null;
  status?: AssignmentStatus;
  sprint?: string | null;
  epic?: string | null;
  points?: number | null;
  priority?: AssignmentPriority;
};

export type PatchTaskInput = {
  status?: AssignmentStatus;
  priority?: AssignmentPriority;
  title?: string | null;
  points?: number | null;
};

export type ApiAttendanceRecord = Omit<
  AttendanceRecord,
  'date' | 'check_in' | 'check_out' | 'created_at'
> & {
  date: string | Date;
  check_in: string | Date | null;
  check_out: string | Date | null;
  created_at: string | Date;
};

export type ApiAttendanceStats = AttendanceStats;

export const worksightApi = {
  getHealth: (timeoutMs = 5000) => apiGet<ApiHealth>('/health', timeoutSignal(timeoutMs)),
  getUsers: () => apiGet<ApiEmployee[]>('/users'),
  getUserStats: () => apiGet<ApiEmployeeStats>('/users/stats'),
getOrgStats: () => apiGet<ApiOrgStats>('/users/stats/org'),
  createUser: (body: Partial<ApiEmployee>) => apiSend<ApiEmployee>('POST', '/users', body),
  patchUser: (id: string, body: Partial<ApiEmployee>) =>
    apiSend<ApiEmployee>('PATCH', `/users/${encodeURIComponent(id)}`, body),
  deleteUser: (id: string) => apiDelete<void>(`/users/${encodeURIComponent(id)}`),
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
  getAttendance: (employeeId?: string) =>
    apiGet<ApiAttendanceRecord[]>(
      employeeId
        ? `/attendance?employee_id=${encodeURIComponent(employeeId)}`
        : '/attendance'
    ),
  getAttendanceStats: (employeeId: string) =>
    apiGet<ApiAttendanceStats>(`/attendance/stats/${encodeURIComponent(employeeId)}`),
  createTask: (body: CreateTaskInput) => apiSend<ApiAssignment>('POST', '/tasks', body),
  patchTask: (id: string, body: PatchTaskInput) =>
    apiSend<ApiAssignment>('PATCH', `/tasks/${encodeURIComponent(id)}`, body),
  deleteTask: (id: string) => apiSend<void>('DELETE', `/tasks/${encodeURIComponent(id)}`),
  getSurveys: () => apiGet<ApiSurvey[]>('/surveys'),
  createSurvey: (body: { created_by?: string; questions?: Partial<ApiSurveyQuestion>[] }) =>
    apiSend<ApiSurvey>('POST', '/surveys', body),
  getSurveyQuestions: (surveyId: string) =>
    apiGet<ApiSurveyQuestion[]>(`/surveys/${encodeURIComponent(surveyId)}/questions`),
  getSurveySubmissions: (employeeId?: string) =>
    apiGet<ApiSurveySubmissionMeta[]>(
      employeeId
        ? `/surveys/responses?employee_id=${encodeURIComponent(employeeId)}`
        : '/surveys/responses'
    ),
  submitSurvey: (surveyId: string, body: SurveySubmission) =>
    apiSend<ApiSurveySubmissionMeta>(
      'POST',
      `/surveys/${encodeURIComponent(surveyId)}/responses`,
      body
    ),
};

export function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}
