'use client';

import { signInWithOAuth } from '@/auth';
import { useAuth } from '@/auth/provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { providers } from '@/data/authProviders';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [saveLogin, setSaveLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  // Handler for OAuth sign-up/sign-in
  const handleOAuthSignIn = async (providerName: 'google' | 'github' | 'discord' | 'facebook') => {
    setError('');
    setIsLoading(true);
    try {
      const { error } = await signInWithOAuth(providerName);
      if (error) {
        setError(error.message || `Failed to sign up with ${providerName}`);
      }
      // OAuth will redirect to callback page which handles account validation
    } catch (err) {
      setError(`Failed to sign up with ${providerName}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !username || !password || !name) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (username.length > 20) {
      setError('Username must be 20 characters or less');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    if (/^[0-9_]+$/.test(username)) {
      setError('Username must contain at least one letter');
      return;
    }

    if (username.startsWith('_') || username.endsWith('_')) {
      setError('Username cannot start or end with underscore');
      return;
    }

    if (username.includes('__')) {
      setError('Username cannot contain consecutive underscores');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              sign in to your account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                  <div className="text-sm text-red-700 dark:text-red-200">{error}</div>
                </div>
              )}

              {/* OAuth Sign Up Buttons */}
              <div className="space-y-3">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Sign up with
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {providers.map((provider) => (
                    <Button
                      key={provider.name}
                      type="button"
                      variant="outline"
                      onClick={() => handleOAuthSignIn(provider.name)}
                      disabled={isLoading}
                      className="w-full flex items-center gap-2"
                    >
                      <provider.icon className="h-4 w-4" />
                      {provider.displayName}
                    </Button>
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
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

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Password must be at least 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveLogin"
                  checked={saveLogin}
                  onCheckedChange={(checked) => setSaveLogin(checked === true)}
                  disabled={isLoading}
                />
                <Label 
                  htmlFor="saveLogin" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Keep me signed in for 30 days (otherwise 5 minutes)
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
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
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
