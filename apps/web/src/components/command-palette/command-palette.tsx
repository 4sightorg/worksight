"use client";
import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  keywords?: string;
  href?: string;
  action?: () => void | Promise<void>;
  group?: string;
  icon?: React.ReactNode;
}

interface CommandPaletteProps {
  items?: CommandItem[];
  extraItems?: CommandItem[];
  onOpenChange?: (open: boolean) => void;
}

const DEFAULT_ITEMS: CommandItem[] = [
  { id: 'go-dashboard', title: 'Go to Dashboard', href: '/dashboard', keywords: 'home main' },
  { id: 'go-tasks', title: 'Open Tasks', href: '/dashboard/tasks', keywords: 'work items kanban' },
  { id: 'go-wellness', title: 'View Wellness', href: '/dashboard/wellness', keywords: 'health burnout survey' },
  { id: 'take-survey', title: 'Take Wellness Survey', href: '/wellness-survey', keywords: 'survey burnout form' },
  { id: 'open-reports', title: 'Open Reports', href: '/dashboard/reports', keywords: 'analytics charts metrics' },
  { id: 'open-settings', title: 'Open Settings', href: '/settings', keywords: 'account profile preferences' },
];

export function CommandPalette({ items, extraItems, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const allItems = [...(items || DEFAULT_ITEMS), ...(extraItems || [])];

  // Simple scoring: partial matches in title > keywords > subtitle
  const filtered = allItems
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter((r) => r.score > 0 || query.length === 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30)
    .map((r) => r.item);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    onOpenChange?.(false);
  }, [onOpenChange]);

  const openPalette = useCallback(() => {
    setOpen(true);
    onOpenChange?.(true);
    // Delay focus to next frame for animation readiness
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [onOpenChange]);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => {
          const next = !o;
          if (next) {
            requestAnimationFrame(() => inputRef.current?.focus());
            onOpenChange?.(true);
          } else {
            onOpenChange?.(false);
          }
          return next;
        });
      } else if (e.key === 'Escape') {
        if (open) {
          e.preventDefault();
          close();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [close, onOpenChange, open]);

  // Navigate or run action
  const run = async (item: CommandItem) => {
    try {
      setLoading(true);
      if (item.action) {
        await item.action();
      } else if (item.href && item.href !== pathname) {
        router.push(item.href);
      }
      close();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-2 text-xs font-medium shadow-sm backdrop-blur transition-colors focus-visible:outline-none focus-visible:ring-2 md:bottom-6 md:right-6"
        aria-label="Open command palette (⌘K)"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search / Jump</span>
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</span>
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:pt-[10vh]"
        >
          <div
            className="bg-background relative w-full max-w-lg overflow-hidden rounded-xl border shadow-lg"
          >
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <Search className="text-muted-foreground h-4 w-4" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, pages, actions..."
                className="placeholder:text-muted-foreground/60 flex h-9 w-full flex-1 bg-transparent text-sm outline-none"
              />
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            <ul className="max-h-[50vh] overflow-auto p-2">
              {filtered.length === 0 && (
                <li className="text-muted-foreground flex items-center justify-center py-8 text-xs">
                  No results
                </li>
              )}
              {filtered.map((item, i) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => run(item)}
                    className={cn(
                      'group flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-sm outline-none transition-colors',
                      'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground'
                    )}
                  >
                    <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-primary/60 group-hover:bg-primary" />
                    <div className="flex flex-col">
                      <span className="font-medium leading-none">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-muted-foreground mt-1 line-clamp-1 text-[11px] tracking-wide">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t bg-muted/30 px-3 py-2 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <kbd className="rounded bg-muted px-1 py-0.5 font-mono">↑↓</kbd>
                <span>to navigate</span>
                <kbd className="rounded bg-muted px-1 py-0.5 font-mono">↵</kbd>
                <span>to run</span>
                <kbd className="rounded bg-muted px-1 py-0.5 font-mono">esc</kbd>
                <span>to close</span>
              </div>
              <span className="hidden sm:inline">{filtered.length} results</span>
            </div>
          </div>
          <div className="bg-background/40 dark:bg-background/60 fixed inset-0 -z-10 backdrop-blur-sm" onClick={close} />
        </div>
      )}
    </>
  );
}

function scoreItem(item: CommandItem, q: string) {
  if (!q) return 1; // show all
  const query = q.toLowerCase();
  let score = 0;
  if (item.title.toLowerCase().includes(query)) score += 10;
  if (item.keywords && item.keywords.toLowerCase().includes(query)) score += 5;
  if (item.subtitle && item.subtitle.toLowerCase().includes(query)) score += 2;
  return score;
}
