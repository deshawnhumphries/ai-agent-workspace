'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, FolderKanban, FileText, Bot } from 'lucide-react';
import Link from 'next/link';

const actions = [
  {
    title: 'New Chat',
    description: 'Start a conversation with an AI agent',
    icon: MessageSquare,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    href: '/chat',
  },
  {
    title: 'New Project',
    description: 'Create a new project workspace',
    icon: FolderKanban,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    href: '/dashboard/projects',
  },
  {
    title: 'Upload Document',
    description: 'Add documents for AI analysis',
    icon: FileText,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    href: '/dashboard/documents',
  },
  {
    title: 'Create Agent',
    description: 'Design a custom AI assistant',
    icon: Bot,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    href: '/dashboard/agents',
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.title} href={action.href}>
            <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${action.bg}`}>
                    <Icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
