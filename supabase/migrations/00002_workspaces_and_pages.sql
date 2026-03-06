-- Phase 2: Workspaces, Members, Pages, Favorites

-- Workspaces
CREATE TABLE workspaces (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  icon_url        TEXT,
  slug            TEXT UNIQUE,
  plan            TEXT DEFAULT 'free' CHECK (plan IN ('free', 'plus', 'business', 'enterprise')),
  settings        JSONB DEFAULT '{}',
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_workspaces
  BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Workspace members
CREATE TABLE workspace_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role            workspace_role NOT NULL DEFAULT 'member',
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, user_id)
);

-- Pages (infinite hierarchy)
CREATE TABLE pages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_page_id  UUID REFERENCES pages(id) ON DELETE CASCADE,
  database_id     UUID,

  title           TEXT NOT NULL DEFAULT '',
  icon            TEXT,
  icon_type       TEXT DEFAULT 'emoji' CHECK (icon_type IN ('emoji', 'url', 'none')),
  cover_url       TEXT,
  cover_position  REAL DEFAULT 0.5,
  font            page_font DEFAULT 'default',
  full_width      BOOLEAN NOT NULL DEFAULT false,
  small_text      BOOLEAN NOT NULL DEFAULT false,
  is_locked       BOOLEAN NOT NULL DEFAULT false,

  section         TEXT DEFAULT 'private' CHECK (section IN ('private', 'shared', 'teamspace')),
  position        REAL NOT NULL DEFAULT 0,

  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  deleted_at      TIMESTAMPTZ,
  deleted_by      UUID REFERENCES profiles(id),
  original_parent UUID,

  is_public       BOOLEAN NOT NULL DEFAULT false,
  public_slug     TEXT UNIQUE,
  public_settings JSONB DEFAULT '{}',

  created_by      UUID NOT NULL REFERENCES profiles(id),
  last_edited_by  UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  content_search  TSVECTOR
);

CREATE INDEX idx_pages_workspace ON pages(workspace_id);
CREATE INDEX idx_pages_parent ON pages(parent_page_id);
CREATE INDEX idx_pages_deleted ON pages(workspace_id, is_deleted);
CREATE INDEX idx_pages_search ON pages USING GIN(content_search);
CREATE INDEX idx_pages_position ON pages(parent_page_id, position);

CREATE TRIGGER set_updated_at_pages
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Full-text search vector
CREATE OR REPLACE FUNCTION update_page_search()
RETURNS TRIGGER AS $$
BEGIN
  NEW.content_search := to_tsvector('simple', COALESCE(NEW.title, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_search_vector
  BEFORE INSERT OR UPDATE OF title ON pages
  FOR EACH ROW EXECUTE FUNCTION update_page_search();

-- Page favorites
CREATE TABLE page_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  position REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, page_id)
);

-- Page recent visits
CREATE TABLE page_recent_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, page_id)
);

-- RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_recent_visits ENABLE ROW LEVEL SECURITY;

-- Workspace policies
CREATE POLICY "Members can read workspace"
  ON workspaces FOR SELECT
  USING (id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Owner can update workspace"
  ON workspaces FOR UPDATE
  USING (id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')));

CREATE POLICY "Authenticated users can create workspace"
  ON workspaces FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Workspace members policies
CREATE POLICY "Members can read members"
  ON workspace_members FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Owner/admin can manage members"
  ON workspace_members FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')));

-- Pages policies
CREATE POLICY "Members can read pages"
  ON pages FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()) AND is_deleted = false);

CREATE POLICY "Members can read deleted pages"
  ON pages FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()) AND is_deleted = true);

CREATE POLICY "Members can create pages"
  ON pages FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Members can update pages"
  ON pages FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Creator can delete pages"
  ON pages FOR DELETE
  USING (created_by = auth.uid());

-- Favorites policies
CREATE POLICY "Users can manage own favorites"
  ON page_favorites FOR ALL
  USING (user_id = auth.uid());

-- Recent visits policies
CREATE POLICY "Users can manage own visits"
  ON page_recent_visits FOR ALL
  USING (user_id = auth.uid());

-- Auto-create workspace + membership on first signup helper
CREATE OR REPLACE FUNCTION create_default_workspace()
RETURNS TRIGGER AS $$
DECLARE ws_id UUID;
BEGIN
  INSERT INTO workspaces (name, created_by)
  VALUES (COALESCE(NEW.full_name, 'My') || '''s Workspace', NEW.id)
  RETURNING id INTO ws_id;

  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (ws_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_default_workspace();
