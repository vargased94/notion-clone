import { useMemo } from 'react'
import { Plus, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDatabase } from '../../hooks/useDatabase'
import { applyFilters } from '../../utils/filter-engine'
import { applySorts } from '../../utils/sort-engine'

export function GalleryView() {
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
    <div className="grid grid-cols-2 gap-3 p-1 sm:grid-cols-3 lg:grid-cols-4">
      {processedEntries.map((entry) => {
        const title = titleProp ? getValue(entry.id, titleProp.id)?.value_text : null
        return (
          <button
            key={entry.id}
            onClick={() => navigate(`/${entry.page_id}`)}
            className="flex flex-col overflow-hidden rounded-lg border border-notion-border bg-notion-bg-primary transition-shadow hover:shadow-md"
          >
            {/* Cover placeholder */}
            <div className="flex h-24 items-center justify-center bg-notion-bg-secondary">
              <FileText className="h-8 w-8 text-notion-text-muted/30" />
            </div>
            <div className="p-3">
              <p className="truncate font-mono text-xs font-medium text-notion-text-primary">
                {title || 'Untitled'}
              </p>
            </div>
          </button>
        )
      })}

      {/* New card */}
      <button
        onClick={addEntry}
        className="flex h-[140px] items-center justify-center rounded-lg border border-dashed border-notion-border transition-colors hover:bg-notion-bg-hover"
      >
        <Plus className="h-5 w-5 text-notion-text-muted" />
      </button>
    </div>
  )
}
