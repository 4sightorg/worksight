import * as React from 'react';
import { cn } from '../../lib/utils';

type Elevation = 'none' | 'sm' | 'md' | 'lg';

const elevationClasses: Record<Elevation, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md shadow-black/5 dark:shadow-black/30',
  lg: 'shadow-lg shadow-black/10 dark:shadow-black/40',
};

interface CardProps extends React.ComponentProps<'div'> {
  elevation?: Elevation; // visual depth tier
  interactive?: boolean; // adds subtle hover elevation lift
}

function Card({ className, elevation = 'sm', interactive = false, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-elevation={elevation}
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 transition-shadow',
        elevationClasses[elevation],
        interactive && 'hover:shadow-md hover:shadow-black/10 dark:hover:shadow-black/40',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
