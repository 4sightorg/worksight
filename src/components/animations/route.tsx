'use client';

import { ClientOnly } from '@/components/core/client-only';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface RouteAnimationProps {
  children: ReactNode;
  className?: string;
}

export function RouteAnimation({ children, className = '' }: RouteAnimationProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define route-specific animations
  const getRouteAnimation = () => {
    const easing = [0.6, -0.05, 0.01, 0.99] as const;

    switch (pathname) {
      case '/':
        return {
          initial: { opacity: 0, scale: 0.95, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 1.05, y: -20 },
          transition: { duration: 0.6, ease: easing },
        };

      case '/survey':
        return {
          initial: { opacity: 0, x: 100, scale: 0.95 },
          animate: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: -100, scale: 1.05 },
          transition: { duration: 0.5, ease: easing },
        };

      case '/survey/results':
        return {
          initial: { opacity: 0, y: 50, rotateX: -5 },
          animate: { opacity: 1, y: 0, rotateX: 0 },
          exit: { opacity: 0, y: -50, rotateX: 5 },
          transition: { duration: 0.7, ease: easing },
        };

      case '/dashboard':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.1 },
          transition: { duration: 0.4, ease: easing },
        };

      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: { duration: 0.4, ease: easing },
        };
    }
  };

  // Render without animations on server and during hydration
  if (!isClient) {
    return <div className={`min-h-screen ${className}`}>{children}</div>;
  }

  const animation = getRouteAnimation();

  return (
    <ClientOnly fallback={<div className={`min-h-screen ${className}`}>{children}</div>}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: animation.initial,
          animate: animation.animate,
          exit: animation.exit,
        }}
        transition={animation.transition}
        className={`min-h-screen ${className}`}
      >
        {children}
      </motion.div>
    </ClientOnly>
  );
}

// Specific page animation components
export function HomePageAnimation({ children }: { children: ReactNode }) {
  const easing = [0.6, -0.05, 0.01, 0.99] as const;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.05, y: -20 }}
      transition={{ duration: 0.6, ease: easing }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

export function SurveyPageAnimation({ children }: { children: ReactNode }) {
  const easing = [0.6, -0.05, 0.01, 0.99] as const;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 1.05 }}
      transition={{ duration: 0.5, ease: easing }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

export function ResultsPageAnimation({ children }: { children: ReactNode }) {
  const easing = [0.6, -0.05, 0.01, 0.99] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: -50, rotateX: 5 }}
      transition={{ duration: 0.7, ease: easing }}
      className="min-h-screen"
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}
