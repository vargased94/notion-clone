import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { supabase } from '@/lib/supabase'

export interface Page {
  id: string
  workspace_id: string
  parent_page_id: string | null
  title: string
  icon: string | null
  icon_type: 'emoji' | 'url' | 'none'
  cover_url: string | null
  cover_position: number
  font: 'default' | 'serif' | 'mono'
  full_width: boolean
  small_text: boolean
  position: number
  is_deleted: boolean
  is_locked: boolean
  created_by: string
  created_at: string
  updated_at: string
}

interface PagesState {
  pages: Page[]
  favorites: string[] // page ids
  isLoading: boolean

  fetchPages: (workspaceId: string) => Promise<void>
  fetchFavorites: () => Promise<void>

  createPage: (workspaceId: string, parentId?: string | null) => Promise<Page | null>
  updatePage: (pageId: string, updates: Partial<Omit<Page, 'id' | 'workspace_id' | 'created_by' | 'created_at' | 'updated_at'>>) => Promise<void>
  softDeletePage: (pageId: string) => Promise<void>
  restorePage: (pageId: string) => Promise<void>
  permanentDeletePage: (pageId: string) => Promise<void>

  toggleFavorite: (pageId: string) => Promise<void>

  getChildPages: (parentId: string | null) => Page[]
  getPageById: (pageId: string) => Page | undefined
}

export const usePages = create<PagesState>()(
  immer((set, get) => ({
    pages: [],
    favorites: [],
    isLoading: false,

    fetchPages: async (workspaceId) => {
      set({ isLoading: true })

      const { data } = await supabase
        .from('pages')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('is_deleted', false)
        .order('position', { ascending: true })

      set({ pages: data ?? [], isLoading: false })
    },

    fetchFavorites: async () => {
      const { data } = await supabase
        .from('page_favorites')
        .select('page_id')
        .order('position', { ascending: true })

      set({ favorites: data?.map((f) => f.page_id) ?? [] })
    },

    createPage: async (workspaceId, parentId = null) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      // Calculate position: append at end
      const siblings = get().getChildPages(parentId)
      const position = siblings.length > 0
        ? siblings[siblings.length - 1].position + 1
        : 0

      const { data, error } = await supabase
        .from('pages')
        .insert({
          workspace_id: workspaceId,
          parent_page_id: parentId,
          title: '',
          icon: null,
          icon_type: 'none',
          position,
          created_by: user.id,
          last_edited_by: user.id,
        })
        .select()
        .single()

      if (error || !data) return null

      set((state) => {
        state.pages.push(data)
      })

      return data
    },

    updatePage: async (pageId, updates) => {
      const { data: { user } } = await supabase.auth.getUser()

      const { data } = await supabase
        .from('pages')
        .update({ ...updates, last_edited_by: user?.id })
        .eq('id', pageId)
        .select()
        .single()

      if (!data) return

      set((state) => {
        const idx = state.pages.findIndex((p) => p.id === pageId)
        if (idx !== -1) state.pages[idx] = { ...state.pages[idx], ...data }
      })
    },

    softDeletePage: async (pageId) => {
      const { data: { user } } = await supabase.auth.getUser()
      const page = get().getPageById(pageId)

      await supabase
        .from('pages')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          deleted_by: user?.id,
          original_parent: page?.parent_page_id,
        })
        .eq('id', pageId)

      set((state) => {
        state.pages = state.pages.filter((p) => p.id !== pageId)
      })
    },

    restorePage: async (pageId) => {
      const { data } = await supabase
        .from('pages')
        .update({
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        })
        .eq('id', pageId)
        .select()
        .single()

      if (data) {
        set((state) => {
          state.pages.push(data)
        })
      }
    },

    permanentDeletePage: async (pageId) => {
      await supabase.from('pages').delete().eq('id', pageId)

      set((state) => {
        state.pages = state.pages.filter((p) => p.id !== pageId)
        state.favorites = state.favorites.filter((id) => id !== pageId)
      })
    },

    toggleFavorite: async (pageId) => {
      const isFav = get().favorites.includes(pageId)

      if (isFav) {
        await supabase
          .from('page_favorites')
          .delete()
          .eq('page_id', pageId)

        set((state) => {
          state.favorites = state.favorites.filter((id) => id !== pageId)
        })
      } else {
        const position = get().favorites.length
        await supabase
          .from('page_favorites')
          .insert({ page_id: pageId, position })

        set((state) => {
          state.favorites.push(pageId)
        })
      }
    },

    getChildPages: (parentId) => {
      return get().pages
        .filter((p) => p.parent_page_id === parentId)
        .sort((a, b) => a.position - b.position)
    },

    getPageById: (pageId) => {
      return get().pages.find((p) => p.id === pageId)
    },
  }))
)
