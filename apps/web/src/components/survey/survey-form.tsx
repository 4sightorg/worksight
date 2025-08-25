'use client';

import { useAuth } from '@/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Employees } from '@/data/employees';
import {
  SURVEY_QUESTIONS,
  addSurveyResponse,
  calculateWellnessScore,
  clearUserSurveyData,
  createSurvey,
  getLatestSurvey,
  getWellnessInsights,
  type Survey,
} from '@/data/surveys';
import { useSurveyResultsStore } from '@/store/survey-results-store';
import { useEffect, useState } from 'react';

// Simple RadioGroup component since we don't have shadcn's radio-group
const RadioGroup = ({
  value: _value,
  onValueChange: _onValueChange,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) => (
  <div role="radiogroup" className="space-y-2">
    {children}
  </div>
);

const RadioGroupItem = ({ value, id }: { value: string; id: string }) => (
  <input
    type="radio"
    value={value}
    id={id}
    name={id.split('-')[0]}
    className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
  />
);

export function SurveyComponent() {
  const { user } = useAuth();
  const { saveResults } = useSurveyResultsStore();
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Map<number, { value?: number; text?: string }>>(
    new Map()
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [wellnessScore, setWellnessScore] = useState<{
    overall: number;
    dimensions: Record<string, number>;
    metaLevel: number;
  } | null>(null);
  const [insights, setInsights] = useState<string[]>([]);

  // Find current employee
  const currentEmployee = user
    ? Object.entries(Employees).find(([_, emp]) => emp.email === user.email)
    : null;
  const employeeId = currentEmployee ? currentEmployee[0] : null;

  const currentQuestion = SURVEY_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / SURVEY_QUESTIONS.length) * 100;

  useEffect(() => {
    // Check if user has already taken a survey in this session
    if (employeeId) {
      const latestSurvey = getLatestSurvey(employeeId);
      if (latestSurvey) {
        const score = calculateWellnessScore(latestSurvey.id);
        if (score.overall > 0) {
          // Has responses
          setCurrentSurvey(latestSurvey);
          setWellnessScore(score);
          setInsights(getWellnessInsights(latestSurvey.id));
          setIsCompleted(true);
        }
      }
    }
  }, [employeeId]);

  const startSurvey = () => {
    if (!employeeId) return;

    const survey = createSurvey(employeeId);
    setCurrentSurvey(survey);
    setCurrentQuestionIndex(0);
    setResponses(new Map());
    setIsCompleted(false);
  };

  const handleResponse = (value?: number, text?: string) => {
    const newResponses = new Map(responses);
    newResponses.set(currentQuestion.id, { value, text });
    setResponses(newResponses);
  };

  const nextQuestion = () => {
    if (!currentSurvey) return;

    // Save current response
    const response = responses.get(currentQuestion.id);
    if (response) {
      addSurveyResponse(
        currentSurvey.id,
        currentQuestion.id,
        response.value || null,
        response.text || null
      );
    }

    if (currentQuestionIndex < SURVEY_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Survey completed
      completeSurvey();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const completeSurvey = () => {
    if (!currentSurvey) return;

    const score = calculateWellnessScore(currentSurvey.id);
    const surveyInsights = getWellnessInsights(currentSurvey.id);

    setWellnessScore(score);
    setInsights(surveyInsights);
    setIsCompleted(true);

    // Convert wellness survey data to burnout assessment format for the store
    const getLevel = (score: number): 'low' | 'moderate' | 'high' | 'severe' => {
      if (score >= 4) return 'low';
      if (score >= 3) return 'moderate';
      if (score >= 2) return 'high';
      return 'severe';
    };

    const burnoutResults = {
      overallScore: score.overall * 20, // Convert 0-5 scale to 0-100
      overallLevel: getLevel(score.overall),
      workload: {
        score: score.dimensions.workload * 20,
        level: getLevel(score.dimensions.workload),
        color: 'text-primary',
        title: 'Workload',
        description: 'Overall workload assessment',
      },
      balance: {
        score: score.dimensions.work_life_balance * 20,
        level: getLevel(score.dimensions.work_life_balance),
        color: 'text-primary',
        title: 'Work-Life Balance',
        description: 'Work-life balance assessment',
      },
      support: {
        score: score.dimensions.team_collaboration * 20,
        level: getLevel(score.dimensions.team_collaboration),
        color: 'text-primary',
        title: 'Support',
        description: 'Team collaboration and support',
      },
      engagement: {
        score: score.dimensions.stress * 20,
        level: getLevel(score.dimensions.stress),
        color: 'text-primary',
        title: 'Engagement',
        description: 'Work engagement level',
      },
      recommendations: surveyInsights,
    };

    const surveyResponses = Array.from(responses.entries()).map(([questionId, response]) => ({
      questionId: questionId.toString(),
      value: response.value || response.text || '',
    }));

    // Save results to store with correct arguments
    saveResults(burnoutResults, surveyResponses);
  };

  const retakeSurvey = () => {
    if (employeeId) {
      clearUserSurveyData(employeeId);
      setCurrentSurvey(null);
      setIsCompleted(false);
      setCurrentQuestionIndex(0);
      setResponses(new Map());
      setWellnessScore(null);
      setInsights([]);
    }
  };

  if (!user || !employeeId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wellness Survey</CardTitle>
          <CardDescription>Please log in to take the wellness survey</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isCompleted && wellnessScore) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Wellness Survey Complete
              <Badge variant="outline">Session Completed</Badge>
            </CardTitle>
            <CardDescription>Thank you for sharing your feedback, {user.name}!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-primary text-3xl font-bold">
                  {wellnessScore.overall.toFixed(1)}/5.0
                </div>
                <p className="text-muted-foreground">Overall Wellness Score</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {Object.entries(wellnessScore.dimensions).map(([dimension, score]) => (
                  <div key={dimension} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{dimension.replace('_', ' ')}</span>
                      <span className="font-medium">{(score as number).toFixed(1)}/5</span>
                    </div>
                    <Progress value={((score as number) / 5) * 100} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">🔍 Insights</h4>
                {insights.map((insight, index) => (
                  <p key={index} className="text-muted-foreground bg-muted rounded-lg p-3 text-sm">
                    {insight}
                  </p>
                ))}
              </div>

              {wellnessScore.metaLevel >= 4 && (
                <Card className="border-dashed border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                  <CardContent className="pt-4">
                    <p className="text-sm">
                      🎭 <strong>Meta Achievement Unlocked!</strong> You&apos;ve reached peak
                      self-awareness. You&apos;re now consciously participating in your own
                      surveillance while building the surveillance system. The 4th wall is
                      completely shattered! 🚀
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={retakeSurvey} variant="outline" className="flex-1">
                  Take Survey Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentSurvey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>💚 Weekly Wellness Check-in</CardTitle>
          <CardDescription>
            Help us understand your wellbeing and work experience. Your responses are stored locally
            during your session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-muted-foreground text-sm">
              <p>📊 This survey includes:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Workload and stress assessment</li>
                <li>Work-life balance evaluation</li>
                <li>Team collaboration feedback</li>
                <li>Meta-awareness questions (because we&apos;re 4sight! 🎭)</li>
              </ul>
            </div>
            <Button onClick={startSurvey} className="w-full">
              Start Wellness Survey ({SURVEY_QUESTIONS.length} questions)
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentResponse = responses.get(currentQuestion.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Question {currentQuestionIndex + 1} of {SURVEY_QUESTIONS.length}
              </CardTitle>
              <CardDescription>
                {currentQuestion.dimension.replace('_', ' ').toUpperCase()} •
                {currentQuestion.response_type === 'scale' ? 'Scale Response' : 'Text Response'}
              </CardDescription>
            </div>
            <Badge variant="outline">{Math.round(progress)}%</Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h3 className="text-lg font-medium leading-relaxed">{currentQuestion.question_text}</h3>

            {currentQuestion.response_type === 'scale' && (
              <div className="space-y-4">
                <RadioGroup
                  value={currentResponse?.value?.toString() || ''}
                  onValueChange={(value: string) => handleResponse(parseInt(value))}
                >
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center space-x-3">
                        <RadioGroupItem
                          value={value.toString()}
                          id={`q${currentQuestion.id}-${value}`}
                        />
                        <Label
                          htmlFor={`q${currentQuestion.id}-${value}`}
                          className="flex-1 cursor-pointer"
                        >
                          <span className="font-medium">{value}</span>
                          {value === 1 && currentQuestion.scale_labels?.min && (
                            <span className="text-muted-foreground ml-2">
                              - {currentQuestion.scale_labels.min}
                            </span>
                          )}
                          {value === 5 && currentQuestion.scale_labels?.max && (
                            <span className="text-muted-foreground ml-2">
                              - {currentQuestion.scale_labels.max}
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentQuestion.response_type === 'text' && (
              <div className="space-y-2">
                <Label htmlFor={`text-${currentQuestion.id}`}>Your response:</Label>
                <Textarea
                  id={`text-${currentQuestion.id}`}
                  placeholder="Share your thoughts..."
                  value={currentResponse?.text || ''}
                  onChange={(e) => handleResponse(undefined, e.target.value)}
                  rows={4}
                />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={
                  currentQuestion.response_type === 'scale'
                    ? !currentResponse?.value
                    : currentQuestion.response_type === 'text'
                      ? !currentResponse?.text?.trim()
                      : false
                }
                className="flex-1"
              >
                {currentQuestionIndex === SURVEY_QUESTIONS.length - 1
                  ? 'Complete Survey'
                  : 'Next Question'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
