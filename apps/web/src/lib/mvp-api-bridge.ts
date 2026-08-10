/**
 * Map Nest API (@worksight/common) payloads into the same view models as mvp-data.
 */
import { UserRole } from '@/auth/types';
import type { UserWithMetrics } from '@/schemas/user';
import type { MvpTask } from '@/lib/mvp-data';
import {
  toDate,
  worksightApi,
  isApiDataMode,
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
  const [employees, teams, tasks, submissions] = await Promise.all([
    worksightApi.getUsers(),
    worksightApi.getTeams(),
    worksightApi.getTasks(),
    worksightApi.getSurveySubmissions(),
  ]);

  const latestByEmployee = new Map<string, (typeof submissions)[number]>();
  for (const sub of submissions) {
    const prev = latestByEmployee.get(sub.employee_id);
    if (!prev || toDate(sub.submitted_at) > toDate(prev.submitted_at)) {
      latestByEmployee.set(sub.employee_id, sub);
    }
  }

  return employees
    .filter(e => e.role !== 'guest')
    .map(employee => {
      const employeeTasks = tasks.filter(t => t.employee_id === employee.id);
      const completedTasks = employeeTasks.filter(t => t.status === 'completed').length;
      const submission = latestByEmployee.get(employee.id);
      // Prefer persisted survey avg_score (1–5 scale → ~2–10); else open-task ratio.
      const burnoutScore =
        submission?.avg_score != null
          ? Math.min(10, Math.round(submission.avg_score * 2 * 10) / 10)
          : Math.min(
              10,
              Math.round(
                (employeeTasks.length === 0 ? 0 : 1 - completedTasks / employeeTasks.length) * 8 * 10
              ) / 10
            );

      return {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: mapRole(employee.role),
        department: departmentLabel(employee),
        team: teamLabel(employee, teams),
        burnoutScore,
        lastActive: relativeTime(toDate(employee.updated_at)),
        surveyCompleted: Boolean(submission),
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

function resolveDataBackend(health: {
  database?: string;
  dataBackend?: string;
}): DemoHealth['dataBackend'] {
  const raw = health.database ?? health.dataBackend;
  if (raw === 'postgres' || raw === 'fixtures') return raw;
  // `unreachable` still means the API intended Postgres; surface as unknown for the badge.
  return 'unknown';
}

export async function fetchApiHealth(): Promise<DemoHealth> {
  const health = await worksightApi.getHealth();
  return {
    status: health.status || 'unknown',
    dataBackend: resolveDataBackend(health),
    databaseUrlConfigured:
      typeof health.databaseUrlConfigured === 'boolean'
        ? health.databaseUrlConfigured
        : health.database === 'postgres'
          ? true
          : health.database === 'fixtures'
            ? false
            : null,
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

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Prefer a real employee UUID for API writes (offline auth ids are not UUIDs). */
export async function resolveApiEmployeeId(preferred?: string | null): Promise<string> {
  if (preferred && UUID_RE.test(preferred)) return preferred;
  const users = await worksightApi.getUsers();
  const employee =
    users.find(u => u.role === 'employee') ??
    users.find(u => u.role === 'manager') ??
    users[0];
  if (!employee) {
    throw new Error('No employees available from API to attribute writes');
  }
  return employee.id;
}

export function mapUiStatusToAssignment(
  status: 'pending' | 'todo' | 'in-progress' | 'completed'
): 'todo' | 'in_progress' | 'completed' {
  if (status === 'completed') return 'completed';
  if (status === 'in-progress') return 'in_progress';
  return 'todo';
}

/** Persist a kanban/status change when API mode is on. Best-effort; callers keep optimistic UI. */
export async function persistTaskStatus(
  taskId: string,
  uiStatus: 'pending' | 'todo' | 'in-progress' | 'completed'
): Promise<void> {
  if (!isApiDataMode()) return;
  if (!UUID_RE.test(taskId)) return;
  await worksightApi.patchTask(taskId, { status: mapUiStatusToAssignment(uiStatus) });
}

export async function fetchMvpSurveysFromApi(): Promise<
  import('@/lib/mvp-data').MvpSurvey[]
> {
  const [surveys, users, submissions] = await Promise.all([
    worksightApi.getSurveys(),
    worksightApi.getUsers(),
    worksightApi.getSurveySubmissions(),
  ]);
  const creators = new Map(users.map(u => [u.id, u.name]));
  const counts = submissions.reduce<Record<string, number>>((acc, s) => {
    acc[s.survey_id] = (acc[s.survey_id] ?? 0) + 1;
    return acc;
  }, {});

  return surveys.map(survey => ({
    id: survey.id,
    title: `Wellness Survey (${survey.num_questions} questions)`,
    description: 'Burnout and wellness assessment from the Nest API',
    status: 'active' as const,
    questionCount: survey.num_questions,
    responseCount: counts[survey.id] ?? 0,
    createdAt: toDate(survey.created_at).toISOString().slice(0, 10),
    lastModified: toDate(survey.created_at).toISOString().slice(0, 10),
    createdBy: creators.get(survey.created_by) ?? survey.created_by,
    category: 'burnout' as const,
    targetAudience: 'all' as const,
  }));
}

/** Default wellness survey template id from @worksight/common fixtures. */
export const DEFAULT_WELLNESS_SURVEY_ID = '277068ac-b7a9-45b5-9d41-f66b017509c7';

/**
 * Map `/survey` UI string ids → Nest/`@worksight/common` numeric question ids.
 * Meta fields (`name`, `email`, `role`) are intentionally omitted.
 * Order matches `SurveyQuestionnaire` in packages/common/src/data/survey.ts.
 */
export const UI_TO_API_SURVEY_QUESTION_IDS: Record<string, number> = {
  workload_1: 0,
  workload_2: 1,
  workload_3: 2,
  workload_4: 3,
  workload_5: 4,
  workload_6: 5,
  balance_1: 6,
  balance_2: 7,
  balance_3: 8,
  balance_4: 9,
  balance_5: 10,
  support_1: 11,
  support_2: 12,
  support_3: 13,
  support_4: 14,
  support_5: 15,
  engagement_1: 16,
  engagement_2: 17,
  engagement_3: 18,
  engagement_4: 19,
  engagement_5: 20,
  engagement_6: 21,
  engagement_7: 22,
  engagement_8: 23,
  engagement_9: 24,
};

/** Resolve a UI or numeric question id to the API `question_id`. */
export function mapUiQuestionIdToApi(questionId: string): number | null {
  if (Object.prototype.hasOwnProperty.call(UI_TO_API_SURVEY_QUESTION_IDS, questionId)) {
    return UI_TO_API_SURVEY_QUESTION_IDS[questionId]!;
  }
  const n = Number(questionId);
  if (Number.isInteger(n) && n >= 0) return n;
  return null;
}

/**
 * Best-effort POST of burnout survey answers to Nest.
 * UI stores keep local history regardless of API success.
 */
export async function submitWellnessSurveyToApi(input: {
  employeeId?: string | null;
  responses: Array<{ questionId: string; value: string | number }>;
  surveyId?: string;
}): Promise<void> {
  if (!isApiDataMode()) return;
  const employee_id = await resolveApiEmployeeId(input.employeeId);
  const answers = input.responses
    .map(r => {
      const question_id = mapUiQuestionIdToApi(r.questionId);
      if (question_id === null) return null;
      const numeric =
        typeof r.value === 'number'
          ? r.value
          : Number.isFinite(Number(r.value))
            ? Number(r.value)
            : r.value;
      return { question_id, response: numeric };
    })
    .filter((a): a is { question_id: number; response: string | number } => a !== null);

  if (answers.length === 0) return;

  await worksightApi.submitSurvey(input.surveyId ?? DEFAULT_WELLNESS_SURVEY_ID, {
    employee_id,
    answers,
  });
}
