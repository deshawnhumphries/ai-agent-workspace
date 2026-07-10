'use client';

import { User, Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types/chat';

interface MessageBubbleProps {
  message: ChatMessage;
}

function formatTime(date: string | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const timestamp = message.createdAt ? formatTime(message.createdAt) : '';

  return (
    <div className={cn('flex gap-4', isUser && 'flex-row-reverse')}>
      <Avatar className={cn('h-8 w-8 shrink-0', isUser ? 'bg-primary' : 'bg-muted')}>
        <AvatarFallback
          className={cn('text-xs', isUser ? 'bg-primary text-primary-foreground' : 'bg-muted')}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={cn('flex-1 min-w-0', isUser ? 'text-right' : 'text-left')}>
        <div className="flex items-center gap-2 mb-1.5">
          {!isUser && <span className="text-sm font-medium">AI Assistant</span>}
          <span className="text-xs text-muted-foreground">{timestamp}</span>
          {isUser && <span className="text-sm font-medium">You</span>}
        </div>

        <div
          className={cn(
            'rounded-2xl px-4 py-3 inline-block max-w-full text-left',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-muted rounded-tl-sm'
          )}
        >
          <div
            className={cn(
              'prose prose-sm max-w-none break-words',
              isUser ? 'prose-invert' : 'dark:prose-invert'
            )}
          >
            {message.content.split('\n').map((line, i) => (
              <span key={i}>
                {line || '\u00A0'}
                {i < message.content.split('\n').length - 1 && <br />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
