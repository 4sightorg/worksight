interface SurveyResponse {
  questionId: string;
  value: string | number;
}

interface DimensionResult {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'severe';
  color: string;
  title: string;
  description: string;
}

interface DetailedBurnoutResult {
  overallScore: number;
  overallLevel: 'low' | 'moderate' | 'high' | 'severe';
  workload: DimensionResult;
  balance: DimensionResult;
  support: DimensionResult;
  engagement: DimensionResult;
  recommendations: string[];
}
