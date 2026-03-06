export type TeamspaceType = 'open' | 'closed' | 'private'
export type TeamspaceRole = 'owner' | 'member'

export interface Teamspace {
  id: string
  workspace_id: string
  name: string
  description: string | null
  icon_url: string | null
  type: TeamspaceType
  is_archived: boolean
  default_permission: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface TeamspaceMember {
  id: string
  teamspace_id: string
  user_id: string
  role: TeamspaceRole
  joined_at: string
  profile?: {
    id: string
    full_name: string | null
    avatar_url: string | null
    email: string
  }
}
