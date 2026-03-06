export type NotificationType =
  | 'mention'
  | 'comment'
  | 'comment_reply'
  | 'page_edit'
  | 'reminder'
  | 'invitation'
  | 'property_change'

export interface Notification {
  id: string
  workspace_id: string
  recipient_id: string
  actor_id: string | null
  type: NotificationType
  page_id: string | null
  block_id: string | null
  comment_id: string | null
  title: string
  body: string | null
  data: Record<string, unknown>
  is_read: boolean
  read_at: string | null
  scheduled_for: string | null
  created_at: string
  // Joined
  actor?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}
