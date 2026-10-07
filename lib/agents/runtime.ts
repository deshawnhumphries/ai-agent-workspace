import { getAgentOrDefault, DEFAULT_AGENT_ID } from '@/lib/agents/registry';
import { agentDefinitions } from '@/lib/agents/definitions';
import { BaseAgent } from '@/lib/agents/base-agent';
import type {
  AgentRuntimeRequest,
  AgentRuntimeResult,
  AgentRuntimeError,
  Agent,
  AgentExecutionContext,
  AgentMessage,
} from '@/lib/agents/types';
import type { AgentId } from '@/types/agents';

type AgentFactory = (id: AgentId, systemPrompt: string) => Agent;

export class AgentRuntime {
  private agentFactory: AgentFactory;

  constructor(agentFactory?: AgentFactory) {
    this.agentFactory = agentFactory ?? ((id, systemPrompt) => new BaseAgent(id, systemPrompt));
  }

  resolveAgent(agentId: string | null | undefined): Agent | null {
    const config = getAgentOrDefault(agentId ?? undefined);
    const definition = agentDefinitions[config.id];
    if (!definition) {
      console.error(`Agent runtime: no definition found for agent "${config.id}"`);
      return null;
    }
    return this.agentFactory(config.id, definition.systemPrompt);
  }

  validateRequest(request: AgentRuntimeRequest): AgentRuntimeError | null {
    if (!request.agentId) {
      return { message: 'A message is required.', status: 400 };
    }

    const config = getAgentOrDefault(request.agentId);
    if (config.id !== request.agentId) {
      return { message: 'Unsupported agent.', status: 400 };
    }

    if (!request.messages || request.messages.length === 0) {
      return { message: 'A message is required.', status: 400 };
    }

    const lastMessage = request.messages[request.messages.length - 1];
    if (!lastMessage || !lastMessage.content?.trim()) {
      return { message: 'A message is required.', status: 400 };
    }

    if (!request.userId) {
      return { message: 'Unauthorized', status: 401 };
    }

    return null;
  }

  async execute(request: AgentRuntimeRequest): Promise<AgentRuntimeResult | { error: AgentRuntimeError }> {
    const validationError = this.validateRequest(request);
    if (validationError) {
      return { error: validationError };
    }

    const agent = this.resolveAgent(request.agentId);
    if (!agent) {
      console.error(`Agent runtime: failed to resolve agent "${request.agentId}"`);
      return { error: { message: 'Unsupported agent.', status: 400 } };
    }

    const ctx: AgentExecutionContext = {
      agentId: agent.id,
      systemPrompt: agent.systemPrompt,
      messages: request.messages,
      model: request.model || 'gpt-4o-mini',
      temperature: request.temperature ?? 0.7,
      onFinish: request.onFinish,
    };

    try {
      const stream = await agent.execute(ctx);
      return {
        agentId: agent.id,
        stream,
        conversationId: request.conversationId,
      };
    } catch (err) {
      console.error(`Agent runtime: execution failed for agent "${request.agentId}"`, err);
      const message = err instanceof Error ? err.message : 'Unable to process the request. Please try again.';
      return { error: { message, status: 500 } };
    }
  }
}

export { DEFAULT_AGENT_ID };
