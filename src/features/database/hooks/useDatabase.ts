import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { supabase } from '@/lib/supabase'
import type {
  Database,
  DatabaseProperty,
  DatabaseEntry,
  EntryValue,
  DatabaseView,
  ViewFilter,
  ViewSort,
  DbPropertyType,
  DbViewType,
  PropertyConfig,
  FilterOperator,
  SortDirection,
} from '../types/database.types'

interface DatabaseState {
  database: Database | null
  properties: DatabaseProperty[]
  entries: DatabaseEntry[]
  values: Map<string, EntryValue> // key: `${entryId}:${propertyId}`
  views: DatabaseView[]
  activeViewId: string | null
  filters: ViewFilter[]
  sorts: ViewSort[]
  isLoading: boolean

  // Database
  fetchDatabase: (databaseId: string) => Promise<void>
  createDatabase: (pageId: string, workspaceId: string, title?: string) => Promise<Database | null>

  // Properties
  addProperty: (name: string, type: DbPropertyType, config?: PropertyConfig) => Promise<DatabaseProperty | null>
  updateProperty: (propertyId: string, updates: Partial<Pick<DatabaseProperty, 'name' | 'type' | 'width' | 'is_visible' | 'config'>>) => Promise<void>
  deleteProperty: (propertyId: string) => Promise<void>

  // Entries
  addEntry: () => Promise<DatabaseEntry | null>
  deleteEntry: (entryId: string) => Promise<void>

  // Values
  getValue: (entryId: string, propertyId: string) => EntryValue | undefined
  setValue: (entryId: string, propertyId: string, value: Partial<Pick<EntryValue, 'value_text' | 'value_number' | 'value_boolean' | 'value_date' | 'value_date_end' | 'value_json'>>) => Promise<void>

  // Views
  setActiveView: (viewId: string) => void
  addView: (name: string, type: DbViewType) => Promise<DatabaseView | null>
  updateView: (viewId: string, updates: Partial<Pick<DatabaseView, 'name' | 'type' | 'layout_config' | 'visible_properties'>>) => Promise<void>
  deleteView: (viewId: string) => Promise<void>

  // Filters
  addFilter: (viewId: string, propertyId: string, operator: FilterOperator, value: unknown) => Promise<void>
  removeFilter: (filterId: string) => Promise<void>

  // Sorts
  addSort: (viewId: string, propertyId: string, direction: SortDirection) => Promise<void>
  removeSort: (sortId: string) => Promise<void>
}

function valueKey(entryId: string, propertyId: string): string {
  return `${entryId}:${propertyId}`
}

export const useDatabase = create<DatabaseState>()(
  immer((set, get) => ({
    database: null,
    properties: [],
    entries: [],
    values: new Map(),
    views: [],
    activeViewId: null,
    filters: [],
    sorts: [],
    isLoading: false,

    fetchDatabase: async (databaseId) => {
      set({ isLoading: true })

      const [dbRes, propsRes, entriesRes, viewsRes] = await Promise.all([
        supabase.from('databases').select('*').eq('id', databaseId).single(),
        supabase.from('database_properties').select('*').eq('database_id', databaseId).order('position'),
        supabase.from('database_entries').select('*').eq('database_id', databaseId).order('position'),
        supabase.from('database_views').select('*').eq('database_id', databaseId).order('position'),
      ])

      const db = dbRes.data as Database | null
      const props = (propsRes.data ?? []) as DatabaseProperty[]
      const entries = (entriesRes.data ?? []) as DatabaseEntry[]
      const views = (viewsRes.data ?? []) as DatabaseView[]

      // Fetch all values for all entries
      const entryIds = entries.map((e) => e.id)
      const valuesMap = new Map<string, EntryValue>()

      if (entryIds.length > 0) {
        const { data: vals } = await supabase
          .from('database_entry_values')
          .select('*')
          .in('entry_id', entryIds)

        for (const v of (vals ?? []) as EntryValue[]) {
          valuesMap.set(valueKey(v.entry_id, v.property_id), v)
        }
      }

      const activeViewId = views.find((v) => v.is_default)?.id ?? views[0]?.id ?? null

      // Fetch filters and sorts for active view
      let filters: ViewFilter[] = []
      let sorts: ViewSort[] = []
      if (activeViewId) {
        const [filtersRes, sortsRes] = await Promise.all([
          supabase.from('view_filters').select('*').eq('view_id', activeViewId).order('position'),
          supabase.from('view_sorts').select('*').eq('view_id', activeViewId).order('position'),
        ])
        filters = (filtersRes.data ?? []) as ViewFilter[]
        sorts = (sortsRes.data ?? []) as ViewSort[]
      }

      set({
        database: db,
        properties: props,
        entries,
        values: valuesMap,
        views,
        activeViewId,
        filters,
        sorts,
        isLoading: false,
      })
    },

    createDatabase: async (pageId, workspaceId, title = 'Untitled Database') => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data: db, error } = await supabase
        .from('databases')
        .insert({ page_id: pageId, workspace_id: workspaceId, title, created_by: user.id })
        .select()
        .single()

      if (error || !db) return null

      // Create default Title property
      const { data: titleProp } = await supabase
        .from('database_properties')
        .insert({ database_id: db.id, name: 'Name', type: 'title', position: 0 })
        .select()
        .single()

      // Create default table view
      const { data: view } = await supabase
        .from('database_views')
        .insert({ database_id: db.id, name: 'Table view', type: 'table', is_default: true, position: 0 })
        .select()
        .single()

      set({
        database: db as Database,
        properties: titleProp ? [titleProp as DatabaseProperty] : [],
        entries: [],
        values: new Map(),
        views: view ? [view as DatabaseView] : [],
        activeViewId: view?.id ?? null,
        filters: [],
        sorts: [],
      })

      return db as Database
    },

    addProperty: async (name, type, config = {}) => {
      const { database, properties } = get()
      if (!database) return null

      const position = properties.length > 0
        ? properties[properties.length - 1].position + 1
        : 0

      const { data, error } = await supabase
        .from('database_properties')
        .insert({ database_id: database.id, name, type, position, config })
        .select()
        .single()

      if (error || !data) return null

      set((state) => {
        state.properties.push(data as DatabaseProperty)
      })

      return data as DatabaseProperty
    },

    updateProperty: async (propertyId, updates) => {
      const { data } = await supabase
        .from('database_properties')
        .update(updates)
        .eq('id', propertyId)
        .select()
        .single()

      if (!data) return

      set((state) => {
        const idx = state.properties.findIndex((p) => p.id === propertyId)
        if (idx !== -1) state.properties[idx] = data as DatabaseProperty
      })
    },

    deleteProperty: async (propertyId) => {
      await supabase.from('database_properties').delete().eq('id', propertyId)

      set((state) => {
        state.properties = state.properties.filter((p) => p.id !== propertyId)
      })
    },

    addEntry: async () => {
      const { database, entries } = get()
      if (!database) return null

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const position = entries.length > 0
        ? entries[entries.length - 1].position + 1
        : 0

      // Create a page for this entry
      const { data: page } = await supabase
        .from('pages')
        .insert({
          workspace_id: database.workspace_id,
          database_id: database.id,
          title: '',
          created_by: user.id,
          last_edited_by: user.id,
          position: 0,
        })
        .select()
        .single()

      if (!page) return null

      const { data: entry, error } = await supabase
        .from('database_entries')
        .insert({
          database_id: database.id,
          page_id: page.id,
          position,
          created_by: user.id,
        })
        .select()
        .single()

      if (error || !entry) return null

      set((state) => {
        state.entries.push(entry as DatabaseEntry)
      })

      return entry as DatabaseEntry
    },

    deleteEntry: async (entryId) => {
      // This cascades to page + values
      const entry = get().entries.find((e) => e.id === entryId)
      if (entry) {
        await supabase.from('pages').delete().eq('id', entry.page_id)
      }

      set((state) => {
        state.entries = state.entries.filter((e) => e.id !== entryId)
        // Clean up values
        const newValues = new Map(state.values)
        for (const [key] of newValues) {
          if (key.startsWith(`${entryId}:`)) {
            newValues.delete(key)
          }
        }
        state.values = newValues
      })
    },

    getValue: (entryId, propertyId) => {
      return get().values.get(valueKey(entryId, propertyId))
    },

    setValue: async (entryId, propertyId, value) => {
      const key = valueKey(entryId, propertyId)
      const existing = get().values.get(key)

      if (existing) {
        const { data } = await supabase
          .from('database_entry_values')
          .update(value)
          .eq('id', existing.id)
          .select()
          .single()

        if (data) {
          set((state) => {
            state.values.set(key, data as EntryValue)
          })
        }
      } else {
        const { data } = await supabase
          .from('database_entry_values')
          .insert({ entry_id: entryId, property_id: propertyId, ...value })
          .select()
          .single()

        if (data) {
          set((state) => {
            state.values.set(key, data as EntryValue)
          })
        }
      }
    },

    setActiveView: (viewId) => {
      set({ activeViewId: viewId })

      // Fetch filters/sorts for the new view
      const fetchViewData = async () => {
        const [filtersRes, sortsRes] = await Promise.all([
          supabase.from('view_filters').select('*').eq('view_id', viewId).order('position'),
          supabase.from('view_sorts').select('*').eq('view_id', viewId).order('position'),
        ])
        set({
          filters: (filtersRes.data ?? []) as ViewFilter[],
          sorts: (sortsRes.data ?? []) as ViewSort[],
        })
      }
      fetchViewData()
    },

    addView: async (name, type) => {
      const { database, views } = get()
      if (!database) return null

      const position = views.length > 0 ? views[views.length - 1].position + 1 : 0

      const { data, error } = await supabase
        .from('database_views')
        .insert({ database_id: database.id, name, type, position })
        .select()
        .single()

      if (error || !data) return null

      set((state) => {
        state.views.push(data as DatabaseView)
      })

      return data as DatabaseView
    },

    updateView: async (viewId, updates) => {
      const { data } = await supabase
        .from('database_views')
        .update(updates)
        .eq('id', viewId)
        .select()
        .single()

      if (!data) return

      set((state) => {
        const idx = state.views.findIndex((v) => v.id === viewId)
        if (idx !== -1) state.views[idx] = data as DatabaseView
      })
    },

    deleteView: async (viewId) => {
      await supabase.from('database_views').delete().eq('id', viewId)

      set((state) => {
        state.views = state.views.filter((v) => v.id !== viewId)
        if (state.activeViewId === viewId) {
          state.activeViewId = state.views[0]?.id ?? null
        }
      })
    },

    addFilter: async (viewId, propertyId, operator, value) => {
      const { filters } = get()
      const position = filters.length > 0 ? filters[filters.length - 1].position + 1 : 0

      const { data } = await supabase
        .from('view_filters')
        .insert({ view_id: viewId, property_id: propertyId, operator, value, position })
        .select()
        .single()

      if (data) {
        set((state) => {
          state.filters.push(data as ViewFilter)
        })
      }
    },

    removeFilter: async (filterId) => {
      await supabase.from('view_filters').delete().eq('id', filterId)

      set((state) => {
        state.filters = state.filters.filter((f) => f.id !== filterId)
      })
    },

    addSort: async (viewId, propertyId, direction) => {
      const { sorts } = get()
      const position = sorts.length > 0 ? sorts[sorts.length - 1].position + 1 : 0

      const { data } = await supabase
        .from('view_sorts')
        .insert({ view_id: viewId, property_id: propertyId, direction, position })
        .select()
        .single()

      if (data) {
        set((state) => {
          state.sorts.push(data as ViewSort)
        })
      }
    },

    removeSort: async (sortId) => {
      await supabase.from('view_sorts').delete().eq('id', sortId)

      set((state) => {
        state.sorts = state.sorts.filter((s) => s.id !== sortId)
      })
    },
  }))
)
