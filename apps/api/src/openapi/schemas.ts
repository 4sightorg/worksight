import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** OpenAPI models mirroring @worksight/common wire shapes. */

export class HealthDto {
  @ApiProperty({ enum: ['ok', 'degraded'] })
  status!: 'ok' | 'degraded';

  @ApiProperty({ description: 'Process uptime in seconds' })
  uptime!: number;

  @ApiProperty({
    enum: ['fixtures', 'postgres', 'unreachable'],
    description: 'Active data source (or connectivity state when Postgres is configured)',
  })
  database!: 'fixtures' | 'postgres' | 'unreachable';
}

export class EmployeeProfileDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'E001' })
  internal_id!: string;

  @ApiProperty({ format: 'email' })
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({
    enum: ['employee', 'team_lead', 'manager', 'admin', 'super_admin', 'guest'],
  })
  role!: string;

  @ApiProperty({
    isArray: true,
    enum: ['frontend', 'backend', 'data', 'sysadmin', 'guest', 'business', 'engineering', ''],
  })
  department!: string[];

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  team?: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  manager_id?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  date_joined!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  created_at!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updated_at!: Date;
}

export class RoleCountDto {
  @ApiProperty()
  role!: string;

  @ApiProperty()
  count!: number;
}

export class DepartmentCountDto {
  @ApiProperty()
  department!: string;

  @ApiProperty()
  count!: number;
}

export class EmployeeStatsDto {
  @ApiProperty()
  totalEmployees!: number;

  @ApiProperty({ type: [RoleCountDto] })
  roles!: RoleCountDto[];

  @ApiProperty({ type: [DepartmentCountDto] })
  departments!: DepartmentCountDto[];

  @ApiProperty({ description: 'Employees with no manager_id' })
  adminCount!: number;
}

export class TeamDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  department!: string;

  @ApiProperty({ format: 'uuid' })
  manager_id!: string;

  @ApiProperty({ type: [String], format: 'uuid' })
  member_ids!: string[];

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  parent_team_id?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  created_at!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updated_at!: Date;
}

export class AssignmentDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  employee_id!: string;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  source_id!: string | null;

  @ApiPropertyOptional({ nullable: true })
  external_id!: string | null;

  @ApiProperty({
    enum: ['feature', 'bug', 'task', 'research', 'documentation', 'infrastructure'],
  })
  type!: string;

  @ApiPropertyOptional({ nullable: true })
  title!: string | null;

  @ApiProperty({ enum: ['todo', 'in_progress', 'completed'] })
  status!: string;

  @ApiPropertyOptional({ nullable: true })
  sprint!: string | null;

  @ApiPropertyOptional({ nullable: true })
  epic!: string | null;

  @ApiPropertyOptional({ nullable: true })
  points!: number | null;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'] })
  priority!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  created_at!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updated_at!: Date;
}

export class ActivityDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  source_id!: string;

  @ApiProperty()
  external_id!: string;

  @ApiProperty({ format: 'uuid' })
  employee_id!: string;

  @ApiProperty({
    enum: [
      'code_commit',
      'task_update',
      'task_creation',
      'communication',
      'research',
      'incident_response',
      'hotfix',
      'documentation',
    ],
  })
  type!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  timestamp!: Date;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  is_after_hours!: boolean;

  @ApiProperty()
  is_weekend!: boolean;

  @ApiProperty()
  is_urgent!: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  created_at!: Date;
}

export class TaskStatsDto {
  @ApiProperty()
  totalTasks!: number;

  @ApiProperty()
  completedTasks!: number;

  @ApiProperty({ description: 'Percent of tasks completed (0–100)' })
  completionRate!: number;

  @ApiProperty()
  totalStoryPoints!: number;

  @ApiProperty()
  completedStoryPoints!: number;

  @ApiProperty({ description: 'Percent of story points completed (0–100)' })
  storyPointsCompletionRate!: number;

  @ApiProperty()
  totalActivities!: number;

  @ApiProperty()
  afterHoursActivities!: number;

  @ApiProperty()
  weekendActivities!: number;

  @ApiProperty()
  urgentActivities!: number;

  @ApiProperty({ description: 'Derived score; lower when after-hours/weekend activity is high' })
  workLifeBalanceScore!: number;
}

export class AttendanceRecordDto {
  @ApiProperty({ format: 'uuid' })
  system_id!: string;

  @ApiProperty({ format: 'uuid' })
  employee_id!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  date!: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  check_in!: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  check_out!: Date | null;

  @ApiPropertyOptional({ nullable: true })
  hours_worked!: number | null;

  @ApiProperty({ type: String, format: 'date-time' })
  created_at!: Date;
}

export class AttendanceStatsDto {
  @ApiProperty()
  totalRecords!: number;

  @ApiProperty()
  totalHours!: number;

  @ApiProperty()
  daysPresent!: number;

  @ApiProperty()
  averageHours!: number;
}

export class SurveyDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  created_by!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  created_at!: Date;

  @ApiProperty()
  num_questions!: number;
}

export class SurveyQuestionDto {
  @ApiProperty()
  id!: number;

  @ApiProperty({ format: 'uuid' })
  survey_id!: string;

  @ApiProperty()
  question_text!: string;

  @ApiPropertyOptional()
  question_subtext?: string;

  @ApiProperty({
    description: 'Wellness dimension label, or a list of dimensions',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  dimension!: string | string[];

  @ApiProperty({ enum: ['scale', 'text', 'radio', 'number', 'email'] })
  type!: string;

  @ApiProperty()
  required!: boolean;

  @ApiPropertyOptional({ type: [String] })
  options?: string[];

  @ApiProperty()
  reverseScore!: boolean;

  @ApiPropertyOptional()
  min_value?: number;

  @ApiPropertyOptional()
  min_label?: string;

  @ApiPropertyOptional()
  max_value?: number;

  @ApiPropertyOptional()
  max_label?: string;

  @ApiPropertyOptional({ oneOf: [{ type: 'string' }, { type: 'number' }] })
  defaultValue?: string | number;
}

export class SurveyResponseMetadataDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  survey_id!: string;

  @ApiProperty({ format: 'uuid' })
  employee_id!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  submitted_at!: Date;

  @ApiPropertyOptional({ nullable: true, description: 'Mean of numeric answers (2 dp), or null' })
  avg_score!: number | null;
}

export class SurveyAnswerDto {
  @ApiProperty({ minimum: 0 })
  question_id!: number;

  @ApiPropertyOptional({
    nullable: true,
    oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'null' }],
  })
  response!: string | number | null;
}

export class SurveySubmissionDto {
  @ApiProperty({ format: 'uuid' })
  employee_id!: string;

  @ApiProperty({ type: [SurveyAnswerDto], minItems: 1 })
  answers!: SurveyAnswerDto[];
}
