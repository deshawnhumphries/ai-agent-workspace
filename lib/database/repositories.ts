import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ConversationRow,
  ConversationInsert,
  ConversationUpdate,
  MessageRow,
  MessageInsert,
} from '@/types/database';

export class ConversationRepository {
  constructor(private client: SupabaseClient) {}

  async listByUser(limit = 50, offset = 0) {
    return this.client
      .from('conversations')
      .select('id, title, model, status, last_message_preview, created_at, updated_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);
  }

  async getById(id: string) {
    return this.client
      .from('conversations')
      .select('id, user_id, title, model, status, last_message_preview, created_at, updated_at')
      .eq('id', id)
      .maybeSingle();
  }

  async create(data: ConversationInsert) {
    return this.client
      .from('conversations')
      .insert(data)
      .select('id, title, model, status, last_message_preview, created_at, updated_at')
      .single();
  }

  async update(id: string, data: ConversationUpdate) {
    return this.client
      .from('conversations')
      .update(data)
      .eq('id', id)
      .select('id, title, model, status, last_message_preview, created_at, updated_at')
      .maybeSingle();
  }

  async delete(id: string) {
    return this.client.from('conversations').delete().eq('id', id);
  }

  async touch(id: string) {
    return this.client
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id);
  }
}

export class MessageRepository {
  constructor(private client: SupabaseClient) {}

  async listByConversation(conversationId: string) {
    return this.client
      .from('messages')
      .select('id, conversation_id, role, content, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
  }

  async create(data: MessageInsert) {
    return this.client
      .from('messages')
      .insert(data)
      .select('id, conversation_id, role, content, created_at')
      .single();
  }

  async createMany(items: MessageInsert[]) {
    return this.client.from('messages').insert(items).select('id, conversation_id, role, content, created_at');
  }

  async deleteByConversation(conversationId: string) {
    return this.client.from('messages').delete().eq('conversation_id', conversationId);
  }
}
