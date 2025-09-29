// In-memory survey management for offline mode
'use client';

import { SURVEY_QUESTIONS } from '@/data/survey-questions';
import { Survey, SurveyResponse, SurveyState } from '@/types/survey';

// In-memory storage for current session
let currentSurveyState: SurveyState = {
  responses: [],
  currentQuestionIndex: 0,
  isCompleted: false,
};

// Generate UUID for offline mode
const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Create a new survey for an employee
export const createSurvey = (employeeId: string): Survey => {
  const survey: Survey = {
    id: generateId(),
    employee_id: employeeId,
    submitted_at: new Date(),
  };

  currentSurveyState = {
    currentSurvey: survey,
    responses: [],
    currentQuestionIndex: 0,
    isCompleted: false,
  };

  return survey;
};

// Add a response to the current survey
export const addSurveyResponse = (
  questionId: number,
  responseValue?: number,
  responseText?: string
): void => {
  if (!currentSurveyState.currentSurvey) {
    throw new Error('No active survey');
  }

  const question = SURVEY_QUESTIONS.find((q) => q.id === questionId);
  if (!question) {
    throw new Error('Question not found');
  }

  const response: SurveyResponse = {
    id: generateId(),
    survey_id: currentSurveyState.currentSurvey.id,
    question_id: questionId,
    question_text: question.text,
    dimension: question.dimension,
    response_value: responseValue || 0,
    response_text: responseText,
    created_at: new Date(),
  };

  // Remove existing response for this question if any
  currentSurveyState.responses = currentSurveyState.responses.filter(
    (r) => r.question_id !== questionId
  );

  // Add new response
  currentSurveyState.responses.push(response);
};

// Get current survey state
export const getCurrentSurveyState = (): SurveyState => {
  return { ...currentSurveyState };
};

// Move to next question
export const nextQuestion = (): void => {
  if (currentSurveyState.currentQuestionIndex < SURVEY_QUESTIONS.length - 1) {
    currentSurveyState.currentQuestionIndex++;
  }
};

// Move to previous question
export const previousQuestion = (): void => {
  if (currentSurveyState.currentQuestionIndex > 0) {
    currentSurveyState.currentQuestionIndex--;
  }
};

// Go to specific question
export const goToQuestion = (index: number): void => {
  if (index >= 0 && index < SURVEY_QUESTIONS.length) {
    currentSurveyState.currentQuestionIndex = index;
  }
};

// Complete the survey
export const completeSurvey = (): void => {
  if (!currentSurveyState.currentSurvey) {
    throw new Error('No active survey');
  }

  currentSurveyState.isCompleted = true;
  currentSurveyState.currentSurvey.submitted_at = new Date();

  // In a real app, this would save to database
  console.warn('📊 Survey completed!', {
    survey: currentSurveyState.currentSurvey,
    responses: currentSurveyState.responses,
  });
};

// Reset survey state (for new survey or logout)
export const resetSurvey = (): void => {
  currentSurveyState = {
    responses: [],
    currentQuestionIndex: 0,
    isCompleted: false,
  };
};

// Get response for a specific question
export const getResponseForQuestion = (questionId: number): SurveyResponse | undefined => {
  return currentSurveyState.responses.find((r) => r.question_id === questionId);
};

// Check if survey is valid for submission
export const isSurveyValid = (): boolean => {
  const requiredQuestions = SURVEY_QUESTIONS.filter((q) => q.required);
  const answeredRequiredQuestions = requiredQuestions.filter((q) =>
    currentSurveyState.responses.some((r) => r.question_id === q.id)
  );

  return answeredRequiredQuestions.length === requiredQuestions.length;
};

// Get survey progress percentage
export const getSurveyProgress = (): number => {
  const totalQuestions = SURVEY_QUESTIONS.length;
  const answeredQuestions = currentSurveyState.responses.length;
  return Math.round((answeredQuestions / totalQuestions) * 100);
};

// Get survey analytics (for fun meta stats)
export const getSurveyAnalytics = () => {
  const responses = currentSurveyState.responses;

  // Calculate dimension averages
  const dimensionAverages: Record<string, number> = {};
  const dimensionCounts: Record<string, number> = {};

  responses.forEach((response) => {
    if (response.response_value > 0) {
      if (!dimensionAverages[response.dimension]) {
        dimensionAverages[response.dimension] = 0;
        dimensionCounts[response.dimension] = 0;
      }
      dimensionAverages[response.dimension] += response.response_value;
      dimensionCounts[response.dimension]++;
    }
  });

  // Calculate averages
  Object.keys(dimensionAverages).forEach((dimension) => {
    dimensionAverages[dimension] = dimensionAverages[dimension] / dimensionCounts[dimension];
  });

  // Meta level calculation 🎭
  const metaResponses = responses.filter((r) => r.dimension === 'meta_awareness');
  const metaLevel =
    metaResponses.length > 0
      ? metaResponses.reduce((sum, r) => sum + r.response_value, 0) / metaResponses.length
      : 0;

  return {
    totalResponses: responses.length,
    dimensionAverages,
    metaLevel,
    isMetaOverload: metaLevel > 4,
    fourthWallStatus: metaLevel > 4 ? 'Completely Shattered' : 'Holding Strong',
  };
};
