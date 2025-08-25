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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { sections } from '@/data/sections';
import {
  BarChart3,
  Copy,
  Edit3,
  Eye,
  FileText,
  LogOut,
  Play,
  Plus,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  questionCount: number;
  responseCount: number;
  createdAt: string;
  lastModified: string;
  createdBy: string;
  category: 'burnout' | 'satisfaction' | 'wellness' | 'feedback';
  targetAudience: 'all' | 'managers' | 'employees' | 'specific';
}

const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Burnout Assessment 2025',
    description: 'Comprehensive burnout evaluation for all employees',
    status: 'active',
    questionCount: 15,
    responseCount: 247,
    createdAt: '2025-01-15',
    lastModified: '2025-01-20',
    createdBy: 'Admin User',
    category: 'burnout',
    targetAudience: 'all',
  },
  {
    id: '2',
    title: 'Job Satisfaction Survey',
    description: 'Quarterly job satisfaction and engagement survey',
    status: 'active',
    questionCount: 12,
    responseCount: 156,
    createdAt: '2025-01-10',
    lastModified: '2025-01-18',
    createdBy: 'HR Manager',
    category: 'satisfaction',
    targetAudience: 'employees',
  },
  {
    id: '3',
    title: 'Manager Feedback Survey',
    description: 'Leadership effectiveness and team dynamics assessment',
    status: 'draft',
    questionCount: 8,
    responseCount: 0,
    createdAt: '2025-01-22',
    lastModified: '2025-01-22',
    createdBy: 'Admin User',
    category: 'feedback',
    targetAudience: 'managers',
  },
  {
    id: '4',
    title: 'Wellness Check Q4 2024',
    description: 'Mental health and wellness assessment',
    status: 'completed',
    questionCount: 10,
    responseCount: 312,
    createdAt: '2024-10-01',
    lastModified: '2024-12-31',
    createdBy: 'Wellness Team',
    category: 'wellness',
    targetAudience: 'all',
  },
  {
    id: '5',
    title: 'Remote Work Experience',
    description: 'Evaluation of remote work setup and productivity',
    status: 'paused',
    questionCount: 14,
    responseCount: 89,
    createdAt: '2025-01-05',
    lastModified: '2025-01-19',
    createdBy: 'Operations Lead',
    category: 'feedback',
    targetAudience: 'all',
  },
];

function SurveyManagementContent() {
  const { logout } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSurveys(mockSurveys);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'paused':
        return 'outline';
      case 'completed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'draft':
        return 'text-gray-600';
      case 'paused':
        return 'text-yellow-600';
      case 'completed':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'burnout':
        return 'bg-red-100 text-red-800';
      case 'satisfaction':
        return 'bg-blue-100 text-blue-800';
      case 'wellness':
        return 'bg-green-100 text-green-800';
      case 'feedback':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      const matchesSearch =
        survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.createdBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || survey.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [surveys, searchTerm, statusFilter, categoryFilter]);

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
                <BreadcrumbPage>Survey Management</BreadcrumbPage>
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
                  <FileText className="h-6 w-6 text-green-600" />
                  <h1 className="text-3xl font-bold tracking-tight">Survey Management</h1>
                </div>
                <p className="text-muted-foreground">
                  Create, manage, and analyze burnout assessment surveys
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/survey/builder">
                    <Settings className="mr-2 h-4 w-4" />
                    Survey Builder
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/admin/surveys/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Survey
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Surveys</CardTitle>
                  <FileText className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{surveys.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Surveys</CardTitle>
                  <Play className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {surveys.filter((s) => s.status === 'active').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {surveys.reduce((sum, s) => sum + s.responseCount, 0)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {surveys.length > 0
                      ? Math.round(
                          (surveys.reduce((sum, s) => sum + s.responseCount, 0) /
                            (surveys.length * 250)) *
                            100
                        )
                      : 0}
                    %
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters & Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      placeholder="Search surveys by title, description, or creator..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="burnout">Burnout</SelectItem>
                      <SelectItem value="satisfaction">Satisfaction</SelectItem>
                      <SelectItem value="wellness">Wellness</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Surveys Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSurveys.map((survey, index) => (
                <div
                  key={survey.id}
                  className="animate-in fade-in slide-in-from-bottom-5 opacity-100 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="line-clamp-2 text-lg">{survey.title}</CardTitle>
                          <Badge
                            variant={getStatusBadgeVariant(survey.status)}
                            className={getStatusColor(survey.status)}
                          >
                            {survey.status}
                          </Badge>
                        </div>
                        <Badge variant="outline" className={getCategoryColor(survey.category)}>
                          {survey.category}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {survey.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Questions:</span>
                          <div className="font-medium">{survey.questionCount}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Responses:</span>
                          <div className="font-medium">{survey.responseCount}</div>
                        </div>
                      </div>

                      <div className="text-muted-foreground space-y-1 text-xs">
                        <div>Created: {survey.createdAt}</div>
                        <div>By: {survey.createdBy}</div>
                        <div>Target: {survey.targetAudience}</div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit3 className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {filteredSurveys.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="text-muted-foreground mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-semibold">No surveys found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                      ? 'Try adjusting your filters or search terms.'
                      : 'Get started by creating your first survey.'}
                  </p>
                  <Button asChild>
                    <Link href="/admin/surveys/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Survey
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function SurveyManagementPage() {
  return (
    <AdminRoute requireSurveyManagement>
      <SurveyManagementContent />
    </AdminRoute>
  );
}
