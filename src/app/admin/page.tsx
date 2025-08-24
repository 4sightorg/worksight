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
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Database,
  FileText,
  LogOut,
  Settings,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AdminStats {
  totalUsers: number;
  activeSurveys: number;
  completedSurveys: number;
  avgBurnoutScore: number;
  highRiskUsers: number;
  recentActivity: number;
}

function AdminDashboardContent() {
  const { logout } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeSurveys: 0,
    completedSurveys: 0,
    avgBurnoutScore: 0,
    highRiskUsers: 0,
    recentActivity: 0,
  });
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulate fetching admin stats
    // In production, this would be an API call
    const mockStats: AdminStats = {
      totalUsers: 247,
      activeSurveys: 12,
      completedSurveys: 1,
      avgBurnoutScore: 6.2,
      highRiskUsers: 23,
      recentActivity: 45,
    };

    setTimeout(() => setStats(mockStats), 500);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

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
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Admin</BreadcrumbPage>
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
          <div
            className={cn(
              'transition-all duration-500 ease-out',
              isAnimated ? 'opacity-100' : 'opacity-0'
            )}
          >
            {/* Welcome Section */}
            <div
              className={cn(
                'space-y-2 transition-all delay-100 duration-500 ease-out',
                isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              )}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-600" />
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Manage users, surveys, and monitor organizational burnout metrics.
              </p>
            </div>

            {/* Quick Stats */}
            <div
              className={cn(
                'grid gap-4 transition-all delay-200 duration-500 ease-out md:grid-cols-2 lg:grid-cols-4',
                isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              )}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-muted-foreground text-xs">
                    <TrendingUp className="mr-1 inline h-3 w-3 text-green-600" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Surveys</CardTitle>
                  <FileText className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeSurveys}</div>
                  <p className="text-muted-foreground text-xs">
                    {stats.completedSurveys} completed today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Burnout Score</CardTitle>
                  <BarChart3 className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgBurnoutScore}/10</div>
                  <p className="text-muted-foreground text-xs">
                    <AlertTriangle className="mr-1 inline h-3 w-3 text-yellow-600" />
                    Moderate risk level
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk Users</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.highRiskUsers}</div>
                  <p className="text-muted-foreground text-xs">Require immediate attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Action Cards */}
            <div
              className={cn(
                'grid gap-6 transition-all delay-300 duration-500 ease-out md:grid-cols-2 lg:grid-cols-3',
                isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              )}
            >
              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <Link href="/admin/users">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <CardTitle>User Management</CardTitle>
                    </div>
                    <CardDescription>
                      View, edit, and manage user accounts and roles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        {stats.totalUsers} total users
                      </span>
                      <Badge variant="secondary">{stats.recentActivity} recent</Badge>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <Link href="/admin/surveys">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <CardTitle>Survey Management</CardTitle>
                    </div>
                    <CardDescription>
                      Create, edit, and manage burnout assessment surveys
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        {stats.activeSurveys} active surveys
                      </span>
                      <Badge variant="secondary">Updated</Badge>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <Link href="/admin/reports">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <CardTitle>Analytics & Reports</CardTitle>
                    </div>
                    <CardDescription>
                      View detailed burnout analytics and organizational insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Real-time data</span>
                      <Badge variant={stats.avgBurnoutScore > 7 ? 'destructive' : 'secondary'}>
                        {stats.avgBurnoutScore > 7 ? 'High Risk' : 'Monitoring'}
                      </Badge>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <Link href="/admin/settings">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-orange-600" />
                      <CardTitle>System Settings</CardTitle>
                    </div>
                    <CardDescription>
                      Configure system-wide settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Global configuration</span>
                      <Badge variant="outline">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <Link href="/admin/audit">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-indigo-600" />
                      <CardTitle>Audit Logs</CardTitle>
                    </div>
                    <CardDescription>
                      View system activity and security audit trails
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Last 30 days</span>
                      <Badge variant="outline">
                        <Clock className="mr-1 h-3 w-3" />
                        Live
                      </Badge>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminRoute requireManager>
      <AdminDashboardContent />
    </AdminRoute>
  );
}
