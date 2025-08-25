'use client';

import { ClientOnly } from '@/components/core/client-only';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface RouteAnimationProps {
  children: ReactNode;
  className?: string;
}

export function RouteAnimation({ children, className = '' }: RouteAnimationProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsClient(true);
    setIsAnimating(true);

    // Reset animation state after transition completes
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Define route-specific animation classes
  const getRouteAnimationClass = () => {
    const baseClass = 'min-h-screen transition-all ease-out';

    switch (pathname) {
      case '/':
        return cn(
          baseClass,
          'duration-600',
          isAnimating ? 'opacity-0 scale-95 translate-y-5' : 'opacity-100 scale-100 translate-y-0'
        );

      case '/survey':
        return cn(
          baseClass,
          'duration-500',
          isAnimating ? 'opacity-0 translate-x-24 scale-95' : 'opacity-100 translate-x-0 scale-100'
        );

      case '/survey/results':
        return cn(
          baseClass,
          'duration-700',
          isAnimating ? 'opacity-0 translate-y-12' : 'opacity-100 translate-y-0'
        );

      case '/dashboard':
        return cn(
          baseClass,
          'duration-400',
          isAnimating ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
        );

      default:
        return cn(
          baseClass,
          'duration-400',
          isAnimating ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'
        );
    }
  };

  // Render without animations on server and during hydration
  if (!isClient) {
    return <div className={cn('min-h-screen', className)}>{children}</div>;
  }

  return (
    <ClientOnly fallback={<div className={cn('min-h-screen', className)}>{children}</div>}>
      <div key={pathname} className={cn(getRouteAnimationClass(), className)}>
        {children}
      </div>
    </ClientOnly>
  );
}

// Specific page animation components
export function HomePageAnimation({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        'duration-600 min-h-screen transition-all ease-out',
        isMounted ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-5 scale-95 opacity-0'
      )}
    >
      {children}
    </div>
  );
}

export function SurveyPageAnimation({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        'min-h-screen transition-all duration-500 ease-out',
        isMounted ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-24 scale-95 opacity-0'
      )}
    >
      {children}
    </div>
  );
}

export function ResultsPageAnimation({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        'min-h-screen transition-all duration-700 ease-out',
        isMounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      )}
    >
      {children}
    </div>
  );
}
