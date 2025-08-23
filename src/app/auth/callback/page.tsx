'use client';

import { validateOAuthUser } from '@/auth/client';
import { useAuth } from '@/auth/provider';
import { User } from '@/auth/types';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthCallbackPage() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setUser, setAccessToken } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
          throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set');
        }

        // Get the current session from Supabase
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
        );

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          setError('Authentication failed');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        if (!session || !session.user) {
          setError('No session found');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        // Validate that the user has an account or allow signup completion
        const result = await validateOAuthUser(session.user as unknown as User);

        if (result.error) {
          // If user doesn't have username, they need to complete signup
          if (result.error.message.includes('Account not found')) {
            // Store OAuth session data and redirect to complete signup
            sessionStorage.setItem(
              'oauth_user_data',
              JSON.stringify({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || session.user.email,
                provider: 'oauth',
              })
            );
            router.push('/signup/complete');
            return;
          }

          setError(result.error.message);
          setTimeout(() => router.push('/signup'), 2000);
          return;
        }

        if (result.user && result.accessToken) {
          setUser(result.user);
          setAccessToken(result.accessToken);
          router.push('/dashboard');
        } else {
          setError('Account validation failed');
          setTimeout(() => router.push('/login'), 2000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed');
        setTimeout(() => router.push('/login'), 2000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router, setUser, setAccessToken]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Completing authentication...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/50">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              Authentication Error
            </h3>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
