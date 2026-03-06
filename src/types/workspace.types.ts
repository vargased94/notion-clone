export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'guest'
export type WorkspacePlan = 'free' | 'plus' | 'business' | 'enterprise'

export interface Workspace {
  id: string
  name: string
  icon_url: string | null
  slug: string | null
  plan: WorkspacePlan
  settings: Record<string, unknown>
  created_by: string
  created_at: string
  updated_at: string
}

export interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string
  role: WorkspaceRole
  joined_at: string
}
