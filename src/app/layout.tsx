import '@/styles/globals.css';
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/store/auth-store"
import { ReactNode } from "react";
import { MetadataRecord } from '@/types/metadata';

type RootLayoutProps = {
  children: ReactNode;
};

export const metadata = new MetadataRecord(
  "Worksight",
  "A way to view work and burnout"
).toNextMetadata(); // ✅ convert to plain object

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
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
