import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export interface SearchResult {
  id: string
  title: string
  icon: string | null
  icon_type: string
  parent_page_id: string | null
  updated_at: string
}

interface SearchState {
  query: string
  results: SearchResult[]
  recentPages: SearchResult[]
  isSearching: boolean

  setQuery: (query: string) => void
  search: (query: string) => Promise<void>
  fetchRecent: () => Promise<void>
  reset: () => void
}

export const useSearch = create<SearchState>()((set) => ({
  query: '',
  results: [],
  recentPages: [],
  isSearching: false,

  setQuery: (query) => set({ query }),

  search: async (query) => {
    if (!query.trim()) {
      set({ results: [], isSearching: false })
      return
    }

    set({ isSearching: true })

    const { data } = await supabase
      .from('pages')
      .select('id, title, icon, icon_type, parent_page_id, updated_at')
      .eq('is_deleted', false)
      .ilike('title', `%${query}%`)
      .order('updated_at', { ascending: false })
      .limit(20)

    set({
      results: (data ?? []) as SearchResult[],
      isSearching: false,
    })
  },

  fetchRecent: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('page_recent_visits')
      .select('page:pages!page_recent_visits_page_id_fkey(id, title, icon, icon_type, parent_page_id, updated_at)')
      .eq('user_id', user.id)
      .order('visited_at', { ascending: false })
      .limit(10)

    if (data) {
      interface RecentRow {
        page:
          | SearchResult
          | SearchResult[]
          | null
      }
      const pages = (data as unknown as RecentRow[])
        .map((r) => (Array.isArray(r.page) ? r.page[0] : r.page))
        .filter((p): p is SearchResult => p !== null && p !== undefined)

      set({ recentPages: pages })
    }
  },

  reset: () => set({ query: '', results: [], isSearching: false }),
}))
