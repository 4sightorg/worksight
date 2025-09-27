"use client";
import { Button } from '@worksight/web/components/ui/button';
import { cn } from '@worksight/web/lib/utils';
import Link from 'next/link';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  primaryAction?: { label: string; href?: string; onClick?: () => void; icon?: ReactNode };
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  illustration?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  size = 'md',
  illustration,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg border bg-background/60 p-8 text-center shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/40',
        size === 'sm' && 'p-6 text-sm',
        size === 'lg' && 'p-12',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 select-none opacity-60">
        {illustration}
      </div>
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border bg-muted/40 text-muted-foreground">
          {icon}
        </div>
      )}
      <h2 className="mb-2 text-lg font-semibold tracking-tight md:text-xl">{title}</h2>
      {description && (
        <p className="text-muted-foreground mx-auto mb-4 max-w-md text-sm leading-relaxed">
          {description}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {primaryAction && (
          primaryAction.href ? (
            <Button asChild>
              <Link href={primaryAction.href} onClick={primaryAction.onClick}>
                {primaryAction.icon}
                {primaryAction.label}
              </Link>
            </Button>
          ) : (
            <Button onClick={primaryAction.onClick}>{primaryAction.icon}{primaryAction.label}</Button>
          )
        )}
        {secondaryAction && (
          secondaryAction.href ? (
            <Button asChild variant="ghost" size="sm">
              <Link href={secondaryAction.href} onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
