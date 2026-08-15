'use client';

import { useAuth } from '@/auth';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ClientOnly } from '@/components/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { isApiDataMode, toDate, worksightApi } from '@/lib/worksight-api';
import { ActivityLookup, AssignmentLookup, AttendanceLookup, SurveyResponseList } from '@worksight/common';
import { Activity, Check, CheckSquare, Clock, ListChecks, Target, TrendingUp, User, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Area, AreaChart, XAxis, YAxis } from 'recharts';

function formatRelativeTime(date: Date): string {
  const deltaMs = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.floor(deltaMs / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [surveyData, setSurveyData] = useState<unknown>(null);
  const [wellnessHistory, setWellnessHistory] = useState<unknown[]>([]);
  const [orgStats, setOrgStats] = useState<{
    activeTasks: number;
    avgAttendanceHours: number;
    recentSurveyAvg: number | null;
  } | null>(null);
  const [recentActivities, setRecentActivities] = useState<
    Array<{ id: string; description: string; time: string }>
  >([]);

  // Getting Started state
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [surveyTaken, setSurveyTaken] = useState(false);
  const [tasksStarted, setTasksStarted] = useState(false);

  // Derive profile completeness (simple heuristic: has name & department OR team)
  useEffect(() => {
    const hasName = Boolean(user?.name || user?.user_metadata?.name);
    const hasOrgInfo = Boolean(user?.department || user?.team || user?.user_metadata?.department || user?.user_metadata?.team);
    setProfileComplete(hasName && hasOrgInfo);
  }, [user]);

  const evaluateGettingStarted = useCallback(() => {
    try {
      const dismissed = localStorage.getItem('worksight_getting_started_dismissed') === 'true';
      const survey = localStorage.getItem('survey_results');
      // Optional tracking of tasks created (other parts of app could increment this later)
      const tasksCreatedRaw = localStorage.getItem('tasks_created');
      const tasksCreated = tasksCreatedRaw ? parseInt(tasksCreatedRaw, 10) : 0;
      setSurveyTaken(!!survey);
      setTasksStarted(tasksCreated > 0);
      const allDone = profileComplete && !!survey && tasksCreated > 0;
      setShowGettingStarted(!dismissed && !allDone);
    } catch {
      // Fail open (do not block UI)
      setShowGettingStarted(false);
    }
  }, [profileComplete]);

  const dismissGettingStarted = () => {
    try {
      localStorage.setItem('worksight_getting_started_dismissed', 'true');
    } catch {}
    setShowGettingStarted(false);
  };

  useEffect(() => {
    // Load latest survey results
    const loadSurveyData = () => {
      const results = localStorage.getItem('survey_results');
      if (results) {
        try {
          const data = JSON.parse(results);
          setSurveyData(data);
        } catch (error) {
          console.error('Error parsing survey data:', error);
        }
      }
    };

    // Stable wellness history (5 weeks of data - no Math.random())
    const loadWellnessHistory = () => {
      const history = [];
      const today = new Date();
      const baseScores = [42, 48, 55, 50, 58];

      for (let i = 4; i >= 0; i--) {
        const weekDate = new Date(today);
        weekDate.setDate(weekDate.getDate() - i * 7);

        history.push({
          week: `Week ${5 - i}`,
          date: weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          burnout: baseScores[4 - i],
        });
      }
      setWellnessHistory(history);
    };

    async function loadOrgData() {
      if (isApiDataMode()) {
        try {
          const [stats, acts] = await Promise.all([
            worksightApi.getOrgStats(),
            worksightApi.getActivities(),
          ]);
          setOrgStats({
            activeTasks: stats.activeTasks,
            avgAttendanceHours: stats.avgAttendanceHours,
            recentSurveyAvg: stats.recentSurveyAvg,
          });
          setRecentActivities(
            acts.slice(0, 6).map(a => ({
              id: a.id,
              description: a.description,
              time: formatRelativeTime(toDate(a.timestamp)),
            }))
          );
        } catch (error) {
          console.error('Failed to load API org stats:', error);
        }
      } else {
        const assignments = new AssignmentLookup().all();
        const activeCount = assignments.filter(t => t.status !== 'completed').length;
        const att = new AttendanceLookup().all();
        const attHours = att
          .map(a => a.hours_worked)
          .filter((h): h is number => h !== null && typeof h === 'number');
        const avgHours = attHours.length
          ? Math.round((attHours.reduce((s, h) => s + h, 0) / attHours.length) * 10) / 10
          : 6.5;
        const surveyScores = SurveyResponseList.map(s => s.avg_score).filter(
          (s): s is number => s !== null && typeof s === 'number'
        );
        const avgScore = surveyScores.length
          ? Math.round((surveyScores.reduce((s, x) => s + x, 0) / surveyScores.length) * 100) / 100
          : 4.2;

        setOrgStats({
          activeTasks: activeCount,
          avgAttendanceHours: avgHours,
          recentSurveyAvg: avgScore,
        });

        const acts = new ActivityLookup().all();
        setRecentActivities(
          acts.slice(0, 6).map(a => ({
            id: a.id,
            description: a.description,
            time: formatRelativeTime(new Date(a.timestamp)),
          }))
        );
      }
    }

    loadSurveyData();
    loadWellnessHistory();
    loadOrgData();
    evaluateGettingStarted();
  }, [evaluateGettingStarted]);

  return (
    <ProtectedRoute>
      <ClientOnly>
        <SidebarProvider>
          <SidebarInset>
            <div className="flex flex-1 flex-col space-y-6 p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, {user?.name || user?.email}!
                  </h1>
                  <p className="text-muted-foreground">
                    Here&apos;s what&apos;s happening with your work today.
                  </p>
                </div>
              </div>

              {showGettingStarted && (
                <section
                  aria-labelledby="getting-started-heading"
                  className="border-border/50 relative overflow-hidden rounded-lg border bg-gradient-to-r from-accent/40 to-accent/10 p-6 shadow-sm transition-all"
                >
                  <div className="absolute right-0 top-0 -mr-12 -mt-12 size-32 rounded-full bg-accent/40 opacity-30 blur-2xl" aria-hidden="true" />
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-xl space-y-2">
                      <h2 id="getting-started-heading" className="text-lg font-semibold tracking-tight">
                        Getting Started
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Finish these quick steps to personalize your workspace and unlock insights.
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-xs font-medium text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Check className={`h-3 w-3 ${profileComplete ? 'text-green-600' : 'text-muted-foreground'}`} /> Profile
                        </div>
                        <div className="flex items-center gap-1">
                          <Check className={`h-3 w-3 ${surveyTaken ? 'text-green-600' : 'text-muted-foreground'}`} /> Survey
                        </div>
                        <div className="flex items-center gap-1">
                          <Check className={`h-3 w-3 ${tasksStarted ? 'text-green-600' : 'text-muted-foreground'}`} /> Task
                        </div>
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                          {Number(profileComplete) + Number(surveyTaken) + Number(tasksStarted)}/3 Complete
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={dismissGettingStarted}
                      className="text-muted-foreground hover:text-foreground absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Dismiss getting started"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <ol className="mt-4 grid gap-3 md:grid-cols-3" aria-label="Getting started steps">
                    {/* Step 1: Complete Profile */}
                    <li className="group relative flex items-start gap-3 rounded-md border bg-background/60 p-3 transition-colors hover:bg-background">
                      <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-md border ${profileComplete ? 'bg-green-600 text-white' : 'bg-accent text-foreground'} shadow-sm`}>
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Complete your profile</p>
                        <p className="text-muted-foreground text-xs">Add your name & team context</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Link
                            href="/settings"
                            className={`text-xs underline-offset-4 ${profileComplete ? 'pointer-events-none text-muted-foreground' : 'text-primary hover:underline'}`}
                            aria-disabled={profileComplete}
                          >
                            {profileComplete ? 'Done' : 'Go to Settings'}
                          </Link>
                        </div>
                      </div>
                      {profileComplete && <Check className="text-green-600 h-4 w-4" aria-hidden="true" />}
                    </li>
                    {/* Step 2: Take Wellness Survey */}
                    <li className="group relative flex items-start gap-3 rounded-md border bg-background/60 p-3 transition-colors hover:bg-background">
                      <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-md border ${surveyTaken ? 'bg-green-600 text-white' : 'bg-accent text-foreground'} shadow-sm`}>
                        <Target className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Take wellness survey</p>
                        <p className="text-muted-foreground text-xs">Establish your baseline</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Link
                            href="/wellness-survey"
                            className={`text-xs underline-offset-4 ${surveyTaken ? 'pointer-events-none text-muted-foreground' : 'text-primary hover:underline'}`}
                            aria-disabled={surveyTaken}
                          >
                            {surveyTaken ? 'Completed' : 'Start Survey'}
                          </Link>
                        </div>
                      </div>
                      {surveyTaken && <Check className="text-green-600 h-4 w-4" aria-hidden="true" />}
                    </li>
                    {/* Step 3: Create First Task */}
                    <li className="group relative flex items-start gap-3 rounded-md border bg-background/60 p-3 transition-colors hover:bg-background">
                      <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-md border ${tasksStarted ? 'bg-green-600 text-white' : 'bg-accent text-foreground'} shadow-sm`}>
                        <ListChecks className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Create your first task</p>
                        <p className="text-muted-foreground text-xs">Track and organize your work</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Link
                            href="/dashboard/tasks"
                            className={`text-xs underline-offset-4 ${tasksStarted ? 'pointer-events-none text-muted-foreground' : 'text-primary hover:underline'}`}
                            aria-disabled={tasksStarted}
                          >
                            {tasksStarted ? 'Created' : 'Add Task'}
                          </Link>
                        </div>
                      </div>
                      {tasksStarted && <Check className="text-green-600 h-4 w-4" aria-hidden="true" />}
                    </li>
                  </ol>
                  <div className="mt-3 flex items-center justify-end gap-4">
                    <button
                      type="button"
                      onClick={dismissGettingStarted}
                      className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Skip for now
                    </button>
                  </div>
                </section>
              )}

              {/* KPI Cluster */}
              <CollapsibleSection
                title="Key Metrics"
                description="Snapshot of today’s performance"
                defaultOpen
                className="bg-background/50 backdrop-blur-sm"
              >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <Link href="/dashboard/tasks">
                  <Card elevation="sm" interactive className="hover:bg-accent/50 cursor-pointer transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                      <CheckSquare className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{orgStats ? orgStats.activeTasks : 12}</div>
                      <p className="text-muted-foreground flex items-center gap-1 text-xs">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        +2 from yesterday
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hours Worked</CardTitle>
                    <Clock className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{orgStats ? orgStats.avgAttendanceHours : 6.5}</div>
                    <p className="text-muted-foreground flex items-center gap-1 text-xs">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      +0.5 from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Productivity</CardTitle>
                    <Activity className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {orgStats && orgStats.recentSurveyAvg != null
                        ? `${Math.round((orgStats.recentSurveyAvg / 5) * 100)}%`
                        : '85%'}
                    </div>
                    <p className="text-muted-foreground flex items-center gap-1 text-xs">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      +5% this week
                    </p>
                  </CardContent>
                </Card>
              </div>
              </CollapsibleSection>

              {/* Trends & Activity */}
              <CollapsibleSection
                title="Trends & Activity"
                description="Recent patterns and latest actions"
                defaultOpen
                className="bg-background/50 backdrop-blur-sm"
              >
              <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
                {/* Wellness Chart */}
                <Link href="/dashboard/wellness" className="md:col-span-2">
                  <Card elevation="md" interactive className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
                    <CardHeader className="pb-3">
                      <CardTitle>Burnout Trends</CardTitle>
                      <CardDescription>Weekly burnout levels over the past 5 weeks</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <ChartContainer
                        config={
                          {
                            burnout: {
                              label: 'Burnout Level',
                              color: 'hsl(var(--destructive))',
                            },
                          } satisfies ChartConfig
                        }
                        className="h-[280px]"
                      >
                        <AreaChart
                          data={wellnessHistory}
                          margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
                        >
                          <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11 }}
                            interval={0}
                          />
                          <YAxis
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                          />
                          <ChartTooltip
                            content={<ChartTooltipContent />}
                            labelFormatter={(value) => `${value}`}
                          />
                          <Area
                            type="monotone"
                            dataKey="burnout"
                            stroke="hsl(var(--destructive))"
                            fill="hsl(var(--destructive))"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </Link>

                {/* Recent Activity */}
                <Card elevation="sm" className="h-full md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest actions and updates</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-4">
                      {recentActivities.length > 0 ? (
                        recentActivities.map((act, index) => {
                          const colors = [
                            'bg-green-500',
                            'bg-blue-500',
                            'bg-yellow-500',
                            'bg-purple-500',
                            'bg-indigo-500',
                            'bg-pink-500',
                          ];
                          const color = colors[index % colors.length];
                          return (
                            <div key={act.id || index} className="flex items-center space-x-4">
                              <div className={`h-2 w-2 rounded-full ${color}`}></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{act.description}</p>
                                <p className="text-muted-foreground text-xs">{act.time}</p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex items-center space-x-4">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Took wellness survey</p>
                            <p className="text-muted-foreground text-xs">
                              {typeof surveyData === 'object' &&
                              surveyData !== null &&
                              'completedAt' in surveyData &&
                              surveyData.completedAt
                                ? new Date(
                                    (surveyData as { completedAt: string }).completedAt
                                  ).toLocaleDateString()
                                : '1 day ago'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              </CollapsibleSection>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ClientOnly>
    </ProtectedRoute>
  );
}
