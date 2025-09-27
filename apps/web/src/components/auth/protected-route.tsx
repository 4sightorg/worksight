'use client';

import { useAuth } from '@worksight/web/auth';
import { LoadingState } from '@worksight/web/components/core';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: string[];
}

export function ProtectedRoute({ children, fallback, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we've finished initializing and there's no user
    if (initialized && !isLoading && !user) {
      router.push('/login');
    }

    // Handle role-based redirects
    if (user && requiredRole && user.role && !requiredRole.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [user, isLoading, initialized, router, requiredRole]);

  // Show loading spinner while checking auth state or initializing
  if (!initialized || isLoading) {
    return <LoadingState fullScreen text="Checking authentication..." />;
  }

  // Show fallback while redirecting to login
  if (!user) {
    return fallback || <LoadingState fullScreen text="Redirecting to login..." />;
  }

  if (requiredRole && user.role && !requiredRole.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
