export type DbPropertyType =
  | 'title' | 'text' | 'number' | 'select' | 'multi_select' | 'status'
  | 'date' | 'person' | 'files' | 'checkbox' | 'url' | 'email' | 'phone'
  | 'formula' | 'relation' | 'rollup'
  | 'created_time' | 'created_by' | 'last_edited_time' | 'last_edited_by'
  | 'unique_id' | 'button'

export type DbViewType = 'table' | 'board' | 'list' | 'calendar' | 'timeline' | 'gallery' | 'chart'

export type SortDirection = 'ascending' | 'descending'

export type FilterOperator =
  | 'equals' | 'does_not_equal'
  | 'contains' | 'does_not_contain'
  | 'starts_with' | 'ends_with'
  | 'is_empty' | 'is_not_empty'
  | 'greater_than' | 'less_than'
  | 'greater_than_or_equal' | 'less_than_or_equal'
  | 'is_before' | 'is_after' | 'is_on_or_before' | 'is_on_or_after'
  | 'is_checked' | 'is_not_checked'

export interface SelectOption {
  id: string
  name: string
  color: string
}

export interface PropertyConfig {
  options?: SelectOption[]
  format?: string
  expression?: string
  database_id?: string
  relation_type?: 'bidirectional' | 'one_way'
  relation_property_id?: string
  target_property_id?: string
  calculation?: string
}

export interface Database {
  id: string
  page_id: string
  workspace_id: string
  title: string
  is_inline: boolean
  is_locked: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface DatabaseProperty {
  id: string
  database_id: string
  name: string
  type: DbPropertyType
  position: number
  is_visible: boolean
  width: number | null
  config: PropertyConfig
  created_at: string
  updated_at: string
}

export interface DatabaseEntry {
  id: string
  database_id: string
  page_id: string
  position: number
  unique_id: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface EntryValue {
  id: string
  entry_id: string
  property_id: string
  value_text: string | null
  value_number: number | null
  value_boolean: boolean | null
  value_date: string | null
  value_date_end: string | null
  value_json: unknown | null
  created_at: string
  updated_at: string
}

export interface DatabaseView {
  id: string
  database_id: string
  name: string
  type: DbViewType
  position: number
  is_default: boolean
  layout_config: Record<string, unknown>
  visible_properties: string[]
  created_at: string
  updated_at: string
}

export interface ViewFilter {
  id: string
  view_id: string
  parent_filter_id: string | null
  position: number
  is_group: boolean
  logical_operator: 'and' | 'or'
  property_id: string | null
  operator: FilterOperator | null
  value: unknown | null
  created_at: string
}

export interface ViewSort {
  id: string
  view_id: string
  property_id: string
  direction: SortDirection
  position: number
  created_at: string
}

export interface ViewGroup {
  id: string
  view_id: string
  property_id: string
  is_sub_group: boolean
  hide_empty: boolean
  sort_order: string
  collapsed_groups: string[]
  hidden_groups: string[]
  created_at: string
}

// Enriched row type for rendering
export interface EnrichedEntry {
  entry: DatabaseEntry
  values: Map<string, EntryValue>
  pageTitle: string
  pageIcon: string | null
}
