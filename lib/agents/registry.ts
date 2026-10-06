import { Search, PenLine, ListTodo } from 'lucide-react';
import type { AgentRegistry } from '@/types/agents';

export const agentRegistry: AgentRegistry = {
  defaultAgentId: 'research',
  agents: [
    {
      id: 'research',
      name: 'Research Agent',
      description: 'Research, analyze, compare, and explain complex topics.',
      icon: Search,
    },
    {
      id: 'writing',
      name: 'Writing Agent',
      description: 'Create, rewrite, edit, and improve written content.',
      icon: PenLine,
    },
    {
      id: 'planning',
      name: 'Planning Agent',
      description: 'Turn goals into structured plans, milestones, and actionable tasks.',
      icon: ListTodo,
    },
  ],
};

export const DEFAULT_AGENT_ID = agentRegistry.defaultAgentId;

export function getAgent(id: string) {
  return agentRegistry.agents.find(a => a.id === id);
}

export function getAgentOrDefault(id: string | null | undefined) {
  if (!id) return getAgent(DEFAULT_AGENT_ID)!;
  return getAgent(id) ?? getAgent(DEFAULT_AGENT_ID)!;
}
