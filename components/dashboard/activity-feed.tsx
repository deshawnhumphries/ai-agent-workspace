'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  LogIn,
  FolderPlus,
  FileUp,
  MessageSquare,
  FileText,
} from 'lucide-react';

const activities = [
  {
    id: '1',
    action: 'Signed in',
    description: 'You signed in to your account',
    icon: LogIn,
    timestamp: 'Just now',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    id: '2',
    action: 'Created Project',
    description: 'E-Commerce Platform project created',
    icon: FolderPlus,
    timestamp: '2 hours ago',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    id: '3',
    action: 'Uploaded Document',
    description: 'quarterly_report.pdf uploaded',
    icon: FileUp,
    timestamp: '4 hours ago',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    id: '4',
    action: 'Started Conversation',
    description: 'API Integration Planning with Dev Assistant',
    icon: MessageSquare,
    timestamp: '1 day ago',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    id: '5',
    action: 'Generated Summary',
    description: 'Research Agent summarized 3 documents',
    icon: FileText,
    timestamp: '2 days ago',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
];

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="relative">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${activity.bg}`}>
                    <Icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  {index < activities.length - 1 && (
                    <div className="absolute left-1/2 top-9 h-8 w-px -translate-x-1/2 bg-border" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
