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
    const { data, error } = await service.getConversationWithMessages(id);
    if (error) {
      const status = error.status ?? 500;
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json({ conversation: data });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { title, model, status } = body as {
      title?: string;
      model?: string;
      status?: string;
    };

    const service = new ConversationService(supabase);

    if (title !== undefined) {
      const { data, error } = await service.renameConversation(id, title);
      if (error) {
        const status = error.status ?? 500;
        return NextResponse.json({ error: error.message }, { status });
      }
      return NextResponse.json({ conversation: data });
    }

    const update: Record<string, string> = {};
    if (model !== undefined) update.model = model;
    if (status !== undefined) update.status = status;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data, error } = await service.updateConversation(id, update);
    if (error) {
      const s = error.status ?? 500;
      return NextResponse.json({ error: error.message }, { status: s });
    }
    return NextResponse.json({ conversation: data });
  } catch {
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const service = new ConversationService(supabase);
    const { error } = await service.deleteConversation(id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
}
