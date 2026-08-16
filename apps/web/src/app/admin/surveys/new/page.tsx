'use client';

import { useAuth } from '@/auth';
import { AdminRoute } from '@/components/admin';
import { SessionTimer } from '@/components/features';
import { AppSidebar } from '@/components/main/sidebar';
import { SurveyBuilder } from '@/components/survey/builder';
import { SurveyQuestion } from '@/components/survey/form';
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
import { Label } from '@/components/ui/label';
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
import { logAuditEvent } from '@/lib/audit-store';
import { type MvpSurvey } from '@/lib/mvp-data';
import { isApiDataMode, worksightApi } from '@/lib/worksight-api';
import { ArrowLeft, FileText, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

function NewSurveyContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'burnout' | 'satisfaction' | 'wellness' | 'feedback'>('wellness');
  const [targetAudience, setTargetAudience] = useState<'all' | 'managers' | 'employees' | 'specific'>('all');
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleSaveSurvey = async (questions: SurveyQuestion[]) => {
    if (!title.trim()) {
      toast.error('Please enter a survey title');
      return;
    }
    if (questions.length === 0) {
      toast.error('Please add at least one question to your survey');
      return;
    }

    setIsSaving(true);
    try {
      if (isApiDataMode()) {
        await worksightApi.createSurvey({
          created_by: user?.id,
        });
      }

      // Also persist to offline local storage for fallback/demo consistency
      const newMvpSurvey: MvpSurvey = {
        id: `survey-${Date.now()}`,
        title,
        description: description || 'Burnout and wellness survey created via Survey Builder',
        status: 'active',
        questionCount: questions.length,
        responseCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        lastModified: new Date().toISOString().slice(0, 10),
        createdBy: user?.name || 'Admin User',
        category,
        targetAudience,
      };

      const existingSurveys = JSON.parse(localStorage.getItem('worksight_custom_surveys') || '[]');
      existingSurveys.unshift(newMvpSurvey);
      localStorage.setItem('worksight_custom_surveys', JSON.stringify(existingSurveys));

      logAuditEvent({
        actor: user?.email || 'admin@worksight.com',
        action: 'SURVEY_CREATE',
        target: `Survey: ${title}`,
        details: `Created new survey with ${questions.length} questions in ${category} category`,
        status: 'success',
      });

      toast.success('Survey created successfully!');
      router.push('/admin/surveys');
    } catch (err) {
      console.error('Failed to create survey:', err);
      toast.error('Failed to create survey. Saved to local storage.');
      router.push('/admin/surveys');
    } finally {
      setIsSaving(false);
    }
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
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/surveys">Surveys</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>New Survey</BreadcrumbPage>
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
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild className="mr-1">
                  <Link href="/admin/surveys">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <FileText className="h-6 w-6 text-green-600" />
                <h1 className="text-3xl font-bold tracking-tight">Create New Survey</h1>
                {isSaving && <Badge variant="secondary">Saving survey...</Badge>}
              </div>
              <p className="text-muted-foreground">
                Define metadata and construct questions for burnout assessment
              </p>
            </div>
          </div>

          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle>Survey Information</CardTitle>
              <CardDescription>Enter basic details about this assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="survey-title">Survey Title</Label>
                  <Input
                    id="survey-title"
                    placeholder="e.g., Q3 Team Burnout & Workload Index"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="survey-category">Category</Label>
                  <Select
                    value={category}
                    onValueChange={(val: 'burnout' | 'satisfaction' | 'wellness' | 'feedback') => setCategory(val)}
                  >
                    <SelectTrigger id="survey-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wellness">Wellness</SelectItem>
                      <SelectItem value="burnout">Burnout</SelectItem>
                      <SelectItem value="satisfaction">Satisfaction</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="survey-description">Description</Label>
                <Input
                  id="survey-description"
                  placeholder="Provide brief context for respondents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="survey-audience">Target Audience</Label>
                <Select
                  value={targetAudience}
                  onValueChange={(val: 'all' | 'managers' | 'employees' | 'specific') => setTargetAudience(val)}
                >
                  <SelectTrigger id="survey-audience">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    <SelectItem value="managers">Managers & Leads</SelectItem>
                    <SelectItem value="employees">Individual Contributors</SelectItem>
                    <SelectItem value="specific">Specific Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Survey Builder Component */}
          <Card>
            <CardHeader>
              <CardTitle>Survey Question Builder</CardTitle>
              <CardDescription>Add and customize question fields</CardDescription>
            </CardHeader>
            <CardContent>
              <SurveyBuilder
                initialQuestions={[
                  {
                    id: 'q_init_1',
                    type: 'scale',
                    title: 'How would you rate your overall workload this week?',
                    subtitle: '1 = Very Light, 10 = Extremely Heavy',
                    required: true,
                    min: 1,
                    max: 10,
                  },
                ]}
                onSave={handleSaveSurvey}
              />
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function NewSurveyPage() {
  return (
    <AdminRoute requireSurveyManagement>
      <NewSurveyContent />
    </AdminRoute>
  );
}
