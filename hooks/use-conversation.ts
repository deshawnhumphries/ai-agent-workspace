'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { ChatMessage, ChatConversationSummary } from '@/types/chat';

interface ConversationDetail extends ChatConversationSummary {
  messages: ChatMessage[];
}

interface UseConversationResult {
  conversation: ConversationDetail | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  loadConversation: (id: string) => Promise<void>;
  clear: () => void;
}

interface ConversationDbRow {
  id: string;
  title: string;
  model: string;
  status: string;
  last_message_preview: string | null;
  created_at: string;
  updated_at: string;
}

interface MessageDbRow {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

export function useConversation(): UseConversationResult {
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const currentIdRef = useRef<string | null>(null);

  const loadConversation = useCallback(async (id: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    // Prevent duplicate concurrent loads of the same conversation
    if (currentIdRef.current === id && loading) return;
    currentIdRef.current = id;

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('id, title, model, status, last_message_preview, created_at, updated_at')
        .eq('id', id)
        .maybeSingle();

      if (convError) throw convError;

      // If conversation doesn't exist or RLS blocks access, convData is null
      if (!convData) {
        if (currentIdRef.current === id) {
          setNotFound(true);
          setConversation(null);
        }
        return;
      }

      const conv = convData as ConversationDbRow;

      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('id, role, content, created_at')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      if (currentIdRef.current !== id) return;

      const messages: ChatMessage[] = (msgData ?? []).map((m: MessageDbRow) => ({
        id: m.id,
        role: m.role as ChatMessage['role'],
        content: m.content,
        createdAt: m.created_at,
      }));

      setConversation({
        id: conv.id,
        title: conv.title,
        model: conv.model,
        status: conv.status as ChatConversationSummary['status'],
        createdAt: conv.created_at,
        updatedAt: conv.updated_at,
        lastMessagePreview: conv.last_message_preview,
        messages,
      });
    } catch (err) {
      if (currentIdRef.current !== id) return;
      setError(err instanceof Error ? err.message : 'Failed to load conversation');
      setConversation(null);
    } finally {
      if (currentIdRef.current === id) setLoading(false);
    }
  }, [loading]);

  const clear = useCallback(() => {
    currentIdRef.current = null;
    setConversation(null);
    setError(null);
    setNotFound(false);
    setLoading(false);
  }, []);

  // Reset when component unmounts
  useEffect(() => {
    return () => {
      currentIdRef.current = null;
    };
  }, []);

  return {
    conversation,
    loading,
    error,
    notFound,
    loadConversation,
    clear,
  };
}
