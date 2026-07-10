'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FolderKanban, MessageSquare, FileText, Bot, TrendingUp } from 'lucide-react';

const stats = [
  {
    label: 'Projects',
    value: '12',
    change: '+3 this month',
    icon: FolderKanban,
    color: 'text-green-500',
  },
  {
    label: 'Conversations',
    value: '48',
    change: '+12 this week',
    icon: MessageSquare,
    color: 'text-blue-500',
  },
  {
    label: 'Documents',
    value: '156',
    change: '+24 uploaded',
    icon: FileText,
    color: 'text-orange-500',
  },
  {
    label: 'AI Agents',
    value: '8',
    change: '4 active',
    icon: Bot,
    color: 'text-purple-500',
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
