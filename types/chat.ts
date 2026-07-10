import type { MessageRole, ConversationStatus } from './database';

export type { MessageRole, ConversationStatus } from './database';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  model: string;
  status: ConversationStatus;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
}

export interface ChatConversationSummary {
  id: string;
  title: string;
  model: string;
  status: ConversationStatus;
  createdAt: string;
  updatedAt: string;
  lastMessagePreview: string | null;
}

export interface ChatError {
  message: string;
  code?: string;
  status?: number;
}
