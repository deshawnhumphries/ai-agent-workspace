'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Mic } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ input, setInput, onSendMessage, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-3">
      {/* Input Area */}
      <div className="relative flex items-end gap-2 rounded-2xl border bg-background p-2">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
          disabled
          title="Attach file (coming soon)"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent min-h-[40px] max-h-[200px] py-2"
          rows={1}
          disabled={disabled}
        />

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            disabled
            title="Voice input (coming soon)"
          >
            <Mic className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Enter</kbd> to send,{' '}
        <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}
