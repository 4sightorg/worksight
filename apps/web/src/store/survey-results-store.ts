import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SurveyResponse {
  questionId: string;
  value: string | number;
}

export interface DimensionResult {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'severe';
  color: string;
  title: string;
  description: string;
}

export interface DetailedBurnoutResult {
  overallScore: number;
  overallLevel: 'low' | 'moderate' | 'high' | 'severe';
  workload: DimensionResult;
  balance: DimensionResult;
  support: DimensionResult;
  engagement: DimensionResult;
  recommendations: string[];
}

export interface SurveyResultsState {
  currentResults: DetailedBurnoutResult | null;
  currentResponses: SurveyResponse[];
  resultHistory: Array<{
    id: string;
    timestamp: Date;
    results: DetailedBurnoutResult;
    responses: SurveyResponse[];
  }>;

  // Actions
  setCurrentResults: (results: DetailedBurnoutResult | null) => void;
  setCurrentResponses: (responses: SurveyResponse[]) => void;
  saveResults: (results: DetailedBurnoutResult, responses: SurveyResponse[]) => void;
  clearCurrentResults: () => void;
  getLatestResults: () => { results: DetailedBurnoutResult; responses: SurveyResponse[] } | null;
}

export const useSurveyResultsStore = create<SurveyResultsState>()(
  persist(
    (set, get) => ({
      currentResults: null,
      currentResponses: [],
      resultHistory: [],

      setCurrentResults: (results) => set({ currentResults: results }),

      setCurrentResponses: (responses) => set({ currentResponses: responses }),

      saveResults: (results, responses) => {
        const newEntry = {
          id: `survey_${Date.now()}`,
          timestamp: new Date(),
          results,
          responses,
        };

        set((state) => ({
          currentResults: results,
          currentResponses: responses,
          resultHistory: [newEntry, ...state.resultHistory.slice(0, 9)], // Keep last 10 results
        }));
      },

      clearCurrentResults: () =>
        set({
          currentResults: null,
          currentResponses: [],
        }),

      getLatestResults: () => {
        const state = get();
        if (state.currentResults && state.currentResponses.length > 0) {
          return {
            results: state.currentResults,
            responses: state.currentResponses,
          };
        }

        if (state.resultHistory.length > 0) {
          const latest = state.resultHistory[0];
          return {
            results: latest.results,
            responses: latest.responses,
          };
        }

        return null;
      },
    }),
    {
      name: 'survey-results-storage',
      // Only persist essential data
      partialize: (state) => ({
        currentResults: state.currentResults,
        currentResponses: state.currentResponses,
        resultHistory: state.resultHistory,
      }),
    }
  )
);
