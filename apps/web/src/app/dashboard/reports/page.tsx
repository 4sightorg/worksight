'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { ClientOnly } from '@/components/core';
import { DashboardSubNav } from '@/components/dashboard/sub-nav';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isApiDataMode, worksightApi } from '@/lib/worksight-api';
import { ActivityLookup, AssignmentLookup, AttendanceLookup, EmployeeLookup, SurveyResponseList } from '@worksight/common';
import { Activity, BarChart3, CheckCircle2, CheckSquare, Clock, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrgStats {
  totalEmployees: number;
  activeTasks: number;
  tasksByStatus: { todo: number; in_progress: number; completed: number };
  avgAttendanceHours: number;
  recentSurveyAvg: number | null;
  activitiesLast7d: number;
}

export default function ReportsPage() {
  const [stats, setStats] = useState<OrgStats | null>(null);

  useEffect(() => {
    async function loadData() {
      if (isApiDataMode()) {
        try {
          const res = await worksightApi.getOrgStats();
          setStats(res);
        } catch (err) {
          console.error('Failed to load org stats:', err);
        }
      } else {
        const employees = new EmployeeLookup().all();
        const assignments = new AssignmentLookup().all();
        const attendance = new AttendanceLookup().all();
        const submissions = SurveyResponseList;
        const activities = new ActivityLookup().all();

        const tasksByStatus = { todo: 0, in_progress: 0, completed: 0 };
        for (const a of assignments) {
          if (a.status in tasksByStatus) {
            tasksByStatus[a.status as keyof typeof tasksByStatus]++;
          }
        }
        const attHours = attendance
          .map(a => a.hours_worked)
          .filter((h): h is number => h !== null && typeof h === 'number');
        const avgAttendanceHours = attHours.length
          ? Math.round((attHours.reduce((sum, h) => sum + h, 0) / attHours.length) * 100) / 100
          : 0;

        const surveyScores = submissions
          .map(s => s.avg_score)
          .filter((s): s is number => s !== null && typeof s === 'number');
        const recentSurveyAvg = surveyScores.length
          ? Math.round((surveyScores.reduce((sum, s) => sum + s, 0) / surveyScores.length) * 100) / 100
          : null;

        const maxTime = activities.length
          ? Math.max(...activities.map(a => new Date(a.timestamp).getTime()))
          : Date.now();
        const weekAgo = maxTime - 7 * 24 * 60 * 60 * 1000;
        const activitiesLast7d = activities.filter(
          a => new Date(a.timestamp).getTime() >= weekAgo
        ).length;

        setStats({
          totalEmployees: employees.length,
          activeTasks: tasksByStatus.todo + tasksByStatus.in_progress,
          tasksByStatus,
          avgAttendanceHours,
          recentSurveyAvg,
          activitiesLast7d,
        });
      }
    }
    loadData();
  }, []);

  const totalTasks = stats
    ? stats.tasksByStatus.todo + stats.tasksByStatus.in_progress + stats.tasksByStatus.completed
    : 0;
  const completionRate = totalTasks > 0 && stats ? Math.round((stats.tasksByStatus.completed / totalTasks) * 100) : 0;

  return (
    <ProtectedRoute>
      <ClientOnly>
        <div className="space-y-6 p-6">
          <DashboardSubNav
            aria-label="Reports sub navigation"
            items={[
              { label: 'Tasks', href: '/dashboard/tasks' },
              { label: 'Attendance', href: '/dashboard/attendance' },
              { label: 'Reports', href: '/dashboard/reports' },
              { label: 'Wellness', href: '/dashboard/wellness' },
            ]}
          />
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
              <p className="text-muted-foreground">Team performance reports and organizational aggregates</p>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              {isApiDataMode() ? 'Live API Aggregates' : 'Fixture Aggregates'}
            </Badge>
          </div>

          {/* Task Performance Summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card elevation="sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <CheckSquare className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTasks}</div>
                <p className="text-muted-foreground text-xs">All assignments across organization</p>
              </CardContent>
            </Card>

            <Card elevation="sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                <Activity className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeTasks ?? 0}</div>
                <p className="text-muted-foreground text-xs">Todo and in-progress items</p>
              </CardContent>
            </Card>

            <Card elevation="sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                <CheckCircle2 className="text-green-600 h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.tasksByStatus.completed ?? 0}</div>
                <p className="text-muted-foreground text-xs">Successfully finished</p>
              </CardContent>
            </Card>

            <Card elevation="sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <BarChart3 className="text-blue-600 h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
                <p className="text-muted-foreground text-xs">Overall completion percentage</p>
              </CardContent>
            </Card>
          </div>

          {/* Attendance & Activity Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card elevation="sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Attendance Summary
                </CardTitle>
                <CardDescription>Work hours and attendance averages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm font-medium">Average Daily Work Hours</span>
                  <span className="text-xl font-bold">{stats?.avgAttendanceHours ?? 0} hrs</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm font-medium">Total Tracked Employees</span>
                  <span className="text-xl font-bold">{stats?.totalEmployees ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Activities Logged (7 Days)</span>
                  <span className="text-xl font-bold">{stats?.activitiesLast7d ?? 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card elevation="sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  Wellness & Survey Trend
                </CardTitle>
                <CardDescription>Organization-wide burnout and survey score averages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm font-medium">Recent Survey Average</span>
                  <span className="text-xl font-bold">
                    {stats?.recentSurveyAvg != null ? `${stats.recentSurveyAvg} / 5` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm font-medium">Org Burnout Risk Index</span>
                  <Badge variant={stats && stats.recentSurveyAvg && stats.recentSurveyAvg > 3.8 ? 'secondary' : 'default'}>
                    {stats && stats.recentSurveyAvg
                      ? stats.recentSurveyAvg > 3.8
                        ? 'Optimal'
                        : 'Moderate Risk'
                      : 'Stable'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Task Distribution</span>
                  <div className="flex gap-2 text-xs font-semibold">
                    <span className="text-yellow-600">{stats?.tasksByStatus.todo ?? 0} Todo</span>
                    <span className="text-blue-600">{stats?.tasksByStatus.in_progress ?? 0} In Progress</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ClientOnly>
    </ProtectedRoute>
  );
}
