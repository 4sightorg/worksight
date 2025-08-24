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

function SurveyResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<DetailedBurnoutResult | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  // Question titles mapping
  const questionTitles: Record<string, string> = {
    // Personal Information
    name: 'Name',
    email: 'Email',
    role: 'Role',
    
    // Workload & Job Demands
    workload_1: 'I often feel emotionally drained after a typical workday.',
    workload_2: 'My workload feels unmanageable in most weeks.',
    workload_3: "I feel pressured to work faster than I'm comfortable with to meet targets.",
    workload_4: 'My job demands a lot of sustained mental and emotional effort.',
    workload_5: "Some days I have so much to do that I don't know where to start.",
    workload_6: 'The number of meetings in a typical week prevents me from completing core tasks.',
    
    // Work–Life Balance & Recovery
    balance_1: 'I have enough energy for my personal life after work.',
    balance_2: 'I find it hard to switch off from work during my time off.',
    balance_3: 'I feel uneasy about using my leaves or holidays.',
    balance_4: 'Weekends or days off leave me feeling recharged.',
    balance_5: 'My job interferes with responsibilities at home.',
    
    // Social Support & Autonomy
    support_1: 'I feel supported by my teammates.',
    support_2: 'My immediate supervisor shows genuine concern for my well-being.',
    support_3: 'I have a say in how I plan and do my work.',
    support_4: 'I often feel isolated at work, even with my team around.',
    support_5: 'I receive regular, constructive feedback that helps me improve.',
    
    // Personal Accomplishment & Engagement
    engagement_1: 'I feel proud of the work I accomplish.',
    engagement_2: 'I am enthusiastic about my job.',
    engagement_3: 'My contributions feel meaningful.',
    engagement_4: "I feel I'm making a positive difference for customers or the bank.",
    engagement_5: 'I feel detached or indifferent toward my work.',
    engagement_6: 'I have a clear sense of purpose in my role.',
    engagement_7: 'I frequently zone out during work hours.',
    engagement_8: 'My work is appreciated by others.',
    engagement_9: 'I feel inspired by my job or colleagues.',
  };

  // Response sections configuration
  const responseSections = [
    {
      title: 'Personal Information',
      filter: (r: SurveyResponse) => ['name', 'email', 'role'].includes(r.questionId),
      borderColor: 'border-l-blue-500/20 hover:border-l-blue-500/60',
      animationDelay: 600,
    },
    {
      title: 'Workload & Job Demands',
      filter: (r: SurveyResponse) => r.questionId.startsWith('workload_'),
      borderColor: 'border-l-red-500/20 hover:border-l-red-500/60',
      animationDelay: 700,
    },
    {
      title: 'Work-Life Balance & Recovery',
      filter: (r: SurveyResponse) => r.questionId.startsWith('balance_'),
      borderColor: 'border-l-orange-500/20 hover:border-l-orange-500/60',
      animationDelay: 800,
    },
    {
      title: 'Social Support & Autonomy',
      filter: (r: SurveyResponse) => r.questionId.startsWith('support_'),
      borderColor: 'border-l-green-500/20 hover:border-l-green-500/60',
      animationDelay: 900,
    },
    {
      title: 'Personal Accomplishment & Engagement',
      filter: (r: SurveyResponse) => r.questionId.startsWith('engagement_'),
      borderColor: 'border-l-purple-500/20 hover:border-l-purple-500/60',
      animationDelay: 1000,
    },
  ];

  // Format response values
  const formatValue = (value: string | number) => {
    if (typeof value === 'number' && value >= 1 && value <= 5) {
      const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
      return `${value} (${labels[value - 1]})`;
    }
    return value;
  };

  // Render response card
  const renderResponseCard = (response: SurveyResponse, index: number, borderColor: string, baseDelay: number) => (
    <Card
      key={response.questionId}
      className={`bg-muted/30 hover:bg-muted/50 animate-in fade-in border-l-4 ${borderColor} transition-all duration-300 hover:shadow-md`}
      style={{ animationDelay: `${baseDelay + index * 80}ms` }}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h4 className="text-sm font-medium leading-relaxed text-foreground">
              {questionTitles[response.questionId] || response.questionId}
            </h4>
            <div className="text-right flex-shrink-0">
              <span className="text-primary font-semibold text-base">
                {formatValue(response.value)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render response section
  const renderResponseSection = (section: typeof responseSections[0]) => {
    const sectionResponses = responses.filter(section.filter);
    
    if (sectionResponses.length === 0) return null;

    return (
      <div key={section.title} className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
          {section.title}
        </h3>
        <div className="space-y-3">
          {sectionResponses.map((response, index) => 
            renderResponseCard(response, index, section.borderColor, section.animationDelay)
          )}
        </div>
      </div>
    );
  };

  // Helper function to get risk level based on score and ranges
  const getWorkloadLevel = (score: number): DimensionResult => {
    if (score <= 15) {
      // 6-15 out of 30 (Low: 6-15)
      return {
        score,
        level: 'low',
        color: 'text-green-600',
        title: 'Low Risk',
        description:
          'The employee feels their workload is manageable, and they are not experiencing emotional or mental exhaustion from job demands. They are confident in their ability to complete tasks effectively and on time, maintaining a healthy pace without feeling overwhelmed.',
      };
    } else if (score <= 20) {
      // 16-20 out of 30 (Moderate: 16-20)
      return {
        score,
        level: 'moderate',
        color: 'text-yellow-600',
        title: 'Moderate Risk',
        description:
          'The employee may be feeling some pressure from their workload but is generally able to cope. They may experience occasional spikes in stress and emotional fatigue, particularly during peak periods, but these feelings are temporary.',
      };
    } else if (score <= 25) {
      // 21-25 out of 30 (High: 21-25)
      return {
        score,
        level: 'high',
        color: 'text-orange-600',
        title: 'High Risk',
        description:
          'The employee is likely experiencing significant stress and emotional fatigue from their job demands. Their workload may feel consistently overwhelming, leading to a sense of being constantly on the verge of exhaustion.',
      };
    } else {
      // 26-30 out of 30 (Severe: 26-30)
      return {
        score,
        level: 'severe',
        color: 'text-red-600',
        title: 'Severe Risk',
        description:
          "The employee's workload is severely impacting their well-being, leading to a state of emotional and mental exhaustion. They feel completely depleted and are struggling to meet even basic job requirements.",
      };
    }
  };

  const getBalanceLevel = (score: number): DimensionResult => {
    if (score <= 12) {
      // 5-12 out of 25 (Low: 5-12)
      return {
        score,
        level: 'low',
        color: 'text-green-600',
        title: 'Low Risk',
        description:
          'The employee feels they have a healthy work-life balance and are able to effectively disconnect from work. They have ample time and energy for personal hobbies, family, and social activities.',
      };
    } else if (score <= 17) {
      // 13-17 out of 25 (Moderate: 13-17)
      return {
        score,
        level: 'moderate',
        color: 'text-yellow-600',
        title: 'Moderate Risk',
        description:
          'The employee is finding it somewhat difficult to balance work and personal life. They may occasionally struggle to relax during time off, with work-related thoughts intruding on their personal time.',
      };
    } else if (score <= 21) {
      // 18-21 out of 25 (High: 18-21)
      return {
        score,
        level: 'high',
        color: 'text-orange-600',
        title: 'High Risk',
        description:
          "The employee's work is significantly interfering with their personal life and time for recovery. They may feel a constant need to be 'on' and find it very difficult to switch off from work.",
      };
    } else {
      // 22-25 out of 25 (Severe: 22-25)
      return {
        score,
        level: 'severe',
        color: 'text-red-600',
        title: 'Severe Risk',
        description:
          "The employee feels unable to disconnect from work, with severe interference in their life outside the office. This suggests a chronic lack of recovery time, where the employee's mental and physical health are at critical risk.",
      };
    }
  };

  const getSupportLevel = (score: number): DimensionResult => {
    if (score <= 12) {
      // 5-12 out of 25 (Low: 5-12)
      return {
        score,
        level: 'low',
        color: 'text-green-600',
        title: 'Low Risk',
        description:
          'The employee feels well-supported by their colleagues and supervisor and has a high degree of autonomy in their role. They have strong, collaborative relationships at work and feel empowered to make decisions.',
      };
    } else if (score <= 17) {
      // 13-17 out of 25 (Moderate: 13-17)
      return {
        score,
        level: 'moderate',
        color: 'text-yellow-600',
        title: 'Moderate Risk',
        description:
          'The employee may be experiencing some issues with support or autonomy. They may feel occasionally isolated or lack a say in their work. While these issues are not constant, they could signal a need for improved communication.',
      };
    } else if (score <= 21) {
      // 18-21 out of 25 (High: 18-21)
      return {
        score,
        level: 'high',
        color: 'text-orange-600',
        title: 'High Risk',
        description:
          'The employee feels unsupported or lacks adequate control over their work. This could indicate strained relationships or a rigid work environment. They may feel that their opinions are not valued.',
      };
    } else {
      // 22-25 out of 25 (Severe: 22-25)
      return {
        score,
        level: 'severe',
        color: 'text-red-600',
        title: 'Severe Risk',
        description:
          'The employee feels isolated and has a severe lack of control or support from their team or supervisor. This is a critical area for intervention, as a lack of social connection and autonomy can lead to deep despair.',
      };
    }
  };

  const getEngagementLevel = (score: number): DimensionResult => {
    if (score <= 22) {
      // 9-22 out of 45 (Low: 9-22)
      return {
        score,
        level: 'low',
        color: 'text-green-600',
        title: 'Low Risk',
        description:
          'The employee feels highly engaged and has a strong sense of accomplishment and purpose in their role. They are motivated by their work and take pride in their contributions.',
      };
    } else if (score <= 31) {
      // 23-31 out of 45 (Moderate: 23-31)
      return {
        score,
        level: 'moderate',
        color: 'text-yellow-600',
        title: 'Moderate Risk',
        description:
          "The employee's engagement and sense of accomplishment may be wavering. They may question the value of their contributions and experience occasional feelings of detachment or indifference.",
      };
    } else if (score <= 38) {
      // 32-38 out of 45 (High: 32-38)
      return {
        score,
        level: 'high',
        color: 'text-orange-600',
        title: 'High Risk',
        description:
          'The employee is feeling a loss of purpose and detachment from their work. They may struggle to find meaning in their daily tasks and feel a sense of ineffectiveness.',
      };
    } else {
      // 39-45 out of 45 (Severe: 39-45)
      return {
        score,
        level: 'severe',
        color: 'text-red-600',
        title: 'Severe Risk',
        description:
          'The employee is completely detached from their work and has lost all sense of purpose and accomplishment. They are likely feeling a profound sense of emptiness and indifference toward their professional responsibilities.',
      };
    }
  };

  useEffect(() => {
    const scoresParam = searchParams.get('scores');
    const responsesParam = searchParams.get('responses');

    if (!scoresParam) {
      router.push('/survey');
      return;
    }

    try {
      const scores = JSON.parse(decodeURIComponent(scoresParam));

      if (responsesParam) {
        setResponses(JSON.parse(decodeURIComponent(responsesParam)));
      }

      // Process results for each dimension
      const workloadResult = getWorkloadLevel(scores.workload);
      const balanceResult = getBalanceLevel(scores.balance);
      const supportResult = getSupportLevel(scores.support);
      const engagementResult = getEngagementLevel(scores.engagement);

      // Determine overall level based on highest risk dimension
      const allLevels = [
        workloadResult.level,
        balanceResult.level,
        supportResult.level,
        engagementResult.level,
      ];
      let overallLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';

      if (allLevels.includes('severe')) overallLevel = 'severe';
      else if (allLevels.includes('high')) overallLevel = 'high';
      else if (allLevels.includes('moderate')) overallLevel = 'moderate';

      // Generate recommendations based on overall level
      let recommendations: string[] = [];
      if (overallLevel === 'low') {
        recommendations = [
          'Continue maintaining your current healthy work habits',
          'Stay aware of early warning signs of stress',
          'Regular check-ins with yourself about your well-being',
          'Keep nurturing relationships both at work and outside',
        ];
      } else if (overallLevel === 'moderate') {
        recommendations = [
          'Implement stress management techniques like meditation or exercise',
          'Set clearer boundaries between work and personal time',
          'Consider talking to a supervisor about any concerns',
          'Prioritize sleep and regular breaks during work',
          'Engage in activities that bring you joy and relaxation',
        ];
      } else if (overallLevel === 'high') {
        recommendations = [
          'Consider taking time off to rest and recharge',
          'Speak with HR or management about your concerns',
          'Seek support from a mental health professional',
          'Evaluate your work situation and consider changes',
          'Build a strong support network of colleagues and friends',
          'Practice daily stress-reduction activities',
        ];
      } else {
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
        overallScore: scores.overall,
        overallLevel,
        workload: workloadResult,
        balance: balanceResult,
        support: supportResult,
        engagement: engagementResult,
        recommendations,
      });
    } catch (error) {
      console.error('Failed to parse survey results:', error);
      router.push('/survey');
    }
  }, [searchParams, router]);

  // Show results immediately - no celebration screen
  if (!result) {
    // Show loading state while processing
    return (
      <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
        <div className="mx-auto max-w-2xl">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="mb-4">
                <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
              </div>
              <h2 className="text-xl font-semibold">Processing your results...</h2>
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
            <div className="mb-4 flex justify-center">
              {result.overallLevel === 'low' && <CheckCircle className="h-8 w-8 text-green-600" />}
              {result.overallLevel === 'moderate' && (
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              )}
              {result.overallLevel === 'high' && (
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              )}
              {result.overallLevel === 'severe' && <Heart className="h-8 w-8 text-red-600" />}
            </div>
            <CardTitle
              className={`text-3xl ${
                result.overallLevel === 'low'
                  ? 'text-green-600'
                  : result.overallLevel === 'moderate'
                    ? 'text-yellow-600'
                    : result.overallLevel === 'high'
                      ? 'text-orange-600'
                      : 'text-red-600'
              }`}
            >
              {result.overallLevel === 'low'
                ? 'Low Burnout Risk'
                : result.overallLevel === 'moderate'
                  ? 'Moderate Burnout Risk'
                  : result.overallLevel === 'high'
                    ? 'High Burnout Risk'
                    : 'Severe Burnout Risk'}
            </CardTitle>
            <div className="mt-4 mb-2 text-6xl font-bold">
              <span
                className={
                  result.overallLevel === 'low'
                    ? 'text-green-600'
                    : result.overallLevel === 'moderate'
                      ? 'text-yellow-600'
                      : result.overallLevel === 'high'
                        ? 'text-orange-600'
                        : 'text-red-600'
                }
              >
                Overall Score: {result.overallScore}
              </span>
            </div>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              {result.overallLevel === 'low'
                ? 'You seem to be managing stress well and maintaining a healthy work-life balance.'
                : result.overallLevel === 'moderate'
                  ? "You're showing some signs of stress that warrant attention before they escalate."
                  : result.overallLevel === 'high'
                    ? "You're experiencing significant signs of burnout that need immediate attention."
                    : "You're showing serious signs of burnout that require immediate professional attention."}
            </p>
          </CardHeader>
          <CardContent>
            {/* Dimension Breakdown */}
            <div className="mb-6 space-y-4">
              <h3 className="mb-4 text-lg font-semibold">Burnout Assessment Breakdown</h3>

              {/* Workload & Job Demands */}
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">Workload & Job Demands</h4>
                  <span className={`font-semibold ${result.workload.color}`}>
                    {result.workload.score}/30
                  </span>
                </div>
                <div className="bg-muted mb-2 h-2 w-full rounded-full">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      result.workload.level === 'low'
                        ? 'bg-green-500'
                        : result.workload.level === 'moderate'
                          ? 'bg-yellow-500'
                          : result.workload.level === 'high'
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                    }`}
                    style={{ width: `${(result.workload.score / 30) * 100}%` }}
                  />
                </div>
                <p className={`text-sm font-medium ${result.workload.color}`}>
                  {result.workload.title}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">{result.workload.description}</p>
              </div>

              {/* Work-Life Balance */}
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">Work-Life Balance & Recovery</h4>
                  <span className={`font-semibold ${result.balance.color}`}>
                    {result.balance.score}/25
                  </span>
                </div>
                <div className="bg-muted mb-2 h-2 w-full rounded-full">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      result.balance.level === 'low'
                        ? 'bg-green-500'
                        : result.balance.level === 'moderate'
                          ? 'bg-yellow-500'
                          : result.balance.level === 'high'
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                    }`}
                    style={{ width: `${(result.balance.score / 25) * 100}%` }}
                  />
                </div>
                <p className={`text-sm font-medium ${result.balance.color}`}>
                  {result.balance.title}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">{result.balance.description}</p>
              </div>

              {/* Social Support & Autonomy */}
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">Social Support & Autonomy</h4>
                  <span className={`font-semibold ${result.support.color}`}>
                    {result.support.score}/25
                  </span>
                </div>
                <div className="bg-muted mb-2 h-2 w-full rounded-full">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      result.support.level === 'low'
                        ? 'bg-green-500'
                        : result.support.level === 'moderate'
                          ? 'bg-yellow-500'
                          : result.support.level === 'high'
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                    }`}
                    style={{ width: `${(result.support.score / 25) * 100}%` }}
                  />
                </div>
                <p className={`text-sm font-medium ${result.support.color}`}>
                  {result.support.title}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">{result.support.description}</p>
              </div>

              {/* Personal Accomplishment & Engagement */}
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">Personal Accomplishment & Engagement</h4>
                  <span className={`font-semibold ${result.engagement.color}`}>
                    {result.engagement.score}/45
                  </span>
                </div>
                <div className="bg-muted mb-2 h-2 w-full rounded-full">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      result.engagement.level === 'low'
                        ? 'bg-green-500'
                        : result.engagement.level === 'moderate'
                          ? 'bg-yellow-500'
                          : result.engagement.level === 'high'
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                    }`}
                    style={{ width: `${(result.engagement.score / 45) * 100}%` }}
                  />
                </div>
                <p className={`text-sm font-medium ${result.engagement.color}`}>
                  {result.engagement.title}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {result.engagement.description}
                </p>
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
              <div className="space-y-8">
                {responseSections.map(renderResponseSection)}
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
