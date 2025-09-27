"use client";
import { useState, ReactNode, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function CollapsibleSection({
  title,
  description,
  children,
  defaultOpen = false,
  className,
  size = 'md',
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className={cn('rounded-md border bg-muted/10', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full items-start gap-3 px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          open ? 'bg-muted/40' : 'hover:bg-muted/30'
        )}
      >
        <ChevronDown
          className={cn(
            'mt-0.5 h-4 w-4 flex-none transform transition-transform duration-200',
            open ? 'rotate-180' : 'rotate-0'
          )}
        />
        <div className="flex-1">
          <p className={cn('font-medium leading-none', size === 'sm' ? 'text-sm' : 'text-sm')}>{title}</p>
          {description && (
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{description}</p>
          )}
        </div>
      </button>
      <div
        id={contentId}
        hidden={!open}
        className={cn(
          'animate-in fade-in slide-in-from-top-1 px-4 pb-4 pt-2 text-sm',
          size === 'sm' && 'text-xs'
        )}
      >
        {children}
      </div>
    </div>
  );
}
