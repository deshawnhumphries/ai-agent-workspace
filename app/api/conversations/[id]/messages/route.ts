import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ConversationService } from '@/lib/database/conversation-service';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const service = new ConversationService(supabase);
    const { data, error } = await service.getMessages(id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ messages: data });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { role, content } = body as { role: string; content: string };

    if (!role || !content) {
      return NextResponse.json({ error: 'Role and content are required' }, { status: 400 });
    }

    const service = new ConversationService(supabase);
    const { data, error } = await service.addMessage(id, role as 'user' | 'assistant' | 'system', content);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: data });
  } catch {
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
