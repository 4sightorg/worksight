'use client';

import { signIn, signInWithOAuth, useAuth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { providers } from '@/data/authProviders';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveLogin, setSaveLogin] = useState(false);

  const { setUser, setAccessToken, setSaveLogin: setAuthSaveLogin } = useAuth();
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
      const { user, error, accessToken } = await signIn({ email, password }, saveLogin);

      if (user && accessToken) {
        // Ensure user has required properties for User type
        const userWithRequiredFields = {
          id: user.id,
          email: user.email || '', // Provide fallback for required email
          name: user.name,
          role: user.role,
          // Don't include accessToken in user object - it's handled separately
        };

        // Update auth state - these methods now handle localStorage automatically
        setUser(userWithRequiredFields);
        setAccessToken(accessToken);
        setAuthSaveLogin(saveLogin);

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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
          <CardDescription>Sign in to your WorkSight account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* OAuth Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {providers.map((provider) => (
                  <Button
                    key={provider.name}
                    type="button"
                    variant="outline"
                    aria-label={`Login with ${provider.displayName}`}
                    className="h-10 w-full"
                    onClick={() => handleOAuthSignIn(provider.name)}
                    disabled={loading}
                  >
                    <span className="flex items-center justify-center text-lg">
                      <provider.icon />
                    </span>
                  </Button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Email/Password Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="test@worksight.app"
                  required
                  ref={emailRef}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="testuser"
                  required
                  ref={passwordRef}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="save-login"
                  checked={saveLogin}
                  onCheckedChange={(checked: boolean) => setSaveLogin(checked)}
                  disabled={loading}
                />
                <Label htmlFor="save-login" className="text-sm font-normal cursor-pointer">
                  Keep me logged in for 30 days
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            {/* Error Message */}
            {errorMsg && (
              <div className="text-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {errorMsg}
              </div>
            )}

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <a href="/signup" className="text-primary hover:underline underline-offset-4 font-medium">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Offline Mode Info */}
      <div className="text-center text-xs text-muted-foreground space-y-2 max-w-md mx-auto">
        <p className="bg-muted/50 p-3 rounded-md">
          <strong>Offline Mode:</strong> Use <code className="bg-background px-1 py-0.5 rounded">test@worksight.app</code> / <code className="bg-background px-1 py-0.5 rounded">testuser</code>
        </p>
        <p className="text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md">
          <strong>Session timeout:</strong> 5 minutes (30 days if "Keep me logged in" is checked)
        </p>
      </div>
    </div>
  );
}
