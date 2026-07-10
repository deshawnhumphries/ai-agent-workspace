import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { QuickAction } from '@/types';
import {
  MessageSquarePlus,
  FolderPlus,
  FileUp,
  Bot,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'message-plus': MessageSquarePlus,
  'folder-plus': FolderPlus,
  'file-up': FileUp,
  bot: Bot,
};

interface QuickActionCardProps {
  action: QuickAction;
}

export function QuickActionCard({ action }: QuickActionCardProps) {
  const IconComponent = iconMap[action.icon] || MessageSquarePlus;

  return (
    <Link href={action.href}>
      <Card className="group p-4 transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">{action.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
