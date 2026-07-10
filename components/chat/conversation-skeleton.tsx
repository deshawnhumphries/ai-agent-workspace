'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function ConversationListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="p-2 space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg p-3">
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 shrink-0 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessageListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:px-6 space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={i % 2 === 0 ? 'flex gap-4' : 'flex gap-4 flex-row-reverse'}>
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            {i % 2 === 1 && <Skeleton className="h-12 w-2/3 rounded-2xl" />}
          </div>
        </div>
      ))}
    </div>
  );
}
