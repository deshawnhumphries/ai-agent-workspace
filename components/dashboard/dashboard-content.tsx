'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { TopNavbar } from '@/components/layout/top-navbar';
import { WelcomeBanner } from '@/components/dashboard/welcome-banner';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ConversationsTable } from '@/components/dashboard/conversations-table';
import { ProjectsSection } from '@/components/dashboard/projects-section';
import { AgentsSection } from '@/components/dashboard/agents-section';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { Loader2 } from 'lucide-react';

export default function DashboardContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="md:ml-64 min-h-screen flex flex-col">
        <TopNavbar title="Dashboard" />
        <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">
          <WelcomeBanner />

          <section>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <QuickActions />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Workspace Statistics</h2>
            <StatsCards />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ConversationsTable />
            <ProjectsSection />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AgentsSection />
            <ActivityFeed />
          </div>
        </div>
      </main>
    </>
  );
}
