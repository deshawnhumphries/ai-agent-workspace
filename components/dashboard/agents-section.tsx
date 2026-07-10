'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  ListTodo,
  PenTool,
  Code,
  Rocket,
} from 'lucide-react';

const agents = [
  {
    id: '1',
    name: 'Research Agent',
    description: 'Finds information and summarizes documents. Perfect for research tasks and knowledge synthesis.',
    icon: Search,
    status: 'available',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    id: '2',
    name: 'Planning Agent',
    description: 'Creates execution plans and roadmaps. Great for project planning and task breakdown.',
    icon: ListTodo,
    status: 'available',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    id: '3',
    name: 'Writing Agent',
    description: 'Generates professional written content. Ideal for articles, emails, and documentation.',
    icon: PenTool,
    status: 'available',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    id: '4',
    name: 'Coding Agent',
    description: 'Assists with software development. Helps with code review, debugging, and implementation.',
    icon: Code,
    status: 'busy',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
];

const statusColors: Record<string, string> = {
  available: 'bg-green-500/10 text-green-600 border-green-500/20',
  busy: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
};

export function AgentsSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          AI Agents
        </CardTitle>
        <Button variant="outline" size="sm">
          Create Agent
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className="border rounded-lg p-6 hover:shadow-md transition-all cursor-pointer group hover:border-primary/50"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${agent.bg}`}>
                    <Icon className={`h-6 w-6 ${agent.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {agent.name}
                      </h4>
                      <Badge variant="secondary" className={statusColors[agent.status]}>
                        {agent.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {agent.description}
                    </p>
                    <Button
                      size="sm"
                      className="mt-4"
                      disabled={agent.status === 'busy'}
                    >
                      Launch
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
