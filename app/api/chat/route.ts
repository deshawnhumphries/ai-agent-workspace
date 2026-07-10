import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createClient } from '@/lib/supabase/server';
import { ConversationService } from '@/lib/database/conversation-service';
import { systemPrompt } from '@/lib/ai/prompts';

export const maxDuration = 60;

interface ChatRequestBody {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  conversationId?: string;
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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service is not configured.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const service = new ConversationService(supabase);

    // Resolve or create a conversation, and persist the latest user message.
    // The client always sends the full message history; we only persist the
    // newest user message (the last entry) to avoid duplicates.
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

    const openai = createOpenAI({ apiKey });

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      onFinish: async ({ text }) => {
        if (resolvedConversationId && text) {
          await service.addMessage(resolvedConversationId, 'assistant', text);
        }
      },
    });

    return result.toTextStreamResponse({
      headers: resolvedConversationId
        ? { 'X-Conversation-Id': resolvedConversationId }
        : undefined,
    });
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
