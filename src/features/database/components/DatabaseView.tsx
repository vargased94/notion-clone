import { useEffect } from 'react'
import { useDatabase } from '../hooks/useDatabase'
import { DatabaseToolbar } from './DatabaseToolbar'
import { TableView } from './views/TableView'
import { BoardView } from './views/BoardView'
import { ListView } from './views/ListView'
import { GalleryView } from './views/GalleryView'
import { CalendarView } from './views/CalendarView'

interface DatabaseViewProps {
  databaseId: string
}

export function DatabaseView({ databaseId }: DatabaseViewProps) {
  const { fetchDatabase, isLoading, views, activeViewId } = useDatabase()

  useEffect(() => {
    fetchDatabase(databaseId)
  }, [databaseId, fetchDatabase])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-notion-green-primary border-t-transparent" />
      </div>
    )
  }

  const activeView = views.find((v) => v.id === activeViewId)

  return (
    <div className="flex flex-col gap-0">
      <DatabaseToolbar />

      <div className="mt-1">
        {activeView?.type === 'table' && <TableView />}
        {activeView?.type === 'board' && <BoardView />}
        {activeView?.type === 'list' && <ListView />}
        {activeView?.type === 'gallery' && <GalleryView />}
        {activeView?.type === 'calendar' && <CalendarView />}
        {!activeView && (
          <p className="py-8 text-center font-mono text-sm text-notion-text-muted">
            No view selected
          </p>
        )}
      </div>
    </div>
  )
}
