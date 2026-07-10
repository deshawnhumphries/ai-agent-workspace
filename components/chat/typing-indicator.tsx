'use client';

import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function TypingIndicator() {
  return (
    <div className="flex gap-4">
      <Avatar className="h-8 w-8 shrink-0 bg-muted">
        <AvatarFallback className="text-xs bg-muted">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-medium">AI Assistant</span>
        </div>

        <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
