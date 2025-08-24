'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Heart, TrendingUp } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface SurveyResponse {
  questionId: string;
  value: string | number;
}

interface BurnoutResult {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'severe';
  color: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  recommendations: string[];
}

function SurveyResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<BurnoutResult | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [showCelebration, setShowCelebration] = useState(true);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const scoreParam = searchParams.get('score');
    const responsesParam = searchParams.get('responses');

    if (!scoreParam) {
      router.push('/survey');
      return;
    }

    const score = parseInt(scoreParam, 10);

    if (responsesParam) {
      try {
        setResponses(JSON.parse(decodeURIComponent(responsesParam)));
      } catch (error) {
        console.warn('Failed to parse responses:', error);
      }
    }

    // Show celebration card for 5 seconds, then show results
    const celebrationTimer = setTimeout(() => {
      setShowCelebration(false);
      setIsProcessing(false);
    }, 5000);

    // Process results after a short delay to feel more natural
    const processingTimer = setTimeout(() => {
      // Determine burnout level and recommendations
      let level: BurnoutResult['level'];
      let color: string;
      let icon: React.ReactNode;
      let title: string;
      let description: string;
      let recommendations: string[];

      if (score <= 25) {
        level = 'low';
        color = 'text-green-600';
        icon = <CheckCircle className="h-8 w-8 text-green-600" />;
        title = 'Low Burnout Risk';
        description =
          'You seem to be managing stress well and maintaining a healthy work-life balance.';
        recommendations = [
          'Continue maintaining your current healthy habits',
          'Stay aware of early warning signs of stress',
          'Regular check-ins with yourself about your well-being',
          'Keep nurturing relationships outside of work',
        ];
      } else if (score <= 50) {
        level = 'moderate';
        color = 'text-yellow-600';
        icon = <TrendingUp className="h-8 w-8 text-yellow-600" />;
        title = 'Moderate Burnout Risk';
        description =
          "You're showing some signs of stress that warrant attention before they escalate.";
        recommendations = [
          'Implement stress management techniques like meditation or exercise',
          'Set clearer boundaries between work and personal time',
          'Consider talking to a supervisor about workload concerns',
          'Prioritize sleep and regular breaks during work',
          'Engage in activities that bring you joy and relaxation',
        ];
      } else if (score <= 75) {
        level = 'high';
        color = 'text-orange-600';
        icon = <AlertTriangle className="h-8 w-8 text-orange-600" />;
        title = 'High Burnout Risk';
        description =
          "You're experiencing significant signs of burnout that need immediate attention.";
        recommendations = [
          'Consider taking time off to rest and recharge',
          'Speak with HR or management about your concerns',
          'Seek support from a mental health professional',
          'Evaluate your work situation and consider changes',
          'Build a strong support network of colleagues and friends',
          'Practice daily stress-reduction activities',
        ];
      } else {
        level = 'severe';
        color = 'text-red-600';
        icon = <Heart className="h-8 w-8 text-red-600" />;
        title = 'Severe Burnout Risk';
        description =
          "You're showing serious signs of burnout that require immediate professional attention.";
        recommendations = [
          'Seek immediate support from a mental health professional',
          'Consider medical leave if possible',
          'Contact employee assistance programs if available',
          'Discuss major workplace changes with leadership',
          'Focus on basic self-care: sleep, nutrition, and gentle exercise',
          "Don't hesitate to reach out to trusted friends and family",
        ];
      }

      setResult({
        score,
        level,
        color,
        icon,
        title,
        description,
        recommendations,
      });
    }, 2000); // Process results after 2 seconds

    return () => {
      clearTimeout(celebrationTimer);
      clearTimeout(processingTimer);
    };
  }, [searchParams, router]);

  // Show celebration card while processing
  if (showCelebration || !result) {
    const userName = responses.find((r) => r.questionId === 'name')?.value || 'there';

    return (
      <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
        <div className="mx-auto max-w-2xl">
          <Card className="fade-in border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 text-center dark:from-green-950/20 dark:to-emerald-950/20">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-200">
                🎉 Survey Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-green-700 dark:text-green-300">
                Thank you, <strong>{userName}</strong>!
              </p>
              <p className="text-green-600 dark:text-green-400">
                Your responses have been recorded and are being analyzed to provide personalized
                insights for your well-being.
              </p>

              {isProcessing && (
                <div className="mt-6 space-y-3">
                  <div className="mx-auto h-2 w-64 overflow-hidden rounded-full bg-green-200 dark:bg-green-800">
                    <div className="progress-bar h-full w-full rounded-full bg-green-500"></div>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Analyzing your responses and generating personalized recommendations...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const userName = responses.find((r) => r.questionId === 'name')?.value || 'there';

  return (
    <div className="from-background to-muted/20 fade-in min-h-screen bg-gradient-to-br p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="fade-in space-y-4 text-center" style={{ animationDelay: '0ms' }}>
          <h1 className="text-4xl font-bold">Your Burnout Assessment Results</h1>
          <p className="text-muted-foreground text-xl">Hi {userName}, here&apos;s what we found</p>
        </div>

        {/* Main Result Card */}
        <Card
          className="fade-in border-2 transition-all hover:shadow-xl"
          style={{ animationDelay: '200ms' }}
        >
          <CardHeader className="pb-4 text-center">
            <div className="mb-4 flex justify-center">{result.icon}</div>
            <CardTitle className={`text-3xl ${result.color}`}>{result.title}</CardTitle>
            <div className="mt-4 mb-2 text-6xl font-bold">
              <span className={result.color}>{result.score}%</span>
            </div>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">{result.description}</p>
          </CardHeader>
          <CardContent>
            <div className="bg-muted mb-6 h-3 w-full overflow-hidden rounded-full">
              <div
                className={`relative h-3 overflow-hidden rounded-full transition-all duration-2000 ease-out ${
                  result.level === 'low'
                    ? 'bg-green-500'
                    : result.level === 'moderate'
                      ? 'bg-yellow-500'
                      : result.level === 'high'
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                }`}
                style={{ width: `${result.score}%` }}
              >
                <div className="absolute inset-0 -skew-x-12 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card
          className="fade-in transition-all hover:shadow-lg"
          style={{ animationDelay: '400ms' }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {result.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="bg-muted/50 animate-in slide-in-from-right-4 hover:bg-muted/70 flex cursor-default items-start gap-3 rounded-lg p-3 transition-all duration-500"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <span className="bg-primary text-primary-foreground flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Summary */}
        {responses.length > 0 && (
          <Card className="animate-in slide-in-from-right-6 transition-all delay-500 duration-700 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Your Response Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {responses
                  .filter((r) => r.questionId !== 'additional_thoughts')
                  .map((response, index) => {
                    const questionTitles: Record<string, string> = {
                      name: 'Name',
                      email: 'Email',
                      role: 'Role',
                      experience: 'Years of Experience',
                      stress_level: 'Stress Level',
                      work_hours: 'Weekly Work Hours',
                      job_satisfaction: 'Job Satisfaction',
                      burnout_symptoms: 'Primary Burnout Symptom',
                      work_life_balance: 'Work-Life Balance',
                    };

                    return (
                      <div
                        key={response.questionId}
                        className="bg-muted/30 hover:bg-muted/50 animate-in fade-in flex items-center justify-between rounded p-3 transition-all duration-300"
                        style={{ animationDelay: `${600 + index * 80}ms` }}
                      >
                        <span className="font-medium">
                          {questionTitles[response.questionId] || response.questionId}:
                        </span>
                        <span className="text-primary font-semibold">{response.value}</span>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Response Confirmation & Tracking Notice */}
        <Card
          className="fade-in border-blue-200 bg-blue-50 dark:bg-blue-900/10"
          style={{ animationDelay: '600ms' }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-blue-800 dark:text-blue-200">
              <CheckCircle className="h-6 w-6" />
              Your Response Has Been Recorded
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-blue-700 dark:text-blue-300">
              <p className="mb-3">
                <strong>Thank you for completing the burnout assessment.</strong> Your responses
                have been securely recorded and will contribute to:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span>
                  <span>
                    <strong>Personal tracking:</strong> Monitor your well-being trends over time
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span>
                  <span>
                    <strong>Early intervention:</strong> Help identify when you may need additional
                    support
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span>
                  <span>
                    <strong>Workplace insights:</strong> Contribute to overall team well-being
                    (anonymously)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span>
                  <span>
                    <strong>Resource recommendations:</strong> Receive personalized support based on
                    your needs
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-4 rounded-lg bg-blue-100 p-3 dark:bg-blue-800/20">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Next steps:</strong> Consider scheduling regular check-ins with yourself
                and retaking this assessment monthly to track your progress and well-being journey.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div
          className="fade-in flex flex-col justify-center gap-4 sm:flex-row"
          style={{ animationDelay: '800ms' }}
        >
          <Button
            onClick={() => router.push('/survey')}
            variant="outline"
            size="lg"
            className="transition-all duration-200 hover:scale-105"
          >
            Take Survey Again
          </Button>
          <Button
            onClick={() => router.push('/dashboard')}
            size="lg"
            className="w-full transition-all duration-200 hover:scale-105 sm:w-auto"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            size="lg"
            className="w-full transition-all duration-200 hover:scale-105 sm:w-auto"
          >
            Back to Home
          </Button>
        </div>

        {/* Privacy & Support Information */}
        <Card
          className="fade-in border-orange-200 bg-orange-50 dark:bg-orange-900/10"
          style={{ animationDelay: '1000ms' }}
        >
          <CardContent className="pt-6">
            <div className="space-y-3 text-center">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                <strong>Privacy:</strong> Your individual responses are confidential and secure.
                Only aggregated, anonymous data is used for workplace insights.
              </p>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                <strong>Support:</strong> This assessment helps identify patterns and provide
                resources. For immediate concerns, please contact your employee assistance program
                or healthcare provider.
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                This assessment is for informational purposes and should not replace professional
                medical or psychological advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SurveyResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
          <div className="text-center">
            <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <p className="text-muted-foreground">Loading your results...</p>
          </div>
        </div>
      }
    >
      <SurveyResultsContent />
    </Suspense>
  );
}
