import { useEffect, useState } from 'react'
import { Trash2, RotateCcw, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { usePages, type Page } from '@/features/page/hooks/usePages'
import { useWorkspace } from '@/features/workspace/hooks/useWorkspace'

export function TrashPage() {
  const [deletedPages, setDeletedPages] = useState<Page[]>([])
  const [search, setSearch] = useState('')
  const { restorePage, permanentDeletePage } = usePages()
  const workspace = useWorkspace((s) => s.workspace)

  useEffect(() => {
    if (!workspace) return

    const fetchDeleted = async () => {
      const { data } = await supabase
        .from('pages')
        .select('*')
        .eq('workspace_id', workspace.id)
        .eq('is_deleted', true)
        .order('deleted_at', { ascending: false })

      setDeletedPages(data ?? [])
    }

    fetchDeleted()
  }, [workspace])

  const filtered = deletedPages.filter((p) =>
    (p.title || 'Untitled').toLowerCase().includes(search.toLowerCase()),
  )

  const handleRestore = async (page: Page) => {
    await restorePage(page.id)
    setDeletedPages((prev) => prev.filter((p) => p.id !== page.id))
  }

  const handleDelete = async (page: Page) => {
    await permanentDeletePage(page.id)
    setDeletedPages((prev) => prev.filter((p) => p.id !== page.id))
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-8">
      <div className="flex items-center gap-3">
        <Trash2 className="h-6 w-6 text-notion-text-muted" />
        <h1 className="font-mono text-xl font-bold text-notion-text-primary">Trash</h1>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter by page title..."
        className="h-9 w-full rounded-lg bg-notion-bg-input px-3 font-mono text-sm text-notion-text-primary placeholder-notion-text-placeholder ring-1 ring-notion-border outline-none focus:ring-notion-green-primary"
      />

      {filtered.length === 0 ? (
        <p className="py-8 text-center font-mono text-sm text-notion-text-muted">
          No pages in trash
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {filtered.map((page) => (
            <div
              key={page.id}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-notion-bg-hover"
            >
              <span className="text-sm">{page.icon || '📄'}</span>
              <span className="flex-1 truncate font-mono text-sm text-notion-text-secondary">
                {page.title || 'Untitled'}
              </span>
              <button
                onClick={() => handleRestore(page)}
                className="hidden rounded p-1 text-notion-text-muted hover:bg-notion-bg-tertiary hover:text-notion-green-primary group-hover:block"
                title="Restore"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(page)}
                className="hidden rounded p-1 text-notion-text-muted hover:bg-notion-bg-tertiary hover:text-red-400 group-hover:block"
                title="Delete permanently"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
