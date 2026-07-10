'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground">
              An unexpected error occurred. Please try again.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => reset()} className="w-full">
              Try again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
              Go home
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
