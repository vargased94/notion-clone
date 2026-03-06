-- Phase 6: Page versions for history

CREATE TABLE page_versions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id         UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  title           TEXT,
  blocks_snapshot JSONB NOT NULL,
  entry_values_snapshot JSONB,
  version_number  INTEGER NOT NULL,
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_versions_page ON page_versions(page_id, created_at DESC);

ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read versions"
  ON page_versions FOR SELECT
  USING (page_id IN (
    SELECT p.id FROM pages p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can create versions"
  ON page_versions FOR INSERT
  WITH CHECK (page_id IN (
    SELECT p.id FROM pages p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));
