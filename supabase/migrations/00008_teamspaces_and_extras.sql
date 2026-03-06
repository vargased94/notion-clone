-- Phase 9: Teamspaces, workspace invitations, file uploads

-- Enums
CREATE TYPE teamspace_type AS ENUM ('open', 'closed', 'private');
CREATE TYPE teamspace_role AS ENUM ('owner', 'member');

-- Teamspaces
CREATE TABLE teamspaces (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id       UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  description        TEXT,
  icon_url           TEXT,
  type               teamspace_type NOT NULL DEFAULT 'open',
  is_archived        BOOLEAN NOT NULL DEFAULT false,
  default_permission permission_level DEFAULT 'full_access',
  created_by         UUID NOT NULL REFERENCES profiles(id),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_teamspaces_workspace ON teamspaces(workspace_id);

CREATE TRIGGER set_updated_at_teamspaces
  BEFORE UPDATE ON teamspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE teamspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can read teamspaces"
  ON teamspaces FOR SELECT
  USING (workspace_id IN (
    SELECT wm.workspace_id FROM workspace_members wm
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Admins can create teamspaces"
  ON teamspaces FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT wm.workspace_id FROM workspace_members wm
    WHERE wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
  ));

CREATE POLICY "Admins can update teamspaces"
  ON teamspaces FOR UPDATE
  USING (workspace_id IN (
    SELECT wm.workspace_id FROM workspace_members wm
    WHERE wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
  ));

CREATE POLICY "Admins can delete teamspaces"
  ON teamspaces FOR DELETE
  USING (workspace_id IN (
    SELECT wm.workspace_id FROM workspace_members wm
    WHERE wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
  ));

-- Teamspace members
CREATE TABLE teamspace_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teamspace_id    UUID NOT NULL REFERENCES teamspaces(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role            teamspace_role NOT NULL DEFAULT 'member',
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(teamspace_id, user_id)
);

CREATE INDEX idx_ts_members_teamspace ON teamspace_members(teamspace_id);
CREATE INDEX idx_ts_members_user ON teamspace_members(user_id);

ALTER TABLE teamspace_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read teamspace members"
  ON teamspace_members FOR SELECT
  USING (teamspace_id IN (
    SELECT t.id FROM teamspaces t
    JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Teamspace owners can manage members"
  ON teamspace_members FOR INSERT
  WITH CHECK (
    teamspace_id IN (
      SELECT tm.teamspace_id FROM teamspace_members tm
      WHERE tm.user_id = auth.uid() AND tm.role = 'owner'
    )
    OR teamspace_id IN (
      SELECT t.id FROM teamspaces t WHERE t.created_by = auth.uid()
    )
    -- Allow joining open teamspaces
    OR teamspace_id IN (
      SELECT t.id FROM teamspaces t
      JOIN workspace_members wm ON wm.workspace_id = t.workspace_id
      WHERE wm.user_id = auth.uid() AND t.type = 'open'
    )
  );

CREATE POLICY "Teamspace owners can update members"
  ON teamspace_members FOR UPDATE
  USING (teamspace_id IN (
    SELECT tm.teamspace_id FROM teamspace_members tm
    WHERE tm.user_id = auth.uid() AND tm.role = 'owner'
  ));

CREATE POLICY "Members can leave or owners can remove"
  ON teamspace_members FOR DELETE
  USING (
    user_id = auth.uid()
    OR teamspace_id IN (
      SELECT tm.teamspace_id FROM teamspace_members tm
      WHERE tm.user_id = auth.uid() AND tm.role = 'owner'
    )
  );

-- Workspace invitations
CREATE TABLE workspace_invitations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  role            workspace_role NOT NULL DEFAULT 'member',
  invited_by      UUID NOT NULL REFERENCES profiles(id),
  token           TEXT UNIQUE NOT NULL DEFAULT replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  accepted_at     TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '7 days',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, email)
);

ALTER TABLE workspace_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read invitations"
  ON workspace_invitations FOR SELECT
  USING (workspace_id IN (
    SELECT wm.workspace_id FROM workspace_members wm
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Admins can create invitations"
  ON workspace_invitations FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT wm.workspace_id FROM workspace_members wm
    WHERE wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
  ));

CREATE POLICY "Admins can delete invitations"
  ON workspace_invitations FOR DELETE
  USING (workspace_id IN (
    SELECT wm.workspace_id FROM workspace_members wm
    WHERE wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
  ));

-- File uploads tracking
CREATE TABLE file_uploads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  uploaded_by     UUID NOT NULL REFERENCES profiles(id),
  file_name       TEXT NOT NULL,
  file_size       BIGINT NOT NULL,
  mime_type       TEXT NOT NULL,
  storage_path    TEXT NOT NULL,
  public_url      TEXT,
  page_id         UUID REFERENCES pages(id) ON DELETE SET NULL,
  block_id        UUID REFERENCES blocks(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_uploads_workspace ON file_uploads(workspace_id);
CREATE INDEX idx_uploads_page ON file_uploads(page_id) WHERE page_id IS NOT NULL;

ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read uploads"
  ON file_uploads FOR SELECT
  USING (workspace_id IN (
    SELECT wm.workspace_id FROM workspace_members wm
    WHERE wm.user_id = auth.uid()
  ));

CREATE POLICY "Members can upload"
  ON file_uploads FOR INSERT
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Uploaders can delete own files"
  ON file_uploads FOR DELETE
  USING (uploaded_by = auth.uid());
