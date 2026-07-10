/*
# Persistent Conversations Schema

## Overview
Creates the foundational database schema for persistent AI conversations.
This migration establishes three tables (profiles, conversations, messages)
with full Row Level Security, enabling every authenticated user to have their
own private conversation history that survives across sessions.

## New Tables

### 1. profiles
- `id` (uuid, primary key, references auth.users.id) — one-to-one with Supabase Auth
- `display_name` (text) — user's chosen display name
- `avatar_url` (text) — URL to profile avatar image
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, auto-updated via trigger)

### 2. conversations
- `id` (uuid, primary key, default gen_random_uuid())
- `user_id` (uuid, not null, default auth.uid(), references auth.users.id) — owner
- `title` (text, not null, default 'New Chat') — conversation title
- `model` (text, default 'gpt-4o-mini') — AI model used (extensible for multi-model)
- `status` (text, default 'active') — lifecycle: active, archived, deleted (future soft-delete)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, auto-updated via trigger) — used for sorting by recency

### 3. messages
- `id` (uuid, primary key, default gen_random_uuid())
- `conversation_id` (uuid, not null, references conversations.id ON DELETE CASCADE)
- `role` (text, not null) — 'user', 'assistant', or 'system'
- `content` (text, not null) — message content
- `created_at` (timestamptz, default now()) — chronological ordering

## Relationships
- profiles.id -> auth.users.id (ON DELETE CASCADE)
- conversations.user_id -> auth.users.id (ON DELETE CASCADE)
- messages.conversation_id -> conversations.id (ON DELETE CASCADE)
- Deleting a conversation automatically deletes all its messages (cascade).
- Deleting a user automatically deletes all their conversations and messages.

## Indexes (Performance)
- idx_conversations_user_id — filter conversations by owner
- idx_conversations_user_updated — list user's conversations sorted by recency
- idx_messages_conversation_id — fetch all messages for a conversation
- idx_messages_conversation_created — sort messages chronologically

## Security — Row Level Security
All three tables have RLS enabled. Policies enforce strict ownership:
- profiles: users can SELECT/INSERT/UPDATE only their own profile row
- conversations: users can SELECT/INSERT/UPDATE/DELETE only their own conversations
- messages: users can SELECT/INSERT/DELETE only messages in their own conversations
  (ownership verified via EXISTS subquery against the parent conversation)
- No user can ever read, modify, or delete another user's data.

## Triggers
- update_profiles_updated_at — auto-set updated_at on profile UPDATE
- update_conversations_updated_at — auto-set updated_at on conversation UPDATE
- handle_new_user_profile — auto-create a profile row when a new auth user signs up

## Notes
1. conversations.user_id defaults to auth.uid() so client-side inserts that omit
   user_id still satisfy the INSERT RLS policy WITH CHECK.
2. The messages table has no user_id column — ownership is derived from the parent
   conversation via an EXISTS subquery. This keeps the schema normalized.
3. conversations.status is designed for future soft-delete and archiving without
   requiring schema changes.
4. The schema is designed to be extensible for future features (AI agents, RAG,
   documents, tags, pinning, sharing) without major refactoring.
5. All statements use IF NOT EXISTS / DROP IF EXISTS for idempotency.
*/

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================================
-- CONVERSATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New Chat',
  model text NOT NULL DEFAULT 'gpt-4o-mini',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_conversations" ON conversations;
CREATE POLICY "select_own_conversations" ON conversations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_conversations" ON conversations;
CREATE POLICY "insert_own_conversations" ON conversations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_conversations" ON conversations;
CREATE POLICY "update_own_conversations" ON conversations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_conversations" ON conversations;
CREATE POLICY "delete_own_conversations" ON conversations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_messages" ON messages;
CREATE POLICY "select_own_messages" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_own_messages" ON messages;
CREATE POLICY "insert_own_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_own_messages" ON messages;
CREATE POLICY "delete_own_messages" ON messages FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_updated ON conversations(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at ASC);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION (shared)
-- ============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, coalesce(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();