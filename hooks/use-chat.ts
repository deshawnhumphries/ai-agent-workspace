'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { ChatMessage } from '@/types/chat';

interface UseChatOptions {
  api?: string;
  conversationId?: string | null;
}

interface ChatState {
  messages: ChatMessage[];
  setMessages: (newMessages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  isLoadingHistory: boolean;
  notFound: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  retry: () => void;
  clearMessages: () => void;
  stop: () => void;
  scrollToBottom: () => void;
  activeConversationId: string | null;
}

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function useChat(options: UseChatOptions = {}): ChatState {
  const { api = '/api/chat', conversationId = null } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(conversationId);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const conversationIdRef = useRef<string | null>(conversationId);
  const loadIdRef = useRef<string | null>(null);
  // Tracks conversation IDs created locally during send — prevents loadHistory
  // from overwriting in-flight streaming messages when the URL updates.
  const locallyCreatedRef = useRef<Set<string>>(new Set());
  // Stores the last failed prompt for retry
  const lastFailedPromptRef = useRef<string | null>(null);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load message history when conversationId changes
  const loadHistory = useCallback(async (id: string) => {
    // Skip loading if this conversation was just created locally — the
    // streaming messages are already in state and we don't want to overwrite.
    if (locallyCreatedRef.current.has(id)) {
      setActiveConversationId(id);
      return;
    }

    if (loadIdRef.current === id) return;
    loadIdRef.current = id;

    const supabase = getSupabaseClient();
    if (!supabase) {
      loadIdRef.current = null;
      return;
    }

    setIsLoadingHistory(true);
    setError(null);
    setNotFound(false);

    try {
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (convError) throw convError;

      if (!convData) {
        if (loadIdRef.current === id) {
          setNotFound(true);
          setMessages([]);
        }
        return;
      }

      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('id, role, content, created_at')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      if (loadIdRef.current !== id) return;

      setMessages(
        (msgData ?? []).map(m => ({
          id: m.id,
          role: m.role as ChatMessage['role'],
          content: m.content,
          createdAt: m.created_at,
        }))
      );
    } catch (err) {
      if (loadIdRef.current !== id) return;
      setError(err instanceof Error ? err.message : 'Failed to load conversation history');
      setMessages([]);
    } finally {
      if (loadIdRef.current === id) {
        setIsLoadingHistory(false);
        loadIdRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    if (conversationId) {
      loadHistory(conversationId);
    } else {
      setMessages([]);
      setError(null);
      setNotFound(false);
      loadIdRef.current = null;
      setActiveConversationId(null);
    }
  }, [conversationId, loadHistory]);

  // Core send logic — extracted so retry can reuse it
  const executeSend = useCallback(
    async (content: string) => {
      setError(null);
      setNotFound(false);

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      const historyForApi = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: historyForApi,
            conversationId: conversationIdRef.current,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        const headerConvId = response.headers.get('X-Conversation-Id');
        if (headerConvId && !conversationIdRef.current) {
          conversationIdRef.current = headerConvId;
          locallyCreatedRef.current.add(headerConvId);
          setActiveConversationId(headerConvId);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let assistantContent = '';
        const assistantMessageId = generateId();

        setMessages(prev => [
          ...prev,
          { id: assistantMessageId, role: 'assistant', content: '', createdAt: new Date().toISOString() },
        ]);

        const processBuffer = (buf: string): string => {
          const lines = buf.split('\n');
          const remaining = lines.pop() ?? '';

          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const parsed = JSON.parse(line.slice(2));
                if (typeof parsed === 'string') {
                  assistantContent += parsed;
                  setMessages(prev =>
                    prev.map(m => (m.id === assistantMessageId ? { ...m, content: assistantContent } : m))
                  );
                  scrollToBottom();
                }
              } catch {
                // incomplete JSON, skip
              }
            }
          }
          return remaining;
        };

        let currentBuffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          currentBuffer = processBuffer(currentBuffer + decoder.decode(value, { stream: true }));
        }
        if (currentBuffer) processBuffer(currentBuffer + '\n');

        // Clear failed prompt on success
        lastFailedPromptRef.current = null;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;

        // Preserve the prompt for retry
        lastFailedPromptRef.current = content;

        // Remove the user message and assistant placeholder so the user can retry cleanly
        setMessages(prev => prev.filter(m => m.id !== userMessage.id));
        // Also remove any empty assistant placeholder
        setMessages(prev => prev.filter(m => !(m.role === 'assistant' && m.content === '')));

        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('Chat error:', err);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, api, scrollToBottom]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;
      setInput('');
      lastFailedPromptRef.current = null;
      await executeSend(content);
    },
    [isLoading, executeSend, setInput]
  );

  const retry = useCallback(async () => {
    const prompt = lastFailedPromptRef.current;
    if (!prompt) return;
    lastFailedPromptRef.current = null;
    setError(null);
    await executeSend(prompt);
  }, [executeSend]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setInput('');
    setError(null);
    setNotFound(false);
    conversationIdRef.current = null;
    setActiveConversationId(null);
    loadIdRef.current = null;
    lastFailedPromptRef.current = null;
  }, []);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    setMessages,
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
  };
}
