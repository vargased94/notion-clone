export type PermissionLevel =
  | 'full_access'
  | 'can_edit'
  | 'can_edit_content'
  | 'can_comment'
  | 'can_view'

export interface PagePermission {
  id: string
  page_id: string
  user_id: string | null
  teamspace_id: string | null
  level: PermissionLevel
  created_by: string
  created_at: string
  // Joined profile data
  profile?: {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
  }
}

export interface PageShare {
  id: string
  page_id: string
  is_enabled: boolean
  slug: string | null
  allow_editing: boolean
  allow_comments: boolean
  allow_duplicate: boolean
  search_indexing: boolean
  has_password: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface PageShareRow {
  id: string
  page_id: string
  is_enabled: boolean
  slug: string | null
  allow_editing: boolean
  allow_comments: boolean
  allow_duplicate: boolean
  search_indexing: boolean
  password_hash: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export const PERMISSION_LABELS: Record<PermissionLevel, string> = {
  full_access: 'Full access',
  can_edit: 'Can edit',
  can_edit_content: 'Can edit content',
  can_comment: 'Can comment',
  can_view: 'Can view',
}

export const PERMISSION_DESCRIPTIONS: Record<PermissionLevel, string> = {
  full_access: 'Can edit, share, and manage permissions',
  can_edit: 'Can edit page structure and content',
  can_edit_content: 'Can edit content only',
  can_comment: 'Can view and leave comments',
  can_view: 'Can view only',
}

export const PERMISSION_ORDER: PermissionLevel[] = [
  'full_access',
  'can_edit',
  'can_edit_content',
  'can_comment',
  'can_view',
]

/** Convert a DB row (with password_hash) to a safe PageShare (with has_password) */
export function toPageShare(row: PageShareRow): PageShare {
  return {
    id: row.id,
    page_id: row.page_id,
    is_enabled: row.is_enabled,
    slug: row.slug,
    allow_editing: row.allow_editing ?? false,
    allow_comments: row.allow_comments ?? false,
    allow_duplicate: row.allow_duplicate ?? false,
    search_indexing: row.search_indexing ?? false,
    has_password: !!row.password_hash,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}
