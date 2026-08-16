'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, ArrowLeft, FileQuestion, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export function RouteErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route error boundary caught error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <Card className="w-full max-w-md border-destructive/20 bg-destructive/5 shadow-sm">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="mb-2 rounded-full bg-destructive/10 p-3 text-destructive">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Something went wrong</h2>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <p className="text-muted-foreground text-sm">
            {error?.message || 'An unexpected error occurred while loading this section.'}
          </p>
          {error?.digest && (
            <p className="text-muted-foreground rounded bg-muted p-1 font-mono text-xs">
              Digest: {error.digest}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button onClick={() => reset()} size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RouteLoadingSkeleton() {
  return (
    <div className="flex flex-1 flex-col space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          </Card>
        ))}
      </div>

      {/* Main content skeleton */}
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-64" />
          <div className="space-y-3 pt-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </Card>
    </div>
  );
}

export function RouteNotFoundState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="mb-2 rounded-full bg-accent p-3 text-muted-foreground">
            <FileQuestion className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Page Not Found</h2>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <p className="text-muted-foreground text-sm">
            The page or resource you are looking for does not exist or has been moved.
          </p>
          <div className="flex justify-center pt-2">
            <Button asChild size="sm">
              <Link href="/dashboard" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
