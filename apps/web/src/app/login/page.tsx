import { LoginForm } from '@/components/auth';
import { FormErrorBoundary, PageErrorBoundary } from '@/components/core';
import { Branding } from '@/components/layout';

// Force dynamic rendering to avoid build-time Supabase client creation
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <PageErrorBoundary>
      <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Branding />
          <FormErrorBoundary>
            <LoginForm />
          </FormErrorBoundary>
        </div>
      </div>
    </PageErrorBoundary>
  );
}
