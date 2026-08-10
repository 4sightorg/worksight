-- WorkSight attendance schema. Aligns with @worksight/common AttendanceRecord.
-- Apply after 001_core.sql:
--   psql "$DATABASE_URL" -f apps/api/sql/002_attendance.sql

CREATE TABLE IF NOT EXISTS attendance (
  system_id    UUID PRIMARY KEY,
  employee_id  UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  check_in     TIMESTAMPTZ,
  check_out    TIMESTAMPTZ,
  hours_worked NUMERIC(5,2),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (employee_id, date)
);

CREATE INDEX IF NOT EXISTS attendance_employee_id_idx ON attendance (employee_id);
CREATE INDEX IF NOT EXISTS attendance_date_idx ON attendance (date DESC);
