import { create } from 'zustand'

interface SidebarState {
  isOpen: boolean
  width: number
  isResizing: boolean
  toggle: () => void
  open: () => void
  close: () => void
  setWidth: (width: number) => void
  setIsResizing: (isResizing: boolean) => void
}

const MIN_WIDTH = 200
const MAX_WIDTH = 480
const DEFAULT_WIDTH = 248

export const useSidebar = create<SidebarState>((set) => ({
  isOpen: true,
  width: DEFAULT_WIDTH,
  isResizing: false,

  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setWidth: (width) => set({ width: Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width)) }),
  setIsResizing: (isResizing) => set({ isResizing }),
}))
