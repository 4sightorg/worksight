import { AuthProvider } from '@/auth';
import { ThemeProvider } from '@/components/theme-provider';
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
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
