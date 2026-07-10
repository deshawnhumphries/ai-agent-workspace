import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ConversationService } from '@/lib/database/conversation-service';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = req.nextUrl.searchParams;
    const limit = Math.min(parseInt(params.get('limit') ?? '50', 10) || 50, 100);
    const offset = Math.max(parseInt(params.get('offset') ?? '0', 10) || 0, 0);

    const service = new ConversationService(supabase);
    const { data, error } = await service.listConversations(limit, offset);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ conversations: data });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, model } = body as { title?: string; model?: string };

    const service = new ConversationService(supabase);
    const { data, error } = await service.createConversation(title, model);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ conversation: data });
  } catch {
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
