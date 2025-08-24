'use client';

import { BounceLink, ScaleLink } from '@/components/anim/';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Heart, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
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
        'You&apos;re showing some signs of stress that warrant attention before they escalate.';
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
        'You&apos;re experiencing significant signs of burnout that need immediate attention.';
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
        'You&apos;re showing serious signs of burnout that require immediate professional attention.';
      recommendations = [
        'Seek immediate support from a mental health professional',
        'Consider medical leave if possible',
        'Contact employee assistance programs if available',
        'Discuss major workplace changes with leadership',
        'Focus on basic self-care: sleep, nutrition, and gentle exercise',
        'Don&apos;t hesitate to reach out to trusted friends and family',
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
  }, [searchParams, router]);

  if (!result) {
    return (
      <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
        <div className="animate-in fade-in slide-in-from-bottom-4 text-center duration-700">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground animate-in fade-in delay-300 duration-1000">
            Loading your results...
          </p>
        </div>
      </div>
    );
  }

  const userName = responses.find((r) => r.questionId === 'name')?.value || 'there';

  return (
    <div className="from-background to-muted/20 animate-in fade-in min-h-screen bg-gradient-to-br p-4 duration-1000">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="animate-in slide-in-from-top-6 space-y-4 text-center duration-700">
          <h1 className="text-4xl font-bold">Your Burnout Assessment Results</h1>
          <p className="text-muted-foreground text-xl">Hi {userName}, here&apos;s what we found</p>
        </div>

        {/* Main Result Card */}
        <Card className="animate-in slide-in-from-bottom-8 border-2 transition-all delay-200 duration-700 hover:shadow-xl">
          <CardHeader className="pb-4 text-center">
            <div className="animate-in zoom-in mb-4 flex justify-center delay-500 duration-1000">
              {result.icon}
            </div>
            <CardTitle
              className={`text-3xl ${result.color} animate-in slide-in-from-left-6 delay-700 duration-700`}
            >
              {result.title}
            </CardTitle>
            <div className="animate-in zoom-in mt-4 mb-2 text-6xl font-bold delay-900 duration-1000">
              <span className={result.color}>{result.score}%</span>
            </div>
            <p className="text-muted-foreground animate-in fade-in mx-auto max-w-2xl text-lg delay-1000 duration-700">
              {result.description}
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-muted animate-in slide-in-from-bottom-4 mb-6 h-3 w-full overflow-hidden rounded-full delay-1200 duration-700">
              <div
                className={`relative h-3 overflow-hidden rounded-full transition-all delay-1300 duration-2000 ease-out ${
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
        <Card className="animate-in slide-in-from-left-6 transition-all delay-300 duration-700 hover:shadow-lg">
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

        {/* Action Buttons */}
        <div className="animate-in slide-in-from-bottom-6 flex flex-col justify-center gap-4 delay-700 duration-700 sm:flex-row">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push('/survey')}
              variant="outline"
              size="lg"
              className="transition-all duration-200"
            >
              Take Survey Again
            </Button>
          </motion.div>
          <BounceLink href="/dashboard">
            <Button size="lg" className="w-full transition-all duration-200 sm:w-auto">
              Go to Dashboard
            </Button>
          </BounceLink>
          <ScaleLink href="/">
            <Button
              variant="ghost"
              size="lg"
              className="w-full transition-all duration-200 sm:w-auto"
            >
              Back to Home
            </Button>
          </ScaleLink>
        </div>

        {/* Disclaimer */}
        <Card className="animate-in fade-in border-orange-200 bg-orange-50 delay-900 duration-700 dark:bg-orange-900/10">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-orange-800 dark:text-orange-200">
              <strong>Important:</strong> This assessment is for informational purposes only and
              should not replace professional medical or psychological advice. If you&apos;re
              experiencing severe stress or mental health concerns, please consult with a qualified
              healthcare provider.
            </p>
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
