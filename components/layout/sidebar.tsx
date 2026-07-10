'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, LayoutDashboard, MessageSquare, FolderKanban, FileText, Settings, CheckSquare, LogOut, ChevronLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/auth-provider';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { name: 'Chats', href: '/chat', icon: MessageSquare },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText },
  { name: 'Agents', href: '/dashboard/agents', icon: Bot },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
];

const bottomItems = [
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed: externalCollapsed, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const collapsed = externalCollapsed ?? internalCollapsed;
  const setCollapsed = onCollapsedChange ?? setInternalCollapsed;

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center border-b px-4 justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shrink-0">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && <span className="font-semibold">AI Workspace</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-8 w-8"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/chat' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-2 space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
          <button
            onClick={() => signOut()}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
