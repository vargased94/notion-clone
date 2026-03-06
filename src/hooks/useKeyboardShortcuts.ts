import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSidebar } from '@/features/sidebar/hooks/useSidebar'
import { useTheme } from './useTheme'

interface ShortcutDef {
  key: string
  meta?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const sidebarToggle = useSidebar((s) => s.toggle)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const shortcuts: ShortcutDef[] = [
      // Cmd+\ — Toggle sidebar (already handled in Sidebar.tsx but duplicated for safety)
      {
        key: '\\',
        meta: true,
        action: sidebarToggle,
        description: 'Toggle sidebar',
      },
      // Cmd+Shift+D — Toggle dark mode
      {
        key: 'd',
        meta: true,
        shift: true,
        action: () => {
          if (theme === 'dark') setTheme('light')
          else if (theme === 'light') setTheme('system')
          else setTheme('dark')
        },
        description: 'Cycle theme',
      },
      // Cmd+Shift+N — New page (navigates to home which triggers new page flow)
      {
        key: 'n',
        meta: true,
        shift: true,
        action: () => navigate('/'),
        description: 'Go to home',
      },
    ]

    const handler = (e: KeyboardEvent) => {
      // Skip if user is typing in an input/textarea (except for meta shortcuts)
      const target = e.target as HTMLElement
      const isEditing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      for (const s of shortcuts) {
        const metaMatch = s.meta ? (e.metaKey || e.ctrlKey) : !(e.metaKey || e.ctrlKey)
        const shiftMatch = s.shift ? e.shiftKey : !e.shiftKey
        const altMatch = s.alt ? e.altKey : !e.altKey
        const keyMatch = e.key.toLowerCase() === s.key.toLowerCase()

        if (keyMatch && metaMatch && shiftMatch && altMatch) {
          // Allow meta shortcuts even in inputs
          if (isEditing && !s.meta) continue
          e.preventDefault()
          s.action()
          return
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [sidebarToggle, theme, setTheme, navigate])
}
