'use client';

import { ClientOnly } from '@/components/core/client-only';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.5,
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Render without animations on server and during hydration
  if (!isClient) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <ClientOnly fallback={<div className="min-h-screen">{children}</div>}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ClientOnly>
  );
}

// Route-specific transition variants
export const routeVariants = {
  // Home to Survey
  homeToSurvey: {
    initial: { opacity: 0, x: 100, scale: 0.95 },
    in: { opacity: 1, x: 0, scale: 1 },
    out: { opacity: 0, x: -100, scale: 1.05 },
  },

  // Survey to Results
  surveyToResults: {
    initial: { opacity: 0, y: 50, rotateX: -10 },
    in: { opacity: 1, y: 0, rotateX: 0 },
    out: { opacity: 0, y: -50, rotateX: 10 },
  },

  // Results back to Survey
  resultsToSurvey: {
    initial: { opacity: 0, x: -100, scale: 0.95 },
    in: { opacity: 1, x: 0, scale: 1 },
    out: { opacity: 0, x: 100, scale: 1.05 },
  },

  // General fade
  fade: {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  },
};

// Custom transition hook for specific routes
export function usePageTransition() {
  const pathname = usePathname();

  const getTransitionVariant = () => {
    if (pathname === '/survey') return routeVariants.homeToSurvey;
    if (pathname === '/survey/results') return routeVariants.surveyToResults;
    if (pathname === '/dashboard') return routeVariants.fade;
    return pageVariants;
  };

  return {
    variants: getTransitionVariant(),
    transition: pageTransition,
  };
}
