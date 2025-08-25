// Survey types and data structures for WorkSight
export type Survey = {
  id: string;
  employee_id: string;
  submitted_at: Date;
};

export type SurveyResponse = {
  id: string;
  survey_id: string;
  question_id: number;
  question_text: string;
  dimension: string;
  response_value: number | null; // 1-5 scale responses
  response_text: string | null; // Text responses
  created_at: Date;
};

// Survey question dimensions for WorkSight
export type SurveyDimension =
  | 'workload'
  | 'stress'
  | 'satisfaction'
  | 'work_life_balance'
  | 'team_collaboration'
  | 'burnout_risk'
  | 'productivity'
  | 'meta_awareness'; // 4sight special dimension 😄

export type SurveyQuestion = {
  id: number;
  question_text: string;
  dimension: SurveyDimension;
  response_type: 'scale' | 'text';
  scale_min?: number;
  scale_max?: number;
  scale_labels?: { min: string; max: string };
};

// Predefined survey questions for WorkSight wellness assessment
export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 1,
    question_text: 'How would you rate your current workload?',
    dimension: 'workload',
    response_type: 'scale',
    scale_min: 1,
    scale_max: 5,
    scale_labels: { min: 'Very Light', max: 'Overwhelming' },
  },
  {
    id: 2,
    question_text: 'How stressed do you feel at work this week?',
    dimension: 'stress',
    response_type: 'scale',
    scale_min: 1,
    scale_max: 5,
    scale_labels: { min: 'Not at all', max: 'Extremely' },
  },
  {
    id: 3,
    question_text: 'How satisfied are you with your current role?',
    dimension: 'satisfaction',
    response_type: 'scale',
    scale_min: 1,
    scale_max: 5,
    scale_labels: { min: 'Very Unsatisfied', max: 'Very Satisfied' },
  },
  {
    id: 4,
    question_text: 'How well are you maintaining work-life balance?',
    dimension: 'work_life_balance',
    response_type: 'scale',
    scale_min: 1,
    scale_max: 5,
    scale_labels: { min: 'Very Poor', max: 'Excellent' },
  },
  {
    id: 5,
    question_text: 'How would you rate team collaboration and communication?',
    dimension: 'team_collaboration',
    response_type: 'scale',
    scale_min: 1,
    scale_max: 5,
    scale_labels: { min: 'Very Poor', max: 'Excellent' },
  },
  {
    id: 6,
    question_text: 'Do you feel at risk of burnout?',
    dimension: 'burnout_risk',
    response_type: 'scale',
    scale_min: 1,
    scale_max: 5,
    scale_labels: { min: 'No risk', max: 'High risk' },
  },
  {
    id: 7,
    question_text: "How productive do you feel you've been this week?",
    dimension: 'productivity',
    response_type: 'scale',
    scale_min: 1,
    scale_max: 5,
    scale_labels: { min: 'Very Low', max: 'Very High' },
  },
  {
    id: 8,
    question_text:
      "On a scale of 1-5, how aware are you that you're building a system to monitor yourself?",
    dimension: 'meta_awareness',
    response_type: 'scale',
    scale_min: 1,
    scale_max: 5,
    scale_labels: { min: 'Blissfully Unaware', max: 'Existentially Terrified' },
  },
  {
    id: 9,
    question_text: 'What specific challenges are you facing this week?',
    dimension: 'stress',
    response_type: 'text',
  },
  {
    id: 10,
    question_text: 'Any suggestions for improving team productivity or wellbeing?',
    dimension: 'satisfaction',
    response_type: 'text',
  },
  {
    id: 11,
    question_text:
      "How does it feel to be tracked by the very system you're building? (Meta question alert! 🚨)",
    dimension: 'meta_awareness',
    response_type: 'text',
  },
];

// In-memory storage for current user's survey responses
const currentSurveyResponses: Map<string, SurveyResponse[]> = new Map();
const currentSurveys: Map<string, Survey[]> = new Map();

// Generate UUID for surveys/responses
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Create a new survey for an employee
export const createSurvey = (employeeId: string): Survey => {
  const survey: Survey = {
    id: generateUUID(),
    employee_id: employeeId,
    submitted_at: new Date(),
  };

  const userSurveys = currentSurveys.get(employeeId) || [];
  userSurveys.push(survey);
  currentSurveys.set(employeeId, userSurveys);

  return survey;
};

// Add a response to a survey
export const addSurveyResponse = (
  surveyId: string,
  questionId: number,
  responseValue: number | null,
  responseText: string | null
): SurveyResponse => {
  const question = SURVEY_QUESTIONS.find((q) => q.id === questionId);
  if (!question) {
    throw new Error(`Question with ID ${questionId} not found`);
  }

  const response: SurveyResponse = {
    id: generateUUID(),
    survey_id: surveyId,
    question_id: questionId,
    question_text: question.question_text,
    dimension: question.dimension,
    response_value: responseValue,
    response_text: responseText,
    created_at: new Date(),
  };

  // Store in memory by survey ID
  const surveyResponses = currentSurveyResponses.get(surveyId) || [];
  surveyResponses.push(response);
  currentSurveyResponses.set(surveyId, surveyResponses);

  return response;
};

// Get all surveys for an employee
export const getSurveysForEmployee = (employeeId: string): Survey[] => {
  return currentSurveys.get(employeeId) || [];
};

// Get all responses for a survey
export const getResponsesForSurvey = (surveyId: string): SurveyResponse[] => {
  return currentSurveyResponses.get(surveyId) || [];
};

// Get the latest survey for an employee
export const getLatestSurvey = (employeeId: string): Survey | null => {
  const surveys = getSurveysForEmployee(employeeId);
  if (surveys.length === 0) return null;

  return surveys.reduce((latest, current) =>
    current.submitted_at > latest.submitted_at ? current : latest
  );
};

// Calculate wellness score from survey responses
export const calculateWellnessScore = (
  surveyId: string
): {
  overall: number;
  dimensions: Record<SurveyDimension, number>;
  metaLevel: number;
} => {
  const responses = getResponsesForSurvey(surveyId);
  const scaleResponses = responses.filter((r) => r.response_value !== null);

  if (scaleResponses.length === 0) {
    return { overall: 0, dimensions: {} as Record<SurveyDimension, number>, metaLevel: 0 };
  }

  // Group by dimension
  const dimensionScores: Partial<Record<SurveyDimension, number[]>> = {};
  scaleResponses.forEach((response) => {
    const dimension = response.dimension as SurveyDimension;
    if (!dimensionScores[dimension]) {
      dimensionScores[dimension] = [];
    }
    dimensionScores[dimension]!.push(response.response_value!);
  });

  // Calculate average for each dimension
  const dimensions = {} as Record<SurveyDimension, number>;
  let totalScore = 0;
  let dimensionCount = 0;

  Object.entries(dimensionScores).forEach(([dimension, scores]) => {
    if (scores.length > 0) {
      const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      dimensions[dimension as SurveyDimension] = avg;

      // For overall score, invert negative dimensions
      const adjustedScore =
        dimension === 'stress' || dimension === 'burnout_risk'
          ? 6 - avg // Invert stress and burnout (higher is worse)
          : avg;

      totalScore += adjustedScore;
      dimensionCount++;
    }
  });

  const overall = dimensionCount > 0 ? totalScore / dimensionCount : 0;
  const metaLevel = dimensions.meta_awareness || 0;

  return { overall, dimensions, metaLevel };
};

// Get wellness insights
export const getWellnessInsights = (surveyId: string): string[] => {
  const score = calculateWellnessScore(surveyId);
  const insights: string[] = [];

  if (score.overall >= 4) {
    insights.push('🌟 Overall wellness looks great! Keep up the excellent work.');
  } else if (score.overall >= 3) {
    insights.push('👍 Solid wellness foundation with some room for improvement.');
  } else if (score.overall >= 2) {
    insights.push('⚠️ Some wellness concerns detected. Consider discussing with your manager.');
  } else {
    insights.push(
      '🚨 Significant wellness issues identified. Please prioritize self-care and seek support.'
    );
  }

  // Specific dimension insights
  if (score.dimensions.stress && score.dimensions.stress >= 4) {
    insights.push('😰 High stress levels detected. Consider stress management techniques.');
  }

  if (score.dimensions.burnout_risk && score.dimensions.burnout_risk >= 4) {
    insights.push('🔥 Burnout risk is high. Time for a break or workload adjustment.');
  }

  if (score.dimensions.work_life_balance && score.dimensions.work_life_balance <= 2) {
    insights.push('⚖️ Work-life balance needs attention. Try setting boundaries.');
  }

  if (score.dimensions.meta_awareness && score.dimensions.meta_awareness >= 4) {
    insights.push(
      "🎭 High meta-awareness detected! You're fully conscious of the irony of building WorkSight."
    );
  }

  return insights;
};

// Clear all survey data for a user (useful for logout)
export const clearUserSurveyData = (employeeId: string): void => {
  const userSurveys = getSurveysForEmployee(employeeId);
  userSurveys.forEach((survey) => {
    currentSurveyResponses.delete(survey.id);
  });
  currentSurveys.delete(employeeId);
};
