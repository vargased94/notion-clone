import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FileText, Clock, X } from 'lucide-react'
import { useState } from 'react'
import { useSearch } from '../hooks/useSearch'
import type { SearchResult } from '../hooks/useSearch'

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const {
    query,
    results,
    recentPages,
    isSearching,
    setQuery,
    search,
    fetchRecent,
    reset,
  } = useSearch()

  // Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      fetchRecent()
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      reset()
    }
  }, [isOpen, fetchRecent, reset])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 200)
    return () => clearTimeout(timer)
  }, [query, search])

  const handleSelect = useCallback(
    (result: SearchResult) => {
      navigate(`/${result.id}`)
      setIsOpen(false)
    },
    [navigate],
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const showResults = query.trim().length > 0
  const displayItems = showResults ? results : recentPages

  return (
    <>
      {/* Trigger — styled like a SidebarItem */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-[30px] w-full items-center gap-2.5 rounded px-2.5 font-mono text-[13px] text-notion-text-secondary transition-colors hover:bg-notion-bg-hover"
      >
        <Search className="h-[18px] w-[18px] shrink-0 text-notion-text-muted" />
        <span className="flex-1 text-left">Search</span>
        <kbd className="rounded border border-notion-border bg-notion-bg-primary px-1.5 py-0.5 font-mono text-[10px] text-notion-text-muted">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div
            className="relative z-10 flex w-[560px] flex-col overflow-hidden rounded-xl border border-notion-border bg-notion-bg-secondary shadow-2xl"
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-notion-border px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-notion-text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages..."
                className="flex-1 bg-transparent font-mono text-sm text-notion-text-primary placeholder-notion-text-muted outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="rounded p-0.5 text-notion-text-muted hover:text-notion-text-secondary"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto py-2">
              {isSearching ? (
                <div className="flex justify-center py-8">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-notion-green-primary border-t-transparent" />
                </div>
              ) : displayItems.length === 0 ? (
                <p className="py-8 text-center font-mono text-xs text-notion-text-muted">
                  {showResults ? 'No results found' : 'No recent pages'}
                </p>
              ) : (
                <>
                  {!showResults && (
                    <div className="flex items-center gap-1.5 px-4 pb-1.5">
                      <Clock className="h-3 w-3 text-notion-text-muted" />
                      <span className="font-mono text-[10px] font-semibold tracking-wider text-notion-text-muted">
                        RECENT
                      </span>
                    </div>
                  )}
                  {displayItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="flex w-full items-center gap-3 px-4 py-2 transition-colors hover:bg-notion-bg-hover"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-notion-bg-hover">
                        {item.icon ? (
                          <span className="text-sm">{item.icon}</span>
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-notion-text-muted" />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-col text-left">
                        <span className="truncate font-mono text-xs font-medium text-notion-text-primary">
                          {item.title || 'Untitled'}
                        </span>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-notion-border px-4 py-2">
              <span className="font-mono text-[10px] text-notion-text-muted">
                {showResults ? `${results.length} results` : 'Type to search'}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-notion-text-muted">↵ Open</span>
                <span className="font-mono text-[10px] text-notion-text-muted">Esc Close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
