'use client';

import { Bot, Sparkles, Code, FileText, Zap, Layout } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  onSendMessage: (message: string) => void;
  onSuggestionClick: (prompt: string) => void;
}

const suggestedPrompts = [
  {
    icon: Layout,
    title: 'Build a Next.js application',
    description: 'Scaffold a full-stack app with App Router',
    prompt: 'Build a Next.js application with App Router, Tailwind CSS, and Supabase authentication',
  },
  {
    icon: Sparkles,
    title: 'Explain Retrieval-Augmented Generation',
    description: 'Learn how RAG enhances AI responses',
    prompt: 'Explain Retrieval-Augmented Generation and how it works with vector databases',
  },
  {
    icon: FileText,
    title: 'Review my resume',
    description: 'Get feedback on your professional profile',
    prompt: 'Review my resume and suggest improvements for a senior software engineer role',
  },
  {
    icon: Code,
    title: 'Generate React components',
    description: 'Create reusable UI components',
    prompt: 'Generate a set of reusable React components with TypeScript and Tailwind CSS',
  },
  {
    icon: Zap,
    title: 'Design a REST API',
    description: 'Plan endpoints, schemas, and auth',
    prompt: 'Design a REST API for a task management application with proper endpoints and authentication',
  },
  {
    icon: Code,
    title: 'Review TypeScript code',
    description: 'Catch bugs and improve type safety',
    prompt: 'Review my TypeScript code for type safety, best practices, and potential bugs',
  },
];

export function EmptyState({ onSendMessage, onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full space-y-8 text-center">
          {/* Logo and Welcome */}
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">How can I help you today?</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Ask me anything about coding, writing, research, or planning. I&apos;m here to help you build faster.
            </p>
          </div>

          {/* Suggested Prompts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedPrompts.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all hover:-translate-y-1 text-left"
                  onClick={() => onSuggestionClick(prompt.prompt)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{prompt.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{prompt.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
