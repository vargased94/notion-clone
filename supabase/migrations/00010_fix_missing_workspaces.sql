-- Fix: infinite recursion in workspace_members RLS
-- Root cause: policies on workspace_members reference workspace_members itself
-- Solution: SECURITY DEFINER function to get user's workspace IDs bypassing RLS

-- 1. Create a helper function that bypasses RLS to get user's workspaces
CREATE OR REPLACE FUNCTION public.get_my_workspace_ids()
RETURNS SETOF UUID AS $$
  SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- 2. Drop ALL broken policies on workspace_members
DROP POLICY IF EXISTS "Members can read members" ON workspace_members;
DROP POLICY IF EXISTS "Owner/admin can manage members" ON workspace_members;
DROP POLICY IF EXISTS "Service role can insert workspace_members" ON workspace_members;
DROP POLICY IF EXISTS "Users can read own memberships" ON workspace_members;
DROP POLICY IF EXISTS "Members can read co-members" ON workspace_members;
DROP POLICY IF EXISTS "Owner/admin can insert members" ON workspace_members;
DROP POLICY IF EXISTS "Owner/admin can update members" ON workspace_members;
DROP POLICY IF EXISTS "Owner/admin can delete members" ON workspace_members;

-- 3. Recreate workspace_members policies using the helper function
CREATE POLICY "Members can read workspace members"
  ON workspace_members FOR SELECT
  USING (workspace_id IN (SELECT get_my_workspace_ids()));

CREATE POLICY "Owner/admin can insert members"
  ON workspace_members FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT wm.workspace_id FROM workspace_members wm
      WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin')
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Owner/admin can update members"
  ON workspace_members FOR UPDATE
  USING (workspace_id IN (SELECT get_my_workspace_ids()));

CREATE POLICY "Owner/admin can delete members"
  ON workspace_members FOR DELETE
  USING (
    user_id = auth.uid()
    OR workspace_id IN (SELECT get_my_workspace_ids())
  );

-- 4. Fix workspace policies (also depended on broken workspace_members)
DROP POLICY IF EXISTS "Members can read workspace" ON workspaces;
DROP POLICY IF EXISTS "Service role can insert workspaces" ON workspaces;
DROP POLICY IF EXISTS "Authenticated users can create workspace" ON workspaces;

CREATE POLICY "Members can read workspace"
  ON workspaces FOR SELECT
  USING (id IN (SELECT get_my_workspace_ids()) OR created_by = auth.uid());

CREATE POLICY "Authenticated users can create workspace"
  ON workspaces FOR INSERT
  WITH CHECK (true);

-- 5. Fix pages policies (also used workspace_members subquery)
DROP POLICY IF EXISTS "Members can read pages" ON pages;
DROP POLICY IF EXISTS "Members can read deleted pages" ON pages;
DROP POLICY IF EXISTS "Members can create pages" ON pages;
DROP POLICY IF EXISTS "Members can update pages" ON pages;

CREATE POLICY "Members can read pages"
  ON pages FOR SELECT
  USING (workspace_id IN (SELECT get_my_workspace_ids()) AND is_deleted = false);

CREATE POLICY "Members can read deleted pages"
  ON pages FOR SELECT
  USING (workspace_id IN (SELECT get_my_workspace_ids()) AND is_deleted = true);

CREATE POLICY "Members can create pages"
  ON pages FOR INSERT
  WITH CHECK (workspace_id IN (SELECT get_my_workspace_ids()));

CREATE POLICY "Members can update pages"
  ON pages FOR UPDATE
  USING (workspace_id IN (SELECT get_my_workspace_ids()));

-- 6. Fix teamspaces policies (same issue)
DROP POLICY IF EXISTS "Workspace members can read teamspaces" ON teamspaces;
DROP POLICY IF EXISTS "Admins can create teamspaces" ON teamspaces;
DROP POLICY IF EXISTS "Admins can update teamspaces" ON teamspaces;
DROP POLICY IF EXISTS "Admins can delete teamspaces" ON teamspaces;

CREATE POLICY "Workspace members can read teamspaces"
  ON teamspaces FOR SELECT
  USING (workspace_id IN (SELECT get_my_workspace_ids()));

CREATE POLICY "Admins can create teamspaces"
  ON teamspaces FOR INSERT
  WITH CHECK (workspace_id IN (SELECT get_my_workspace_ids()));

CREATE POLICY "Admins can update teamspaces"
  ON teamspaces FOR UPDATE
  USING (workspace_id IN (SELECT get_my_workspace_ids()));

CREATE POLICY "Admins can delete teamspaces"
  ON teamspaces FOR DELETE
  USING (workspace_id IN (SELECT get_my_workspace_ids()));

-- 7. Fix other tables that reference workspace_members
DROP POLICY IF EXISTS "Members can read invitations" ON workspace_invitations;
DROP POLICY IF EXISTS "Admins can create invitations" ON workspace_invitations;
DROP POLICY IF EXISTS "Admins can delete invitations" ON workspace_invitations;

CREATE POLICY "Members can read invitations"
  ON workspace_invitations FOR SELECT
  USING (workspace_id IN (SELECT get_my_workspace_ids()));

CREATE POLICY "Admins can create invitations"
  ON workspace_invitations FOR INSERT
  WITH CHECK (workspace_id IN (SELECT get_my_workspace_ids()));

CREATE POLICY "Admins can delete invitations"
  ON workspace_invitations FOR DELETE
  USING (workspace_id IN (SELECT get_my_workspace_ids()));

DROP POLICY IF EXISTS "Members can read uploads" ON file_uploads;
CREATE POLICY "Members can read uploads"
  ON file_uploads FOR SELECT
  USING (workspace_id IN (SELECT get_my_workspace_ids()));

-- 8. Grant trigger functions permission
GRANT ALL ON public.workspaces TO supabase_auth_admin;
GRANT ALL ON public.workspace_members TO supabase_auth_admin;

-- 9. Create missing workspaces for existing profiles
DO $$
DECLARE
  p RECORD;
  ws_id UUID;
BEGIN
  FOR p IN
    SELECT pr.id, pr.full_name, pr.email
    FROM profiles pr
    WHERE NOT EXISTS (
      SELECT 1 FROM workspace_members wm WHERE wm.user_id = pr.id
    )
  LOOP
    INSERT INTO workspaces (name, created_by)
    VALUES (
      COALESCE(NULLIF(p.full_name, ''), split_part(p.email, '@', 1)) || '''s Workspace',
      p.id
    )
    RETURNING id INTO ws_id;

    INSERT INTO workspace_members (workspace_id, user_id, role)
    VALUES (ws_id, p.id, 'owner');
  END LOOP;
END $$;
