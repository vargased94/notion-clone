import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(resolved: 'light' | 'dark') {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => {
      const systemTheme = getSystemTheme()

      // Listen for system theme changes
      if (typeof window !== 'undefined') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          const newSystem = e.matches ? 'dark' : 'light'
          set((state) => {
            if (state.theme === 'system') {
              applyTheme(newSystem)
              return { resolvedTheme: newSystem }
            }
            return {}
          })
        })
      }

      return {
        theme: 'system',
        resolvedTheme: systemTheme,

        setTheme: (theme) => {
          const resolved = theme === 'system' ? getSystemTheme() : theme
          applyTheme(resolved)
          set({ theme, resolvedTheme: resolved })
        },
      }
    },
    {
      name: 'notion-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolved = state.theme === 'system' ? getSystemTheme() : state.theme
          applyTheme(resolved)
          state.resolvedTheme = resolved
        }
      },
    },
  ),
)
