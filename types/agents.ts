import type { LucideIcon } from 'lucide-react';

export type AgentId = 'research' | 'writing' | 'planning';

export interface AgentConfig {
  id: AgentId;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface AgentRegistry {
  agents: AgentConfig[];
  defaultAgentId: AgentId;
}
