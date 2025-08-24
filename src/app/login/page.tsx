import { LoginForm } from '@/components/auth';
import { ModeToggle } from '@/components/theme-toggle';
import Branding from '../../components/branding';

// Force dynamic rendering to avoid build-time Supabase client creation
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Branding />
        <LoginForm />
      </div>
      <div className="fixed right-4 bottom-4 z-50">
        <ModeToggle />
      </div>
    </div>
  );
}
