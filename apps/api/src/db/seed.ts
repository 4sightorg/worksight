/**
 * Seed Postgres from @worksight/common fixtures.
 *
 *   DATABASE_URL=postgresql://… pnpm --filter @worksight/api seed
 *
 * Idempotent: truncates core tables then reloads. Requires 001_core.sql applied.
 */
import {
  Activities,
  Assignments,
  Attendance,
  Employees,
  SurveyQuestionnaire,
  SurveyResponseList,
  SurveyResponses,
  Surveys,
  Teams,
} from '@worksight/common';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Pool } from 'pg';

/** Load apps/api/.env when present (CI usually injects DATABASE_URL directly). */
function loadLocalEnv(): void {
  const envPath = join(__dirname, '..', '..', '.env');
  if (!existsSync(envPath) || process.env.DATABASE_URL) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadLocalEnv();

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error('DATABASE_URL is required');
  }

  const pool = new Pool({ connectionString: url });
  const client = await pool.connect();

  try {
    for (const file of ['001_core.sql', '002_attendance.sql', '003_surveys.sql']) {
      const schemaSql = readFileSync(join(__dirname, '..', '..', 'sql', file), 'utf8');
      await client.query(schemaSql);
    }

    await client.query('BEGIN');
    await client.query(
      `TRUNCATE survey_responses, survey_response_meta, survey_questions, surveys,
               attendance, activities, assignments, teams, employees
       RESTART IDENTITY CASCADE`
    );

    // Insert managers before reports so manager_id FKs resolve.
    const ordered = [...Employees].sort((a, b) => {
      const aHas = a.manager_id ? 1 : 0;
      const bHas = b.manager_id ? 1 : 0;
      return aHas - bHas;
    });

    for (const employee of ordered) {
      await client.query(
        `INSERT INTO employees
           (id, internal_id, email, name, role, department, team_id, manager_id,
            date_joined, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          employee.id,
          employee.internal_id,
          employee.email,
          employee.name,
          employee.role,
          employee.department,
          employee.team ?? null,
          employee.manager_id ?? null,
          employee.date_joined,
          employee.created_at,
          employee.updated_at,
        ]
      );
    }

    for (const team of Teams) {
      await client.query(
        `INSERT INTO teams
           (id, name, description, department, manager_id, member_ids,
            parent_team_id, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          team.id,
          team.name,
          team.description ?? null,
          team.department,
          team.manager_id,
          team.member_ids,
          team.parent_team_id ?? null,
          team.created_at,
          team.updated_at,
        ]
      );
    }

    for (const assignment of Assignments) {
      await client.query(
        `INSERT INTO assignments
           (id, employee_id, source_id, external_id, type, title, status,
            sprint, epic, points, priority, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          assignment.id,
          assignment.employee_id,
          assignment.source_id,
          assignment.external_id,
          assignment.type,
          assignment.title,
          assignment.status,
          assignment.sprint,
          assignment.epic,
          assignment.points,
          assignment.priority,
          assignment.created_at,
          assignment.updated_at,
        ]
      );
    }

    for (const activity of Activities) {
      await client.query(
        `INSERT INTO activities
           (id, source_id, external_id, employee_id, type, timestamp,
            description, is_after_hours, is_weekend, is_urgent, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          activity.id,
          activity.source_id,
          activity.external_id,
          activity.employee_id,
          activity.type,
          activity.timestamp,
          activity.description,
          activity.is_after_hours,
          activity.is_weekend,
          activity.is_urgent,
          activity.created_at,
        ]
      );
    }

    for (const record of Attendance) {
      await client.query(
        `INSERT INTO attendance
           (system_id, employee_id, date, check_in, check_out, hours_worked, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          record.system_id,
          record.employee_id,
          record.date,
          record.check_in,
          record.check_out,
          record.hours_worked,
          record.created_at,
        ]
      );
    }

    for (const survey of Surveys) {
      await client.query(
        `INSERT INTO surveys (id, created_by, created_at, num_questions)
         VALUES ($1,$2,$3,$4)`,
        [survey.id, survey.created_by, survey.created_at, survey.num_questions]
      );
    }

    for (const question of SurveyQuestionnaire) {
      await client.query(
        `INSERT INTO survey_questions
           (survey_id, id, question_text, question_subtext, dimension, type,
            required, options, reverse_score, min_value, min_label, max_value,
            max_label, default_value)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [
          question.survey_id,
          question.id,
          question.question_text,
          question.question_subtext ?? null,
          Array.isArray(question.dimension) ? question.dimension : [question.dimension],
          question.type,
          question.required,
          question.options ?? null,
          question.reverseScore,
          question.min_value ?? null,
          question.min_label ?? null,
          question.max_value ?? null,
          question.max_label ?? null,
          question.defaultValue === undefined ? null : JSON.stringify(question.defaultValue),
        ]
      );
    }

    for (const meta of SurveyResponseList) {
      await client.query(
        `INSERT INTO survey_response_meta (id, survey_id, employee_id, submitted_at, avg_score)
         VALUES ($1,$2,$3,$4,$5)`,
        [meta.id, meta.survey_id, meta.employee_id, meta.submitted_at, meta.avg_score]
      );
    }

    for (const response of SurveyResponses) {
      await client.query(
        `INSERT INTO survey_responses (id, response_meta_id, question_id, response, created_at)
         VALUES ($1,$2,$3,$4,$5)`,
        [
          response.id,
          response.response_meta_id,
          response.question_id,
          response.response === null ? null : JSON.stringify(response.response),
          response.created_at,
        ]
      );
    }

    await client.query('COMMIT');

    const counts = await client.query(
      `SELECT
         (SELECT count(*)::int FROM employees) AS employees,
         (SELECT count(*)::int FROM teams) AS teams,
         (SELECT count(*)::int FROM assignments) AS assignments,
         (SELECT count(*)::int FROM activities) AS activities,
         (SELECT count(*)::int FROM attendance) AS attendance,
         (SELECT count(*)::int FROM surveys) AS surveys,
         (SELECT count(*)::int FROM survey_questions) AS survey_questions,
         (SELECT count(*)::int FROM survey_response_meta) AS survey_submissions,
         (SELECT count(*)::int FROM survey_responses) AS survey_responses`
    );
    console.log('Seeded', counts.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
