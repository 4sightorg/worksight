-- WorkSight survey schema. Aligns with @worksight/common Survey /
-- SurveyQuestion / SurveyResponseMetadata / SurveyResponse. Apply after
-- 001_core.sql:
--   psql "$DATABASE_URL" -f apps/api/sql/003_surveys.sql

CREATE TABLE IF NOT EXISTS surveys (
  id            UUID PRIMARY KEY,
  created_by    UUID NOT NULL REFERENCES employees(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  num_questions INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS survey_questions (
  survey_id        UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  id               INTEGER NOT NULL,
  question_text    TEXT NOT NULL,
  question_subtext TEXT,
  -- SurveyQuestion.dimension is string | string[]; stored uniformly as an array.
  dimension        TEXT[] NOT NULL DEFAULT '{}',
  type             TEXT NOT NULL
                   CHECK (type IN ('scale','text','radio','number','email')),
  required         BOOLEAN NOT NULL DEFAULT true,
  options          TEXT[],
  reverse_score    BOOLEAN NOT NULL DEFAULT false,
  min_value        DOUBLE PRECISION,
  min_label        TEXT,
  max_value        DOUBLE PRECISION,
  max_label        TEXT,
  default_value    JSONB,
  PRIMARY KEY (survey_id, id)
);

CREATE TABLE IF NOT EXISTS survey_response_meta (
  id           UUID PRIMARY KEY,
  survey_id    UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  employee_id  UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  avg_score    DOUBLE PRECISION
);

CREATE INDEX IF NOT EXISTS survey_response_meta_employee_id_idx
  ON survey_response_meta (employee_id);

CREATE TABLE IF NOT EXISTS survey_responses (
  id               UUID PRIMARY KEY,
  response_meta_id UUID NOT NULL REFERENCES survey_response_meta(id) ON DELETE CASCADE,
  question_id      INTEGER NOT NULL,
  -- string | number | null over the wire; JSONB keeps the type intact.
  response         JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS survey_responses_meta_idx
  ON survey_responses (response_meta_id);
