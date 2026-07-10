'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Loader2 } from 'lucide-react';

export default function LoginPageContent() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        if (error.message.includes('already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Password')) {
          setError('Password must be at least 6 characters long.');
        } else {
          setError(error.message);
        }
      } else {
        setSuccess('Account created successfully! You can now sign in.');
        setIsSignUp(false);
        setPassword('');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(error.message);
        }
      } else {
        router.push('/dashboard');
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">AI Agent Workspace</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {isSignUp ? 'Already have an account?' : 'New here?'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccess(null);
                }}
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center pt-16 p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </CardTitle>
              <CardDescription>
                {isSignUp
                  ? 'Enter your email and password to create your account'
                  : 'Enter your email and password to access your workspace'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                    <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {!isSignUp && (
                      <Link
                        href="#"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder={isSignUp ? 'Choose a password (min 6 characters)' : 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={isSignUp ? 6 : undefined}
                    disabled={isLoading}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isSignUp ? 'Creating account...' : 'Signing in...'}
                    </>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By continuing, you agree to our{' '}
                  <Link href="#" className="underline hover:text-primary">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="underline hover:text-primary">
                    Privacy Policy
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccess(null);
                }}
                className="font-medium text-primary hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Create one'}
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} AI Agent Workspace. All rights reserved.</p>
      </footer>
    </div>
  );
}
