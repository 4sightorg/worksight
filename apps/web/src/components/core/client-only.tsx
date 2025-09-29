'use client';

import { ErrorBoundary } from '@/components/core';
import { ReactNode, useCallback, useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  /**
   * Component to show while the client component is mounting
   * @default null
   */
  fallback?: ReactNode;
  /**
   * Component to show if there's an error during mounting or rendering
   * @default <div className="bg-destructive/10 rounded p-2">Error loading component</div>
   */
  errorFallback?: ReactNode;
  /**
   * Whether to retry mounting after an error
   * @default false
   */
  retryOnError?: boolean;
  /**
   * Maximum number of retry attempts
   * @default 3
   */
  maxRetries?: number;
}

const DEFAULT_ERROR_FALLBACK = (
  <div className="bg-destructive/10 rounded p-2">Error loading component</div>
);

export function ClientOnly({
  children,
  fallback = null,
  errorFallback = DEFAULT_ERROR_FALLBACK,
  retryOnError = false,
  maxRetries = 3,
}: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const mount = useCallback(async () => {
    try {
      // Add a small delay to ensure proper hydration
      await new Promise((resolve) => setTimeout(resolve, 0));
      setMounted(true);
      setHasError(false);
    } catch (error) {
      setHasError(true);
      console.error('ClientOnly mounting error:', error);

      // Retry logic
      if (retryOnError && retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1);
        setTimeout(mount, Math.pow(2, retryCount) * 1000); // Exponential backoff
      }
    }
  }, [retryCount, maxRetries, retryOnError]);

  useEffect(() => {
    if (!mounted && !hasError) {
      mount();
    }
  }, [mounted, hasError, mount]);

  // Reset retry count when the children prop changes
  useEffect(() => {
    setRetryCount(0);
  }, [children]);

  if (hasError) {
    return <>{errorFallback}</>;
  }

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <ErrorBoundary fallback={errorFallback}>{children}</ErrorBoundary>;
}
