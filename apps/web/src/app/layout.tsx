import { AuthProvider } from '@/auth';
import { PageTransition } from '@/components/animations';
import { ErrorBoundary } from '@/components/core';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ThemeScript } from '@/components/theme/theme-script';
import { ModeToggle } from '@/components/theme/theme-toggle';
import { Skeleton } from '@/components/ui/skeleton';
import '@/styles/globals.css';
import { MetadataRecord } from '@/types/metadata';
import { ReactNode, Suspense } from 'react';

type RootLayoutProps = {
  children: ReactNode;
};

export const metadata = new MetadataRecord(
  'Worksight',
  'A way to view work and burnout'
).toNextMetadata();

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        {/* Skip navigation link for keyboard users */}
        <a
          href="#main-content"
          className="focus:ring-ring bg-primary text-primary-foreground absolute left-2 top-2 -translate-y-16 rounded px-3 py-2 text-sm font-medium focus:translate-y-0 focus:outline-none focus:ring-2"
        >
          Skip to main content
        </a>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            storageKey="worksight-theme"
          >
            <AuthProvider>
              {/* Layout-level optimistic shell to reduce hard flashes during route change */}
              <Suspense
                fallback={
                  <div aria-busy="true" aria-live="polite" className="min-h-screen">
                    {/* Top bar / header skeleton */}
                    <div className="border-b px-6 py-4">
                      <div className="mx-auto flex max-w-7xl items-center gap-4">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-6 w-24" />
                        <div className="ml-auto flex gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                      </div>
                    </div>
                    {/* Content grid skeleton */}
                    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 md:grid-cols-3">
                      <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-40 w-full rounded-xl" />
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <Skeleton className="h-32 w-full rounded-xl" />
                          <Skeleton className="h-32 w-full rounded-xl" />
                        </div>
                        <Skeleton className="h-64 w-full rounded-xl" />
                      </div>
                      <div className="space-y-6">
                        <Skeleton className="h-24 w-full rounded-xl" />
                        <Skeleton className="h-48 w-full rounded-xl" />
                        <Skeleton className="h-64 w-full rounded-xl" />
                      </div>
                    </div>
                  </div>
                }
              >
                <PageTransition>{children}</PageTransition>
              </Suspense>
            </AuthProvider>
            <div className="fixed right-4 bottom-4 z-50">
              <ModeToggle />
            </div>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
