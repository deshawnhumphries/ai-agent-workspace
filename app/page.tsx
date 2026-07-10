import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FeatureCard } from '@/components/feature-card';
import {
  Bot,
  MessageSquare,
  FolderKanban,
  FileText,
  Sparkles,
  Shield,
  ArrowRight,
  Check,
} from 'lucide-react';

const features = [
  {
    title: 'AI-Powered Agents',
    description: 'Intelligent agents that understand context and help you accomplish complex tasks with natural conversations.',
    icon: 'bot',
  },
  {
    title: 'Contextual Conversations',
    description: 'Maintain context across sessions with persistent conversation history and smart memory.',
    icon: 'chat',
  },
  {
    title: 'Project Management',
    description: 'Organize your work into projects with dedicated agents, documents, and progress tracking.',
    icon: 'project',
  },
  {
    title: 'Document Intelligence',
    description: 'Upload and analyze documents with AI-powered search, summarization, and insights.',
    icon: 'document',
  },
  {
    title: 'Multi-Agent Workflows',
    description: 'Coordinate multiple specialized agents working together on complex projects.',
    icon: 'sparkles',
  },
  {
    title: 'Enterprise Security',
    description: 'Your data stays secure with end-to-end encryption and private workspaces.',
    icon: 'shield',
  },
];

const benefits = [
  'Unlimited AI conversations',
  'Up to 10 active projects',
  '100GB document storage',
  'Priority support',
  'Custom agent configurations',
  'API access',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Introducing AI Agent Workspace</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Work smarter with{' '}
                <span className="text-primary">intelligent agents</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A modern workspace where you collaborate with AI agents, manage conversations,
                upload documents, and complete projects—all in one seamless experience.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login">
                  <Button size="lg" className="gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
              <div className="rounded-xl border bg-muted/50 p-2 shadow-2xl">
                <div className="rounded-lg bg-card overflow-hidden">
                  <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 text-center text-sm text-muted-foreground">
                      AI Agent Workspace Dashboard
                    </div>
                  </div>
                  <div className="aspect-[16/9] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Bot className="h-16 w-16 mx-auto text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">Interactive preview coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need for AI-powered productivity
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A comprehensive workspace designed for seamless collaboration between humans and AI agents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 sm:px-12 sm:py-24">
              <div className="relative">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
                    Ready to transform your workflow?
                  </h2>
                  <p className="mt-4 text-primary-foreground/80">
                    Join thousands of professionals using AI Agent Workspace to boost their productivity.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/login">
                      <Button variant="secondary" size="lg" className="gap-2">
                        Start for Free
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Built for professionals who demand more
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  AI Agent Workspace provides the tools you need to work efficiently with AI,
                  without sacrificing control or security.
                </p>
              </div>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
