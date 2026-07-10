'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ChatInterface = dynamic(() => import('@/components/chat/chat-interface'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  ),
});

function ChatInterfaceWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <ChatInterface />
    </Suspense>
  );
}

export default function ChatPage() {
  return <ChatInterfaceWrapper />;
}
