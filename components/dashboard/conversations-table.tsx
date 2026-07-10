'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Clock, ArrowRight } from 'lucide-react';

const conversations = [
  {
    id: '1',
    title: 'Build AI Portfolio Website',
    agent: 'Dev Assistant',
    lastMessage: 'I have completed the homepage layout and added responsive...',
    timestamp: '2 hours ago',
    status: 'active',
  },
  {
    id: '2',
    title: 'Quarterly Report Analysis',
    agent: 'Research Agent',
    lastMessage: 'The quarterly report has been summarized. Key findings...',
    timestamp: '4 hours ago',
    status: 'active',
  },
  {
    id: '3',
    title: 'Marketing Strategy Draft',
    agent: 'Writing Agent',
    lastMessage: 'Here is the revised marketing strategy document based...',
    timestamp: '1 day ago',
    status: 'completed',
  },
  {
    id: '4',
    title: 'API Integration Planning',
    agent: 'Dev Assistant',
    lastMessage: 'I have outlined the integration steps for the payment...',
    timestamp: '2 days ago',
    status: 'completed',
  },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-500/10 text-green-600 border-green-500/20',
  completed: 'bg-muted text-muted-foreground',
};

export function ConversationsTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent Conversations
        </CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {conversation.agent.split(' ').map((w) => w[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium truncate">{conversation.title}</h4>
                  <Badge variant="secondary" className={statusColors[conversation.status]}>
                    {conversation.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {conversation.lastMessage}
                </p>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground shrink-0">
                <span className="text-xs">{conversation.agent}</span>
                <div className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {conversation.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
