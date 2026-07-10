'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FolderKanban, Bot, FileText, MessageSquare, ArrowRight } from 'lucide-react';

const projects = [
  {
    id: '1',
    name: 'E-Commerce Platform',
    description: 'Building a modern online shopping experience',
    progress: 65,
    status: 'active',
    documents: 12,
    conversations: 8,
  },
  {
    id: '2',
    name: 'Marketing Automation',
    description: 'Automated campaign management system',
    progress: 42,
    status: 'active',
    documents: 8,
    conversations: 15,
  },
  {
    id: '3',
    name: 'API Integration Hub',
    description: 'Third-party service integrations',
    progress: 100,
    status: 'completed',
    documents: 6,
    conversations: 4,
  },
];

const statusColors: Record<string, "default" | "secondary"> = {
  active: 'default',
  completed: 'secondary',
};

export function ProjectsSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5" />
          Projects
        </CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold group-hover:text-primary transition-colors">
                    {project.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.description}
                  </p>
                </div>
                <Badge variant={statusColors[project.status]}>{project.status}</Badge>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {project.documents}
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {project.conversations}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
