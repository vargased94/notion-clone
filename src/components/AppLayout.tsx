import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/features/sidebar/components/Sidebar'
import { Topbar } from '@/features/sidebar/components/Topbar'
import { ErrorBoundary } from './ErrorBoundary'
import { useWorkspace } from '@/features/workspace/hooks/useWorkspace'
import { usePages } from '@/features/page/hooks/usePages'
import { useSidebar } from '@/features/sidebar/hooks/useSidebar'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useTheme } from '@/hooks/useTheme'

export function AppLayout() {
  const { workspace, fetchWorkspace } = useWorkspace()
  const { fetchPages, fetchFavorites } = usePages()
  const isResizing = useSidebar((s) => s.isResizing)
  const resolvedTheme = useTheme((s) => s.resolvedTheme)

  // Initialize theme on mount
  useEffect(() => {
    const { theme, setTheme } = useTheme.getState()
    setTheme(theme)
  }, [])

  // Register global keyboard shortcuts
  useKeyboardShortcuts()

  // Fetch workspace on mount
  useEffect(() => {
    fetchWorkspace()
  }, [fetchWorkspace])

  // Fetch pages when workspace loads
  useEffect(() => {
    if (workspace?.id) {
      fetchPages(workspace.id)
      fetchFavorites()
    }
  }, [workspace?.id, fetchPages, fetchFavorites])

  return (
    <div className={`flex h-screen ${resolvedTheme === 'dark' ? 'dark' : ''}`}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden bg-notion-bg-primary">
        <Topbar />
        <main
          className="flex-1 overflow-y-auto"
          style={{ pointerEvents: isResizing ? 'none' : 'auto' }}
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
