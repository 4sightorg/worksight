'use client';

import { canManageSurveys, canManageUsers, isAdmin, isManager } from '@/auth/admin';
import { useAuth } from '@/auth/provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireManager?: boolean;
  requireUserManagement?: boolean;
  requireSurveyManagement?: boolean;
  fallbackPath?: string;
}

export function AdminRoute({
  children,
  requireAdmin = false,
  requireManager = false,
  requireUserManagement = false,
  requireSurveyManagement = false,
  fallbackPath = '/dashboard',
}: AdminRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  // Check specific permissions
  const hasPermission =
    (!requireAdmin || isAdmin(user)) &&
    (!requireManager || isManager(user)) &&
    (!requireUserManagement || canManageUsers(user)) &&
    (!requireSurveyManagement || canManageSurveys(user));

  if (!hasPermission) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="mt-4">Access Denied</CardTitle>
            <CardDescription>
              You don&apos;t have permission to access this page. This area is restricted to
              administrators and managers only.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push(fallbackPath)} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
