import { Survey, SurveyQuestion, SurveyResponse, SurveyResponseMetadata } from '../types';

export const SurveyQuestionnaire: SurveyQuestion[] = [
  // Part 1: Workload & Job Demands
  {
    id: 0,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'I often feel emotionally drained after a typical workday.',
    dimension: 'workload',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 1,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'My workload feels unmanageable in most weeks.',
    dimension: 'workload',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 2,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: "I feel pressured to work faster than I'm comfortable with to meet targets.",
    dimension: 'workload',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 3,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'My job demands a lot of sustained mental and emotional effort.',
    dimension: 'workload',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 4,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: "Some days I have so much to do that I don't know where to start.",
    dimension: 'workload',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 5,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text:
      'The number of meetings in a typical week prevents me from completing core tasks.',
    dimension: 'workload',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },

  // Part 2: Work–Life Balance & Recovery
  {
    id: 6,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'I have enough energy for my personal life after work.',
    dimension: 'balance',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 7,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'I find it hard to switch off from work during my time off.',
    dimension: 'balance',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 8,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'I feel uneasy about using my leaves or holidays.',
    dimension: 'balance',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 9,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'Weekends or days off leave me feeling recharged.',
    dimension: 'balance',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 10,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'My job interferes with responsibilities at home.',
    dimension: 'balance',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },

  // Part 3: Social Support & Autonomy
  {
    id: 11,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'I feel supported by my teammates.',
    dimension: 'support',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 12,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'My immediate supervisor shows genuine concern for my well-being.',
    dimension: 'support',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 13,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'I have a say in how I plan and do my work.',
    dimension: 'support',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 14,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'I often feel isolated at work, even with my team around.',
    dimension: 'support',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 15,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'I receive regular, constructive feedback that helps me improve.',
    dimension: 'support',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },

  // Part 4: Personal Accomplishment & Engagement
  {
    id: 16,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'I feel proud of the work I accomplish.',
    dimension: 'engagement',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 17,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'I am enthusiastic about my job.',
    dimension: 'engagement',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 18,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'My contributions feel meaningful.',
    dimension: 'engagement',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 19,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: "I feel I'm making a positive difference for customers or the bank.",
    dimension: 'engagement',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 20,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'I feel detached or indifferent toward my work.',
    dimension: 'engagement',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 21,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'I have a clear sense of purpose in my role.',
    dimension: 'engagement',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 22,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'I frequently zone out during work hours.',
    dimension: 'engagement',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 23,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'My work is appreciated by others.',
    dimension: 'engagement',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
  {
    id: 24,
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    question_text: 'I feel inspired by my job or colleagues.',
    dimension: 'engagement',
    type: 'scale',
    reverseScore: false,
    required: true,
    min_value: 1,
    min_label: 'Strongly Disagree',
    max_value: 5,
    max_label: 'Strongly Agree',
  },
];

export const Surveys: Survey[] = [
  {
    id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    created_at: new Date('09-15-2025'),
    created_by: '7f1fcc2a-4025-49e3-9090-bf0ff9fee898',
    num_questions: SurveyQuestionnaire.length,
  },
];
export const SurveyResponseList: SurveyResponseMetadata[] = [
  {
    id: 'd80ae2c8-dcc3-42cd-96d0-c1eb63ca795d',
    survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
    employee_id: '08b6fc43-77e6-4fcf-8ed8-dafc16b4b025',
    submitted_at: new Date('2025-09-15T08:00:00.000Z'),
    avg_score: 3.57,
  },
];

export const SurveyResponses: SurveyResponse[] = [
  {
    id: '5e590000-0000-4000-8000-000000000001',
    response_meta_id: 'd80ae2c8-dcc3-42cd-96d0-c1eb63ca795d',
    question_id: 1,
    response: 4,
    created_at: new Date('2025-09-15T08:00:00.000Z'),
  },
  {
    id: '5e590000-0000-4000-8000-000000000002',
    response_meta_id: 'd80ae2c8-dcc3-42cd-96d0-c1eb63ca795d',
    question_id: 2,
    response: 3,
    created_at: new Date('2025-09-15T08:00:00.000Z'),
  },
  {
    id: '5e590000-0000-4000-8000-000000000003',
    response_meta_id: 'd80ae2c8-dcc3-42cd-96d0-c1eb63ca795d',
    question_id: 3,
    response: 4,
    created_at: new Date('2025-09-15T08:00:00.000Z'),
  },
  {
    id: '5e590000-0000-4000-8000-000000000004',
    response_meta_id: 'd80ae2c8-dcc3-42cd-96d0-c1eb63ca795d',
    question_id: 4,
    response: 2,
    created_at: new Date('2025-09-15T08:00:00.000Z'),
  },
  {
    id: '5e590000-0000-4000-8000-000000000005',
    response_meta_id: 'd80ae2c8-dcc3-42cd-96d0-c1eb63ca795d',
    question_id: 5,
    response: 5,
    created_at: new Date('2025-09-15T08:00:00.000Z'),
  },
  {
    id: '5e590000-0000-4000-8000-000000000006',
    response_meta_id: 'd80ae2c8-dcc3-42cd-96d0-c1eb63ca795d',
    question_id: 6,
    response: 3,
    created_at: new Date('2025-09-15T08:00:00.000Z'),
  },
  {
    id: '5e590000-0000-4000-8000-000000000007',
    response_meta_id: 'd80ae2c8-dcc3-42cd-96d0-c1eb63ca795d',
    question_id: 7,
    response: 4,
    created_at: new Date('2025-09-15T08:00:00.000Z'),
  },
  {
    id: '5e590000-0000-4000-8000-000000000009',
    response_meta_id: 'd80ae2c8-dcc3-42cd-96d0-c1eb63ca795d',
    question_id: 9,
    response: 'Juggling too many tasks at once.',
    created_at: new Date('2025-09-15T08:00:00.000Z'),
  },
  {
    id: '5e590000-0000-4000-8000-000000000010',
    response_meta_id: 'd80ae2c8-dcc3-42cd-96d0-c1eb63ca795d',
    question_id: 10,
    response: 'Weekly sync could be shorter and more focused.',
    created_at: new Date('2025-09-15T08:00:00.000Z'),
  },
];

// // In-memory storage for current user's survey responses
// const currentSurveyResponses: Map<string, SurveyResponse[]> = new Map();
// const currentSurveys: Map<string, Survey[]> = new Map();

// // Generate UUID for surveys/responses
// const generateUUID = (): string => {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//     const r = (Math.random() * 16) | 0;
//     const v = c === 'x' ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// };

// // Create a new survey for an employee
// export const createSurvey = (employeeId: string): Survey => {
//   const survey: Survey = {
//     id: generateUUID(),
//     employee_id: employeeId,
//     submitted_at: new Date(),
//   };

//   const userSurveys = currentSurveys.get(employeeId) || [];
//   userSurveys.push(survey);
//   currentSurveys.set(employeeId, userSurveys);

//   return survey;
// };

// // Add a response to a survey
// export const addSurveyResponse = (
//   surveyId: string,
//   questionId: number,
//   responseValue: number | null,
//   responseText: string | null
// ): SurveyResponse => {
//   const question = SURVEY_QUESTIONS.find((q) => q.id === questionId);
//   if (!question) {
//     throw new Error(`Question with ID ${questionId} not found`);
//   }

//   const response: SurveyResponse = {
//     id: generateUUID(),
//     survey_id: '277068ac-b7a9-45b5-9d41-f66b017509c7',
//     question_id: questionId,
//     question_text: question.question_text,
//     dimension: question.dimension,
//     response: responseValue,
//     response_text: responseText,
//     created_at: new Date(),
//   };

//   // Store in memory by survey ID
//   const surveyResponses = currentSurveyResponses.get(surveyId) || [];
//   surveyResponses.push(response);
//   currentSurveyResponses.set(surveyId, surveyResponses);

//   return response;
// };

// // Get all surveys for an employee
// export const getSurveysForEmployee = (employeeId: string): Survey[] => {
//   return currentSurveys.get(employeeId) || [];
// };

// // Get all responses for a survey
// export const getResponsesForSurvey = (surveyId: string): SurveyResponse[] => {
//   return currentSurveyResponses.get(surveyId) || [];
// };

// // Get the latest survey for an employee
// export const getLatestSurvey = (employeeId: string): Survey | null => {
//   const surveys = getSurveysForEmployee(employeeId);
//   if (surveys.length === 0) return null;

//   return surveys.reduce((latest, current) =>
//     current.submitted_at > latest.submitted_at ? current : latest
//   );
// };

// // Calculate wellness score from survey responses
// export const calculateWellnessScore = (
//   surveyId: string
// ): {
//   overall: number;
//   dimensions: Record<SurveyDimension, number>;
//   metaLevel: number;
// } => {
//   const responses = getResponsesForSurvey(surveyId);
//   const scaleResponses = responses.filter((r) => r.response_value !== null);

//   if (scaleResponses.length === 0) {
//     return { overall: 0, dimensions: {} as Record<SurveyDimension, number>, metaLevel: 0 };
//   }

//   // Group by dimension
//   const dimensionScores: Partial<Record<SurveyDimension, number[]>> = {};
//   scaleResponses.forEach((response) => {
//     const dimension = response.dimension as SurveyDimension;
//     if (!dimensionScores[dimension]) {
//       dimensionScores[dimension] = [];
//     }
//     dimensionScores[dimension]!.push(response.response_value!);
//   });

//   // Calculate average for each dimension
//   const dimensions = {} as Record<SurveyDimension, number>;
//   let totalScore = 0;
//   let dimensionCount = 0;

//   Object.entries(dimensionScores).forEach(([dimension, scores]) => {
//     if (scores.length > 0) {
//       const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
//       dimensions[dimension as SurveyDimension] = avg;

//       // For overall score, invert negative dimensions
//       const adjustedScore =
//         dimension === 'stress' || dimension === 'burnout_risk'
//           ? 6 - avg // Invert stress and burnout (higher is worse)
//           : avg;

//       totalScore += adjustedScore;
//       dimensionCount++;
//     }
//   });

//   const overall = dimensionCount > 0 ? totalScore / dimensionCount : 0;
//   const metaLevel = dimensions.meta_awareness || 0;

//   return { overall, dimensions, metaLevel };
// };

// // Get wellness insights
// export const getWellnessInsights = (surveyId: string): string[] => {
//   const score = calculateWellnessScore(surveyId);
//   const insights: string[] = [];

//   if (score.overall >= 4) {
//     insights.push('🌟 Overall wellness looks great! Keep up the excellent work.');
//   } else if (score.overall >= 3) {
//     insights.push('👍 Solid wellness foundation with some room for improvement.');
//   } else if (score.overall >= 2) {
//     insights.push('⚠️ Some wellness concerns detected. Consider discussing with your manager.');
//   } else {
//     insights.push(
//       🚨 Significant wellness issues identified. Please prioritize self-care and seek support.'
//     );
//   }

//   // Specific dimension insights
//   if (score.dimensions.stress && score.dimensions.stress >= 4) {
//     insights.push('😰 High stress levels detected. Consider stress management techniques.');
//   }

//   if (score.dimensions.burnout_risk && score.dimensions.burnout_risk >= 4) {
//     insights.push('🔥 Burnout risk is high. Time for a break or workload adjustment.');
//   }

//   if (score.dimensions.work_life_balance && score.dimensions.work_life_balance <= 2) {
//     insights.push('⚖️ Work-life balance needs attention. Try setting boundaries.');
//   }

//   if (score.dimensions.meta_awareness && score.dimensions.meta_awareness >= 4) {
//     insights.push(
//       "🎭 High meta-awareness detected! You're fully conscious of the irony of building WorkSight."
//     );
//   }

//   return insights;
// };

// // Clear all survey data for a user (useful for logout)
// export const clearUserSurveyData = (employeeId: string): void => {
//   const userSurveys = getSurveysForEmployee(employeeId);
//   userSurveys.forEach((survey) => {
//     currentSurveyResponses.delete(survey.id);
//   });
//   currentSurveys.delete(employeeId);
// };
