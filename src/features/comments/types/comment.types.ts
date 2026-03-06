export type CommentStatus = 'open' | 'resolved'

export interface CommentContent {
  type: 'text' | 'mention_user' | 'mention_page'
  text?: string
  user_id?: string
  page_id?: string
}

export interface Comment {
  id: string
  page_id: string
  block_id: string | null
  parent_comment_id: string | null
  content: CommentContent[]
  text_range: { from: number; to: number } | null
  status: CommentStatus
  resolved_by: string | null
  resolved_at: string | null
  created_by: string
  created_at: string
  updated_at: string
  // Joined data
  author?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  replies?: Comment[]
}
