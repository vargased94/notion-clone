-- Phase 5: Database tables

CREATE TYPE db_property_type AS ENUM (
  'title', 'text', 'number', 'select', 'multi_select', 'status',
  'date', 'person', 'files', 'checkbox', 'url', 'email', 'phone',
  'formula', 'relation', 'rollup',
  'created_time', 'created_by', 'last_edited_time', 'last_edited_by',
  'unique_id', 'button'
);

CREATE TYPE db_view_type AS ENUM (
  'table', 'board', 'list', 'calendar', 'timeline', 'gallery', 'chart'
);

-- Databases
CREATE TABLE databases (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id         UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title           TEXT NOT NULL DEFAULT 'Untitled Database',
  is_inline       BOOLEAN NOT NULL DEFAULT true,
  is_locked       BOOLEAN NOT NULL DEFAULT false,
  sub_items_enabled BOOLEAN DEFAULT false,
  dependencies_enabled BOOLEAN DEFAULT false,
  unique_id_prefix TEXT DEFAULT '',
  unique_id_counter INTEGER DEFAULT 0,
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_databases
  BEFORE UPDATE ON databases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE pages ADD CONSTRAINT fk_pages_database
  FOREIGN KEY (database_id) REFERENCES databases(id) ON DELETE SET NULL;

-- Database properties
CREATE TABLE database_properties (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  database_id     UUID NOT NULL REFERENCES databases(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  type            db_property_type NOT NULL,
  position        REAL NOT NULL DEFAULT 0,
  is_visible      BOOLEAN NOT NULL DEFAULT true,
  width           INTEGER,
  config          JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_database_properties
  BEFORE UPDATE ON database_properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Database entries (rows)
CREATE TABLE database_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  database_id     UUID NOT NULL REFERENCES databases(id) ON DELETE CASCADE,
  page_id         UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE UNIQUE,
  position        REAL NOT NULL DEFAULT 0,
  unique_id       TEXT,
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_database_entries
  BEFORE UPDATE ON database_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate unique_id
CREATE OR REPLACE FUNCTION generate_unique_id()
RETURNS TRIGGER AS $$
DECLARE prefix TEXT; counter INTEGER;
BEGIN
  SELECT d.unique_id_prefix, d.unique_id_counter + 1 INTO prefix, counter
  FROM databases d WHERE d.id = NEW.database_id FOR UPDATE;
  UPDATE databases SET unique_id_counter = counter WHERE id = NEW.database_id;
  NEW.unique_id := prefix || counter::TEXT;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_unique_id BEFORE INSERT ON database_entries
  FOR EACH ROW EXECUTE FUNCTION generate_unique_id();

-- Entry values (cells)
CREATE TABLE database_entry_values (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id        UUID NOT NULL REFERENCES database_entries(id) ON DELETE CASCADE,
  property_id     UUID NOT NULL REFERENCES database_properties(id) ON DELETE CASCADE,
  value_text      TEXT,
  value_number    DOUBLE PRECISION,
  value_boolean   BOOLEAN,
  value_date      TIMESTAMPTZ,
  value_date_end  TIMESTAMPTZ,
  value_json      JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(entry_id, property_id)
);

CREATE INDEX idx_entryvals_entry ON database_entry_values(entry_id);
CREATE INDEX idx_entryvals_json ON database_entry_values USING GIN(value_json) WHERE value_json IS NOT NULL;

CREATE TRIGGER set_updated_at_entry_values
  BEFORE UPDATE ON database_entry_values
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Database views
CREATE TABLE database_views (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  database_id     UUID NOT NULL REFERENCES databases(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT 'Default view',
  type            db_view_type NOT NULL DEFAULT 'table',
  position        REAL NOT NULL DEFAULT 0,
  is_default      BOOLEAN NOT NULL DEFAULT false,
  layout_config   JSONB DEFAULT '{}',
  visible_properties JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_database_views
  BEFORE UPDATE ON database_views
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- View filters (supports AND/OR nesting)
CREATE TABLE view_filters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  view_id         UUID NOT NULL REFERENCES database_views(id) ON DELETE CASCADE,
  parent_filter_id UUID REFERENCES view_filters(id) ON DELETE CASCADE,
  position        REAL NOT NULL DEFAULT 0,
  is_group        BOOLEAN NOT NULL DEFAULT false,
  logical_operator TEXT DEFAULT 'and' CHECK (logical_operator IN ('and', 'or')),
  property_id     UUID REFERENCES database_properties(id) ON DELETE CASCADE,
  operator        TEXT,
  value           JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- View sorts
CREATE TABLE view_sorts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  view_id         UUID NOT NULL REFERENCES database_views(id) ON DELETE CASCADE,
  property_id     UUID NOT NULL REFERENCES database_properties(id) ON DELETE CASCADE,
  direction       TEXT NOT NULL DEFAULT 'ascending' CHECK (direction IN ('ascending', 'descending')),
  position        REAL NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- View groups
CREATE TABLE view_groups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  view_id         UUID NOT NULL REFERENCES database_views(id) ON DELETE CASCADE,
  property_id     UUID NOT NULL REFERENCES database_properties(id) ON DELETE CASCADE,
  is_sub_group    BOOLEAN NOT NULL DEFAULT false,
  hide_empty      BOOLEAN DEFAULT false,
  sort_order      TEXT DEFAULT 'alphabetical',
  collapsed_groups JSONB DEFAULT '[]',
  hidden_groups   JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Database relations
CREATE TABLE database_relations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_entry_id   UUID NOT NULL REFERENCES database_entries(id) ON DELETE CASCADE,
  target_entry_id   UUID NOT NULL REFERENCES database_entries(id) ON DELETE CASCADE,
  property_id       UUID NOT NULL REFERENCES database_properties(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source_entry_id, target_entry_id, property_id)
);

-- Database templates
CREATE TABLE database_templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  database_id     UUID NOT NULL REFERENCES databases(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT 'Untitled Template',
  icon            TEXT,
  default_values  JSONB DEFAULT '{}',
  content_blocks  JSONB DEFAULT '[]',
  is_recurring    BOOLEAN NOT NULL DEFAULT false,
  recurrence      TEXT CHECK (recurrence IN ('daily','weekly','biweekly','monthly','yearly')),
  position        REAL NOT NULL DEFAULT 0,
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for all database tables
ALTER TABLE databases ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_entry_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE view_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE view_sorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE view_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE database_templates ENABLE ROW LEVEL SECURITY;

-- Workspace member check helper
CREATE OR REPLACE FUNCTION is_workspace_member(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM workspace_members WHERE workspace_id = ws_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Databases policies
CREATE POLICY "Members can read databases"
  ON databases FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "Members can create databases"
  ON databases FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Members can update databases"
  ON databases FOR UPDATE
  USING (is_workspace_member(workspace_id));

CREATE POLICY "Members can delete databases"
  ON databases FOR DELETE
  USING (is_workspace_member(workspace_id));

-- Properties policies (via database -> workspace)
CREATE POLICY "Members can manage properties"
  ON database_properties FOR ALL
  USING (database_id IN (SELECT id FROM databases WHERE is_workspace_member(workspace_id)));

-- Entries policies
CREATE POLICY "Members can manage entries"
  ON database_entries FOR ALL
  USING (database_id IN (SELECT id FROM databases WHERE is_workspace_member(workspace_id)));

-- Entry values policies
CREATE POLICY "Members can manage entry values"
  ON database_entry_values FOR ALL
  USING (entry_id IN (
    SELECT e.id FROM database_entries e
    JOIN databases d ON d.id = e.database_id
    WHERE is_workspace_member(d.workspace_id)
  ));

-- Views policies
CREATE POLICY "Members can manage views"
  ON database_views FOR ALL
  USING (database_id IN (SELECT id FROM databases WHERE is_workspace_member(workspace_id)));

-- Filters, sorts, groups via view -> database -> workspace
CREATE POLICY "Members can manage filters"
  ON view_filters FOR ALL
  USING (view_id IN (
    SELECT v.id FROM database_views v
    JOIN databases d ON d.id = v.database_id
    WHERE is_workspace_member(d.workspace_id)
  ));

CREATE POLICY "Members can manage sorts"
  ON view_sorts FOR ALL
  USING (view_id IN (
    SELECT v.id FROM database_views v
    JOIN databases d ON d.id = v.database_id
    WHERE is_workspace_member(d.workspace_id)
  ));

CREATE POLICY "Members can manage groups"
  ON view_groups FOR ALL
  USING (view_id IN (
    SELECT v.id FROM database_views v
    JOIN databases d ON d.id = v.database_id
    WHERE is_workspace_member(d.workspace_id)
  ));

-- Relations policies
CREATE POLICY "Members can manage relations"
  ON database_relations FOR ALL
  USING (property_id IN (
    SELECT p.id FROM database_properties p
    JOIN databases d ON d.id = p.database_id
    WHERE is_workspace_member(d.workspace_id)
  ));

-- Templates policies
CREATE POLICY "Members can manage templates"
  ON database_templates FOR ALL
  USING (database_id IN (SELECT id FROM databases WHERE is_workspace_member(workspace_id)));
