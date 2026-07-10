'use client';

import { RefObject } from 'react';
import { Bot, AlertCircle, Square, Loader2, RefreshCw } from 'lucide-react';
import { ChatInput } from '@/components/chat/chat-input';
import { MessageBubble } from '@/components/chat/message-bubble';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { EmptyState } from '@/components/chat/empty-state';
import { Button } from '@/components/ui/button';
import { MessageListSkeleton } from '@/components/chat/conversation-skeleton';
import { ConversationEmptyState } from '@/components/chat/conversation-empty-state';
import type { ChatMessage } from '@/types/chat';

interface ChatWindowProps {
  messages: ChatMessage[];
  input: string;
  setInput: (input: string) => void;
  onSendMessage: (message: string) => void;
  onSuggestionClick: (prompt: string) => void;
  onRetry?: () => void;
  onNewChat: () => void;
  isLoading: boolean;
  isLoadingHistory?: boolean;
  notFound?: boolean;
  error: string | null;
  stop: () => void;
  messagesEndRef: RefObject<HTMLDivElement>;
  conversationTitle?: string;
  conversationModel?: string;
}

export function ChatWindow({
  messages,
  input,
  setInput,
  onSendMessage,
  onSuggestionClick,
  onRetry,
  onNewChat,
  isLoading,
  isLoadingHistory,
  notFound,
  error,
  stop,
  messagesEndRef,
  conversationTitle,
  conversationModel,
}: ChatWindowProps) {
  const hasMessages = messages.length > 0;

  // Not found / deleted conversation
  if (notFound) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 py-3 md:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <Bot className="h-5 w-5 text-primary shrink-0" />
            <h1 className="font-semibold truncate text-muted-foreground">Conversation unavailable</h1>
          </div>
          <Button onClick={onNewChat} variant="ghost" size="sm">New Chat</Button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <ConversationEmptyState variant="not-found" onStartChat={onNewChat} />
        </div>
      </div>
    );
  }

  // Loading message history
  if (isLoadingHistory) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 py-3 md:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <Bot className="h-5 w-5 text-primary shrink-0" />
            <div className="min-w-0">
              <h1 className="font-semibold truncate">{conversationTitle || 'Loading...'}</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Loading conversation...
              </p>
            </div>
          </div>
          <Button onClick={onNewChat} variant="ghost" size="sm">New Chat</Button>
        </header>
        <div className="flex-1 overflow-y-auto">
          <MessageListSkeleton />
        </div>
      </div>
    );
  }

  // Welcome state - no conversation selected, no messages
  if (!hasMessages && !isLoading && !error) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <EmptyState onSendMessage={onSendMessage} onSuggestionClick={onSuggestionClick} />
        <div className="border-t bg-background/80 backdrop-blur-sm p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              input={input}
              setInput={setInput}
              onSendMessage={onSendMessage}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
  const isStreaming = isLoading && lastUserMessage && !lastAssistantMessage?.content;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 py-3 md:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <Bot className="h-5 w-5 text-primary shrink-0" />
          <div className="min-w-0">
            <h1 className="font-semibold truncate">
              {conversationTitle || 'New Chat'}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                {hasMessages ? `${messages.length} messages` : 'Start a new conversation'}
              </p>
              {conversationModel && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground/80 font-mono">
                  {conversationModel}
                </span>
              )}
            </div>
          </div>
        </div>
        <Button onClick={onNewChat} variant="ghost" size="sm">
          New Chat
        </Button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 md:px-6 space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Typing indicator */}
          {isStreaming && <TypingIndicator />}

          {/* Error state with retry */}
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Error</p>
                  <p className="mt-1">{error}</p>
                  {onRetry && (
                    <Button variant="outline" size="sm" onClick={onRetry} className="mt-3 gap-2">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-background/80 backdrop-blur-sm p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          {isLoading && !isStreaming ? (
            <div className="flex items-center justify-center gap-2 py-4">
              <Bot className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
              <Button variant="ghost" size="sm" onClick={stop}>
                <Square className="h-4 w-4 mr-1" />
                Stop
              </Button>
            </div>
          ) : (
            <ChatInput
              input={input}
              setInput={setInput}
              onSendMessage={onSendMessage}
              disabled={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
