'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MessageSquare, Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2, Check, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatConversationSummary } from '@/types/chat';
import { ConversationListSkeleton } from '@/components/chat/conversation-skeleton';
import { ConversationEmptyState } from '@/components/chat/conversation-empty-state';

interface ConversationSidebarProps {
  conversations: ChatConversationSummary[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, title: string) => Promise<void>;
  onDeleteConversation: (id: string) => Promise<void>;
  loading: boolean;
  initialLoaded: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

interface ConversationItemProps {
  conversation: ChatConversationSummary;
  isActive: boolean;
  collapsed: boolean;
  onSelect: () => void;
  onRename: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => void;
}

function ConversationItem({
  conversation,
  isActive,
  collapsed,
  onSelect,
  onRename,
  onDelete,
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(conversation.title);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValue('');
    setIsSaving(false);
  };

  const saveEditing = async () => {
    if (!editValue.trim()) {
      cancelEditing();
      return;
    }
    setIsSaving(true);
    await onRename(conversation.id, editValue.trim());
    cancelEditing();
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEditing();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(conversation.id);
  };

  return (
    <div
      onClick={() => !isEditing && onSelect()}
      className={cn(
        'group w-full text-left rounded-lg p-3 transition-colors cursor-pointer',
        isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted border border-transparent'
      )}
    >
      <div className="flex items-start gap-3">
        <MessageSquare
          className={cn(
            'h-5 w-5 shrink-0 mt-0.5',
            isActive ? 'text-primary' : 'text-muted-foreground'
          )}
        />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <Input
                  ref={editInputRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  className="h-7 text-sm px-2"
                  disabled={isSaving}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0"
                  onClick={(e) => { e.stopPropagation(); saveEditing(); }}
                  disabled={isSaving}
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0"
                  onClick={(e) => { e.stopPropagation(); cancelEditing(); }}
                  disabled={isSaving}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <>
                <p
                  className={cn(
                    'font-medium truncate text-sm',
                    isActive && 'text-primary'
                  )}
                >
                  {conversation.title}
                </p>
                {conversation.lastMessagePreview && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {conversation.lastMessagePreview}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground/70">
                    {formatRelativeTime(conversation.updatedAt)}
                  </p>
                  {conversation.model && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground/80 font-mono">
                      {conversation.model}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        {!collapsed && !isEditing && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0"
              onClick={startEditing}
              title="Rename"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
              onClick={handleDelete}
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  loading,
  initialLoaded,
  collapsed,
  onToggleCollapse,
}: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await onDeleteConversation(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
  };

  const clearSearch = () => setSearchQuery('');

  const showSkeletons = loading && !initialLoaded;
  const showEmpty = initialLoaded && conversations.length === 0 && !searchQuery;
  const showNoResults = initialLoaded && conversations.length > 0 && filteredConversations.length === 0 && !!searchQuery;

  return (
    <>
      <div
        className={cn(
          'hidden md:flex flex-col border-r bg-card transition-all duration-300',
          collapsed ? 'w-16' : 'w-72'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-3">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <Button onClick={onNewChat} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono text-muted-foreground/70 bg-muted px-1.5 py-0.5 rounded">
                ⌘⇧O
              </kbd>
            </div>
          ) : (
            <Button onClick={onNewChat} size="icon" className="h-8 w-8" title="New Chat (⌘⇧O)">
              <Plus className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Clear search"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Conversation List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {showSkeletons && !collapsed && <ConversationListSkeleton />}

            {!showSkeletons && filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={activeConversationId === conversation.id}
                collapsed={collapsed}
                onSelect={() => onSelectConversation(conversation.id)}
                onRename={onRenameConversation}
                onDelete={openDeleteDialog}
              />
            ))}

            {!showSkeletons && showEmpty && !collapsed && (
              <ConversationEmptyState variant="no-conversations" onStartChat={onNewChat} />
            )}

            {!showSkeletons && showNoResults && !collapsed && (
              <ConversationEmptyState
                variant="no-results"
                searchQuery={searchQuery}
                onClearSearch={clearSearch}
              />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the conversation and all its messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
