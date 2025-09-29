"use client";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface SubNavItem {
  label: string;
  href: string;
  badge?: string | number;
  soon?: boolean;
}

interface DashboardSubNavProps {
  items: SubNavItem[];
  className?: string;
  align?: 'start' | 'center' | 'end';
  'aria-label'?: string;
}

// Accessible, responsive sub-navigation for dashboard deep sections
export function DashboardSubNav({ items, className, align = 'start', ...props }: DashboardSubNavProps) {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        'relative flex w-full flex-wrap items-center gap-1 rounded-md border bg-background/60 p-1 text-sm backdrop-blur supports-[backdrop-filter]:bg-background/40',
        className
      )}
      {...props}
    >
      <ul
        className={cn('flex w-full flex-wrap gap-1', {
          'justify-start': align === 'start',
          'justify-center': align === 'center',
          'justify-end': align === 'end',
        })}
      >
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group relative flex items-center gap-2 rounded-md px-3 py-1.5 font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active
                    ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/30'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      'flex min-w-[1.25rem] items-center justify-center rounded-full bg-primary/15 px-1 text-[10px] font-semibold tracking-wide text-primary',
                      active && 'bg-primary text-primary-foreground'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                {item.soon && (
                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
                    Soon
                  </span>
                )}
                {active && (
                  <span
                    aria-hidden="true"
                    className="bg-primary absolute inset-x-2 -bottom-px h-0.5 rounded-full"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <Separator className="-mb-1 mt-1 h-px w-full" />
    </nav>
  );
}
