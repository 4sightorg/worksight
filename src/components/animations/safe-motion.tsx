'use client';

import { motion } from 'motion/react';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface SafeMotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  type?: 'fade' | 'slide' | 'scale';
  triggerOnce?: boolean; // Only animate once
}

// Simplified motion component that's safe for Vercel deployment
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
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if animations should be reduced
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // During SSR, if reduced motion is preferred, or if already animated and triggerOnce is true
  if (typeof window === 'undefined' || prefersReducedMotion || (triggerOnce && hasAnimated)) {
    return (
      <div ref={elementRef} className={className}>
        {children}
      </div>
    );
  }

  // If not on client yet, render without animation
  if (!isClient) {
    return (
      <div ref={elementRef} className={className}>
        {children}
      </div>
    );
  }

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  };

  const handleAnimationComplete = () => {
    if (triggerOnce) {
      setHasAnimated(true);
    }
  };

  return (
    <motion.div
      ref={elementRef}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants[type]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      onAnimationComplete={handleAnimationComplete}
      layout={false} // Disable layout animations to prevent retriggering
    >
      {children}
    </motion.div>
  );
}
