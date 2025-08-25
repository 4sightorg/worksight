'use client';

import { BounceLink, ScaleLink, SlideLink } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br">
      <div className="flex flex-col items-center px-4 text-center">
        <div
          className={cn(
            'mb-8 transition-all duration-500 ease-out',
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          )}
        >
          <h1
            className={cn(
              'text-primary leading-tighter max-w-2xl text-balance text-4xl font-bold tracking-tight transition-all delay-300 duration-700 ease-out lg:text-5xl lg:leading-[1.1] xl:text-6xl xl:tracking-tighter',
              isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            )}
          >
            Welcome to WorkSight
          </h1>
          <h2
            className={cn(
              'text-muted-foreground mt-6 max-w-2xl text-center text-lg font-normal leading-relaxed transition-all delay-500 duration-700 ease-out lg:text-xl',
              isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            )}
          >
            Your personal dashboard to monitor burnout levels and foster well-being in the
            workplace.
          </h2>
        </div>

        <div
          className={cn(
            'flex flex-col gap-4 transition-all delay-700 duration-700 ease-out sm:flex-row sm:gap-6',
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          )}
        >
          <div
            className={cn(
              'delay-900 duration-400 transition-all ease-out',
              isAnimated ? 'scale-100 opacity-100' : 'scale-80 opacity-0'
            )}
          >
            <ScaleLink href="/login">
              <Button size="lg" className="min-w-[140px] transition-all duration-200">
                Log in
              </Button>
            </ScaleLink>
          </div>

          <div
            className={cn(
              'duration-400 transition-all delay-1000 ease-out',
              isAnimated ? 'scale-100 opacity-100' : 'scale-80 opacity-0'
            )}
          >
            <SlideLink href="/signup">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[140px] transition-all duration-200"
              >
                Sign up
              </Button>
            </SlideLink>
          </div>

          <div
            className={cn(
              'delay-1100 duration-400 transition-all ease-out',
              isAnimated ? 'scale-100 opacity-100' : 'scale-80 opacity-0'
            )}
          >
            <BounceLink href="/survey">
              <Button
                variant="secondary"
                size="lg"
                className="min-w-[140px] transition-all duration-200"
              >
                Try Survey
              </Button>
            </BounceLink>
          </div>
        </div>

        <div
          className={cn(
            'fixed bottom-6 z-50 text-center transition-all delay-1000 duration-700 ease-out',
            isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          )}
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
        </div>
      </div>
    </div>
  );
}
