import { useState, memo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, FileText, MoreHorizontal, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePages, type Page } from '@/features/page/hooks/usePages'
import { useWorkspace } from '@/features/workspace/hooks/useWorkspace'

interface PageTreeItemProps {
  page: Page
  depth?: number
}

export const PageTreeItem = memo(function PageTreeItem({ page, depth = 0 }: PageTreeItemProps) {
  const { pageId } = useParams()
  const navigate = useNavigate()
  const { getChildPages, createPage } = usePages()
  const workspace = useWorkspace((s) => s.workspace)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const children = getChildPages(page.id)
  const hasChildren = children.length > 0
  const isActive = pageId === page.id

  const handleClick = () => {
    navigate(`/${page.id}`)
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const handleAddSubpage = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!workspace) return
    const newPage = await createPage(workspace.id, page.id)
    if (newPage) {
      setIsExpanded(true)
      navigate(`/${newPage.id}`)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'group flex h-7 w-full items-center gap-1.5 rounded px-2.5 font-mono text-[13px] text-notion-text-secondary transition-colors hover:bg-notion-bg-hover',
          isActive && 'bg-notion-bg-hover font-medium text-notion-text-primary',
        )}
        style={{ paddingLeft: `${depth * 12 + 10}px` }}
      >
        <button
          onClick={handleToggle}
          className={cn(
            'flex h-3 w-3 shrink-0 items-center justify-center text-notion-text-muted transition-transform',
            isExpanded && 'rotate-90',
            !hasChildren && !isHovered && 'invisible',
          )}
        >
          <ChevronRight className="h-3 w-3" />
        </button>

        {page.icon && page.icon_type === 'emoji' ? (
          <span className="shrink-0 text-sm">{page.icon}</span>
        ) : (
          <FileText className="h-4 w-4 shrink-0 text-notion-text-muted" />
        )}

        <span className="truncate">{page.title || 'Untitled'}</span>

        {isHovered && (
          <div className="ml-auto flex shrink-0 items-center gap-0.5">
            <span
              onClick={(e) => { e.stopPropagation() }}
              className="rounded p-0.5 text-notion-text-muted hover:bg-notion-bg-tertiary"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </span>
            <span
              onClick={handleAddSubpage}
              className="rounded p-0.5 text-notion-text-muted hover:bg-notion-bg-tertiary"
            >
              <Plus className="h-3.5 w-3.5" />
            </span>
          </div>
        )}
      </button>

      {isExpanded && hasChildren && (
        <div>
          {children.map((child) => (
            <PageTreeItem key={child.id} page={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
})
