import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SurveyResponse {
  questionId: string;
  value: string | number | boolean | string[];
}

export interface SurveyResults {
  overallScore: number;
  overallLevel: string;
  workload: { score: number; level: string };
  balance: { score: number; level: string };
  support: { score: number; level: string };
  engagement: { score: number; level: string };
  recommendations: string[];
  timestamp: string;
}

interface SurveyState {
  // Current survey session
  currentResponses: SurveyResponse[];
  currentStep: number;
  isCompleted: boolean;

  // Results and history
  latestResults: SurveyResults | null;
  resultHistory: Array<{
    results: SurveyResults;
    timestamp: string;
    userId: string;
  }>;

  // Actions
  addResponse: (response: SurveyResponse) => void;
  updateResponse: (questionId: string, value: any) => void;
  setStep: (step: number) => void;
  setResults: (results: SurveyResults) => void;
  completeSurvey: () => void;
  resetSurvey: () => void;
  getLatestResults: () => { results: SurveyResults; timestamp: string } | null;
}

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set, get) => ({
      currentResponses: [],
      currentStep: 0,
      isCompleted: false,
      latestResults: null,
      resultHistory: [],

      addResponse: (response) =>
        set((state) => ({
          currentResponses: [
            ...state.currentResponses.filter((r) => r.questionId !== response.questionId),
            response,
          ],
        })),

      updateResponse: (questionId, value) =>
        set((state) => ({
          currentResponses: state.currentResponses.map((r) =>
            r.questionId === questionId ? { ...r, value } : r
          ),
        })),

      setStep: (currentStep) => set({ currentStep }),

      setResults: (results) =>
        set((state) => {
          const timestamp = new Date().toISOString();
          const newHistoryEntry = {
            results,
            timestamp,
            userId: 'current-user', // This should come from auth store
          };

          return {
            latestResults: results,
            resultHistory: [newHistoryEntry, ...state.resultHistory.slice(0, 9)], // Keep last 10
          };
        }),

      completeSurvey: () => set({ isCompleted: true }),

      resetSurvey: () =>
        set({
          currentResponses: [],
          currentStep: 0,
          isCompleted: false,
        }),

      getLatestResults: () => {
        const state = get();
        if (state.resultHistory.length > 0) {
          return state.resultHistory[0];
        }
        return null;
      },
    }),
    {
      name: 'worksight-survey',
      partialize: (state) => ({
        latestResults: state.latestResults,
        resultHistory: state.resultHistory,
      }),
    }
  )
);
