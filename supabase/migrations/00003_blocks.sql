-- Phase 3: Blocks table

CREATE TYPE block_type AS ENUM (
  'paragraph', 'heading_1', 'heading_2', 'heading_3',
  'bulleted_list', 'numbered_list', 'to_do', 'toggle',
  'quote', 'callout', 'divider',
  'code', 'image', 'video', 'audio', 'file', 'bookmark', 'embed',
  'table', 'table_row',
  'column_list', 'column',
  'equation', 'table_of_contents',
  'synced_block', 'synced_block_reference',
  'toggle_heading_1', 'toggle_heading_2', 'toggle_heading_3',
  'link_preview', 'link_to_page',
  'child_page', 'child_database',
  'breadcrumb'
);

CREATE TABLE blocks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id         UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  parent_block_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
  type            block_type NOT NULL DEFAULT 'paragraph',

  content         JSONB DEFAULT '[]',
  properties      JSONB DEFAULT '{}',

  color           TEXT,
  position        REAL NOT NULL DEFAULT 0,

  created_by      UUID REFERENCES profiles(id),
  last_edited_by  UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_blocks_page ON blocks(page_id);
CREATE INDEX idx_blocks_parent ON blocks(parent_block_id);
CREATE INDEX idx_blocks_page_position ON blocks(page_id, position);

CREATE TRIGGER set_updated_at_blocks
  BEFORE UPDATE ON blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read blocks"
  ON blocks FOR SELECT
  USING (page_id IN (
    SELECT p.id FROM pages p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can insert blocks"
  ON blocks FOR INSERT
  WITH CHECK (page_id IN (
    SELECT p.id FROM pages p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can update blocks"
  ON blocks FOR UPDATE
  USING (page_id IN (
    SELECT p.id FROM pages p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can delete blocks"
  ON blocks FOR DELETE
  USING (page_id IN (
    SELECT p.id FROM pages p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));
