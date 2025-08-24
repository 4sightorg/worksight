import { cn } from '@/lib/utils';

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        'border-border bg-muted text-muted-foreground inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-xs',
        className
      )}
    >
      {children}
    </kbd>
  );
}
