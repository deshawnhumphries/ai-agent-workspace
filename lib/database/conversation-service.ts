import type { SupabaseClient } from '@supabase/supabase-js';
import { ConversationRepository, MessageRepository } from '@/lib/database/repositories';
import type {
  ConversationRow,
  ConversationUpdate,
  MessageInsert,
  MessageRow,
} from '@/types/database';

export interface ConversationWithMessages extends ConversationRow {
  messages: MessageRow[];
}

export interface ServiceError {
  message: string;
  status?: number;
}

const MAX_TITLE_LENGTH = 60;

export function truncateTitle(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= MAX_TITLE_LENGTH) return trimmed;
  return trimmed.substring(0, MAX_TITLE_LENGTH).trimEnd() + '...';
}

export class ConversationService {
  private conversations: ConversationRepository;
  private messages: MessageRepository;

  constructor(client: SupabaseClient) {
    this.conversations = new ConversationRepository(client);
    this.messages = new MessageRepository(client);
  }

  async listConversations(limit = 50, offset = 0) {
    const { data, error } = await this.conversations.listByUser(limit, offset);
    if (error) return { data: null, error: { message: error.message } as ServiceError };
    return { data, error: null };
  }

  async getConversationWithMessages(id: string) {
    const { data: conv, error: convError } = await this.conversations.getById(id);
    if (convError) return { data: null, error: { message: convError.message } as ServiceError };
    if (!conv) return { data: null, error: { message: 'Conversation not found', status: 404 } as ServiceError };

    const { data: msgs, error: msgError } = await this.messages.listByConversation(id);
    if (msgError) return { data: null, error: { message: msgError.message } as ServiceError };

    return {
      data: { ...conv, messages: msgs ?? [] } as ConversationWithMessages,
      error: null,
    };
  }

  async getMessages(conversationId: string) {
    const { data, error } = await this.messages.listByConversation(conversationId);
    if (error) return { data: null, error: { message: error.message } as ServiceError };
    return { data, error: null };
  }

  async createConversation(firstMessage?: string, model = 'gpt-4o-mini') {
    const title = firstMessage ? truncateTitle(firstMessage) : 'New Chat';
    const { data, error } = await this.conversations.create({ title, model });
    if (error) return { data: null, error: { message: error.message } as ServiceError };
    return { data, error: null };
  }

  async addMessage(conversationId: string, role: MessageInsert['role'], content: string) {
    const { data, error } = await this.messages.create({ conversation_id: conversationId, role, content });
    if (error) return { data: null, error: { message: error.message } as ServiceError };
    // DB trigger `on_message_inserted` auto-updates updated_at + last_message_preview
    return { data, error: null };
  }

  async addMessages(items: MessageInsert[]) {
    const { data, error } = await this.messages.createMany(items);
    if (error) return { data: null, error: { message: error.message } as ServiceError };
    // DB trigger `on_message_inserted` auto-updates updated_at + last_message_preview per insert
    return { data, error: null };
  }

  async renameConversation(id: string, title: string) {
    const clean = title.trim();
    if (!clean) return { data: null, error: { message: 'Title cannot be empty' } as ServiceError };
    const { data, error } = await this.conversations.update(id, { title: truncateTitle(clean) });
    if (error) return { data: null, error: { message: error.message } as ServiceError };
    if (!data) return { data: null, error: { message: 'Conversation not found', status: 404 } as ServiceError };
    return { data, error: null };
  }

  async updateConversation(id: string, data: ConversationUpdate) {
    const { data: updated, error } = await this.conversations.update(id, data);
    if (error) return { data: null, error: { message: error.message } as ServiceError };
    if (!updated) return { data: null, error: { message: 'Conversation not found', status: 404 } as ServiceError };
    return { data: updated, error: null };
  }

  async deleteConversation(id: string) {
    const { error } = await this.conversations.delete(id);
    if (error) return { error: { message: error.message } as ServiceError };
    return { error: null };
  }
}
