'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { providers } from '@/data/authProviders';
import { signIn, signInWithOAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { useAuth } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { setUser, setAccessToken } = useAuth();
  const router = useRouter();

  // Handler for OAuth sign-in
  const handleOAuthSignIn = async (providerName: 'google' | 'github' | 'discord' | 'facebook') => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const { error } = await signInWithOAuth(providerName);
      if (error) {
        setErrorMsg(error.message || `Login with ${providerName} failed`);
      }
      // On success, Supabase will redirect automatically
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : `Login with ${providerName} failed`;
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    try {
      const { user, error, accessToken } = await signIn({ email, password });

      if (user && accessToken) {
        // Ensure user has required properties for User type
        const userWithRequiredFields = {
          id: user.id,
          email: user.email || '', // Provide fallback for required email
          name: user.name,
          role: user.role,
          accessToken,
        };

        // Update auth state
        setUser(userWithRequiredFields);
        setAccessToken(accessToken);

        // Redirect to dashboard
        router.push('/dashboard');
        setErrorMsg(null);
      } else if (error) {
        const errorMessage =
          error && typeof error === 'object' && 'message' in error
            ? (error as { message: string }).message
            : 'Login failed';
        setErrorMsg(errorMessage);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Apple or Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              {/* OAuth row with a screen-reader-only label */}
              <div>
                <span className="sr-only" id="oauth-label">
                  Login with an OAuth provider
                </span>
                <div className="grid grid-cols-4 gap-4">
                  {providers.map((provider) => (
                    <Button
                      key={provider.name}
                      type="button"
                      aria-label={`Login with ${provider.displayName}`}
                      className="flex h-12 w-full items-center justify-center"
                      onClick={() => handleOAuthSignIn(provider.name)}
                      disabled={loading}
                    >
                      <span className="flex items-center justify-center text-2xl">
                        <provider.icon />
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="test@worksight.app"
                    required
                    ref={emailRef}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="testuser"
                    required
                    ref={passwordRef}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                {errorMsg && <div className="text-destructive text-center text-sm">{errorMsg}</div>}
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        <p className="mb-2">
          <strong>Offline Mode:</strong> Use test@worksight.app / testuser
        </p>
        <p>
          By clicking continue, you agree to our{' '}
          <a href="#" className="hover:text-primary underline underline-offset-4">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="hover:text-primary underline underline-offset-4">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
