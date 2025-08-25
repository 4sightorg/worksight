'use client';

import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface SafeMotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  type?: 'fade' | 'slide' | 'scale';
  triggerOnce?: boolean; // Only animate once
}

// Simplified motion component using Tailwind CSS transitions
export function SafeMotion({
  children,
  className = '',
  delay = 0,
  duration = 0.2,
  type = 'fade',
  triggerOnce = true,
}: SafeMotionProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Check if animations should be reduced
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || (triggerOnce && hasAnimated)) {
      setIsVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
      if (triggerOnce) {
        setHasAnimated(true);
      }
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isClient, delay, triggerOnce, hasAnimated]);

  // Check if animations should be reduced
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // During SSR, if reduced motion is preferred, or if already animated and triggerOnce is true
  if (
    typeof window === 'undefined' ||
    prefersReducedMotion ||
    (triggerOnce && hasAnimated && isVisible)
  ) {
    return (
      <div ref={elementRef} className={className}>
        {children}
      </div>
    );
  }

  const getAnimationClasses = () => {
    const durationClass = `duration-${Math.round(duration * 1000)}`;

    switch (type) {
      case 'fade':
        return cn(
          'transition-opacity ease-out',
          durationClass,
          isVisible ? 'opacity-100' : 'opacity-0'
        );
      case 'slide':
        return cn(
          'transition-all ease-out',
          durationClass,
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'
        );
      case 'scale':
        return cn(
          'transition-all ease-out',
          durationClass,
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        );
      default:
        return cn(
          'transition-opacity ease-out',
          durationClass,
          isVisible ? 'opacity-100' : 'opacity-0'
        );
    }
  };

  return (
    <div ref={elementRef} className={cn(getAnimationClasses(), className)}>
      {children}
    </div>
  );
}
