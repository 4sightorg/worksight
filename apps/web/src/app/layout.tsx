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
            <div className="fixed bottom-4 right-4 z-50">
              <ModeToggle />
            </div>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
