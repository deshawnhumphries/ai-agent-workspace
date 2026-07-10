// Database row types — mirror the Supabase schema exactly.

export interface ProfileRow {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ConversationStatus = 'active' | 'archived' | 'deleted';

export interface ConversationRow {
  id: string;
  user_id: string;
  title: string;
  model: string;
  status: ConversationStatus;
  last_message_preview: string | null;
  created_at: string;
  updated_at: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface MessageRow {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

// Insert helper types (omit auto-generated columns)

export type ConversationInsert = {
  title?: string;
  model?: string;
  status?: ConversationStatus;
  // user_id defaults to auth.uid() server-side; omitted on client inserts
  user_id?: string;
};

export type MessageInsert = {
  conversation_id: string;
  role: MessageRole;
  content: string;
};

export type ConversationUpdate = {
  title?: string;
  model?: string;
  status?: ConversationStatus;
};

export type ProfileUpdate = {
  display_name?: string;
  avatar_url?: string;
};
