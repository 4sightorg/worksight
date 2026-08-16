'use client';

import { useAuth } from '@/auth';
import { AdminRoute } from '@/components/admin';
import { SessionTimer } from '@/components/features';
import { AppSidebar } from '@/components/main/sidebar';
import { Badge } from '@/components/ui/badge';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { sections } from '@/data/sections';
import {
    AlertTriangle,
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Filter,
    LogOut,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { isApiDataMode, worksightApi } from '@/lib/worksight-api';
import { fetchUsersWithMetricsFromApi } from '@/lib/mvp-api-bridge';
import { EmployeeLookup, SurveyResponseList } from '@worksight/common';

interface BurnoutData {
  department: string;
  avgScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  employeeCount: number;
  trend: 'up' | 'down' | 'stable';
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function ReportsContent() {
  const { logout } = useAuth();
  const [data, setData] = useState<BurnoutData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallScore, setOverallScore] = useState<number>(5.5);
  const [highRiskCount, setHighRiskCount] = useState<number>(0);
  const [completionPercentage, setCompletionPercentage] = useState<number>(85);
  const [avgWorkHours, setAvgWorkHours] = useState<number>(7.2);
  const [highestRiskDept, setHighestRiskDept] = useState<string>('Engineering');

  useEffect(() => {
    async function loadData() {
      try {
        let usersWithMetrics: Array<{
          department: string;
          burnoutScore: number;
          surveyCompleted: boolean;
          riskLevel: 'low' | 'medium' | 'high';
        }> = [];

        if (isApiDataMode()) {
          usersWithMetrics = await fetchUsersWithMetricsFromApi();
          try {
            const orgStats = await worksightApi.getOrgStats();
            setAvgWorkHours(orgStats.avgAttendanceHours);
          } catch {}
        } else {
          const employees = new EmployeeLookup().all();
          const submissions = SurveyResponseList;
          const latestByEmp = new Map<string, number>();
          for (const sub of submissions) {
            if (sub.avg_score != null) {
              latestByEmp.set(sub.employee_id, Math.min(10, Math.round(sub.avg_score * 2 * 10) / 10));
            }
          }

          usersWithMetrics = employees
            .filter(e => e.role !== 'guest')
            .map(e => {
              const dept = e.department[0] || 'Unassigned';
              const score = latestByEmp.get(e.id) ?? 5.0;
              return {
                department: dept,
                burnoutScore: score,
                surveyCompleted: latestByEmp.has(e.id),
                riskLevel: score >= 7 ? 'high' : score >= 4 ? 'medium' : 'low',
              };
            });
        }

        // Group by department
        const deptMap = new Map<string, { scores: number[]; count: number }>();
        let totalScore = 0;
        let highRisk = 0;
        let completedSurveys = 0;

        for (const u of usersWithMetrics) {
          const dept = u.department || 'Unassigned';
          const existing = deptMap.get(dept) ?? { scores: [], count: 0 };
          existing.scores.push(u.burnoutScore);
          existing.count += 1;
          deptMap.set(dept, existing);

          totalScore += u.burnoutScore;
          if (u.burnoutScore >= 7) highRisk += 1;
          if (u.surveyCompleted) completedSurveys += 1;
        }

        const computedDepts: BurnoutData[] = [];
        let maxDeptName = 'Engineering';
        let maxDeptScore = 0;

        deptMap.forEach((val, deptName) => {
          const avg = val.scores.length
            ? Math.round((val.scores.reduce((a, b) => a + b, 0) / val.scores.length) * 10) / 10
            : 0;
          if (avg > maxDeptScore) {
            maxDeptScore = avg;
            maxDeptName = deptName;
          }
          computedDepts.push({
            department: deptName.charAt(0).toUpperCase() + deptName.slice(1),
            avgScore: avg,
            riskLevel: avg >= 7 ? 'high' : avg >= 4 ? 'medium' : 'low',
            employeeCount: val.count,
            trend: avg >= 6 ? 'up' : 'stable',
          });
        });

        const overallAvg = usersWithMetrics.length
          ? Math.round((totalScore / usersWithMetrics.length) * 10) / 10
          : 5.5;
        const completion = usersWithMetrics.length
          ? Math.round((completedSurveys / usersWithMetrics.length) * 100)
          : 85;

        setData(computedDepts.length > 0 ? computedDepts : [
          { department: 'Engineering', avgScore: 6.2, riskLevel: 'medium', employeeCount: 12, trend: 'stable' },
          { department: 'Backend', avgScore: 4.5, riskLevel: 'medium', employeeCount: 8, trend: 'stable' },
        ]);
        setOverallScore(overallAvg);
        setHighRiskCount(highRisk);
        setCompletionPercentage(completion);
        setHighestRiskDept(maxDeptName.charAt(0).toUpperCase() + maxDeptName.slice(1));
      } catch (err) {
        console.error('Error loading admin reports data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const metrics: MetricCard[] = [
    {
      title: 'Overall Burnout Score',
      value: `${overallScore}/10`,
      change: 'computed score',
      trend: overallScore > 6 ? 'up' : 'down',
      icon: BarChart3,
      color: 'text-orange-600',
    },
    {
      title: 'High Risk Employees',
      value: `${highRiskCount}`,
      change: 'score ≥ 7.0',
      trend: highRiskCount > 0 ? 'up' : 'down',
      icon: AlertTriangle,
      color: 'text-red-600',
    },
    {
      title: 'Survey Completion',
      value: `${completionPercentage}%`,
      change: 'completion rate',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Avg Daily Hours',
      value: `${avgWorkHours} hrs`,
      change: 'attendance avg',
      trend: 'down',
      icon: Clock,
      color: 'text-blue-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar sections={sections.sections} defaultSection={sections.defaultSection} />
      <SidebarInset>
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 flex h-16 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Analytics & Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <SessionTimer />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6">
          <div className="animate-in fade-in slide-in-from-bottom-5 opacity-100 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
                </div>
                <p className="text-muted-foreground">
                  Comprehensive burnout analytics and organizational insights
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled title="Filtering disabled in current build">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" disabled title="Date range disabled in current build">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date Range
                </Button>
                <Button size="sm" disabled title="Export disabled in current build">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric, index) => (
                <div
                  key={metric.title}
                  className="animate-in fade-in slide-in-from-bottom-5 opacity-100 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                      <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <p className="text-muted-foreground flex items-center gap-1 text-xs">
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-red-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-green-500" />
                        )}
                        {metric.change}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Department Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Burnout by Department</CardTitle>
                <CardDescription>
                  Average burnout scores and risk levels across all departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.map((dept, index) => (
                    <div
                      key={dept.department}
                      className="animate-in fade-in slide-in-from-left-5 flex items-center justify-between rounded-lg border p-4 opacity-100 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold">{dept.department}</h3>
                          <p className="text-muted-foreground text-sm">
                            {dept.employeeCount} employees
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold">{dept.avgScore}/10</div>
                          <div className="text-muted-foreground text-xs">Avg Score</div>
                        </div>

                        <Badge className={getRiskColor(dept.riskLevel)}>
                          {dept.riskLevel} risk
                        </Badge>

                        {getTrendIcon(dept.trend)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Critical Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <h4 className="font-semibold text-red-800">High Risk Alert</h4>
                    <p className="text-sm text-red-700">
                      {highestRiskDept} department currently records highest relative burnout scores.
                    </p>
                  </div>
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                    <h4 className="font-semibold text-yellow-800">Survey Completion</h4>
                    <p className="text-sm text-yellow-700">
                      {Math.max(0, 100 - completionPercentage)}% of employees have not completed recent assessments.
                    </p>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <h4 className="font-semibold text-blue-800">Workload Signals</h4>
                    <p className="text-sm text-blue-700">
                      Average daily tracked hours stand at {avgWorkHours} hrs per employee.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                    <h4 className="font-semibold text-green-800">Immediate Action</h4>
                    <p className="text-sm text-green-700">
                      Schedule 1:1 check-ins with team leads in {highestRiskDept}.
                    </p>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <h4 className="font-semibold text-blue-800">Process Improvement</h4>
                    <p className="text-sm text-blue-700">
                      Rebalance sprint points for teams working after hours.
                    </p>
                  </div>
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
                    <h4 className="font-semibold text-purple-800">Long-term Strategy</h4>
                    <p className="text-sm text-purple-700">
                      Monitor weekly burnout trends across all active departments.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function ReportsPage() {
  return (
    <AdminRoute requireManager>
      <ReportsContent />
    </AdminRoute>
  );
}
