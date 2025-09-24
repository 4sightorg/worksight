import { SignupForm } from '@/components/auth';
import { FormErrorBoundary, PageErrorBoundary } from '@/components/core';
import { Branding } from '@/components/layout';

export default function SignUpPage() {
  return (
    <PageErrorBoundary>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Branding />
          <FormErrorBoundary>
            <SignupForm />
          </FormErrorBoundary>
        </div>
      </div>
    </PageErrorBoundary>
  );
}
