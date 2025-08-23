'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useMetaColor } from '@/hooks/use-meta-color';

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const { setMetaColor, metaColor } = useMetaColor();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted) {
      setMetaColor(metaColor);
    }
  }, [metaColor, setMetaColor, mounted]);

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        disabled
      >
        <div className="size-4.5 animate-pulse bg-muted-foreground/20 rounded" />
        <span className="sr-only">Loading theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 hover:bg-muted/50 transition-colors"
      onClick={toggleTheme}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="size-4.5 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="size-4.5 transition-transform hover:-rotate-12" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
