import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { DatabaseProperty, EntryValue, SelectOption } from '../../types/database.types'

interface CellRendererProps {
  property: DatabaseProperty
  value: EntryValue | undefined
  onChange: (value: Partial<Pick<EntryValue, 'value_text' | 'value_number' | 'value_boolean' | 'value_date' | 'value_date_end' | 'value_json'>>) => void
}

export function CellRenderer({ property, value, onChange }: CellRendererProps) {
  switch (property.type) {
    case 'title':
    case 'text':
    case 'url':
    case 'email':
    case 'phone':
      return <TextCell value={value?.value_text ?? ''} onChange={(v) => onChange({ value_text: v })} />
    case 'number':
      return <NumberCell value={value?.value_number ?? null} onChange={(v) => onChange({ value_number: v })} />
    case 'checkbox':
      return <CheckboxCell value={value?.value_boolean ?? false} onChange={(v) => onChange({ value_boolean: v })} />
    case 'select':
    case 'status':
      return (
        <SelectCell
          value={value?.value_text ?? null}
          options={(property.config.options ?? []) as SelectOption[]}
          onChange={(v) => onChange({ value_text: v })}
        />
      )
    case 'multi_select':
      return (
        <MultiSelectCell
          values={(value?.value_json as string[] | null) ?? []}
          options={(property.config.options ?? []) as SelectOption[]}
          onChange={(v) => onChange({ value_json: v })}
        />
      )
    case 'date':
      return <DateCell value={value?.value_date ?? null} onChange={(v) => onChange({ value_date: v })} />
    case 'created_time':
      return <ReadonlyCell value={value?.value_date ? new Date(value.value_date).toLocaleDateString() : '—'} />
    case 'last_edited_time':
      return <ReadonlyCell value={value?.value_date ? new Date(value.value_date).toLocaleDateString() : '—'} />
    default:
      return <TextCell value={value?.value_text ?? ''} onChange={(v) => onChange({ value_text: v })} />
  }
}

// --- Individual cell components ---

function TextCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-full w-full bg-transparent px-2 font-mono text-xs text-notion-text-primary outline-none"
      placeholder="Empty"
    />
  )
}

function NumberCell({ value, onChange }: { value: number | null; onChange: (v: number | null) => void }) {
  return (
    <input
      type="number"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      className="h-full w-full bg-transparent px-2 font-mono text-xs text-notion-text-primary outline-none"
      placeholder="Empty"
    />
  )
}

function CheckboxCell({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex h-full w-full items-center justify-center"
    >
      <div
        className={cn(
          'flex h-4 w-4 items-center justify-center rounded border transition-colors',
          value
            ? 'border-notion-green-primary bg-notion-green-primary'
            : 'border-notion-border-light',
        )}
      >
        {value && <Check className="h-3 w-3 text-white" />}
      </div>
    </button>
  )
}

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

function SelectCell({
  value,
  options,
  onChange,
}: {
  value: string | null
  options: SelectOption[]
  onChange: (v: string | null) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = options.find((o) => o.name === value)

  return (
    <div className="relative h-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-full w-full items-center px-2"
      >
        {selected ? (
          <span className={cn('rounded px-1.5 py-0.5 font-mono text-[10px]', SELECT_COLORS[selected.color] ?? SELECT_COLORS.default)}>
            {selected.name}
          </span>
        ) : (
          <span className="font-mono text-xs text-notion-text-placeholder">Empty</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 min-w-[160px] rounded-lg border border-notion-border bg-notion-bg-secondary p-1 shadow-lg">
          {value && (
            <button
              onClick={() => { onChange(null); setIsOpen(false) }}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 font-mono text-xs text-notion-text-muted hover:bg-notion-bg-hover"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => { onChange(option.name); setIsOpen(false) }}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-notion-bg-hover"
            >
              <span className={cn('rounded px-1.5 py-0.5 font-mono text-[10px]', SELECT_COLORS[option.color] ?? SELECT_COLORS.default)}>
                {option.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MultiSelectCell({
  values,
  options,
  onChange,
}: {
  values: string[]
  options: SelectOption[]
  onChange: (v: string[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = (name: string) => {
    if (values.includes(name)) {
      onChange(values.filter((v) => v !== name))
    } else {
      onChange([...values, name])
    }
  }

  return (
    <div className="relative h-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-full w-full flex-wrap items-center gap-1 px-2"
      >
        {values.length > 0 ? (
          values.map((v) => {
            const opt = options.find((o) => o.name === v)
            return (
              <span
                key={v}
                className={cn('rounded px-1.5 py-0.5 font-mono text-[10px]', SELECT_COLORS[opt?.color ?? 'default'])}
              >
                {v}
              </span>
            )
          })
        ) : (
          <span className="font-mono text-xs text-notion-text-placeholder">Empty</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 min-w-[160px] rounded-lg border border-notion-border bg-notion-bg-secondary p-1 shadow-lg">
          {options.map((option) => {
            const isSelected = values.includes(option.name)
            return (
              <button
                key={option.id}
                onClick={() => toggle(option.name)}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-notion-bg-hover"
              >
                <div className={cn('flex h-3.5 w-3.5 items-center justify-center rounded border', isSelected ? 'border-notion-green-primary bg-notion-green-primary' : 'border-notion-border-light')}>
                  {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <span className={cn('rounded px-1.5 py-0.5 font-mono text-[10px]', SELECT_COLORS[option.color] ?? SELECT_COLORS.default)}>
                  {option.name}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DateCell({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  return (
    <input
      type="date"
      value={value ? value.slice(0, 10) : ''}
      onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
      className="h-full w-full bg-transparent px-2 font-mono text-xs text-notion-text-primary outline-none"
    />
  )
}

function ReadonlyCell({ value }: { value: string }) {
  return (
    <span className="flex h-full items-center px-2 font-mono text-xs text-notion-text-muted">
      {value}
    </span>
  )
}
