'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { ChatConversationSummary } from '@/types/chat';

interface UseConversationsResult {
  conversations: ChatConversationSummary[];
  loading: boolean;
  initialLoaded: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  upsertConversation: (summary: ChatConversationSummary) => void;
  removeConversation: (id: string) => void;
  updateConversationPreview: (id: string, preview: string) => void;
  renameConversation: (id: string, title: string) => Promise<boolean>;
  deleteConversation: (id: string) => Promise<boolean>;
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

function toSummary(row: ConversationDbRow): ChatConversationSummary {
  return {
    id: row.id,
    title: row.title,
    model: row.model,
    status: row.status as ChatConversationSummary['status'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastMessagePreview: row.last_message_preview,
  };
}

const SELECT_COLUMNS = 'id, title, model, status, last_message_preview, created_at, updated_at';

export function useConversations(): UseConversationsResult {
  const [conversations, setConversations] = useState<ChatConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const initialFetchDone = useRef(false);

  const fetchConversations = useCallback(async (isInitial: boolean) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    if (isInitial) setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('conversations')
        .select(SELECT_COLUMNS)
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .limit(50);

      if (queryError) throw queryError;
      if (!mountedRef.current) return;

      setConversations((data ?? []).map(toSummary));
      if (isInitial) setInitialLoaded(true);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      if (mountedRef.current && isInitial) setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => fetchConversations(false), [fetchConversations]);

  const upsertConversation = useCallback((summary: ChatConversationSummary) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== summary.id);
      return [summary, ...filtered];
    });
  }, []);

  const removeConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateConversationPreview = useCallback((id: string, preview: string) => {
    const truncated = preview.length > 120 ? preview.substring(0, 117) + '...' : preview;
    setConversations(prev => {
      const updated = prev.map(c =>
        c.id === id
          ? { ...c, lastMessagePreview: truncated, updatedAt: new Date().toISOString() }
          : c
      );
      // Re-sort: move updated conversation to top
      updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      return updated;
    });
  }, []);

  const renameConversation = useCallback(async (id: string, title: string): Promise<boolean> => {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const clean = title.trim();
    if (!clean) {
      setError('Title cannot be empty');
      return false;
    }

    try {
      const { data, error: queryError } = await supabase
        .from('conversations')
        .update({ title: clean })
        .eq('id', id)
        .select(SELECT_COLUMNS)
        .maybeSingle();

      if (queryError) throw queryError;
      if (data) {
        setConversations(prev => {
          const updated = prev.map(c => (c.id === id ? toSummary(data) : c));
          updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          return updated;
        });
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename conversation');
      return false;
    }
  }, []);

  const deleteConversation = useCallback(async (id: string): Promise<boolean> => {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const { error: queryError } = await supabase.from('conversations').delete().eq('id', id);
      if (queryError) throw queryError;

      setConversations(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation');
      return false;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchConversations(true);
    }
    return () => {
      mountedRef.current = false;
    };
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    initialLoaded,
    error,
    refresh,
    upsertConversation,
    removeConversation,
    updateConversationPreview,
    renameConversation,
    deleteConversation,
  };
}
