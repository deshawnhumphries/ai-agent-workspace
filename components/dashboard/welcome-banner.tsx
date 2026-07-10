'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar } from 'lucide-react';
import Link from 'next/link';

export function WelcomeBanner() {
  const { user } = useAuth();

  const userEmail = user?.email || 'user@example.com';
  const userName = userEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 overflow-hidden relative">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {today}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              {getGreeting()}, {userName}
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to build with your AI team?
            </p>
          </div>
          <Link href="/chat">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              New Chat
            </Button>
          </Link>
        </div>
      </CardContent>
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
    </Card>
  );
}
