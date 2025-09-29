'use client';

import { ClientOnly } from '@/components/core/client-only';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsClient(true);
    setIsAnimating(true);

    // Reset animation state after transition completes
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Render without animations on server and during hydration
  if (!isClient) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <ClientOnly fallback={<div className="min-h-screen">{children}</div>}>
      <div
        key={pathname}
        className={cn(
          'min-h-screen transition-all duration-500 ease-out',
          isAnimating
            ? 'translate-y-5 scale-[0.98] opacity-0'
            : 'translate-y-0 scale-100 opacity-100'
        )}
      >
        {children}
      </div>
    </ClientOnly>
  );
}

// Route-specific transition classes
export const routeTransitions = {
  // Home to Survey
  homeToSurvey:
    'transition-all duration-500 ease-out opacity-0 translate-x-24 scale-95 data-[mounted]:opacity-100 data-[mounted]:translate-x-0 data-[mounted]:scale-100',

  // Survey to Results
  surveyToResults:
    'transition-all duration-500 ease-out opacity-0 translate-y-12 data-[mounted]:opacity-100 data-[mounted]:translate-y-0',

  // Results back to Survey
  resultsToSurvey:
    'transition-all duration-500 ease-out opacity-0 -translate-x-24 scale-95 data-[mounted]:opacity-100 data-[mounted]:translate-x-0 data-[mounted]:scale-100',

  // General fade
  fade: 'transition-opacity duration-500 ease-out opacity-0 data-[mounted]:opacity-100',
};

// Custom transition hook for specific routes
export function usePageTransition() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(false);
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  const getTransitionClass = () => {
    const baseClass = 'min-h-screen transition-all duration-500 ease-out';

    if (pathname === '/survey') {
      return cn(baseClass, routeTransitions.homeToSurvey);
    }
    if (pathname === '/survey/results') {
      return cn(baseClass, routeTransitions.surveyToResults);
    }
    if (pathname === '/dashboard') {
      return cn(baseClass, routeTransitions.fade);
    }

    return cn(
      baseClass,
      'opacity-0 translate-y-5 scale-[0.98]',
      isMounted && 'opacity-100 translate-y-0 scale-100'
    );
  };

  return {
    className: getTransitionClass(),
    'data-mounted': isMounted,
  };
}
