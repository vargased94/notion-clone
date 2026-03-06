import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { supabase } from '@/lib/supabase'
import type {
  PagePermission,
  PageShare,
  PageShareRow,
  PermissionLevel,
} from '../types/sharing.types'
import { toPageShare } from '../types/sharing.types'

interface SharingState {
  permissions: PagePermission[]
  share: PageShare | null
  isLoading: boolean

  fetchPermissions: (pageId: string) => Promise<void>
  addPermission: (pageId: string, email: string, level: PermissionLevel) => Promise<{ error?: string }>
  updatePermission: (permissionId: string, level: PermissionLevel) => Promise<void>
  removePermission: (permissionId: string) => Promise<void>

  fetchShare: (pageId: string) => Promise<void>
  enableShare: (pageId: string) => Promise<void>
  disableShare: (pageId: string) => Promise<void>
  updateShare: (pageId: string, updates: Partial<Pick<PageShare, 'allow_editing' | 'allow_comments' | 'allow_duplicate' | 'search_indexing'>>) => Promise<void>

  reset: () => void
}

export const useSharing = create<SharingState>()(
  immer((set, get) => ({
    permissions: [],
    share: null,
    isLoading: false,

    fetchPermissions: async (pageId) => {
      set({ isLoading: true })

      const { data } = await supabase
        .from('page_permissions')
        .select(`
          id, page_id, user_id, teamspace_id, level, created_by, created_at,
          profile:profiles!page_permissions_user_id_fkey(id, email, full_name, avatar_url)
        `)
        .eq('page_id', pageId)
        .order('created_at', { ascending: true })

      if (data) {
        interface JoinedRow {
          id: string
          page_id: string
          user_id: string | null
          teamspace_id: string | null
          level: string
          created_by: string
          created_at: string
          profile: { id: string; email: string; full_name: string | null; avatar_url: string | null } | Array<{ id: string; email: string; full_name: string | null; avatar_url: string | null }>
        }

        const permissions: PagePermission[] = (data as unknown as JoinedRow[]).map((row) => {
          const profileData = Array.isArray(row.profile) ? row.profile[0] : row.profile
          return {
            id: row.id,
            page_id: row.page_id,
            user_id: row.user_id,
            teamspace_id: row.teamspace_id,
            level: row.level as PermissionLevel,
            created_by: row.created_by,
            created_at: row.created_at,
            profile: profileData ?? undefined,
          }
        })
        set({ permissions, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    },

    addPermission: async (pageId, email, level) => {
      // Look up the user by email
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url')
        .eq('email', email)
        .single()

      if (!profile) {
        return { error: 'User not found' }
      }

      // Check if permission already exists
      const existing = get().permissions.find((p) => p.user_id === profile.id)
      if (existing) {
        return { error: 'User already has access' }
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { error: 'Not authenticated' }

      const { data, error } = await supabase
        .from('page_permissions')
        .insert({
          page_id: pageId,
          user_id: profile.id,
          level,
          created_by: user.id,
        })
        .select('id, page_id, user_id, teamspace_id, level, created_by, created_at')
        .single()

      if (error || !data) {
        return { error: error?.message ?? 'Failed to add permission' }
      }

      set((state) => {
        state.permissions.push({
          id: data.id as string,
          page_id: data.page_id as string,
          user_id: data.user_id as string | null,
          teamspace_id: data.teamspace_id as string | null,
          level: data.level as PermissionLevel,
          created_by: data.created_by as string,
          created_at: data.created_at as string,
          profile: {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
          },
        })
      })

      return {}
    },

    updatePermission: async (permissionId, level) => {
      await supabase
        .from('page_permissions')
        .update({ level })
        .eq('id', permissionId)

      set((state) => {
        const perm = state.permissions.find((p) => p.id === permissionId)
        if (perm) perm.level = level
      })
    },

    removePermission: async (permissionId) => {
      await supabase
        .from('page_permissions')
        .delete()
        .eq('id', permissionId)

      set((state) => {
        state.permissions = state.permissions.filter((p) => p.id !== permissionId)
      })
    },

    fetchShare: async (pageId) => {
      const { data } = await supabase
        .from('page_shares')
        .select('*')
        .eq('page_id', pageId)
        .single()

      if (data) {
        set({ share: toPageShare(data as PageShareRow) })
      } else {
        set({ share: null })
      }
    },

    enableShare: async (pageId) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const slug = crypto.randomUUID().slice(0, 12)

      const existing = get().share
      if (existing) {
        // Update existing share
        const { data } = await supabase
          .from('page_shares')
          .update({ is_enabled: true, slug: existing.slug ?? slug })
          .eq('page_id', pageId)
          .select('*')
          .single()

        if (data) set({ share: toPageShare(data as PageShareRow) })
      } else {
        // Create new share
        const { data } = await supabase
          .from('page_shares')
          .insert({
            page_id: pageId,
            is_enabled: true,
            slug,
            created_by: user.id,
          })
          .select('*')
          .single()

        if (data) set({ share: toPageShare(data as PageShareRow) })
      }
    },

    disableShare: async (pageId) => {
      await supabase
        .from('page_shares')
        .update({ is_enabled: false })
        .eq('page_id', pageId)

      set((state) => {
        if (state.share) state.share.is_enabled = false
      })
    },

    updateShare: async (pageId, updates) => {
      const { data } = await supabase
        .from('page_shares')
        .update(updates)
        .eq('page_id', pageId)
        .select('*')
        .single()

      if (data) set({ share: toPageShare(data as PageShareRow) })
    },

    reset: () => {
      set({ permissions: [], share: null, isLoading: false })
    },
  })),
)
