import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { supabase } from '@/lib/supabase'
import type { Notification, NotificationType } from '../types/notification.types'

interface JoinedNotifRow {
  id: string
  workspace_id: string
  recipient_id: string
  actor_id: string | null
  type: string
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
  actor:
    | { id: string; full_name: string | null; avatar_url: string | null }
    | Array<{ id: string; full_name: string | null; avatar_url: string | null }>
    | null
}

function parseNotif(row: JoinedNotifRow): Notification {
  const actor = Array.isArray(row.actor) ? row.actor[0] : row.actor
  return {
    id: row.id,
    workspace_id: row.workspace_id,
    recipient_id: row.recipient_id,
    actor_id: row.actor_id,
    type: row.type as NotificationType,
    page_id: row.page_id,
    block_id: row.block_id,
    comment_id: row.comment_id,
    title: row.title,
    body: row.body,
    data: row.data ?? {},
    is_read: row.is_read,
    read_at: row.read_at,
    scheduled_for: row.scheduled_for,
    created_at: row.created_at,
    actor: actor ?? undefined,
  }
}

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean

  fetchNotifications: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  reset: () => void
}

export const useNotifications = create<NotificationsState>()(
  immer((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    fetchNotifications: async () => {
      set({ isLoading: true })

      const { data } = await supabase
        .from('notifications')
        .select(`
          id, workspace_id, recipient_id, actor_id, type, page_id, block_id,
          comment_id, title, body, data, is_read, read_at, scheduled_for, created_at,
          actor:profiles!notifications_actor_id_fkey(id, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      const notifications = (data as unknown as JoinedNotifRow[] | null)?.map(parseNotif) ?? []
      const unreadCount = notifications.filter((n) => !n.is_read).length

      set({ notifications, unreadCount, isLoading: false })
    },

    markAsRead: async (notificationId) => {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)

      set((state) => {
        const n = state.notifications.find((x) => x.id === notificationId)
        if (n && !n.is_read) {
          n.is_read = true
          n.read_at = new Date().toISOString()
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
    },

    markAllAsRead: async () => {
      const unreadIds = get().notifications.filter((n) => !n.is_read).map((n) => n.id)
      if (unreadIds.length === 0) return

      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in('id', unreadIds)

      set((state) => {
        for (const n of state.notifications) {
          if (!n.is_read) {
            n.is_read = true
            n.read_at = new Date().toISOString()
          }
        }
        state.unreadCount = 0
      })
    },

    deleteNotification: async (notificationId) => {
      await supabase.from('notifications').delete().eq('id', notificationId)

      set((state) => {
        const idx = state.notifications.findIndex((n) => n.id === notificationId)
        if (idx !== -1) {
          if (!state.notifications[idx].is_read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1)
          }
          state.notifications.splice(idx, 1)
        }
      })
    },

    reset: () => {
      set({ notifications: [], unreadCount: 0, isLoading: false })
    },
  })),
)
