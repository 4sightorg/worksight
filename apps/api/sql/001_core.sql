-- WorkSight core schema. Aligns with @worksight/common EmployeeProfile / Team /
-- Assignment / Activity. Apply with:
--   psql "$DATABASE_URL" -f apps/api/sql/001_core.sql
-- Prefer a direct Postgres URL or a PgBouncer transaction-pool URL; the Nest
-- API uses node-postgres against DATABASE_URL and does not go through PostgREST.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS employees (
  id            UUID PRIMARY KEY,
  internal_id   TEXT NOT NULL UNIQUE,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL
                CHECK (role IN ('employee','team_lead','manager','admin','super_admin','guest')),
  department    TEXT[] NOT NULL DEFAULT '{}',
  team_id       UUID,
  manager_id    UUID REFERENCES employees(id) ON DELETE SET NULL,
  date_joined   TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teams (
  id              UUID PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT,
  department      TEXT NOT NULL,
  manager_id      UUID NOT NULL REFERENCES employees(id),
  member_ids      UUID[] NOT NULL DEFAULT '{}',
  parent_team_id  UUID REFERENCES teams(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE employees
  DROP CONSTRAINT IF EXISTS employees_team_id_fkey;
ALTER TABLE employees
  ADD CONSTRAINT employees_team_id_fkey
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS assignments (
  id           UUID PRIMARY KEY,
  employee_id  UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  source_id    UUID,
  external_id  TEXT,
  type         TEXT NOT NULL
               CHECK (type IN ('feature','bug','task','research','documentation','infrastructure')),
  title        TEXT,
  status       TEXT NOT NULL DEFAULT 'todo'
               CHECK (status IN ('todo','in_progress','completed')),
  sprint       TEXT,
  epic         TEXT,
  points       INTEGER,
  priority     TEXT NOT NULL DEFAULT 'low'
               CHECK (priority IN ('low','medium','high','critical')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS assignments_employee_id_idx ON assignments (employee_id);

CREATE TABLE IF NOT EXISTS activities (
  id             UUID PRIMARY KEY,
  source_id      UUID NOT NULL,
  external_id    TEXT NOT NULL,
  employee_id    UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  type           TEXT NOT NULL
                 CHECK (type IN (
                   'code_commit','task_update','task_creation','communication',
                   'research','incident_response','hotfix','documentation'
                 )),
  timestamp      TIMESTAMPTZ NOT NULL,
  description    TEXT NOT NULL,
  is_after_hours BOOLEAN NOT NULL DEFAULT false,
  is_weekend     BOOLEAN NOT NULL DEFAULT false,
  is_urgent      BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activities_employee_id_idx ON activities (employee_id);
CREATE INDEX IF NOT EXISTS activities_timestamp_idx ON activities (timestamp DESC);
