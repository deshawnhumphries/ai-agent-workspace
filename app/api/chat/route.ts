import { createClient } from '@/lib/supabase/server';
import { ConversationService } from '@/lib/database/conversation-service';
import { AgentRuntime } from '@/lib/agents/runtime';
import { DEFAULT_AGENT_ID } from '@/lib/agents/registry';
import type { AgentId } from '@/types/agents';
import type { AgentMessage } from '@/lib/agents/types';

export const maxDuration = 60;

interface ChatRequestBody {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  conversationId?: string;
  agentId?: string;
}

const runtime = new AgentRuntime();

function isAgentId(value: string): value is AgentId {
  return value === 'research' || value === 'writing' || value === 'planning';
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json() as ChatRequestBody;
    const { messages, conversationId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Resolve agent ID — validate against the typed union, fall back to default
    const agentId: AgentId = body.agentId && isAgentId(body.agentId) ? body.agentId : DEFAULT_AGENT_ID;

    const service = new ConversationService(supabase);

    // Resolve or create a conversation, and persist the latest user message.
    let resolvedConversationId = conversationId;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && lastMessage.role === 'user') {
      if (!resolvedConversationId) {
        const { data: conv, error: convError } = await service.createConversation(lastMessage.content);
        if (convError) {
          return new Response(JSON.stringify({ error: convError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        resolvedConversationId = conv.id;
      } else {
        const { error: msgError } = await service.addMessage(resolvedConversationId, 'user', lastMessage.content);
        if (msgError) {
          return new Response(JSON.stringify({ error: msgError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }

    const agentMessages: AgentMessage[] = messages.map(m => ({
      role: m.role as AgentMessage['role'],
      content: m.content,
    }));

    const result = await runtime.execute({
      agentId,
      messages: agentMessages,
      conversationId: resolvedConversationId,
      userId: user.id,
      model: 'gpt-4o-mini',
      temperature: 0.7,
      onFinish: async (text) => {
        if (resolvedConversationId && text) {
          await service.addMessage(resolvedConversationId, 'assistant', text);
        }
      },
    });

    if ('error' in result) {
      const { error } = result;
      if (error.message.includes('rate limit')) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (error.message.includes('context_length')) {
        return new Response(
          JSON.stringify({ error: 'Message too long. Please start a new conversation.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: error.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const headers: Record<string, string> = {};
    if (resolvedConversationId) {
      headers['X-Conversation-Id'] = resolvedConversationId;
    }
    headers['X-Agent-Id'] = result.agentId;

    return new Response(result.stream, { headers });
  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (error.message.includes('context_length')) {
        return new Response(
          JSON.stringify({ error: 'Message too long. Please start a new conversation.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
