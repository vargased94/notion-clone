-- Fix: grant auth admin full permissions on profiles
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON public.profiles TO supabase_auth_admin;

-- Allow the trigger to bypass RLS
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Add insert policy for service role (trigger runs as superuser)
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Allow users to read all profiles (needed for sharing, comments, etc.)
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Authenticated users can read profiles"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Recreate trigger function with explicit schema and search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Also fix: auto-create workspace + membership on first login
CREATE OR REPLACE FUNCTION public.handle_first_workspace()
RETURNS TRIGGER AS $$
DECLARE
  ws_id UUID;
BEGIN
  -- Check if user already has a workspace
  IF NOT EXISTS (SELECT 1 FROM workspace_members WHERE user_id = NEW.id) THEN
    INSERT INTO workspaces (name, created_by)
    VALUES (COALESCE(NEW.full_name, split_part(NEW.email, '@', 1)) || '''s Workspace', NEW.id)
    RETURNING id INTO ws_id;

    INSERT INTO workspace_members (workspace_id, user_id, role)
    VALUES (ws_id, NEW.id, 'owner');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_first_workspace();
