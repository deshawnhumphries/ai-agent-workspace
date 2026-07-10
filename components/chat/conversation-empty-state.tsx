'use client';

import { Bot, SearchX, MessageSquarePlus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConversationEmptyStateProps {
  variant: 'no-conversations' | 'no-results' | 'not-found';
  searchQuery?: string;
  onStartChat?: () => void;
  onClearSearch?: () => void;
}

export function ConversationEmptyState({
  variant,
  searchQuery,
  onStartChat,
  onClearSearch,
}: ConversationEmptyStateProps) {
  if (variant === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <SearchX className="h-8 w-8 text-muted-foreground/60 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No conversations found</p>
        <p className="text-xs text-muted-foreground/70 mt-1 mb-3">
          No matches for "{searchQuery}"
        </p>
        {onClearSearch && (
          <Button variant="outline" size="sm" onClick={onClearSearch}>
            Clear search
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'not-found') {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground/60 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Conversation not found</p>
        <p className="text-xs text-muted-foreground/70 mt-1 mb-3">
          This conversation may have been deleted or you don&apos;t have access to it.
        </p>
        {onStartChat && (
          <Button variant="outline" size="sm" onClick={onStartChat}>
            Start a new chat
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
        <Bot className="h-6 w-6 text-primary" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">No conversations yet</p>
      <p className="text-xs text-muted-foreground/70 mt-1 mb-4">
        Start chatting to see your conversation history here.
      </p>
      {onStartChat && (
        <Button size="sm" onClick={onStartChat} className="gap-2">
          <MessageSquarePlus className="h-4 w-4" />
          Start Your First Chat
        </Button>
      )}
    </div>
  );
}
