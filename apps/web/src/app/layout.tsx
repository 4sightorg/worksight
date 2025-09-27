import { AuthProvider } from '@/auth';
import { PageTransition } from '@/components/animations';
import { ErrorBoundary } from '@/components/core';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ThemeScript } from '@/components/theme/theme-script';
import { ModeToggle } from '@/components/theme/theme-toggle';
import '@/styles/globals.css';
import { MetadataRecord } from '@/types/metadata';
import { ReactNode } from 'react';

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
              <PageTransition>{children}</PageTransition>
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
