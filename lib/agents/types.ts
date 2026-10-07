import type { AgentId } from '@/types/agents';
import type { MessageRole } from '@/types/database';

export interface AgentMessage {
  role: MessageRole;
  content: string;
}

export interface AgentRuntimeRequest {
  agentId: AgentId;
  messages: AgentMessage[];
  conversationId?: string;
  userId: string;
  model?: string;
  temperature?: number;
  onFinish: (text: string) => Promise<void>;
}

export interface AgentRuntimeResult {
  agentId: AgentId;
  stream: ReadableStream<Uint8Array>;
  conversationId?: string;
}

export interface AgentRuntimeError {
  message: string;
  status: number;
}

export interface AgentExecutionContext {
  agentId: AgentId;
  systemPrompt: string;
  messages: AgentMessage[];
  model: string;
  temperature: number;
  onFinish: (text: string) => Promise<void>;
}

export interface Agent {
  id: AgentId;
  systemPrompt: string;
  execute(ctx: AgentExecutionContext): Promise<ReadableStream<Uint8Array>>;
}
