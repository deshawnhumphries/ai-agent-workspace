'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, LogOut, Settings, User, Search } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

interface TopNavbarProps {
  title?: string;
}

export function TopNavbar({ title = 'Dashboard' }: TopNavbarProps) {
  const { user, signOut } = useAuth();

  const userEmail = user?.email || 'user@example.com';
  const userInitials = userEmail
    .split('@')[0]
    .split(/[._]/)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/80 backdrop-blur-md px-6 gap-6">
      <div className="flex-1 flex items-center gap-6">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="relative hidden md:flex items-center max-w-sm flex-1">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations, projects, documents..."
            className="pl-9 bg-muted/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm">{userEmail}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Account</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
