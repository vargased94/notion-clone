-- Phase 7: Sharing and Permissions

-- Permission level enum
CREATE TYPE permission_level AS ENUM (
  'full_access', 'can_edit', 'can_edit_content', 'can_comment', 'can_view'
);

-- Page permissions (per-user or per-teamspace)
CREATE TABLE page_permissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id         UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,
  teamspace_id    UUID,
  level           permission_level NOT NULL DEFAULT 'can_view',
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT perm_has_target CHECK (user_id IS NOT NULL OR teamspace_id IS NOT NULL),
  UNIQUE(page_id, user_id),
  UNIQUE(page_id, teamspace_id)
);

CREATE INDEX idx_perm_page ON page_permissions(page_id);
CREATE INDEX idx_perm_user ON page_permissions(user_id);

ALTER TABLE page_permissions ENABLE ROW LEVEL SECURITY;

-- Members of the workspace that owns the page can read permissions
CREATE POLICY "Members can read permissions"
  ON page_permissions FOR SELECT
  USING (page_id IN (
    SELECT p.id FROM pages p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

-- Only page owner or workspace admin can manage permissions
CREATE POLICY "Admins can insert permissions"
  ON page_permissions FOR INSERT
  WITH CHECK (page_id IN (
    SELECT p.id FROM pages p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
  ) OR page_id IN (
    SELECT p.id FROM pages p WHERE p.created_by = auth.uid()
  ));

CREATE POLICY "Admins can update permissions"
  ON page_permissions FOR UPDATE
  USING (page_id IN (
    SELECT p.id FROM pages p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
  ) OR page_id IN (
    SELECT p.id FROM pages p WHERE p.created_by = auth.uid()
  ));

CREATE POLICY "Admins can delete permissions"
  ON page_permissions FOR DELETE
  USING (page_id IN (
    SELECT p.id FROM pages p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
  ) OR page_id IN (
    SELECT p.id FROM pages p WHERE p.created_by = auth.uid()
  ));

-- Page shares (public sharing)
CREATE TABLE page_shares (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id         UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE UNIQUE,
  is_enabled      BOOLEAN NOT NULL DEFAULT false,
  slug            TEXT UNIQUE,
  allow_editing   BOOLEAN DEFAULT false,
  allow_comments  BOOLEAN DEFAULT false,
  allow_duplicate BOOLEAN DEFAULT false,
  search_indexing BOOLEAN DEFAULT false,
  password_hash   TEXT,
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_shares_slug ON page_shares(slug) WHERE is_enabled = true;

ALTER TABLE page_shares ENABLE ROW LEVEL SECURITY;

-- Anyone can read enabled shares (for public page access)
CREATE POLICY "Anyone can read enabled shares"
  ON page_shares FOR SELECT
  USING (
    is_enabled = true
    OR page_id IN (
      SELECT p.id FROM pages p
      JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
      WHERE wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Page owners can manage shares"
  ON page_shares FOR INSERT
  WITH CHECK (page_id IN (
    SELECT p.id FROM pages p WHERE p.created_by = auth.uid()
  ) OR page_id IN (
    SELECT p.id FROM pages p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
  ));

CREATE POLICY "Page owners can update shares"
  ON page_shares FOR UPDATE
  USING (page_id IN (
    SELECT p.id FROM pages p WHERE p.created_by = auth.uid()
  ) OR page_id IN (
    SELECT p.id FROM pages p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
  ));

CREATE POLICY "Page owners can delete shares"
  ON page_shares FOR DELETE
  USING (page_id IN (
    SELECT p.id FROM pages p WHERE p.created_by = auth.uid()
  ) OR page_id IN (
    SELECT p.id FROM pages p
    JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
    WHERE wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
  ));

CREATE TRIGGER set_updated_at_page_shares
  BEFORE UPDATE ON page_shares
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Page followers
CREATE TABLE page_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(page_id, user_id)
);

ALTER TABLE page_followers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own follows"
  ON page_followers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can follow pages"
  ON page_followers FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unfollow pages"
  ON page_followers FOR DELETE
  USING (user_id = auth.uid());
