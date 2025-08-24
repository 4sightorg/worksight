import { AuthProvider } from '@/auth';
import { ErrorBoundary } from '@/components/error-boundary';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/theme-toggle';
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
        <meta name="theme-color" content="#000000" />
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
            <AuthProvider>{children}</AuthProvider>
            <div className="fixed right-4 bottom-4 z-50">
              <ModeToggle />
            </div>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
