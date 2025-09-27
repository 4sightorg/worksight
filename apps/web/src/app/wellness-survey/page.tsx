'use client';

import { useAuth } from '@worksight/web/auth';
import { ProtectedRoute } from '@worksight/web/components/auth/protected-route';
import { AppSidebar } from '@worksight/web/components/main/sidebar';
import { SurveyComponent } from '@worksight/web/components/survey/survey-form';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@worksight/web/components/ui/breadcrumb';
import { Button } from '@worksight/web/components/ui/button';
import { Separator } from '@worksight/web/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@worksight/web/components/ui/sidebar';
import { sections } from '@worksight/web/data/sections';
import { LogOut } from 'lucide-react';

function WellnessSurveyContent() {
  const { logout } = useAuth();

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
                <BreadcrumbPage>Wellness Survey</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <SurveyComponent />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function WellnessSurveyPage() {
  return (
    <ProtectedRoute>
      <WellnessSurveyContent />
    </ProtectedRoute>
  );
}
