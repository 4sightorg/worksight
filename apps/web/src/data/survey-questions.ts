// Survey questions for WorkSight - with 4sight meta commentary!
import { SURVEY_DIMENSIONS, SurveyQuestion } from '@/types/survey';

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  // Workload questions
  {
    id: 1,
    text: 'How would you rate your current workload?',
    dimension: SURVEY_DIMENSIONS.WORKLOAD,
    type: 'scale',
    required: true,
  },
  {
    id: 2,
    text: 'Do you feel you have enough time to complete your tasks effectively?',
    dimension: SURVEY_DIMENSIONS.WORKLOAD,
    type: 'scale',
    required: true,
  },

  // Stress level questions
  {
    id: 3,
    text: 'How stressed do you feel at work on a typical day?',
    dimension: SURVEY_DIMENSIONS.STRESS,
    type: 'scale',
    required: true,
  },
  {
    id: 4,
    text: 'How often do you feel overwhelmed by your responsibilities?',
    dimension: SURVEY_DIMENSIONS.STRESS,
    type: 'scale',
    required: true,
  },

  // Job satisfaction
  {
    id: 5,
    text: 'How satisfied are you with your current role and responsibilities?',
    dimension: SURVEY_DIMENSIONS.SATISFACTION,
    type: 'scale',
    required: true,
  },
  {
    id: 6,
    text: 'Do you find your work meaningful and engaging?',
    dimension: SURVEY_DIMENSIONS.SATISFACTION,
    type: 'scale',
    required: true,
  },

  // Work-life balance
  {
    id: 7,
    text: 'How well are you able to maintain a healthy work-life balance?',
    dimension: SURVEY_DIMENSIONS.WORK_LIFE_BALANCE,
    type: 'scale',
    required: true,
  },
  {
    id: 8,
    text: 'How often do you work outside of normal business hours?',
    dimension: SURVEY_DIMENSIONS.WORK_LIFE_BALANCE,
    type: 'scale',
    required: true,
  },

  // Team collaboration
  {
    id: 9,
    text: 'How effectively does your team collaborate and communicate?',
    dimension: SURVEY_DIMENSIONS.TEAM_COLLABORATION,
    type: 'scale',
    required: true,
  },
  {
    id: 10,
    text: 'Do you feel supported by your colleagues and manager?',
    dimension: SURVEY_DIMENSIONS.TEAM_COLLABORATION,
    type: 'scale',
    required: true,
  },

  // Burnout risk assessment
  {
    id: 11,
    text: 'How often do you feel emotionally exhausted from your work?',
    dimension: SURVEY_DIMENSIONS.BURNOUT_RISK,
    type: 'scale',
    required: true,
  },
  {
    id: 12,
    text: 'Do you feel energized and motivated about your work?',
    dimension: SURVEY_DIMENSIONS.BURNOUT_RISK,
    type: 'scale',
    required: true,
  },

  // 4sight Meta Questions - Breaking the 4th wall! 🎭
  {
    id: 13,
    text: "How do you feel about being surveyed by a system you're building to survey people?",
    dimension: SURVEY_DIMENSIONS.META_AWARENESS,
    type: 'scale',
    required: true,
  },
  {
    id: 14,
    text: 'On a scale of 1-5, how meta is this experience right now?',
    dimension: SURVEY_DIMENSIONS.META_AWARENESS,
    type: 'scale',
    required: true,
  },
  {
    id: 15,
    text: 'Any additional thoughts on building WorkSight while being WorkSighted?',
    dimension: SURVEY_DIMENSIONS.META_AWARENESS,
    type: 'text',
    required: false,
  },
];

// Scale labels for better UX
export const SCALE_LABELS = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

// Dimension-specific scale labels
export const DIMENSION_SCALE_LABELS: Record<string, Record<number, string>> = {
  [SURVEY_DIMENSIONS.STRESS]: {
    1: 'Not Stressed',
    2: 'Slightly Stressed',
    3: 'Moderately Stressed',
    4: 'Very Stressed',
    5: 'Extremely Stressed',
  },
  [SURVEY_DIMENSIONS.WORKLOAD]: {
    1: 'Very Light',
    2: 'Light',
    3: 'Moderate',
    4: 'Heavy',
    5: 'Overwhelming',
  },
  [SURVEY_DIMENSIONS.WORK_LIFE_BALANCE]: {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Balanced',
    4: 'Good',
    5: 'Excellent',
  },
  [SURVEY_DIMENSIONS.META_AWARENESS]: {
    1: 'Not Meta At All',
    2: 'Slightly Meta',
    3: 'Moderately Meta',
    4: 'Very Meta',
    5: 'MAXIMUM META 🚀',
  },
};
