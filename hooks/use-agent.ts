'use client';

import { useState, useCallback, useMemo } from 'react';
import { agentRegistry, DEFAULT_AGENT_ID, getAgentOrDefault } from '@/lib/agents/registry';
import type { AgentId, AgentConfig } from '@/types/agents';

interface UseAgentResult {
  selectedAgentId: AgentId;
  selectedAgent: AgentConfig;
  selectAgent: (id: AgentId) => void;
  resetAgent: () => void;
  agents: AgentConfig[];
}

export function useAgent(initialAgentId?: AgentId): UseAgentResult {
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>(
    initialAgentId ?? DEFAULT_AGENT_ID
  );

  const selectAgent = useCallback((id: AgentId) => {
    const agent = agentRegistry.agents.find(a => a.id === id);
    if (agent) {
      setSelectedAgentId(id);
    } else {
      setSelectedAgentId(DEFAULT_AGENT_ID);
    }
  }, []);

  const resetAgent = useCallback(() => {
    setSelectedAgentId(DEFAULT_AGENT_ID);
  }, []);

  const selectedAgent = useMemo(
    () => getAgentOrDefault(selectedAgentId),
    [selectedAgentId]
  );

  return {
    selectedAgentId,
    selectedAgent,
    selectAgent,
    resetAgent,
    agents: agentRegistry.agents,
  };
}
