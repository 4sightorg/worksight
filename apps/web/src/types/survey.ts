// Survey types based on database schema

export interface Survey {
  id: string;
  employee_id: string;
  submitted_at: Date;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  question_id: number;
  question_text: string;
  dimension: string;
  response_value: number; // 1-5 scale
  response_text?: string;
  created_at: Date;
}

// Survey question structure
export interface SurveyQuestion {
  id: number;
  text: string;
  dimension: string;
  type: 'scale' | 'text';
  required: boolean;
}

// In-memory survey state
export interface SurveyState {
  currentSurvey?: Survey;
  responses: SurveyResponse[];
  currentQuestionIndex: number;
  isCompleted: boolean;
}

// Survey dimensions for WorkSight
export const SURVEY_DIMENSIONS = {
  WORKLOAD: 'workload',
  STRESS: 'stress',
  SATISFACTION: 'satisfaction',
  WORK_LIFE_BALANCE: 'work_life_balance',
  TEAM_COLLABORATION: 'team_collaboration',
  BURNOUT_RISK: 'burnout_risk',
  META_AWARENESS: 'meta_awareness', // 4sight special dimension 🎭
} as const;

export type SurveyDimension = (typeof SURVEY_DIMENSIONS)[keyof typeof SURVEY_DIMENSIONS];
