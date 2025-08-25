'use client';

import { useAuth } from '@/auth';
import { LoadingState } from '@/components/core';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRole?: string[];
}

export function ProtectedRoute({ children, fallback, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }

    if (user && requiredRole && user.role && !requiredRole.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router, requiredRole]);

  // Show loading spinner while checking auth state
  if (isLoading) {
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
