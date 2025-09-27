'use client';

import { ProtectedRoute } from '@worksight/web/components/auth/protected-route';
import { ClientOnly } from '@worksight/web/components/core';
import { DashboardSubNav } from '@worksight/web/components/dashboard/sub-nav';
import { EmptyState } from '@worksight/web/components/empty/empty-state';
import { Badge } from '@worksight/web/components/ui/badge';
import { Button } from '@worksight/web/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@worksight/web/components/ui/card';
import { CollapsibleSection } from '@worksight/web/components/ui/collapsible-section';
import { Progress } from '@worksight/web/components/ui/progress';
import { Activity, Calendar, FolderPlus, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function WellnessPage() {
  const [canTakeSurvey, setCanTakeSurvey] = useState(true);
  const [nextSurveyTime, setNextSurveyTime] = useState<string>('');

  useEffect(() => {
    // Check survey availability
    const checkSurveyAvailability = () => {
      const lastSurveyTime = localStorage.getItem('last_survey_time');

      if (lastSurveyTime) {
        const lastTime = new Date(lastSurveyTime);
        const now = new Date();
        const timeDiff = now.getTime() - lastTime.getTime();
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

        if (timeDiff < oneHour) {
          setCanTakeSurvey(false);
          const nextTime = new Date(lastTime.getTime() + oneHour);
          setNextSurveyTime(nextTime.toLocaleString());
        } else {
          setCanTakeSurvey(true);
          setNextSurveyTime('');
        }
      }
    };

    checkSurveyAvailability();

    // Update every minute
    const interval = setInterval(checkSurveyAvailability, 60000);
    return () => clearInterval(interval);
  }, []);

  // Mock wellness data - replace with real data
  const wellnessData = {
    currentBurnoutLevel: 65,
    lastSurveyDate: '2025-01-24',
    surveyCount: 12,
    averageScore: 58,
    trend: 'improving',
  };

  const recentSurveys: { date: string; score: number; status: string }[] = [
    { date: '2025-01-24', score: 65, status: 'moderate' },
    { date: '2025-01-17', score: 72, status: 'high' },
    { date: '2025-01-10', score: 58, status: 'moderate' },
    { date: '2025-01-03', score: 45, status: 'low' },
  ];

  const getBurnoutColor = (level: number) => {
    if (level < 30) return 'text-green-600';
    if (level < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      low: 'bg-green-100 text-green-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return variants[status as keyof typeof variants] || variants.moderate;
  };

  return (
    <ProtectedRoute>
      <ClientOnly>
        <div className="space-y-6 p-6">
          <DashboardSubNav
            aria-label="Wellness sub navigation"
            items={[
              { label: 'Tasks', href: '/dashboard/tasks' },
              { label: 'Reports', href: '/dashboard/reports', soon: true },
              { label: 'Wellness', href: '/dashboard/wellness', badge: recentSurveys.length },
            ]}
          />
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Wellness Dashboard</h1>
              <p className="text-muted-foreground">
                Track your wellness surveys and burnout levels
              </p>
            </div>
            {canTakeSurvey ? (
              <Button asChild>
                <Link href="/survey">
                  <Activity className="mr-2 h-4 w-4" />
                  Take Survey
                </Link>
              </Button>
            ) : (
              <div className="text-center">
                <Button disabled>
                  <Activity className="mr-2 h-4 w-4" />
                  Survey Unavailable
                </Button>
                <p className="text-muted-foreground mt-1 text-xs">
                  Next available: {nextSurveyTime}
                </p>
              </div>
            )}
          </div>

          {/* KPI / Status Cluster */}
          <CollapsibleSection
            title="Current Metrics"
            description="Latest wellness indicators"
            defaultOpen
            className="bg-background/50 backdrop-blur-sm"
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Burnout Level</CardTitle>
                <Activity className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${getBurnoutColor(wellnessData.currentBurnoutLevel)}`}
                >
                  {wellnessData.currentBurnoutLevel}%
                </div>
                <p className="text-muted-foreground text-xs">
                  Last updated: {wellnessData.lastSurveyDate}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Surveys Completed</CardTitle>
                <Calendar className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wellnessData.surveyCount}</div>
                <p className="text-muted-foreground text-xs">Total surveys taken</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Users className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wellnessData.averageScore}%</div>
                <p className="text-muted-foreground text-xs">Over last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trend</CardTitle>
                <TrendingUp className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Improving</div>
                <p className="text-muted-foreground text-xs">Compared to last month</p>
              </CardContent>
            </Card>
            </div>
          </CollapsibleSection>

          {/* Progress & History Section (collapsible to control scroll) */}
          <CollapsibleSection
            title="Progress & Risk Range"
            description="Track progression against risk thresholds"
            defaultOpen
            className="bg-background/50 backdrop-blur-sm"
          >
            <Card elevation="sm" className="shadow-none">
              <CardHeader>
                <CardTitle>Burnout Level Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Level</span>
                  <span
                    className={`text-lg font-bold ${getBurnoutColor(wellnessData.currentBurnoutLevel)}`}
                  >
                    {wellnessData.currentBurnoutLevel}%
                  </span>
                </div>
                <Progress value={wellnessData.currentBurnoutLevel} className="h-3" />
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>Low Risk (0-30%)</span>
                  <span>Moderate Risk (30-70%)</span>
                  <span>High Risk (70-100%)</span>
                </div>
              </div>
              </CardContent>
            </Card>
          </CollapsibleSection>

          <CollapsibleSection
            title="Recent Survey Results"
            description="Past submissions and risk classification"
            defaultOpen
            className="bg-background/50 backdrop-blur-sm"
          >
            <Card elevation="sm" className="shadow-none">
              <CardHeader>
                <CardTitle>Recent Survey Results</CardTitle>
              </CardHeader>
              <CardContent>
              {recentSurveys.length === 0 ? (
                <EmptyState
                  size="sm"
                  icon={<FolderPlus className="h-5 w-5" />}
                  title="No surveys yet"
                  description="Take your first wellness survey to start tracking burnout risk over time."
                  primaryAction={{ href: '/survey', label: 'Take Survey' }}
                  secondaryAction={{ href: '/help', label: 'Learn more' }}
                />
              ) : (
                <div className="space-y-4">
                  {recentSurveys.map((survey, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium">
                          {new Date(survey.date).toLocaleDateString()}
                        </div>
                        <Badge className={getStatusBadge(survey.status)}>
                          {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)} Risk
                        </Badge>
                      </div>
                      <div className={`text-lg font-bold ${getBurnoutColor(survey.score)}`}>
                        {survey.score}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </CardContent>
            </Card>
          </CollapsibleSection>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card elevation="sm" interactive className="cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Take New Survey</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Complete a wellness assessment to track your current state
                </p>
                <Button asChild className="w-full">
                  <Link href="/survey">
                    <Activity className="mr-2 h-4 w-4" />
                    Start Survey
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card elevation="sm" interactive className="cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">View History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Review your wellness trends and historical data
                </p>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  View All Results
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ClientOnly>
    </ProtectedRoute>
  );
}
