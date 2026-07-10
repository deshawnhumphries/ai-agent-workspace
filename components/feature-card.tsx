import { Card } from '@/components/ui/card';
import { Feature } from '@/types';
import { Bot, MessageSquare, FolderKanban, FileText, Sparkles, Shield } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  bot: Bot,
  chat: MessageSquare,
  project: FolderKanban,
  document: FileText,
  sparkles: Sparkles,
  shield: Shield,
};

interface FeatureCardProps {
  feature: Feature & { icon?: string };
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const IconComponent = feature.icon ? iconMap[feature.icon] : Sparkles;

  return (
    <Card className="group relative p-6 transition-all hover:shadow-lg hover:border-primary/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
        {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
      </div>
      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
    </Card>
  );
}
