import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Server-side: return a placeholder that won't be used
    // Auth provider checks for this and handles gracefully
    return null as unknown as SupabaseClient;
  }

  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }

  return client;
}
