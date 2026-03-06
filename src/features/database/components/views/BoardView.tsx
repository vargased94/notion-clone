import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useDatabase } from '../../hooks/useDatabase'
import { applyFilters } from '../../utils/filter-engine'
import { applySorts } from '../../utils/sort-engine'
import type { DatabaseEntry, SelectOption } from '../../types/database.types'

export function BoardView() {
  const {
    properties,
    entries,
    filters,
    sorts,
    getValue,
    setValue,
    addEntry,
  } = useDatabase()

  // Board groups by the first select/status property
  const groupProperty = properties.find(
    (p) => p.type === 'select' || p.type === 'status',
  )

  const options: SelectOption[] = useMemo(() => {
    if (!groupProperty) return []
    return (groupProperty.config.options ?? []) as SelectOption[]
  }, [groupProperty])

  const processedEntries = useMemo(() => {
    const filtered = applyFilters(entries, filters, properties, getValue)
    return applySorts(filtered, sorts, properties, getValue)
  }, [entries, filters, sorts, properties, getValue])

  const groups = useMemo(() => {
    const grouped = new Map<string, DatabaseEntry[]>()
    grouped.set('No status', [])
    for (const opt of options) {
      grouped.set(opt.name, [])
    }

    for (const entry of processedEntries) {
      if (!groupProperty) {
        grouped.get('No status')!.push(entry)
        continue
      }
      const val = getValue(entry.id, groupProperty.id)
      const group = val?.value_text ?? 'No status'
      if (!grouped.has(group)) {
        grouped.set(group, [])
      }
      grouped.get(group)!.push(entry)
    }

    return grouped
  }, [processedEntries, groupProperty, options, getValue])

  const titleProp = properties.find((p) => p.type === 'title')

  const SELECT_COLORS: Record<string, string> = {
    red: 'bg-red-500/20 text-red-400',
    orange: 'bg-orange-500/20 text-orange-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    green: 'bg-green-500/20 text-green-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    pink: 'bg-pink-500/20 text-pink-400',
    gray: 'bg-gray-500/20 text-gray-400',
    default: 'bg-notion-bg-hover text-notion-text-secondary',
  }

  return (
    <div className="flex gap-3 overflow-x-auto p-1 pb-4">
      {Array.from(groups.entries()).map(([groupName, groupEntries]) => {
        const option = options.find((o) => o.name === groupName)
        const colorClass = option
          ? (SELECT_COLORS[option.color] ?? SELECT_COLORS.default)
          : SELECT_COLORS.default

        return (
          <div
            key={groupName}
            className="flex w-[260px] shrink-0 flex-col rounded-lg bg-notion-bg-secondary"
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${colorClass}`}>
                  {groupName}
                </span>
                <span className="font-mono text-[10px] text-notion-text-muted">
                  {groupEntries.length}
                </span>
              </div>
              <button
                onClick={async () => {
                  const entry = await addEntry()
                  if (entry && groupProperty && groupName !== 'No status') {
                    setValue(entry.id, groupProperty.id, { value_text: groupName })
                  }
                }}
                className="rounded p-0.5 text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-1.5 px-2 pb-2">
              {groupEntries.map((entry) => {
                const title = titleProp ? getValue(entry.id, titleProp.id)?.value_text : null
                return (
                  <div
                    key={entry.id}
                    className="cursor-pointer rounded-md border border-notion-border bg-notion-bg-primary p-3 transition-shadow hover:shadow-md"
                  >
                    <p className="font-mono text-xs text-notion-text-primary">
                      {title || 'Untitled'}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
