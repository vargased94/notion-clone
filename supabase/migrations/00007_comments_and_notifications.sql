-- Phase 8: Comments, Notifications

-- Enums
CREATE TYPE comment_status AS ENUM ('open', 'resolved');
CREATE TYPE notification_type AS ENUM (
  'mention', 'comment', 'comment_reply', 'page_edit',
  'reminder', 'invitation', 'property_change'
);

-- Comments (page-level and block-level, threaded)
CREATE TABLE comments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id           UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  block_id          UUID REFERENCES blocks(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content           JSONB NOT NULL DEFAULT '[]',
  text_range        JSONB,
  status            comment_status NOT NULL DEFAULT 'open',
  resolved_by       UUID REFERENCES profiles(id),
  resolved_at       TIMESTAMPTZ,
  created_by        UUID NOT NULL REFERENCES profiles(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_page ON comments(page_id, created_at DESC);
CREATE INDEX idx_comments_block ON comments(block_id) WHERE block_id IS NOT NULL;
CREATE INDEX idx_comments_parent ON comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;

CREATE TRIGGER set_updated_at_comments
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read comments"
  ON comments FOR SELECT
  USING (page_id IN (
    SELECT p.id FROM pages p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can create comments"
  ON comments FOR INSERT
  WITH CHECK (
    created_by = auth.uid()
    AND page_id IN (
      SELECT p.id FROM pages p
      JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
      WHERE wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update own comments"
  ON comments FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Authors can delete own comments"
  ON comments FOR DELETE
  USING (created_by = auth.uid());

-- Notifications
CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  recipient_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id        UUID REFERENCES profiles(id),
  type            notification_type NOT NULL,
  page_id         UUID REFERENCES pages(id) ON DELETE CASCADE,
  block_id        UUID REFERENCES blocks(id) ON DELETE SET NULL,
  comment_id      UUID REFERENCES comments(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  body            TEXT,
  data            JSONB DEFAULT '{}',
  is_read         BOOLEAN NOT NULL DEFAULT false,
  read_at         TIMESTAMPTZ,
  scheduled_for   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notif_recipient ON notifications(recipient_id, is_read, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (recipient_id = auth.uid());

CREATE POLICY "Members can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT wm.workspace_id FROM workspace_members wm
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (recipient_id = auth.uid());
