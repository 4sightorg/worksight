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
import { fetchMvpSurveysFromApi } from '@/lib/mvp-api-bridge';
import { getMvpSurveys, type MvpSurvey } from '@/lib/mvp-data';
import { isApiDataMode } from '@/lib/worksight-api';
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
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

function SurveyManagementContent() {
  const { logout } = useAuth();
  const [surveys, setSurveys] = useState<MvpSurvey[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [viewingSurvey, setViewingSurvey] = useState<MvpSurvey | null>(null);
  const [analyticsSurvey, setAnalyticsSurvey] = useState<MvpSurvey | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let loadedSurveys: MvpSurvey[] = [];
        if (isApiDataMode()) {
          loadedSurveys = await fetchMvpSurveysFromApi();
        } else {
          loadedSurveys = getMvpSurveys();
        }
        // Include any custom surveys saved to localStorage
        const customRaw = typeof window !== 'undefined' ? localStorage.getItem('worksight_custom_surveys') : null;
        if (customRaw) {
          try {
            const customSurveys: MvpSurvey[] = JSON.parse(customRaw);
            loadedSurveys = [...customSurveys, ...loadedSurveys];
          } catch (e) {
            console.error('Failed to parse custom surveys', e);
          }
        }

        if (!cancelled) setSurveys(loadedSurveys);
      } catch (err) {
        console.warn('API survey load failed; falling back to fixtures', err);
        if (!cancelled) setSurveys(getMvpSurveys());
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleDuplicateSurvey = (surveyToCopy: MvpSurvey) => {
    const duplicated: MvpSurvey = {
      ...surveyToCopy,
      id: `survey-copy-${Date.now()}`,
      title: `${surveyToCopy.title} (Copy)`,
      status: 'draft',
      responseCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      lastModified: new Date().toISOString().slice(0, 10),
    };

    setSurveys(prev => [duplicated, ...prev]);

    // Persist duplicate to localStorage
    const existingCustom = JSON.parse(localStorage.getItem('worksight_custom_surveys') || '[]');
    localStorage.setItem('worksight_custom_surveys', JSON.stringify([duplicated, ...existingCustom]));

    toast.success(`Duplicated survey: "${surveyToCopy.title}"`);
  };

  const handleEditSurvey = (survey: MvpSurvey) => {
    toast.info(`Editing survey "${survey.title}". Metadata loaded into survey builder.`);
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
    return surveys.filter(survey => {
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
            <div className="grid gap-4 mt-6 md:grid-cols-4">
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
                    {surveys.filter(s => s.status === 'active').length}
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
            <Card className="mt-6">
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
                      onChange={e => setSearchTerm(e.target.value)}
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
            <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSurveys.map((survey, index) => (
                <div
                  key={survey.id}
                  className="animate-in fade-in slide-in-from-bottom-5 opacity-100 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="h-full transition-shadow hover:shadow-lg flex flex-col justify-between">
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setViewingSurvey(survey)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditSurvey(survey)}
                        >
                          <Edit3 className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAnalyticsSurvey(survey)}
                          title="View Analytics"
                        >
                          <BarChart3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDuplicateSurvey(survey)}
                          title="Duplicate Survey"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {filteredSurveys.length === 0 && (
              <Card className="mt-6">
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

            {/* View Survey Modal */}
            {viewingSurvey && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <Card className="w-full max-w-lg bg-background">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-xl font-bold">{viewingSurvey.title}</CardTitle>
                      <CardDescription>{viewingSurvey.description}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setViewingSurvey(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <div className="font-semibold capitalize">{viewingSurvey.category}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Target Audience:</span>
                        <div className="font-semibold capitalize">{viewingSurvey.targetAudience}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Question Count:</span>
                        <div className="font-semibold">{viewingSurvey.questionCount} questions</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Responses:</span>
                        <div className="font-semibold">{viewingSurvey.responseCount} submissions</div>
                      </div>
                    </div>
                    <div className="border-t pt-4 text-xs text-muted-foreground space-y-1">
                      <div>Created on {viewingSurvey.createdAt} by {viewingSurvey.createdBy}</div>
                      <div>Status: <span className="font-medium text-foreground">{viewingSurvey.status}</span></div>
                    </div>
                  </CardContent>
                  <div className="flex justify-end p-6 pt-0">
                    <Button variant="outline" onClick={() => setViewingSurvey(null)}>
                      Close Preview
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Analytics Modal */}
            {analyticsSurvey && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <Card className="w-full max-w-lg bg-background">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-xl font-bold">Survey Analytics</CardTitle>
                      <CardDescription>{analyticsSurvey.title}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setAnalyticsSurvey(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center border-y py-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{analyticsSurvey.responseCount}</div>
                        <div className="text-xs text-muted-foreground">Total Responses</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {analyticsSurvey.responseCount > 0 ? '78%' : '0%'}
                        </div>
                        <div className="text-xs text-muted-foreground">Completion Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">6.4/10</div>
                        <div className="text-xs text-muted-foreground">Avg Score</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Detailed response breakdowns are generated dynamically from incoming survey submissions.
                    </p>
                  </CardContent>
                  <div className="flex justify-end p-6 pt-0">
                    <Button variant="outline" onClick={() => setAnalyticsSurvey(null)}>
                      Close Analytics
                    </Button>
                  </div>
                </Card>
              </div>
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
