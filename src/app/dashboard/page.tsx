'use client';

import { useAuth } from '@/auth';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ClientOnly } from '@/components/client-only';
import { AppSidebar } from '@/components/main/sidebar';
import { SessionTimer } from '@/components/session-timer';
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
import { Activity, CheckSquare, Clock, LogOut, TrendingUp, User } from 'lucide-react';

function DashboardContent() {
  const { user, logout } = useAuth();

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
                <BreadcrumbLink href="#">{sections.defaultPart}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{sections.defaultSection}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <ClientOnly fallback={<div className="bg-muted h-7 w-20 animate-pulse rounded" />}>
              <SessionTimer />
            </ClientOnly>
            {/* <ClientOnly fallback={<div className="bg-muted h-8 w-8 animate-pulse rounded" />}>
              <ModeToggle />
            </ClientOnly> */}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.name || user?.email}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Here&apos;s what&apos;s happening with your work today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-shadow hover:shadow-md">
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

            <Card className="transition-shadow hover:shadow-md">
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

            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Burnout Level</CardTitle>
                <User className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Low</div>
                <p className="text-muted-foreground text-xs">Good work-life balance</p>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Activity */}
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest work activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      time: '2 hours ago',
                      activity: 'Completed task: Update user documentation',
                      type: 'task',
                    },
                    {
                      time: '4 hours ago',
                      activity: 'Started working on new feature',
                      type: 'feature',
                    },
                    {
                      time: '6 hours ago',
                      activity: 'Team meeting - Sprint planning',
                      type: 'meeting',
                    },
                    { time: '1 day ago', activity: 'Code review completed', type: 'review' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="hover:bg-muted/50 flex items-center gap-3 rounded-lg p-3 transition-colors"
                    >
                      <div className="bg-primary h-2 w-2 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.activity}</p>
                        <p className="text-muted-foreground text-xs">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Create New Task
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  Start Timer
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
