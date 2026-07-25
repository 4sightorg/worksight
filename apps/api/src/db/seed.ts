/**
 * Seed Postgres from @worksight/common fixtures.
 *
 *   DATABASE_URL=postgresql://… pnpm --filter @worksight/api seed
 *
 * Idempotent: truncates core tables then reloads. Requires 001_core.sql applied.
 */
import { Activities, Assignments, Attendance, Employees, Teams } from '@worksight/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Pool } from 'pg';

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error('DATABASE_URL is required');
  }

  const pool = new Pool({ connectionString: url });
  const client = await pool.connect();

  try {
    for (const file of ['001_core.sql', '002_attendance.sql']) {
      const schemaSql = readFileSync(join(__dirname, '..', '..', 'sql', file), 'utf8');
      await client.query(schemaSql);
    }

    await client.query('BEGIN');
    await client.query(
      `TRUNCATE attendance, activities, assignments, teams, employees RESTART IDENTITY CASCADE`
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

    await client.query('COMMIT');

    const counts = await client.query(
      `SELECT
         (SELECT count(*)::int FROM employees) AS employees,
         (SELECT count(*)::int FROM teams) AS teams,
         (SELECT count(*)::int FROM assignments) AS assignments,
         (SELECT count(*)::int FROM activities) AS activities,
         (SELECT count(*)::int FROM attendance) AS attendance`
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
