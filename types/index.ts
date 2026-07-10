export interface Conversation {
  id: string;
  title: string;
  agent: string;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  progress: number;
  lastUpdated: string;
  agents: string[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'busy';
  lastActive: string;
  tasksCompleted: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
}

export interface NavItem {
  name: string;
  href: string;
  icon?: string;
}
