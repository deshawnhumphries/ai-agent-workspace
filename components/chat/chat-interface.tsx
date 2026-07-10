'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { useChat } from '@/hooks/use-chat';
import { useConversations } from '@/hooks/use-conversations';
import { Sidebar } from '@/components/layout/sidebar';
import { ConversationSidebar } from '@/components/chat/conversation-sidebar';
import { ChatWindow } from '@/components/chat/chat-window';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatConversationSummary } from '@/types/chat';

export default function ChatInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading: authLoading } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversationSidebarOpen, setConversationSidebarOpen] = useState(true);

  // URL is the source of truth for the selected conversation
  const urlConversationId = searchParams.get('id');

  const {
    conversations,
    loading: conversationsLoading,
    initialLoaded,
    refresh: refreshConversations,
    upsertConversation,
    removeConversation,
    updateConversationPreview,
    renameConversation,
    deleteConversation,
  } = useConversations();

  const {
    messages,
    messagesEndRef,
    input,
    setInput,
    isLoading,
    isLoadingHistory,
    notFound,
    error,
    sendMessage,
    retry,
    clearMessages,
    stop,
    scrollToBottom,
    activeConversationId,
  } = useChat({ conversationId: urlConversationId });

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // When the server creates a conversation during send, navigate to its URL
  useEffect(() => {
    if (activeConversationId && !urlConversationId) {
      router.push(`/chat?id=${activeConversationId}`);
    }
  }, [activeConversationId, urlConversationId, router]);

  // When a new conversation is created (activeConversationId appears),
  // fetch its full summary and insert it into the sidebar immediately.
  useEffect(() => {
    if (!activeConversationId) return;
    // Only insert if it's not already in the list
    const exists = conversations.some(c => c.id === activeConversationId);
    if (exists) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from('conversations')
        .select('id, title, model, status, last_message_preview, created_at, updated_at')
        .eq('id', activeConversationId)
        .maybeSingle();

      if (cancelled || !data) return;

      upsertConversation({
        id: data.id,
        title: data.title,
        model: data.model,
        status: data.status as ChatConversationSummary['status'],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        lastMessagePreview: data.last_message_preview,
      });
    })();

    return () => { cancelled = true; };
  }, [activeConversationId, conversations, upsertConversation]);

  // Refresh conversation list after streaming finishes (syncs preview/timestamp)
  useEffect(() => {
    if (!isLoading) {
      refreshConversations();
    }
  }, [isLoading, refreshConversations]);

  // Keyboard shortcut: Cmd/Ctrl+Shift+O for New Chat
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'O') {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewChat = useCallback(() => {
    router.push('/chat');
    clearMessages();
  }, [router, clearMessages]);

  const handleSelectConversation = useCallback(
    (conversationId: string) => {
      if (conversationId === urlConversationId) return;
      router.push(`/chat?id=${conversationId}`);
    },
    [router, urlConversationId]
  );

  const handleRenameConversation = useCallback(
    async (id: string, title: string) => {
      await renameConversation(id, title);
    },
    [renameConversation]
  );

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      const success = await deleteConversation(id);
      if (success) {
        removeConversation(id);
        if (urlConversationId === id) {
          handleNewChat();
        }
      }
    },
    [deleteConversation, removeConversation, urlConversationId, handleNewChat]
  );

  // Sync sidebar when a new message is sent (optimistic preview + move to top)
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (urlConversationId) {
        updateConversationPreview(urlConversationId, content);
      }
      await sendMessage(content);
    },
    [sendMessage, urlConversationId, updateConversationPreview]
  );

  const handleSuggestionClick = useCallback(
    (prompt: string) => {
      setInput(prompt);
    },
    [setInput]
  );

  // Use activeConversationId for highlight during streaming, urlConversationId otherwise
  const highlightId = urlConversationId ?? activeConversationId;
  const activeConversation = conversations.find(c => c.id === highlightId);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />

      <div className={cn('flex-1 flex flex-col md:ml-64 transition-all duration-300', sidebarCollapsed && 'md:ml-16')}>
        <div className="flex-1 flex overflow-hidden">
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={highlightId}
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
            onRenameConversation={handleRenameConversation}
            onDeleteConversation={handleDeleteConversation}
            loading={conversationsLoading}
            initialLoaded={initialLoaded}
            collapsed={!conversationSidebarOpen}
            onToggleCollapse={() => setConversationSidebarOpen(!conversationSidebarOpen)}
          />

          <ChatWindow
            messages={messages}
            input={input}
            setInput={setInput}
            onSendMessage={handleSendMessage}
            onSuggestionClick={handleSuggestionClick}
            onRetry={retry}
            onNewChat={handleNewChat}
            isLoading={isLoading}
            isLoadingHistory={isLoadingHistory}
            notFound={notFound}
            error={error}
            stop={stop}
            messagesEndRef={messagesEndRef}
            conversationTitle={activeConversation?.title}
            conversationModel={activeConversation?.model}
          />
        </div>
      </div>
    </div>
  );
}
