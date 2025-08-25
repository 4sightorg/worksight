'use client';

import { useAuth } from '@/auth/provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBrowserClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OAuthUserData {
  id: string;
  email: string;
  name: string;
  provider: string;
}

export default function CompleteSignupForm() {
  const [username, setUsername] = useState('');
  const [saveLogin, setSaveLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [oauthData, setOauthData] = useState<OAuthUserData | null>(null);
  const router = useRouter();
  const { setUser, setAccessToken } = useAuth();

  useEffect(() => {
    // Get OAuth user data from session storage
    const storedData = sessionStorage.getItem('oauth_user_data');
    if (storedData) {
      try {
        const userData = JSON.parse(storedData) as OAuthUserData;
        setOauthData(userData);
        // Generate a username suggestion based on email or name
        const emailPrefix = userData.email.split('@')[0];
        const suggestion = emailPrefix.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        setUsername(suggestion);
      } catch (err) {
        console.error('Error parsing OAuth data:', err);
        router.push('/signup');
      }
    } else {
      // No OAuth data, redirect to regular signup
      router.push('/signup');
    }
  }, [router]);

  const validateUsername = (username: string): string | null => {
    if (username.length < 3) {
      return 'Username must be at least 3 characters';
    }

    if (username.length > 20) {
      return 'Username must be 20 characters or less';
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Username can only contain letters, numbers, and underscores';
    }

    if (/^[0-9_]+$/.test(username)) {
      return 'Username must contain at least one letter';
    }

    if (username.startsWith('_') || username.endsWith('_')) {
      return 'Username cannot start or end with underscore';
    }

    if (username.includes('__')) {
      return 'Username cannot contain consecutive underscores';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!oauthData) {
      setError('OAuth data not found. Please try signing up again.');
      return;
    }

    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    setIsLoading(true);

    try {
      // Update the user's metadata with username
      const supabase = createBrowserClient();

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          username,
          signup_completed: true,
        },
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      // Create user object and sign in
      const user = {
        id: oauthData.id,
        email: oauthData.email,
        name: oauthData.name,
        username,
        role: 'user' as const,
      };

      // Get current session to get access token
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        setUser(user);
        setAccessToken(session.access_token);

        // Clear OAuth data from session storage
        sessionStorage.removeItem('oauth_user_data');

        router.push('/dashboard');
      } else {
        setError('Session not found. Please try signing in again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete signup');
    } finally {
      setIsLoading(false);
    }
  };

  if (!oauthData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Complete Your Signup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Welcome {oauthData.name}! Just choose a username to finish setting up your account.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Choose Username</CardTitle>
            <CardDescription>Pick a unique username for your WorkSight account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/50">
                  <div className="text-sm text-red-700 dark:text-red-200">{error}</div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Email (from {oauthData.provider})</Label>
                <Input
                  type="email"
                  value={oauthData.email}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  type="text"
                  value={oauthData.name}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="Choose a username"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  3-20 characters, letters/numbers/underscores only. Must contain at least one
                  letter.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveLogin"
                  checked={saveLogin}
                  onCheckedChange={(checked) => setSaveLogin(checked === true)}
                  disabled={isLoading}
                />
                <Label htmlFor="saveLogin" className="cursor-pointer text-sm font-normal">
                  Keep me signed in for 30 days (otherwise 5 minutes)
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing signup...
                  </>
                ) : (
                  'Complete Signup'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By completing signup, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
