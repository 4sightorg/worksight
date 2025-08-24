'use client';

import { useAuth } from '@/auth';
import { LoadingState } from '@/components/loading-state';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking auth state
  if (isLoading) {
    return <LoadingState fullScreen text="Checking authentication..." />;
  }

  // Show fallback while redirecting to login
  if (!user) {
    return fallback || <LoadingState fullScreen text="Redirecting to login..." />;
  }

  return <>{children}</>;
}
