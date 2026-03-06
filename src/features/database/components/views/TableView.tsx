import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { useDatabase } from '../../hooks/useDatabase'
import { CellRenderer } from '../cells/CellRenderer'
import { applyFilters } from '../../utils/filter-engine'
import { applySorts } from '../../utils/sort-engine'
import type { DatabaseEntry } from '../../types/database.types'

export function TableView() {
  const {
    properties,
    entries,
    filters,
    sorts,
    getValue,
    setValue,
    addEntry,
    addProperty,
  } = useDatabase()

  const visibleProps = properties.filter((p) => p.is_visible)

  const processedEntries = useMemo(() => {
    const filtered = applyFilters(entries, filters, properties, getValue)
    return applySorts(filtered, sorts, properties, getValue)
  }, [entries, filters, sorts, properties, getValue])

  const columns = useMemo<ColumnDef<DatabaseEntry>[]>(() => {
    return visibleProps.map((prop): ColumnDef<DatabaseEntry> => ({
      id: prop.id,
      header: () => (
        <span className="truncate font-mono text-[11px] font-semibold text-notion-text-muted">
          {prop.name}
        </span>
      ),
      size: prop.width ?? (prop.type === 'title' ? 280 : 180),
      cell: ({ row }) => {
        const entry = row.original
        const cellValue = getValue(entry.id, prop.id)
        return (
          <CellRenderer
            property={prop}
            value={cellValue}
            onChange={(val) => setValue(entry.id, prop.id, val)}
          />
        )
      },
    }))
  }, [visibleProps, getValue, setValue])

  const table = useReactTable({
    data: processedEntries,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-notion-border">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="h-8 border-r border-notion-border px-2 text-left last:border-r-0"
                  style={{ width: header.getSize() }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
              <th className="h-8 w-8 px-1">
                <button
                  onClick={() => addProperty('New property', 'text')}
                  className="flex h-6 w-6 items-center justify-center rounded text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="group border-b border-notion-border transition-colors hover:bg-notion-bg-hover/50"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="h-9 border-r border-notion-border last:border-r-0"
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td className="h-9 w-8" />
            </tr>
          ))}
        </tbody>
      </table>

      {/* New row button */}
      <button
        onClick={addEntry}
        className="flex h-8 w-full items-center gap-1.5 px-2 font-mono text-xs text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
      >
        <Plus className="h-3.5 w-3.5" />
        New
      </button>
    </div>
  )
}
