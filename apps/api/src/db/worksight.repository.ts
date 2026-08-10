import { Injectable } from '@nestjs/common';
import type {
  Activity,
  Assignment,
  AttendanceRecord,
  AttendanceStats,
  EmployeeProfile,
  Survey,
  SurveyQuestion,
  SurveyResponseMetadata,
  SurveySubmission,
  Team,
} from '@worksight/common';
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

type AttendanceRow = {
  system_id: string;
  employee_id: string;
  date: Date;
  check_in: Date | null;
  check_out: Date | null;
  // NUMERIC arrives as a string from node-postgres.
  hours_worked: string | null;
  created_at: Date;
};

type AttendanceStatsRow = {
  total_records: number;
  total_hours: number;
  days_present: number;
};

type SurveyRow = {
  id: string;
  created_by: string;
  created_at: Date;
  num_questions: number;
};

type SurveyQuestionRow = {
  survey_id: string;
  id: number;
  question_text: string;
  question_subtext: string | null;
  dimension: string[];
  type: SurveyQuestion['type'];
  required: boolean;
  options: string[] | null;
  reverse_score: boolean;
  min_value: number | null;
  min_label: string | null;
  max_value: number | null;
  max_label: string | null;
  default_value: string | number | null;
};

type SurveyResponseMetaRow = {
  id: string;
  survey_id: string;
  employee_id: string;
  submitted_at: Date;
  avg_score: number | null;
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


/** Insert shape for POST /tasks (timestamps owned by the repository). */
export type NewAssignmentInput = {
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
};

/** Columns PATCH /tasks/:id may touch. */
export type AssignmentPatch = Partial<
  Pick<Assignment, 'status' | 'priority' | 'title' | 'points'>
>;

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

  /** Insert one assignment and return the mapped shared type. */
  async createAssignment(input: NewAssignmentInput): Promise<Assignment> {
    const now = new Date();
    const { rows } = await this.db.query<AssignmentRow>(
      `INSERT INTO assignments
         (id, employee_id, source_id, external_id, type, title, status,
          sprint, epic, points, priority, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        input.id,
        input.employee_id,
        input.source_id,
        input.external_id,
        input.type,
        input.title,
        input.status,
        input.sprint,
        input.epic,
        input.points,
        input.priority,
        now,
        now,
      ]
    );
    return toAssignment(rows[0]);
  }

  /**
   * Partial update. Returns null when no row matches so callers can 404.
   * `updated_at` is always bumped server-side.
   */
  async updateAssignment(id: string, patch: AssignmentPatch): Promise<Assignment | null> {
    const sets: string[] = [];
    const params: unknown[] = [];
    const push = (column: string, value: unknown) => {
      params.push(value);
      sets.push(`${column} = $${params.length}`);
    };

    if (patch.status !== undefined) push('status', patch.status);
    if (patch.priority !== undefined) push('priority', patch.priority);
    if (patch.title !== undefined) push('title', patch.title);
    if (patch.points !== undefined) push('points', patch.points);

    if (sets.length === 0) {
      throw new Error('AssignmentPatch must set at least one column');
    }

    push('updated_at', new Date());
    params.push(id);
    const { rows } = await this.db.query<AssignmentRow>(
      `UPDATE assignments SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
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

  async listAttendance(employeeId?: string): Promise<AttendanceRecord[]> {
    const { rows } = employeeId
      ? await this.db.query<AttendanceRow>(
          `SELECT * FROM attendance WHERE employee_id = $1 ORDER BY date DESC`,
          [employeeId]
        )
      : await this.db.query<AttendanceRow>(`SELECT * FROM attendance ORDER BY date DESC`);
    return rows.map(toAttendance);
  }

  async getAttendanceStats(employeeId: string): Promise<AttendanceStats> {
    const { rows } = await this.db.query<AttendanceStatsRow>(
      `SELECT count(*)::int              AS total_records,
              COALESCE(sum(hours_worked), 0)::float AS total_hours,
              count(check_in)::int       AS days_present
         FROM attendance
        WHERE employee_id = $1`,
      [employeeId]
    );
    const { total_records, total_hours, days_present } = rows[0];
    const average = days_present > 0 ? total_hours / days_present : 0;
    return {
      totalRecords: total_records,
      totalHours: Math.round(total_hours * 100) / 100,
      daysPresent: days_present,
      averageHours: Math.round(average * 100) / 100,
    };
  }

  async listSurveys(): Promise<Survey[]> {
    const { rows } = await this.db.query<SurveyRow>(`SELECT * FROM surveys ORDER BY created_at`);
    return rows.map(toSurvey);
  }

  async getSurvey(id: string): Promise<Survey | null> {
    const { rows } = await this.db.query<SurveyRow>(`SELECT * FROM surveys WHERE id = $1`, [id]);
    return rows[0] ? toSurvey(rows[0]) : null;
  }

  async listSurveyQuestions(surveyId: string): Promise<SurveyQuestion[]> {
    const { rows } = await this.db.query<SurveyQuestionRow>(
      `SELECT * FROM survey_questions WHERE survey_id = $1 ORDER BY id`,
      [surveyId]
    );
    return rows.map(toSurveyQuestion);
  }

  async listSurveySubmissions(employeeId?: string): Promise<SurveyResponseMetadata[]> {
    const { rows } = employeeId
      ? await this.db.query<SurveyResponseMetaRow>(
          `SELECT * FROM survey_response_meta WHERE employee_id = $1 ORDER BY submitted_at DESC`,
          [employeeId]
        )
      : await this.db.query<SurveyResponseMetaRow>(
          `SELECT * FROM survey_response_meta ORDER BY submitted_at DESC`
        );
    return rows.map(toSurveyResponseMeta);
  }

  async createSurveySubmission(
    surveyId: string,
    submission: SurveySubmission
  ): Promise<SurveyResponseMetadata> {
    const numeric = submission.answers
      .map(a => a.response)
      .filter((r): r is number => typeof r === 'number');
    const avgScore = numeric.length
      ? Math.round((numeric.reduce((a, b) => a + b, 0) / numeric.length) * 100) / 100
      : null;

    return this.db.withClient(async client => {
      await client.query('BEGIN');
      try {
        const {
          rows: [meta],
        } = await client.query<SurveyResponseMetaRow>(
          `INSERT INTO survey_response_meta (id, survey_id, employee_id, submitted_at, avg_score)
           VALUES (gen_random_uuid(), $1, $2, now(), $3)
           RETURNING *`,
          [surveyId, submission.employee_id, avgScore]
        );
        for (const answer of submission.answers) {
          await client.query(
            `INSERT INTO survey_responses (id, response_meta_id, question_id, response)
             VALUES (gen_random_uuid(), $1, $2, $3)`,
            [meta.id, answer.question_id, answer.response === null ? null : JSON.stringify(answer.response)]
          );
        }
        await client.query('COMMIT');
        return toSurveyResponseMeta(meta);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    });
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

function toAttendance(row: AttendanceRow): AttendanceRecord {
  return {
    system_id: row.system_id,
    employee_id: row.employee_id,
    date: new Date(row.date),
    check_in: row.check_in ? new Date(row.check_in) : null,
    check_out: row.check_out ? new Date(row.check_out) : null,
    hours_worked: row.hours_worked === null ? null : Number(row.hours_worked),
    created_at: new Date(row.created_at),
  };
}

function toSurvey(row: SurveyRow): Survey {
  return {
    id: row.id,
    created_by: row.created_by,
    created_at: new Date(row.created_at),
    num_questions: row.num_questions,
  };
}

function toSurveyQuestion(row: SurveyQuestionRow): SurveyQuestion {
  return {
    id: row.id,
    survey_id: row.survey_id,
    question_text: row.question_text,
    question_subtext: row.question_subtext ?? undefined,
    // Stored as an array; unwrap singletons for fixture parity.
    dimension: row.dimension.length === 1 ? row.dimension[0] : row.dimension,
    type: row.type,
    required: row.required,
    options: row.options ?? undefined,
    reverseScore: row.reverse_score,
    min_value: row.min_value ?? undefined,
    min_label: row.min_label ?? undefined,
    max_value: row.max_value ?? undefined,
    max_label: row.max_label ?? undefined,
    defaultValue: row.default_value ?? undefined,
  };
}

function toSurveyResponseMeta(row: SurveyResponseMetaRow): SurveyResponseMetadata {
  return {
    id: row.id,
    survey_id: row.survey_id,
    employee_id: row.employee_id,
    submitted_at: new Date(row.submitted_at),
    avg_score: row.avg_score,
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
