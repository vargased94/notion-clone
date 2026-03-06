export type PageFont = 'default' | 'serif' | 'mono'
export type PageSection = 'private' | 'shared' | 'teamspace'

export interface Page {
  id: string
  workspace_id: string
  parent_page_id: string | null
  teamspace_id: string | null
  database_id: string | null
  title: string
  icon: string | null
  icon_type: 'emoji' | 'url' | 'none'
  cover_url: string | null
  cover_position: number
  font: PageFont
  full_width: boolean
  small_text: boolean
  is_locked: boolean
  section: PageSection
  is_template: boolean
  is_deleted: boolean
  deleted_at: string | null
  deleted_by: string | null
  created_by: string
  last_edited_by: string | null
  position: number
  created_at: string
  updated_at: string
}
