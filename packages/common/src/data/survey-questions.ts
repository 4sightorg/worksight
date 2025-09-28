import { SurveyQuestion, Survey, SurveyResponse } from '@worksight/common/types/survey';

// --- Survey questions
export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  // Workload
  {
    id: 1,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: 'How would you rate your current workload?',
    dimension: 'workload',
    type: 'scale',
    required: true,
    reverseScore: false,
    min_value: 1,
    max_value: 5,
    min_label: 'Very Light',
    max_label: 'Overwhelming',
  },
  {
    id: 2,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: 'Do you feel you have enough time to complete your tasks effectively?',
    dimension: 'workload',
    type: 'scale',
    required: true,
    reverseScore: false,
    min_value: 1,
    max_value: 5,
    min_label: 'Very Light',
    max_label: 'Overwhelming',
  },

  // Stress
  {
    id: 3,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: 'How stressed do you feel at work on a typical day?',
    dimension: 'stress',
    type: 'scale',
    required: true,
    reverseScore: false,
    min_value: 1,
    max_value: 5,
    min_label: 'Not Stressed',
    max_label: 'Extremely Stressed',
  },
  {
    id: 4,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: 'How often do you feel overwhelmed by your responsibilities?',
    dimension: 'stress',
    type: 'scale',
    required: true,
    reverseScore: false,
    min_value: 1,
    max_value: 5,
    min_label: 'Not Stressed',
    max_label: 'Extremely Stressed',
  },

  // Job satisfaction
  {
    id: 5,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: 'How satisfied are you with your current role and responsibilities?',
    dimension: 'satisfaction',
    type: 'scale',
    required: true,
    reverseScore: false,
    min_value: 1,
    max_value: 5,
    min_label: 'Very Poor',
    max_label: 'Excellent',
  },
  {
    id: 6,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: 'Do you find your work meaningful and engaging?',
    dimension: 'satisfaction',
    type: 'scale',
    required: true,
    reverseScore: false,
    min_value: 1,
    max_value: 5,
    min_label: 'Very Poor',
    max_label: 'Excellent',
  },

  // Work-life balance
  {
    id: 7,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: 'How well are you able to maintain a healthy work-life balance?',
    dimension: 'work_life_balance',
    type: 'scale',
    required: true,
    reverseScore: false,
    min_value: 1,
    max_value: 5,
    min_label: 'Very Poor',
    max_label: 'Excellent',
  },
  {
    id: 8,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: 'How often do you work outside of normal business hours?',
    dimension: 'work_life_balance',
    type: 'scale',
    required: true,
    reverseScore: true,
    min_value: 1,
    max_value: 5,
    min_label: 'Very Poor',
    max_label: 'Excellent',
  },

  // Team collaboration
  {
    id: 9,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: 'How effectively does your team collaborate and communicate?',
    dimension: 'team_collaboration',
    type: 'scale',
    required: true,
    reverseScore: false,
    min_value: 1,
    max_value: 5,
    min_label: 'Very Poor',
    max_label: 'Excellent',
  },
  {
    id: 10,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: 'Do you feel supported by your colleagues and manager?',
    dimension: 'team_collaboration',
    type: 'scale',
    required: true,
    reverseScore: false,
    min_value: 1,
    max_value: 5,
    min_label: 'Very Poor',
    max_label: 'Excellent',
  },

  // Burnout risk
  {
    id: 11,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: 'How often do you feel emotionally exhausted from your work?',
    dimension: 'burnout_risk',
    type: 'scale',
    required: true,
    reverseScore: false,
    min_value: 1,
    max_value: 5,
    min_label: 'Very Poor',
    max_label: 'Excellent',
  },
  {
    id: 12,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: 'Do you feel energized and motivated about your work?',
    dimension: 'burnout_risk',
    type: 'scale',
    required: true,
    reverseScore: true,
    min_value: 1,
    max_value: 5,
    min_label: 'Very Poor',
    max_label: 'Excellent',
  },

  // Meta-awareness
  {
    id: 13,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: "How do you feel about being surveyed by a system you're building to survey people?",
    dimension: 'meta_awareness',
    type: 'scale',
    required: true,
    reverseScore: false,
    min_value: 1,
    max_value: 5,
    min_label: 'Not Meta At All',
    max_label: 'MAXIMUM META 🚀',
  },
  {
    id: 14,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: 'On a scale of 1-5, how meta is this experience right now?',
    dimension: 'meta_awareness',
    type: 'scale',
    required: true,
    reverseScore: false,
    min_value: 1,
    max_value: 5,
    min_label: 'Not Meta At All',
    max_label: 'MAXIMUM META 🚀',
  },
  {
    id: 15,
    survey_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    question_text: 'Any additional thoughts on building WorkSight while being WorkSighted?',
    dimension: 'meta_awareness',
    type: 'text',
    required: false,
    reverseScore: false,
  },
];

// --- Survey template
export const Surveys: Survey = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  created_by: '7f1fcc2a-4025-49e3-9090-bf0ff9fee898',
  created_at: new Date('2025-09-28T12:00:00.000Z'),
  num_questions: 15,
};

// --- Sample SurveyResponses
export const SURVEY_RESPONSES: SurveyResponse[] = SURVEY_QUESTIONS.map((q) => ({
  id: crypto.randomUUID(), // or any UUID generator
  response_meta_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', // placeholder response metadata ID
  question_id: q.id,
  response:
    q.type === 'scale'
      ? Math.floor(Math.random() * (q.max_value! - q.min_value! + 1)) + q.min_value! // random scale 1-5
      : 'Sample answer', // default text for text questions
  created_at: new Date(),
}));
