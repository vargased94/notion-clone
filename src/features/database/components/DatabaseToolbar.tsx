import { useState } from 'react'
import { SlidersHorizontal, ArrowUpDown, Plus, Search, X } from 'lucide-react'
import { useDatabase } from '../hooks/useDatabase'
import { cn } from '@/lib/cn'
import type { FilterOperator, SortDirection, DbViewType } from '../types/database.types'

const VIEW_TYPES: { type: DbViewType; label: string }[] = [
  { type: 'table', label: 'Table' },
  { type: 'board', label: 'Board' },
  { type: 'list', label: 'List' },
  { type: 'gallery', label: 'Gallery' },
  { type: 'calendar', label: 'Calendar' },
]

export function DatabaseToolbar() {
  const {
    views,
    activeViewId,
    properties,
    filters,
    sorts,
    setActiveView,
    addView,
    addFilter,
    removeFilter,
    addSort,
    removeSort,
  } = useDatabase()

  const [showFilterPicker, setShowFilterPicker] = useState(false)
  const [showSortPicker, setShowSortPicker] = useState(false)
  const [showViewPicker, setShowViewPicker] = useState(false)

  const filterableProps = properties.filter(
    (p) => !['created_time', 'created_by', 'last_edited_time', 'last_edited_by', 'unique_id', 'button', 'formula', 'rollup'].includes(p.type),
  )

  const handleAddFilter = (propertyId: string) => {
    if (!activeViewId) return
    const prop = properties.find((p) => p.id === propertyId)
    const defaultOp: FilterOperator = prop?.type === 'checkbox' ? 'is_checked' : 'contains'
    addFilter(activeViewId, propertyId, defaultOp, null)
    setShowFilterPicker(false)
  }

  const handleAddSort = (propertyId: string, direction: SortDirection) => {
    if (!activeViewId) return
    addSort(activeViewId, propertyId, direction)
    setShowSortPicker(false)
  }

  return (
    <div className="flex flex-col gap-2 border-b border-notion-border px-1 pb-2">
      {/* View tabs + actions */}
      <div className="flex items-center gap-1">
        {/* View tabs */}
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={cn(
              'rounded px-2.5 py-1 font-mono text-xs transition-colors',
              view.id === activeViewId
                ? 'bg-notion-bg-hover font-medium text-notion-text-primary'
                : 'text-notion-text-muted hover:text-notion-text-secondary',
            )}
          >
            {view.name}
          </button>
        ))}

        {/* Add view */}
        <div className="relative">
          <button
            onClick={() => setShowViewPicker(!showViewPicker)}
            className="rounded p-1 text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          {showViewPicker && (
            <div className="absolute top-full left-0 z-50 mt-1 rounded-lg border border-notion-border bg-notion-bg-secondary p-1 shadow-lg">
              {VIEW_TYPES.map(({ type, label }) => (
                <button
                  key={type}
                  onClick={async () => {
                    const view = await addView(label, type)
                    if (view) setActiveView(view.id)
                    setShowViewPicker(false)
                  }}
                  className="flex w-full rounded px-3 py-1.5 font-mono text-xs text-notion-text-secondary hover:bg-notion-bg-hover"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Filter button */}
        <div className="relative">
          <button
            onClick={() => setShowFilterPicker(!showFilterPicker)}
            className={cn(
              'flex items-center gap-1 rounded px-2 py-1 font-mono text-xs transition-colors hover:bg-notion-bg-hover',
              filters.length > 0 ? 'text-notion-green-primary' : 'text-notion-text-muted',
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
            {filters.length > 0 && <span className="ml-0.5">{filters.length}</span>}
          </button>
          {showFilterPicker && (
            <div className="absolute top-full right-0 z-50 mt-1 min-w-[200px] rounded-lg border border-notion-border bg-notion-bg-secondary p-1 shadow-lg">
              <div className="px-2 py-1 font-mono text-[10px] font-semibold text-notion-text-muted">
                ADD FILTER
              </div>
              {filterableProps.map((prop) => (
                <button
                  key={prop.id}
                  onClick={() => handleAddFilter(prop.id)}
                  className="flex w-full rounded px-3 py-1.5 font-mono text-xs text-notion-text-secondary hover:bg-notion-bg-hover"
                >
                  {prop.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort button */}
        <div className="relative">
          <button
            onClick={() => setShowSortPicker(!showSortPicker)}
            className={cn(
              'flex items-center gap-1 rounded px-2 py-1 font-mono text-xs transition-colors hover:bg-notion-bg-hover',
              sorts.length > 0 ? 'text-notion-green-primary' : 'text-notion-text-muted',
            )}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort
            {sorts.length > 0 && <span className="ml-0.5">{sorts.length}</span>}
          </button>
          {showSortPicker && (
            <div className="absolute top-full right-0 z-50 mt-1 min-w-[200px] rounded-lg border border-notion-border bg-notion-bg-secondary p-1 shadow-lg">
              <div className="px-2 py-1 font-mono text-[10px] font-semibold text-notion-text-muted">
                ADD SORT
              </div>
              {filterableProps.map((prop) => (
                <div key={prop.id} className="flex items-center gap-1 px-1">
                  <button
                    onClick={() => handleAddSort(prop.id, 'ascending')}
                    className="flex-1 rounded px-2 py-1.5 text-left font-mono text-xs text-notion-text-secondary hover:bg-notion-bg-hover"
                  >
                    {prop.name} ↑
                  </button>
                  <button
                    onClick={() => handleAddSort(prop.id, 'descending')}
                    className="flex-1 rounded px-2 py-1.5 text-left font-mono text-xs text-notion-text-secondary hover:bg-notion-bg-hover"
                  >
                    {prop.name} ↓
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <button className="rounded p-1 text-notion-text-muted transition-colors hover:bg-notion-bg-hover">
          <Search className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Active filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1">
          {filters.map((filter) => {
            const prop = properties.find((p) => p.id === filter.property_id)
            return (
              <div
                key={filter.id}
                className="flex items-center gap-1 rounded bg-notion-bg-hover px-2 py-0.5 font-mono text-[10px] text-notion-text-secondary"
              >
                <span>{prop?.name ?? 'Unknown'}</span>
                <span className="text-notion-text-muted">{filter.operator}</span>
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-notion-bg-tertiary"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Active sorts */}
      {sorts.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1">
          {sorts.map((sort) => {
            const prop = properties.find((p) => p.id === sort.property_id)
            return (
              <div
                key={sort.id}
                className="flex items-center gap-1 rounded bg-notion-bg-hover px-2 py-0.5 font-mono text-[10px] text-notion-text-secondary"
              >
                <ArrowUpDown className="h-2.5 w-2.5" />
                <span>{prop?.name ?? 'Unknown'}</span>
                <span className="text-notion-text-muted">{sort.direction === 'ascending' ? '↑' : '↓'}</span>
                <button
                  onClick={() => removeSort(sort.id)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-notion-bg-tertiary"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
