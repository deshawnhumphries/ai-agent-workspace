/*
# Add last_message_preview to conversations

## Overview
Adds a `last_message_preview` column to the conversations table so the sidebar
can display a short preview of the most recent message without an extra join
or query. A trigger automatically updates this column (and `updated_at`)
whenever a new message is inserted into the messages table.

## Modified Tables
### conversations
- NEW COLUMN `last_message_preview` (text, nullable) — truncated preview of the
  last message content, max 120 characters. NULL when the conversation has no
  messages yet.

## New Triggers
- `update_conversation_on_message_insert` — AFTER INSERT on messages:
  sets conversations.last_message_preview to the new message content (truncated),
  and sets conversations.updated_at to now(). This replaces the manual "touch"
  calls from the application layer, keeping the sidebar ordering and preview
  always in sync with the latest message.

## New Functions
- `truncate_text(text, int)` — helper to safely truncate text to a max length
  with an ellipsis.
- `update_conversation_on_new_message()` — trigger function that updates the
  parent conversation row when a message is inserted.

## Notes
1. This is an additive migration — no data is lost. Existing conversations get
   a NULL preview, which will be populated on the next message insert.
2. The trigger handles both `updated_at` and `last_message_preview` in one
   operation, so the application layer no longer needs to call `touch()`.
3. The preview is truncated to 120 chars to keep sidebar rows compact.
*/

-- ============================================================================
-- HELPER: truncate text with ellipsis
-- ============================================================================
CREATE OR REPLACE FUNCTION truncate_text(input text, max_len int)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF input IS NULL THEN RETURN NULL; END IF;
  IF char_length(input) <= max_len THEN RETURN input; END IF;
  RETURN substring(input from 1 for max_len - 3) || '...';
END;
$$;

-- ============================================================================
-- ADD last_message_preview COLUMN
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conversations' AND column_name = 'last_message_preview'
  ) THEN
    ALTER TABLE conversations ADD COLUMN last_message_preview text;
  END IF;
END $$;

-- ============================================================================
-- TRIGGER: update conversation when a message is inserted
-- ============================================================================
CREATE OR REPLACE FUNCTION update_conversation_on_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE conversations
  SET
    last_message_preview = truncate_text(NEW.content, 120),
    updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_message_inserted ON messages;
CREATE TRIGGER on_message_inserted
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_on_new_message();