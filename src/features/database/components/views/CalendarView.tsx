import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDatabase } from '../../hooks/useDatabase'
import { applyFilters } from '../../utils/filter-engine'
import type { DatabaseEntry } from '../../types/database.types'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarView() {
  const { properties, entries, filters, getValue } = useDatabase()
  const [currentDate, setCurrentDate] = useState(new Date())

  const dateProp = properties.find((p) => p.type === 'date')
  const titleProp = properties.find((p) => p.type === 'title')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Monday = 0
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = lastDay.getDate()

  const processedEntries = useMemo(() => {
    return applyFilters(entries, filters, properties, getValue)
  }, [entries, filters, properties, getValue])

  const entriesByDay = useMemo(() => {
    const map = new Map<number, DatabaseEntry[]>()
    if (!dateProp) return map

    for (const entry of processedEntries) {
      const val = getValue(entry.id, dateProp.id)
      if (val?.value_date) {
        const d = new Date(val.value_date)
        if (d.getFullYear() === year && d.getMonth() === month) {
          const day = d.getDate()
          if (!map.has(day)) map.set(day, [])
          map.get(day)!.push(entry)
        }
      }
    }
    return map
  }, [processedEntries, dateProp, year, month, getValue])

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-2">
        <span className="font-mono text-sm font-semibold text-notion-text-primary">
          {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="rounded p-1 hover:bg-notion-bg-hover">
            <ChevronLeft className="h-4 w-4 text-notion-text-muted" />
          </button>
          <button onClick={nextMonth} className="rounded p-1 hover:bg-notion-bg-hover">
            <ChevronRight className="h-4 w-4 text-notion-text-muted" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-notion-border">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1 text-center font-mono text-[10px] text-notion-text-muted">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {/* Empty cells before first day */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-notion-border p-1" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dayEntries = entriesByDay.get(day) ?? []
          const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear()

          return (
            <div
              key={day}
              className="min-h-[80px] border-b border-r border-notion-border p-1"
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] ${
                  isToday
                    ? 'bg-notion-green-primary font-semibold text-white'
                    : 'text-notion-text-muted'
                }`}
              >
                {day}
              </span>
              <div className="mt-0.5 flex flex-col gap-0.5">
                {dayEntries.map((entry) => {
                  const title = titleProp
                    ? getValue(entry.id, titleProp.id)?.value_text
                    : null
                  return (
                    <div
                      key={entry.id}
                      className="truncate rounded bg-notion-green-primary/10 px-1 py-0.5 font-mono text-[9px] text-notion-green-primary"
                    >
                      {title || 'Untitled'}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
