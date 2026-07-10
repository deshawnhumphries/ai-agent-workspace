'use client';

import dynamic from 'next/dynamic';

// Dynamic import to prevent SSR issues with auth
const DashboardContent = dynamic(() => import('@/components/dashboard/dashboard-content'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  ),
});

export default function DashboardPage() {
  return <DashboardContent />;
}
