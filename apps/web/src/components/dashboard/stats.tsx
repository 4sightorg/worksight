'use client';

import { useAuth } from '@/auth';
import { isOfflineMode } from '@/auth/offline';
import { SurveyResultsCard } from '@/components/dashboard/survey-results-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Employees } from '@/data/employees';
import {
  getAfterHoursActivities,
  getDataSourceUsageStats,
  getEmployeeProductivityStats,
  getTeamMetaStats,
  getWeekendActivities,
} from '@/data/work-tracking';
import { useEffect, useState } from 'react';

export function DashboardStats() {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(isOfflineMode());
  }, []);

  // Get current user's stats if they're an employee
  const currentEmployee = user
    ? Object.entries(Employees).find(([_, emp]) => emp.email === user.email)
    : null;
  const currentEmployeeStats = currentEmployee
    ? getEmployeeProductivityStats(currentEmployee[0])
    : null;

  const teamMetaStats = getTeamMetaStats();
  const dataSourceStats = getDataSourceUsageStats();
  const weekendActivities = getWeekendActivities();
  const afterHoursActivities = getAfterHoursActivities();

  return (
    <div className="space-y-6">
      {/* Content only, no header */}

      {/* Personal Stats (if current user is an employee) */}
      {currentEmployeeStats && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Productivity Stats</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                <Badge variant="outline">{currentEmployeeStats.completionRate.toFixed(0)}%</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentEmployeeStats.completedTasks}/{currentEmployeeStats.totalTasks}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Story Points</CardTitle>
                <Badge variant="outline">
                  {currentEmployeeStats.storyPointsCompletionRate.toFixed(0)}%
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentEmployeeStats.completedStoryPoints}/
                  {currentEmployeeStats.totalStoryPoints}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Work-Life Balance</CardTitle>
                <Badge
                  variant={
                    currentEmployeeStats.workLifeBalanceScore > 80 ? 'default' : 'destructive'
                  }
                >
                  {currentEmployeeStats.workLifeBalanceScore.toFixed(0)}%
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground text-sm">
                  {currentEmployeeStats.weekendActivities} weekend,{' '}
                  {currentEmployeeStats.afterHoursActivities} after-hours
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentEmployeeStats.totalActivities}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Survey Results Card */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Assessment Results</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <SurveyResultsCard />
        </div>
      </div>

      {/* Team Stats */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Team Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(Employees).length}</div>
              <p className="text-muted-foreground text-xs">4sight employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Self-Awareness Level</CardTitle>
              <Badge variant="secondary">Meta</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMetaStats.selfAwarenessLevel}</div>
              <p className="text-muted-foreground text-xs">
                {teamMetaStats.metaActivityPercentage.toFixed(1)}% meta activities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">4th Wall Integrity</CardTitle>
              <Badge variant={teamMetaStats.fourthWallIntegrity > 50 ? 'outline' : 'destructive'}>
                {teamMetaStats.fourthWallIntegrity}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm">
                {teamMetaStats.fourthWallIntegrity < 50 ? 'Severely broken' : 'Mostly intact'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekend Warriors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weekendActivities.length}</div>
              <p className="text-muted-foreground text-xs">activities on weekends</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Sources */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Data Source Usage</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(dataSourceStats).map(([sourceId, stats]) => (
            <Card key={sourceId}>
              <CardHeader>
                <CardTitle className="text-lg">{stats.name}</CardTitle>
                <CardDescription>{stats.types.join(', ')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Assignments</span>
                    <Badge variant="outline">{stats.assignments}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Activities</span>
                    <Badge variant="outline">{stats.activities}</Badge>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total</span>
                    <Badge>{stats.total}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Meta Commentary */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎭 Meta Commentary
            <Badge variant="secondary">Breaking the 4th Wall</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            You&apos;re looking at a dashboard that tracks productivity while being built by the
            very people it&apos;s tracking. The irony levels are{' '}
            {teamMetaStats.selfAwarenessLevel > 10 ? 'dangerously high' : 'acceptable'}. We have{' '}
            {afterHoursActivities.length} after-hours activities because apparently building a
            work-life balance tracker requires sacrificing work-life balance. The meta level is at
            maximum capacity! 🚀
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
