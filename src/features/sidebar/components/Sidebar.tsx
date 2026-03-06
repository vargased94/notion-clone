import { useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Sparkles,
  LayoutDashboard,
  Settings,
  Plus,
  Trash2,
  ChevronDown,
} from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import { SidebarSection } from './SidebarSection'
import { PageTreeItem } from './PageTreeItem'
import { SearchModal } from '@/features/search/components/SearchModal'
import { InboxPanel } from '@/features/notifications/components/InboxPanel'
import { TeamspaceList } from '@/features/teamspace/components/TeamspaceList'
import { useSidebar } from '../hooks/useSidebar'
import { usePages } from '@/features/page/hooks/usePages'
import { useWorkspace } from '@/features/workspace/hooks/useWorkspace'

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isOpen, width, setWidth, setIsResizing } = useSidebar()
  const { workspace } = useWorkspace()
  const { pages, favorites, getChildPages, createPage } = usePages()
  const resizeRef = useRef<HTMLDivElement>(null)

  const rootPages = getChildPages(null)
  const favoritePages = pages.filter((p) => favorites.includes(p.id))

  const handleNewPage = async () => {
    if (!workspace) return
    const page = await createPage(workspace.id)
    if (page) navigate(`/${page.id}`)
  }

  // Resize logic
  const handleMouseDown = useCallback(() => {
    setIsResizing(true)

    const handleMouseMove = (e: MouseEvent) => {
      setWidth(e.clientX)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [setWidth, setIsResizing])

  // Cmd+\ toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === '\\') {
        e.preventDefault()
        useSidebar.getState().toggle()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isOpen) return null

  return (
    <aside
      className="relative flex h-full flex-col border-r border-notion-border bg-notion-bg-secondary"
      style={{ width }}
    >
      {/* Top section */}
      <div className="flex flex-col gap-0.5 px-2.5 pt-3 pb-1">
        {/* Workspace header */}
        <button className="flex h-[30px] items-center justify-between rounded px-2.5 hover:bg-notion-bg-hover">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-notion-green-primary">
              <span className="font-mono text-[10px] font-bold text-white">
                {workspace?.name?.[0]?.toUpperCase() ?? 'N'}
              </span>
            </div>
            <span className="font-mono text-[13px] font-medium text-notion-text-primary">
              {workspace?.name ?? 'Workspace'}
            </span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-notion-text-muted" />
        </button>

        {/* Nav items */}
        <SearchModal />
        <SidebarItem
          icon={Sparkles}
          label="Notion AI"
          iconClassName="text-notion-green-primary"
          labelClassName="text-notion-green-primary"
        />
        <SidebarItem
          icon={LayoutDashboard}
          label="Home"
          isActive={location.pathname === '/'}
          onClick={() => navigate('/')}
        />
        <InboxPanel />
        <SidebarItem
          icon={Settings}
          label="Settings"
          isActive={location.pathname === '/settings'}
          onClick={() => navigate('/settings')}
        />
      </div>

      {/* Divider */}
      <div className="mx-2.5 h-px bg-notion-divider" />

      {/* Scrollable page tree */}
      <div className="flex-1 overflow-y-auto px-2.5 py-1">
        {/* Favorites */}
        {favoritePages.length > 0 && (
          <SidebarSection title="Favorites">
            {favoritePages.map((page) => (
              <PageTreeItem key={page.id} page={page} />
            ))}
          </SidebarSection>
        )}

        {/* Divider between favorites and teamspaces */}
        {favoritePages.length > 0 && (
          <div className="my-1 h-px bg-notion-divider" />
        )}

        {/* Teamspaces */}
        <TeamspaceList />

        <div className="my-1 h-px bg-notion-divider" />

        {/* Private pages */}
        <SidebarSection title="Private" onAdd={handleNewPage}>
          {rootPages.map((page) => (
            <PageTreeItem key={page.id} page={page} />
          ))}
        </SidebarSection>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col gap-0.5 border-t border-notion-divider px-2.5 py-2">
        <SidebarItem
          icon={Plus}
          label="New page"
          onClick={handleNewPage}
          iconClassName="text-notion-green-primary"
          labelClassName="text-notion-green-primary"
        />
        <SidebarItem
          icon={Trash2}
          label="Trash"
          isActive={location.pathname === '/trash'}
          onClick={() => navigate('/trash')}
        />
      </div>

      {/* Resize handle */}
      <div
        ref={resizeRef}
        onMouseDown={handleMouseDown}
        className="absolute top-0 right-0 z-10 h-full w-1 cursor-col-resize transition-colors hover:bg-notion-green-primary/30"
      />
    </aside>
  )
}
