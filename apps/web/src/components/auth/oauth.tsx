'use client';

import { signIn, signInWithOAuth, useAuth } from '@/auth';
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
import { providers } from '@/data/authProviders';
import { cn } from '@/lib/utils';
import { useConnectivityStore } from '@/stores/connectivity-store';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { OFFLINE_ACCOUNTS } from '../../auth/credentials';

// Check if forced offline mode is enabled via environment variable
const IS_FORCED_OFFLINE = process.env.NEXT_PUBLIC_IS_OFFLINE === 'true';

// Types
type OAuthProvider = {
  name: 'google' | 'github' | 'discord' | 'facebook';
  displayName: string;
  icon: React.ComponentType<{ className?: string }>;
};

// Helper to capitalize first letter
const capitalize = (str: string) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : str);

interface OAuthButtonsProps {
  OAuthProviders: OAuthProvider[];
  onclick: (providerName: 'google' | 'github' | 'discord' | 'facebook') => void;
  loading?: boolean;
}

// Shared utilities
const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};

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

const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

// Shared OAuth handler
const useOAuthHandler = (
  type: 'Login' | 'Signup',
  setErrorMsg: (msg: string | null) => void,
  setLoading: (loading: boolean) => void
) => {
  return async (providerName: 'google' | 'github' | 'discord' | 'facebook') => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const { error } = await signInWithOAuth(providerName);
      if (error) {
        setErrorMsg(error.message || `${type} with ${providerName} failed`);
      }
      // On success, Supabase will redirect automatically
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : `${type} with ${providerName} failed`;
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };
};

// Modular Components
function OAuthButtons({ OAuthProviders, onclick, loading = false }: OAuthButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {OAuthProviders.map((OAuthProvider) => (
        <Button
          key={OAuthProvider.name}
          type="button"
          variant="outline"
          aria-label={`Login with ${OAuthProvider.displayName}`}
          className="h-10 w-full"
          onClick={() => onclick(OAuthProvider.name)}
          disabled={loading}
        >
          <span className="flex items-center justify-center text-lg">
            <OAuthProvider.icon />
          </span>
          {OAuthProvider.displayName}
        </Button>
      ))}
    </div>
  );
}

type FieldProps = {
  type: 'email' | 'password' | 'confirmpassword';
  ref?: React.RefObject<HTMLInputElement | null>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  aria_label?: string;
  disabled?: boolean;
  required?: boolean;
  bottom_link?: boolean;
  bottom_url?: string;
  bottom_label?: string;
  children?: React.ReactNode;
};

function Field({
  type,
  ref,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  bottom_link,
  bottom_url,
  bottom_label,
  children,
}: FieldProps) {
  let field_label: string = '';
  switch (type) {
    case 'email':
      field_label = 'Email';
      break;
    case 'password':
      field_label = 'Password';
      break;
    case 'confirmpassword':
      field_label = 'Confirm Password';
      break;
    default:
      field_label = '';
  }
  return (
    <div className="space-y-2">
      <Label htmlFor={type}>{field_label}</Label>
      <Input
        id={type}
        name={type}
        type={type}
        placeholder={placeholder}
        required={required}
        ref={ref}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {bottom_link && bottom_url ? (
        <Link
          href={bottom_url}
          className="text-muted-foreground hover:text-primary text-xs underline-offset-4 hover:underline"
        >
          {bottom_label}
        </Link>
      ) : null}
      {children}
    </div>
  );
}

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveLogin, setSaveLogin] = useState(true);

  const { setUser, setAccessToken, setSaveLogin: setAuthSaveLogin } = useAuth();
  const router = useRouter();
  const { mode, setMode } = useConnectivityStore();

  // Initialize mode based on environment or stored preference
  useEffect(() => {
    if (IS_FORCED_OFFLINE) {
      setMode('offline');
    }
    // If not forced offline, the store will handle persistence automatically
  }, [setMode]);

  // Handle mode change with persistence (only if not forced offline)
  const handleModeChange = (newMode: 'offline' | 'online') => {
    if (!IS_FORCED_OFFLINE) {
      setMode(newMode);
    }
  };

  // Use shared OAuth handler
  const handleOAuthSignIn = useOAuthHandler('Login', setErrorMsg, setLoading);

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
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
          <CardDescription>Sign in to your WorkSight account</CardDescription>

          {/* Only show mode selector if not forced offline */}
          {!IS_FORCED_OFFLINE && (
            <div className="grid grid-cols-2 items-center gap-3 rounded-lg border p-1">
              <Button
                variant={mode === 'offline' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleModeChange('offline')}
                className="h-8 px-3"
              >
                Offline
              </Button>
              <Button
                variant={mode === 'online' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleModeChange('online')}
                className="h-8 px-3"
              >
                Online
              </Button>
            </div>
          )}

          {/* Show offline mode indicator if forced */}
          {IS_FORCED_OFFLINE && (
            <div className="bg-muted rounded-lg border p-2">
              <span className="text-sm font-medium">Offline Mode</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* OAuth Section - Only show when online and not forced offline */}
            {mode === 'online' && !IS_FORCED_OFFLINE && (
              <div className="space-y-4">
                <OAuthButtons
                  OAuthProviders={providers}
                  onclick={handleOAuthSignIn}
                  loading={loading}
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="text-muted-foreground px-2">Or continue with</span>
                  </div>
                </div>
              </div>
            )}
            {/* Email/Password Form */}
            <Field
              type="email"
              ref={emailRef}
              placeholder="test@worksight.app"
              disabled={loading}
            />
            <Field
              type="password"
              ref={passwordRef}
              placeholder="testuser"
              disabled={loading}
              bottom_link={true}
              bottom_url="#"
              bottom_label={`Forgot password?`}
            ></Field>
            <div className="mb-4 flex items-center space-x-2">
              <Checkbox
                id="save-login"
                checked={saveLogin}
                onCheckedChange={(checked: boolean) => setSaveLogin(checked)}
                disabled={loading}
              />
              <Label htmlFor="save-login" className="cursor-pointer text-sm font-normal">
                Keep me logged in for 30 days
              </Label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            {/* Error Message */}
            {errorMsg && (
              <div className="text-destructive bg-destructive/10 rounded-md p-3 text-center text-sm">
                {errorMsg}
              </div>
            )}

            {/* Sign Up Link - Only show when online and not forced offline */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don&apos;t have an account? </span>
              {mode === 'online' && !IS_FORCED_OFFLINE ? (
                <a
                  href="/signup"
                  className="text-primary font-medium underline-offset-4 hover:underline"
                >
                  Sign up
                </a>
              ) : (
                <span className="text-muted-foreground">
                  {IS_FORCED_OFFLINE
                    ? 'Sign up disabled in offline mode'
                    : 'Sign up unavailable in offline mode'}
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Offline Mode Info */}
      {(mode === 'offline' || IS_FORCED_OFFLINE) && (
        <div className="text-muted-foreground mx-auto max-w-md space-y-2 px-3 text-center text-xs">
          <strong>Here&apos;s some accounts you can log into</strong>
          <div className="bg-muted/50 mt-2 flex flex-col gap-2 rounded-md">
            {OFFLINE_ACCOUNTS.map((user, i) => (
              <div key={i} className="flex w-full flex-row items-center justify-between">
                <span className="mr-5 text-sm font-medium">{capitalize(user.role)}</span>
                <code className="bg-background break-all rounded px-2 py-0.5 text-xs">
                  {user.email}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [saveLogin, setSaveLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const router = useRouter();
  const { mode } = useConnectivityStore();
  // Use shared OAuth handler
  const handleOAuthSignIn = useOAuthHandler('Signup', setError, setIsLoading);

  // If forced offline or user selected offline mode, redirect to login
  if (IS_FORCED_OFFLINE || mode === 'offline') {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !username || !password || !name) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Use shared validation functions
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    setIsLoading(true);

    try {
      await signUp({ email, username, password, name }, saveLogin);
      // Redirect to dashboard on successful signup
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">Create your account</CardTitle>
          <CardDescription>
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              sign in to your account
            </Link>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/50">
                <div className="text-sm text-red-700 dark:text-red-200">{error}</div>
              </div>
            )}

            {/* OAuth Sign Up Buttons - Always shown in signup since we redirect if offline */}
            <div className="space-y-3">
              <OAuthButtons
                OAuthProviders={providers}
                onclick={handleOAuthSignIn}
                loading={isLoading}
              />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="text-muted-foreground px-2">Or continue with email</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
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
                3-20 characters, letters/numbers/underscores only. Must contain at least one letter.
              </p>
            </div>

            <Field
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              value={email}
            />
            <Field
              type="password"
              placeholder="Create a password"
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              value={password}
            />
            <Field
              type="confirmpassword"
              placeholder="Confirm your password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              value={confirmPassword}
            />

            <div className="mb-4 flex items-center space-x-2">
              <Checkbox
                id="saveLogin"
                checked={saveLogin}
                onCheckedChange={(checked) => setSaveLogin(checked === true)}
                disabled={isLoading}
              />
              <Label htmlFor="saveLogin" className="cursor-pointer text-sm font-normal">
                Keep me signed in for 30 days
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          By signing up, you agree to our <Link href="/terms">Terms of Service</Link> and{' '}
          <Link href="/privacy">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
