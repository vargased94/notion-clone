export type BlockType =
  | 'paragraph' | 'heading_1' | 'heading_2' | 'heading_3'
  | 'bulleted_list_item' | 'numbered_list_item' | 'to_do' | 'toggle'
  | 'quote' | 'callout' | 'divider'
  | 'toggle_heading_1' | 'toggle_heading_2' | 'toggle_heading_3'
  | 'image' | 'video' | 'audio' | 'file' | 'bookmark' | 'embed'
  | 'code' | 'equation' | 'table_of_contents' | 'breadcrumb'
  | 'synced_block' | 'synced_block_reference' | 'button'
  | 'column_list' | 'column' | 'link_to_page' | 'child_page' | 'child_database'
  | 'table' | 'table_row'

export interface Block {
  id: string
  page_id: string
  parent_block_id: string | null
  type: BlockType
  content: Record<string, unknown>
  position: number
  indent_level: number
  is_collapsed: boolean
  created_by: string
  last_edited_by: string | null
  created_at: string
  updated_at: string
}
