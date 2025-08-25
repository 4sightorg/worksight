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
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Activity, CheckSquare, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Area, AreaChart, XAxis, YAxis } from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const [surveyData, setSurveyData] = useState<unknown>(null);
  const [wellnessHistory, setWellnessHistory] = useState<unknown[]>([]);

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

    // Load wellness history (5 weeks of data - 1 data point per week)
    const loadWellnessHistory = () => {
      const history = [];
      const today = new Date();

      for (let i = 4; i >= 0; i--) {
        const weekDate = new Date(today);
        weekDate.setDate(weekDate.getDate() - i * 7); // Go back by weeks

        // Generate realistic burnout progression
        const baseScore = 35 + i * 5; // Gradual increase over time
        const variation = Math.floor(Math.random() * 15) - 7; // ±7 variation
        const burnoutScore = Math.max(25, Math.min(85, baseScore + variation));

        history.push({
          week: `Week ${5 - i}`,
          date: weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          burnout: burnoutScore,
        });
      }
      setWellnessHistory(history);
    };

    loadSurveyData();
    loadWellnessHistory();
  }, []);

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

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <Link href="/dashboard/tasks">
                  <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                      <CheckSquare className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
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
                    <div className="text-2xl font-bold">6.5</div>
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
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <p className="text-muted-foreground flex items-center gap-1 text-xs">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      +5% this week
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Area */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Wellness Chart */}
                <Link href="/dashboard/wellness" className="md:col-span-2">
                  <Card className="hover:bg-accent/50 h-full cursor-pointer transition-colors">
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
                <Card className="h-full md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest actions and updates</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Completed &quot;Project Review&quot;
                          </p>
                          <p className="text-muted-foreground text-xs">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Took wellness survey</p>
                          <p className="text-muted-foreground text-xs">
                            {surveyData && surveyData.completedAt
                              ? new Date(surveyData.completedAt).toLocaleDateString()
                              : '1 day ago'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Started &quot;Team Meeting Prep&quot;
                          </p>
                          <p className="text-muted-foreground text-xs">Yesterday</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Updated project status</p>
                          <p className="text-muted-foreground text-xs">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Attended team standup</p>
                          <p className="text-muted-foreground text-xs">3 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Submitted quarterly report</p>
                          <p className="text-muted-foreground text-xs">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ClientOnly>
    </ProtectedRoute>
  );
}
