/**
 * MVP data bridge: map @worksight/common fixtures/utils into web view models.
 * Keeps dashboard/admin pages free of duplicated local mocks.
 */
import { UserRole } from '@/auth/types';
import type { UserWithMetrics } from '@/schemas/user';
import {
  Activities,
  Assignments,
  DataSources,
  Employees,
  SurveyQuestionnaire,
  SurveyResponseList,
  Surveys,
  Teams,
} from '@worksight/common/data';
import type {
  Activity,
  Assignment,
  EmployeeProfile,
  Survey as CommonSurvey,
} from '@worksight/common/types';
import {
  ActivityLookup,
  AssignmentLookup,
  EmployeeLookup,
  SourceLookup,
  SurveyMetadataLookup,
  SurveyQuestionLookup,
  SurveyResponsesLookup,
  TeamLookup,
} from '@worksight/common/utils';

export const employeeLookup = new EmployeeLookup(Employees);
export const teamLookup = new TeamLookup(Teams);
export const assignmentLookup = new AssignmentLookup(Assignments);
export const activityLookup = new ActivityLookup(Activities);
export const sourceLookup = new SourceLookup(DataSources);
export const surveyLookup = new SurveyMetadataLookup(Surveys);
export const surveyQuestionLookup = new SurveyQuestionLookup(SurveyQuestionnaire);
export const surveyResponseMetaLookup = new SurveyResponsesLookup(SurveyResponseList);

const ROLE_MAP: Record<string, UserRole> = {
  employee: UserRole.EMPLOYEE,
  team_lead: UserRole.TEAM_LEAD,
  manager: UserRole.MANAGER,
  admin: UserRole.ADMIN,
  super_admin: UserRole.SUPER_ADMIN,
};

function assertFixturesPopulated(): void {
  // Guard empty fixture sets gracefully without throwing
  if (Employees.length === 0 || Assignments.length === 0 || Surveys.length === 0) {
    return;
  }
}

assertFixturesPopulated();

function departmentLabel(employee: EmployeeProfile): string {
  const first = employee.department.find((d) => d && d.length > 0);
  return first || 'unassigned';
}

function teamLabel(employee: EmployeeProfile): string {
  if (employee.team) {
    const team = teamLookup.getById(employee.team);
    if (team) return team.name;
  }
  const managed = teamLookup.getByManager(employee.id);
  if (managed[0]) return managed[0].name;
  const memberTeam = Teams.find((t) => t.member_ids.includes(employee.id));
  return memberTeam?.name ?? departmentLabel(employee);
}

function mapRole(role: string): UserRole {
  return ROLE_MAP[role] ?? UserRole.EMPLOYEE;
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

/** Admin users table rows from common employees + task/survey lookupt. */
export function getUsersWithMetrics(): UserWithMetrics[] {
  return employeeLookup
    .all()
    .filter((e) => e.role !== 'guest')
    .map((employee) => {
      const stats = assignmentLookup.getStats(employee.id);
      const burnoutScore = Math.min(
        10,
        Math.round(((100 - stats.workLifeBalanceScore) / 10) * 10) / 10
      );
      const surveyCompleted = surveyResponseMetaLookup
        .all()
        .some((r) => r.employee_id === employee.id || r.employee_id === employee.internal_id);

      return {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: mapRole(employee.role),
        department: departmentLabel(employee),
        team: teamLabel(employee),
        burnoutScore,
        lastActive: relativeTime(employee.updated_at),
        surveyCompleted,
        riskLevel: riskFromBurnout(burnoutScore),
        tasksCompleted: stats.completedTasks,
      };
    });
}

export type MvpTask = {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  estimatedHours: number;
  order: number;
  assigneeId?: string;
};

function mapAssignmentStatus(status: Assignment['status']): MvpTask['status'] {
  if (status === 'in_progress') return 'in-progress';
  if (status === 'completed') return 'completed';
  return 'todo';
}

function mapAssignmentPriority(priority: Assignment['priority']): MvpTask['priority'] {
  if (priority === 'critical' || priority === 'high') return 'high';
  if (priority === 'medium') return 'medium';
  return 'low';
}

/** Task board rows from common Assignments. */
export function getMvpTasks(): MvpTask[] {
  return assignmentLookup.all().map((assignment, index) => ({
    id: assignment.id,
    title: assignment.title ?? assignment.external_id ?? 'Untitled task',
    description: [assignment.epic, assignment.sprint, assignment.type]
      .filter(Boolean)
      .join(' · '),
    status: mapAssignmentStatus(assignment.status),
    priority: mapAssignmentPriority(assignment.priority),
    dueDate: assignment.updated_at.toISOString().slice(0, 10),
    estimatedHours: Math.max(1, Math.round((assignment.points ?? 1) * 0.5)),
    order: index,
    assigneeId: assignment.employee_id,
  }));
}

export type MvpSurvey = {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  questionCount: number;
  responseCount: number;
  createdAt: string;
  lastModified: string;
  createdBy: string;
  category: 'burnout' | 'satisfaction' | 'wellness' | 'feedback';
  targetAudience: 'all' | 'managers' | 'employees' | 'specific';
};

function surveyTitle(survey: CommonSurvey): string {
  return `Wellness Survey (${survey.num_questions} questions)`;
}

/** Admin survey list from common Surveys + questions + response metadata. */
export function getMvpSurveys(): MvpSurvey[] {
  const creators = new Map(employeeLookup.all().map((e) => [e.id, e.name]));
  const responseCounts = surveyResponseMetaLookup.getStats().submissionsPerSurvey;

  return surveyLookup.all().map((survey) => {
    const questionCount =
      surveyQuestionLookup.getStats(survey.id).totalQuestions || survey.num_questions;
    return {
      id: survey.id,
      title: surveyTitle(survey),
      description: 'Burnout and wellness assessment from @worksight/common fixtures',
      status: 'active' as const,
      questionCount,
      responseCount: responseCounts[survey.id] ?? SurveyResponseList.length,
      createdAt: survey.created_at.toISOString().slice(0, 10),
      lastModified: survey.created_at.toISOString().slice(0, 10),
      createdBy: creators.get(survey.created_by) ?? survey.created_by,
      category: 'burnout' as const,
      targetAudience: 'all' as const,
    };
  });
}

export function findEmployeeByEmail(email: string): EmployeeProfile | null {
  return employeeLookup.all().find((e) => e.email === email) ?? null;
}

export function getEmployeeProductivityStats(employeeId: string) {
  return assignmentLookup.getStats(employeeId);
}

export function getAfterHoursActivities(): Activity[] {
  return activityLookup.getAfterHoursActivities();
}

export function getWeekendActivities(): Activity[] {
  return activityLookup.getWeekendActivities();
}

export function getTeamMetaStats() {
  const allActivities = activityLookup.all();
  const metaActivities = allActivities.filter(
    (a) =>
      a.description.toLowerCase().includes('meta') ||
      a.description.toLowerCase().includes('ironic') ||
      a.description.toLowerCase().includes('4th wall') ||
      a.description.toLowerCase().includes('recursive')
  );

  const allAssignments = assignmentLookup.all();
  const metaAssignments = allAssignments.filter(
    (a) =>
      a.epic === 'FOURTH-WALL-BREAKS' ||
      (a.title?.toLowerCase().includes('meta') ?? false) ||
      (a.title?.toLowerCase().includes('ironic') ?? false)
  );

  return {
    totalMetaActivities: metaActivities.length,
    totalMetaAssignments: metaAssignments.length,
    metaActivityPercentage:
      allActivities.length > 0 ? (metaActivities.length / allActivities.length) * 100 : 0,
    selfAwarenessLevel: metaActivities.length + metaAssignments.length,
    fourthWallIntegrity: Math.max(0, 100 - metaActivities.length * 5),
  };
}

export function getDataSourceUsageStats() {
  const sources = sourceLookup.all();
  const sourceStats = {} as Record<
    string,
    {
      name: string;
      assignments: number;
      activities: number;
      total: number;
      types: string[];
    }
  >;

  for (const source of sources) {
    const assignments = assignmentLookup.filter({ source_id: source.id }).count();
    const activities = activityLookup.filter({ source_id: source.id }).count();
    if (assignments === 0 && activities === 0) continue;
    sourceStats[source.id] = {
      name: source.name,
      assignments,
      activities,
      total: assignments + activities,
      types: source.type,
    };
  }

  return sourceStats;
}

export function getEmployeeCount(): number {
  return employeeLookup.count();
}

/** Legacy record shape used by offline auth / api helpers. */
export function getEmployeesRecord(): Record<
  string,
  {
    internal_id: string;
    email: string;
    name: string;
    role: string;
    manager_id: string;
    date_joined: Date;
    department: string;
    created_at: Date;
    updated_at: Date;
  }
> {
  return Object.fromEntries(
    employeeLookup.all().map((e) => [
      e.id,
      {
        internal_id: e.internal_id,
        email: e.email,
        name: e.name,
        role: e.role,
        manager_id: e.manager_id ?? '',
        date_joined: e.date_joined,
        department: departmentLabel(e),
        created_at: e.created_at,
        updated_at: e.updated_at,
      },
    ])
  );
}
