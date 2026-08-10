/**
 * Seed Neon/local Postgres from `@worksight/common` fixtures.
 *
 *   DATABASE_URL=postgres://... pnpm --filter @worksight/api db:seed
 */
import 'dotenv/config';

import {
  Activities,
  Assignments,
  DataSources,
  Employees,
  Teams,
} from '@worksight/common';
import { createDatabase } from './client';
import { normalizeOptionalId } from './mappers';
import { activities, assignments, dataSources, employees, teams } from './schema';

async function seed() {
  const handle = createDatabase(process.env.DATABASE_URL);
  if (!handle) {
    throw new Error('DATABASE_URL is required to seed');
  }

  const { db, sql } = handle;

  console.log('Seeding WorkSight tables from @worksight/common fixtures…');

  await db.delete(activities);
  await db.delete(assignments);
  await db.delete(teams);
  await db.delete(employees);
  await db.delete(dataSources);

  await db.insert(dataSources).values(
    DataSources.map(ds => ({
      id: ds.id,
      name: ds.name,
      type: [...ds.type],
      baseUrl: ds.base_url,
      isActive: ds.is_active,
      modules: [...ds.modules],
      createdAt: ds.created_at,
      updatedAt: ds.updated_at,
    }))
  );

  await db.insert(employees).values(
    Employees.map(e => ({
      id: e.id,
      internalId: e.internal_id,
      email: e.email,
      name: e.name,
      role: e.role,
      department: [...e.department],
      team: e.team ?? null,
      managerId: normalizeOptionalId(e.manager_id),
      dateJoined: e.date_joined,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    }))
  );

  await db.insert(teams).values(
    Teams.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description ?? null,
      department: t.department,
      managerId: t.manager_id,
      memberIds: [...t.member_ids],
      parentTeamId: t.parent_team_id ?? null,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }))
  );

  await db.insert(assignments).values(
    Assignments.map(a => ({
      id: a.id,
      employeeId: a.employee_id,
      sourceId: a.source_id,
      externalId: a.external_id,
      type: a.type,
      title: a.title,
      status: a.status,
      sprint: a.sprint,
      epic: a.epic,
      points: a.points,
      priority: a.priority,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    }))
  );

  await db.insert(activities).values(
    Activities.map(a => ({
      id: a.id,
      sourceId: a.source_id,
      externalId: a.external_id,
      employeeId: a.employee_id,
      type: a.type,
      timestamp: a.timestamp,
      description: a.description,
      isAfterHours: a.is_after_hours,
      isWeekend: a.is_weekend,
      isUrgent: a.is_urgent,
      createdAt: a.created_at,
    }))
  );

  console.log(
    `Done: ${DataSources.length} data sources, ${Employees.length} employees, ${Teams.length} teams, ${Assignments.length} assignments, ${Activities.length} activities`
  );

  await sql.end({ timeout: 5 });
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
