import { useState, useEffect } from 'react'
import { History, RotateCcw, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface PageVersion {
  id: string
  page_id: string
  title: string | null
  version_number: number
  created_by: string
  created_at: string
}

interface PageHistoryProps {
  pageId: string
  onRestore: (blocksSnapshot: unknown) => void
}

export function PageHistory({ pageId, onRestore }: PageHistoryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [versions, setVersions] = useState<PageVersion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const fetchVersions = async () => {
      setIsLoading(true)
      const { data } = await supabase
        .from('page_versions')
        .select('id, page_id, title, version_number, created_by, created_at')
        .eq('page_id', pageId)
        .order('created_at', { ascending: false })
        .limit(50)

      setVersions((data ?? []) as PageVersion[])
      setIsLoading(false)
    }

    fetchVersions()
  }, [isOpen, pageId])

  const handleRestore = async (versionId: string) => {
    const { data } = await supabase
      .from('page_versions')
      .select('blocks_snapshot')
      .eq('id', versionId)
      .single()

    if (data?.blocks_snapshot) {
      onRestore(data.blocks_snapshot)
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded p-1 text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
        title="Page history"
      >
        <History className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsOpen(false)} />
          <div className="relative z-10 flex h-full w-[320px] flex-col border-l border-notion-border bg-notion-bg-secondary shadow-xl">
            {/* Header */}
            <div className="flex h-12 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-notion-text-muted" />
                <span className="font-mono text-sm font-semibold text-notion-text-primary">
                  Page history
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-notion-text-muted hover:bg-notion-bg-hover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Versions list */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-notion-green-primary border-t-transparent" />
                </div>
              ) : versions.length === 0 ? (
                <p className="px-4 py-8 text-center font-mono text-xs text-notion-text-muted">
                  No versions yet
                </p>
              ) : (
                <div className="flex flex-col">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className="group flex items-center justify-between border-b border-notion-border px-4 py-3 transition-colors hover:bg-notion-bg-hover"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-xs font-medium text-notion-text-primary">
                          Version {version.version_number}
                        </span>
                        <span className="font-mono text-[10px] text-notion-text-muted">
                          {new Date(version.created_at).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRestore(version.id)}
                        className="hidden rounded p-1 text-notion-text-muted hover:bg-notion-bg-tertiary hover:text-notion-green-primary group-hover:block"
                        title="Restore this version"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
