'use client';

import { BounceLink, ScaleLink, SlideLink } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99] as const,
    },
  },
};

const buttonVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.68, -0.55, 0.265, 1.55] as const,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: [0.6, -0.05, 0.01, 0.99] as const,
    },
  },
  tap: {
    scale: 0.95,
  },
};

export default function Home() {
  return (
    <motion.div
      className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col items-center px-4 text-center">
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.h1
            className="text-primary leading-tighter max-w-2xl text-4xl font-bold tracking-tight text-balance lg:text-5xl lg:leading-[1.1] xl:text-6xl xl:tracking-tighter"
            variants={itemVariants}
          >
            Welcome to WorkSight
          </motion.h1>
          <motion.h2
            className="text-muted-foreground mt-6 max-w-2xl text-center text-lg leading-relaxed font-normal lg:text-xl"
            variants={itemVariants}
          >
            Your personal dashboard to monitor burnout levels and foster well-being in the
            workplace.
          </motion.h2>
        </motion.div>

        <motion.div className="flex flex-col gap-4 sm:flex-row sm:gap-6" variants={itemVariants}>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <ScaleLink href="/login">
              <Button size="lg" className="min-w-[140px] transition-all duration-200">
                Log in
              </Button>
            </ScaleLink>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <SlideLink href="/signup">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[140px] transition-all duration-200"
              >
                Sign up
              </Button>
            </SlideLink>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <BounceLink href="/survey">
              <Button
                variant="secondary"
                size="lg"
                className="min-w-[140px] transition-all duration-200"
              >
                Try Survey
              </Button>
            </BounceLink>
          </motion.div>
        </motion.div>

        <motion.div
          className="fixed bottom-6 z-50 text-center"
          variants={itemVariants}
          transition={{ delay: 1 }}
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing up, you agree to our{' '}
            <Link
              href="/terms"
              className="transition-colors duration-200 hover:underline hover:opacity-80"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="transition-colors duration-200 hover:underline hover:opacity-80"
            >
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
