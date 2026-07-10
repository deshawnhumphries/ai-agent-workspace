'use client';

import Link from 'next/link';
import { Bot, Menu, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';

const navItems = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Documentation', href: '#docs' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">AI Agent Workspace</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            <ThemeToggle />
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4">
                {loading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : user ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
