import { useMemo } from 'react'
import { Plus, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDatabase } from '../../hooks/useDatabase'
import { applyFilters } from '../../utils/filter-engine'
import { applySorts } from '../../utils/sort-engine'

export function ListView() {
  const navigate = useNavigate()
  const {
    properties,
    entries,
    filters,
    sorts,
    getValue,
    addEntry,
  } = useDatabase()

  const processedEntries = useMemo(() => {
    const filtered = applyFilters(entries, filters, properties, getValue)
    return applySorts(filtered, sorts, properties, getValue)
  }, [entries, filters, sorts, properties, getValue])

  const titleProp = properties.find((p) => p.type === 'title')

  return (
    <div className="flex flex-col">
      {processedEntries.map((entry) => {
        const title = titleProp ? getValue(entry.id, titleProp.id)?.value_text : null
        return (
          <button
            key={entry.id}
            onClick={() => navigate(`/${entry.page_id}`)}
            className="flex h-9 items-center gap-2.5 border-b border-notion-border px-3 text-left transition-colors hover:bg-notion-bg-hover"
          >
            <FileText className="h-4 w-4 shrink-0 text-notion-text-muted" />
            <span className="truncate font-mono text-xs text-notion-text-primary">
              {title || 'Untitled'}
            </span>
          </button>
        )
      })}

      <button
        onClick={addEntry}
        className="flex h-8 items-center gap-1.5 px-3 font-mono text-xs text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
      >
        <Plus className="h-3.5 w-3.5" />
        New
      </button>
    </div>
  )
}
