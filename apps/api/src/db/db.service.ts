import {
  Injectable,
  Logger,
  OnModuleDestroy,
  Optional,
} from '@nestjs/common';
import {
  Activity,
  Assignment,
  EmployeeLookup,
  EmployeeProfile,
  Team,
} from '@worksight/common';
import { eq } from 'drizzle-orm';
import { createDatabase, type AppDatabase, type DatabaseHandle } from './client';
import { toActivity, toAssignment, toEmployeeProfile, toTeam } from './mappers';
import { activities, assignments, employees, teams } from './schema';

export type DataBackend = 'postgres' | 'fixtures';

/** Insert shape for `assignments`, derived from the table so it tracks schema.ts. */
export type NewAssignmentRow = typeof assignments.$inferInsert;

/** Columns `PATCH /tasks/:id` is allowed to touch. */
export type AssignmentPatch = Partial<
  Pick<NewAssignmentRow, 'status' | 'priority' | 'title' | 'points'>
>;

@Injectable()
export class DbService implements OnModuleDestroy {
  private readonly logger = new Logger(DbService.name);
  private readonly handle: DatabaseHandle | null;

  constructor(@Optional() handle?: DatabaseHandle | null) {
    this.handle = handle === undefined ? createDatabase() : handle;
    if (this.handle) {
      this.logger.log('Postgres data backend enabled (DATABASE_URL set)');
    } else {
      loggerFixture(this.logger);
    }
  }

  get backend(): DataBackend {
    return this.handle ? 'postgres' : 'fixtures';
  }

  get enabled(): boolean {
    return this.handle !== null;
  }

  get db(): AppDatabase {
    if (!this.handle) {
      throw new Error('Database is not configured (DATABASE_URL missing)');
    }
    return this.handle.db;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.handle) {
      await this.handle.sql.end({ timeout: 5 });
    }
  }

  async listEmployees(): Promise<EmployeeProfile[]> {
    const rows = await this.db.select().from(employees);
    return rows.map(toEmployeeProfile);
  }

  async getEmployeeById(id: string): Promise<EmployeeProfile | null> {
    const [row] = await this.db.select().from(employees).where(eq(employees.id, id)).limit(1);
    return row ? toEmployeeProfile(row) : null;
  }

  async getEmployeeStats(): Promise<ReturnType<EmployeeLookup['getStats']>> {
    const profiles = await this.listEmployees();
    return new EmployeeLookup(profiles).getStats();
  }

  async listTeams(): Promise<Team[]> {
    const rows = await this.db.select().from(teams);
    return rows.map(toTeam);
  }

  async getTeamById(id: string): Promise<Team | null> {
    const [row] = await this.db.select().from(teams).where(eq(teams.id, id)).limit(1);
    return row ? toTeam(row) : null;
  }

  async listAssignments(employeeId?: string): Promise<Assignment[]> {
    const rows = employeeId
      ? await this.db.select().from(assignments).where(eq(assignments.employeeId, employeeId))
      : await this.db.select().from(assignments);
    return rows.map(toAssignment);
  }

  async getAssignmentById(id: string): Promise<Assignment | null> {
    const [row] = await this.db.select().from(assignments).where(eq(assignments.id, id)).limit(1);
    return row ? toAssignment(row) : null;
  }

  async listActivities(employeeId?: string): Promise<Activity[]> {
    const rows = employeeId
      ? await this.db.select().from(activities).where(eq(activities.employeeId, employeeId))
      : await this.db.select().from(activities);
    return rows.map(toActivity);
  }

  async getAssignmentStats(employeeId: string) {
    const employeeAssignments = await this.listAssignments(employeeId);
    const employeeActivities = await this.listActivities(employeeId);

    const completed = employeeAssignments.filter(a => a.status === 'completed');
    const totalStoryPoints = employeeAssignments.reduce((sum, t) => sum + (t.points ?? 0), 0);
    const completedStoryPoints = completed.reduce((sum, t) => sum + (t.points ?? 0), 0);
    const afterHours = employeeActivities.filter(a => a.is_after_hours).length;
    const weekend = employeeActivities.filter(a => a.is_weekend).length;
    const urgent = employeeActivities.filter(a => a.is_urgent).length;

    return {
      totalTasks: employeeAssignments.length,
      completedTasks: completed.length,
      completionRate: employeeAssignments.length
        ? (completed.length / employeeAssignments.length) * 100
        : 0,
      totalStoryPoints,
      completedStoryPoints,
      storyPointsCompletionRate: totalStoryPoints
        ? (completedStoryPoints / totalStoryPoints) * 100
        : 0,
      totalActivities: employeeActivities.length,
      afterHoursActivities: afterHours,
      weekendActivities: weekend,
      urgentActivities: urgent,
      workLifeBalanceScore: Math.max(0, 100 - afterHours * 10 - weekend * 5),
    };
  }

  /* ---------------------------------------------------------------- writes */

  /** Insert one assignment and return it mapped back to the shared type. */
  async createAssignment(values: NewAssignmentRow): Promise<Assignment> {
    const [row] = await this.db.insert(assignments).values(values).returning();
    return toAssignment(row);
  }

  /**
   * Apply a partial update. Returns `null` when no row matched `id` so callers
   * can turn that into a 404. `updated_at` is bumped server-side.
   */
  async updateAssignment(id: string, patch: AssignmentPatch): Promise<Assignment | null> {
    const [row] = await this.db
      .update(assignments)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(assignments.id, id))
      .returning();
    return row ? toAssignment(row) : null;
  }
}

function loggerFixture(logger: Logger): void {
  logger.log('Fixture data backend (set DATABASE_URL for Neon/Postgres)');
}
