'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16 p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4 text-6xl font-bold text-muted-foreground">404</div>
          <CardTitle>Page not found</CardTitle>
          <CardDescription>
            The page you&apos;re looking for doesn&apos;t exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/login">
            <Button className="w-full">
              Go to Login
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
