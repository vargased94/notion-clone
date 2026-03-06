import { useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, PanelLeft, Star } from 'lucide-react'
import { usePages } from '@/features/page/hooks/usePages'
import { PageSettings } from '@/features/page/components/PageSettings'
import { PageHistory } from '@/features/page/components/PageHistory'
import { ShareMenu } from '@/features/sharing/components/ShareMenu'
import { PageDiscussion } from '@/features/comments/components/PageDiscussion'
import { useSidebar } from '../hooks/useSidebar'
import { cn } from '@/lib/cn'
import type { Page } from '@/features/page/hooks/usePages'

export function Topbar() {
  const { pageId } = useParams()
  const navigate = useNavigate()
  const { isOpen, toggle } = useSidebar()
  const { getPageById, favorites, toggleFavorite, updatePage } = usePages()

  const page = pageId ? getPageById(pageId) : null
  const isFavorite = pageId ? favorites.includes(pageId) : false

  const handleSettingsUpdate = useCallback(
    (updates: Partial<Pick<Page, 'is_locked' | 'font' | 'full_width' | 'small_text'>>) => {
      if (!page) return
      updatePage(page.id, updates)
    },
    [page, updatePage],
  )

  const handleRestore = useCallback(
    (_blocksSnapshot: unknown) => {
      // Version restore will reload the page content via the editor
      // The blocks snapshot is saved to the blocks table by the calling component
      if (pageId) {
        navigate(`/${pageId}`)
      }
    },
    [pageId, navigate],
  )

  // Build breadcrumb trail
  const breadcrumbs: { id: string; title: string; icon: string | null }[] = []
  if (page) {
    let current = page
    breadcrumbs.unshift({ id: current.id, title: current.title || 'Untitled', icon: current.icon })
    while (current.parent_page_id) {
      const parent = getPageById(current.parent_page_id)
      if (!parent) break
      breadcrumbs.unshift({ id: parent.id, title: parent.title || 'Untitled', icon: parent.icon })
      current = parent
    }
  }

  return (
    <div className="flex h-11 shrink-0 items-center gap-2 border-b border-notion-border px-3">
      {/* Toggle sidebar */}
      {!isOpen && (
        <button
          onClick={toggle}
          className="rounded p-1 text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      )}

      {/* Breadcrumbs */}
      <nav className="flex min-w-0 items-center gap-1">
        {breadcrumbs.map((crumb, i) => (
          <div key={crumb.id} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-notion-text-muted" />}
            <button
              onClick={() => navigate(`/${crumb.id}`)}
              className={cn(
                'flex items-center gap-1.5 truncate rounded px-1.5 py-0.5 font-mono text-sm transition-colors hover:bg-notion-bg-hover',
                i === breadcrumbs.length - 1
                  ? 'text-notion-text-primary'
                  : 'text-notion-text-muted',
              )}
            >
              {crumb.icon && <span className="text-sm">{crumb.icon}</span>}
              <span className="truncate">{crumb.title}</span>
            </button>
          </div>
        ))}
      </nav>

      {/* Right actions */}
      {page && (
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => toggleFavorite(page.id)}
            className={cn(
              'rounded p-1 transition-colors hover:bg-notion-bg-hover',
              isFavorite ? 'text-yellow-500' : 'text-notion-text-muted',
            )}
          >
            <Star className={cn('h-4 w-4', isFavorite && 'fill-current')} />
          </button>
          <ShareMenu pageId={page.id} pageCreatedBy={page.created_by} />
          <PageDiscussion pageId={page.id} />
          <PageHistory pageId={page.id} onRestore={handleRestore} />
          <PageSettings page={page} onUpdate={handleSettingsUpdate} />
        </div>
      )}
    </div>
  )
}
