'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgentConfig, AgentId } from '@/types/agents';

interface AgentSelectorProps {
  agents: AgentConfig[];
  selectedAgent: AgentConfig;
  onSelect: (id: AgentId) => void;
}

export function AgentSelector({ agents, selectedAgent, onSelect }: AgentSelectorProps) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = selectedAgent.icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select agent"
          className="h-9 gap-2 max-w-[200px] sm:max-w-none justify-between font-medium"
        >
          <span className="flex items-center gap-2 min-w-0">
            <SelectedIcon className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{selectedAgent.name}</span>
          </span>
          <ChevronDown
            className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[300px] p-2"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          const firstItem = document.querySelector<HTMLButtonElement>('[data-agent-option]');
          firstItem?.focus();
        }}
      >
        <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Select Agent</p>
        <div className="space-y-1">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isSelected = agent.id === selectedAgent.id;
            return (
              <button
                key={agent.id}
                data-agent-option
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelect(agent.id);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors',
                  'hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isSelected && 'bg-primary/5'
                )}
              >
                <div className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                  isSelected ? 'bg-primary/10' : 'bg-muted'
                )}>
                  <Icon className={cn('h-4 w-4', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{agent.name}</span>
                    {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{agent.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
