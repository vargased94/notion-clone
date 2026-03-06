import { useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { usePages } from '../hooks/usePages'
import { BlockEditor } from '@/features/editor/components/BlockEditor'
import { PageCover } from './PageCover'
import { PageIcon } from './PageIcon'
import { supabase } from '@/lib/supabase'

export function PageView() {
  const { pageId } = useParams<{ pageId: string }>()
  const { getPageById, updatePage } = usePages()
  const titleRef = useRef<HTMLTextAreaElement>(null)

  const page = pageId ? getPageById(pageId) : null

  // Track page visit
  useEffect(() => {
    if (!pageId) return

    const trackVisit = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('page_recent_visits')
        .upsert(
          { user_id: user.id, page_id: pageId, visited_at: new Date().toISOString() },
          { onConflict: 'user_id,page_id' },
        )
    }

    trackVisit()
  }, [pageId])

  // Auto-resize title textarea
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto'
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px'
    }
  }, [page?.title])

  const handleCoverUpdate = useCallback(
    (coverUrl: string | null, coverPosition?: number) => {
      if (!page) return
      const updates: { cover_url: string | null; cover_position?: number } = { cover_url: coverUrl }
      if (coverPosition !== undefined) updates.cover_position = coverPosition
      updatePage(page.id, updates)
    },
    [page, updatePage],
  )

  const handleIconUpdate = useCallback(
    (icon: string | null, iconType: 'emoji' | 'url' | 'none') => {
      if (!page) return
      updatePage(page.id, { icon, icon_type: iconType })
    },
    [page, updatePage],
  )

  if (!page) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="font-mono text-sm text-notion-text-muted">Page not found</p>
      </div>
    )
  }

  const hasCover = !!page.cover_url

  return (
    <div className="flex w-full flex-col">
      {/* Cover */}
      <PageCover
        coverUrl={page.cover_url ?? null}
        coverPosition={page.cover_position ?? 0.5}
        pageId={page.id}
        onUpdate={handleCoverUpdate}
      />

      {/* Content area */}
      <div className="mx-auto flex w-full max-w-3xl flex-col px-24">
        {/* Icon */}
        <div className={hasCover ? '-mt-8' : 'mt-16'}>
          <PageIcon
            icon={page.icon ?? null}
            iconType={(page.icon_type as 'emoji' | 'url' | 'none') ?? 'none'}
            onUpdate={handleIconUpdate}
          />
        </div>

        {/* Page title */}
        <textarea
          ref={titleRef}
          value={page.title}
          onChange={(e) => updatePage(page.id, { title: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
          placeholder="Untitled"
          rows={1}
          className="mt-2 w-full resize-none overflow-hidden bg-transparent font-mono text-4xl font-bold text-notion-text-primary placeholder-notion-text-placeholder outline-none"
        />

        {/* Block Editor */}
        <div className="mt-2 pb-16">
          <BlockEditor pageId={page.id} />
        </div>
      </div>
    </div>
  )
}
